// welcome.js - trait selection + save avatar (copy/paste ready)
// Place this in public/welcome.js and ensure welcome.html includes it.

console.log('welcome.js loaded');

// Auth check
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/comms.html';
}

// Helpers
const authHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });
function $(sel){ return document.querySelector(sel); }
function createEl(tag, cls){ const e = document.createElement(tag); if(cls) e.className = cls; return e; }

// Containers (fall back to body if layout differs)
const categoriesContainer = $('.left-panel') || createEl('div');
const previewContainer = $('.right-panel') || createEl('div');

// Limit of traits selected (adjust if you want exactly 10 max)
const MAX_TRAITS = 10;
const selectedTraits = new Set();

async function loadTraits() {
  try {
    const res = await fetch('/api/profile/traits');
    const json = await res.json();
    if (!json.success) {
      console.warn('No traits available', json);
      return;
    }
    const cats = json.categories || [];
    const traits = json.traits || [];

    // Clear and build UI
    categoriesContainer.innerHTML = '';
    cats.forEach(cat => {
      const catWrap = createEl('div', 'trait-category');
      const h = createEl('h4'); h.textContent = cat.name;
      const list = createEl('div', 'trait-list');
      list.dataset.cat = cat.id;
      catWrap.appendChild(h);
      catWrap.appendChild(list);
      categoriesContainer.appendChild(catWrap);

      traits.filter(t => t.category_id === cat.id).forEach(tr => {
        const btn = createEl('button', 'trait-btn');
        btn.dataset.traitId = tr.id;
        btn.title = tr.name;
        if (tr.asset_url) {
          const img = createEl('img');
          img.src = tr.asset_url;
          img.alt = tr.name;
          img.style.width = '56px';
          img.style.height = '56px';
          btn.appendChild(img);
        } else {
          btn.textContent = tr.name;
        }
        btn.addEventListener('click', () => toggleTrait(btn, tr));
        list.appendChild(btn);
      });
    });

    // Optionally load current user selections to pre-select
    await loadCurrentAvatar();
  } catch (err) {
    console.error('Failed loading traits', err);
  }
}

async function loadCurrentAvatar() {
  try {
    const res = await fetch('/api/profile/me', { headers: { 'Authorization': `Bearer ${token}` }});
    const json = await res.json();
    if (!json.success) return;
    const traits = json.traits || [];
    traits.forEach(t => {
      const btn = document.querySelector(`button.trait-btn[data-trait-id="${t.id}"]`);
      if (btn) {
        selectedTraits.add(t.id);
        btn.classList.add('selected');
      }
    });
    renderPreview();
  } catch (err) {
    console.error('failed to load current avatar', err);
  }
}

function toggleTrait(btn, traitObj) {
  const id = Number(btn.dataset.traitId);
  if (selectedTraits.has(id)) {
    selectedTraits.delete(id);
    btn.classList.remove('selected');
  } else {
    if (selectedTraits.size >= MAX_TRAITS) {
      // short feedback
      btn.animate([{transform:'scale(1.05)'},{transform:'scale(1)'}], {duration:160});
      return alert(`You can select up to ${MAX_TRAITS} traits.`);
    }
    selectedTraits.add(id);
    btn.classList.add('selected');
  }
  renderPreview();
}

function renderPreview() {
  previewContainer.innerHTML = '<h3>Preview</h3>';
  const wrapper = createEl('div', 'pfp-preview');
  selectedTraits.forEach(id => {
    const srcBtn = document.querySelector(`button.trait-btn[data-trait-id="${id}"]`);
    if (!srcBtn) return;
    const node = srcBtn.cloneNode(true);
    node.classList.remove('selected');
    node.style.width = '56px';
    node.style.height = '56px';
    node.style.margin = '4px';
    wrapper.appendChild(node);
  });
  previewContainer.appendChild(wrapper);
}

// Save avatar selection to server
async function saveAvatar() {
  try {
    const res = await fetch('/api/profile/avatar', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ traitIds: Array.from(selectedTraits) })
    });
    const json = await res.json();
    if (json.success) {
      alert('Avatar saved');
      window.location.href = '/dashboard.html';
    } else {
      alert('Failed to save avatar: ' + (json.message || 'unknown'));
    }
  } catch (err) {
    console.error('saveAvatar error', err);
    alert('Network error while saving avatar');
  }
}

// Save button (if your Cargo editor doesn't provide a place for it, this appends to body)
let saveBtn = $('#saveAvatarBtn');
if (!saveBtn) {
  saveBtn = createEl('button');
  saveBtn.id = 'saveAvatarBtn';
  saveBtn.textContent = 'Save Avatar';
  saveBtn.style.position = 'fixed';
  saveBtn.style.right = '18px';
  saveBtn.style.bottom = '18px';
  saveBtn.style.padding = '10px 14px';
  saveBtn.style.zIndex = 9999;
  document.body.appendChild(saveBtn);
}
saveBtn.addEventListener('click', saveAvatar);

// initial load
loadTraits();
