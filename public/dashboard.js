// dashboard.js - profile, rituals, quests, chat wiring (copy/paste ready)
// Place this in public/dashboard.js and ensure dashboard.html includes it.

console.log('dashboard.js loaded');

const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/comms.html';
}

// Helpers for API calls with authorization
async function apiFetch(path, opts = {}) {
  opts.headers = opts.headers || {};
  if (!opts.headers['Authorization']) opts.headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(path, opts);
  // gracefully handle non-JSON
  try { return await res.json(); } catch (e) { return { success: false, status: res.status }; }
}

async function apiGet(path) {
  return apiFetch(path, { method: 'GET' });
}
async function apiPost(path, body) {
  return apiFetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
}
async function apiPatch(path, body) {
  return apiFetch(path, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
}

// Load and render profile & traits
async function loadProfile() {
  try {
    const json = await apiGet('/api/profile/me');
    if (!json || !json.success) {
      console.error('Failed to load profile', json);
      return;
    }
    const profile = json.profile || {};
    const user = json.user || {};
    const traits = json.traits || [];

    const usernameDisplay = document.getElementById('usernameDisplay');
    if (usernameDisplay) usernameDisplay.value = user.username || '';

    const displayName = document.getElementById('displayName');
    if (displayName) displayName.textContent = profile.display_name || `${user.firstname || ''} ${user.lastname || ''}`;

    const userPFP = document.getElementById('userPFP');
    if (userPFP) userPFP.src = profile.pfp_url || user.pfp_url || user.profile_picture || user.pfp || user.avatar || userPFP.src;

    // legendary items area: show trait names or images
    const legendary = document.getElementById('legendaryList');
    if (legendary) {
      legendary.innerHTML = '';
      traits.forEach(t => {
        const el = document.createElement('div');
        el.className = 'legendary-item';
        if (t.asset_url) {
          const img = document.createElement('img');
          img.src = t.asset_url;
          img.alt = t.name;
          img.style.width = '48px';
          img.style.height = '48px';
          el.appendChild(img);
        } else {
          el.textContent = t.name;
        }
        legendary.appendChild(el);
      });
    }
  } catch (err) {
    console.error('loadProfile error', err);
  }
}

// Save simple profile edits (display name / pfp_url)
const saveProfileBtn = document.getElementById('saveProfileBtn'); // if you add a button in HTML
if (saveProfileBtn) {
  saveProfileBtn.addEventListener('click', async () => {
    const displayNameInput = document.getElementById('displayNameInput'); // optional field
    const pfpUrlInput = document.getElementById('pfpUrlInput'); // optional field
    const body = {
      display_name: displayNameInput ? displayNameInput.value.trim() : undefined,
      pfp_url: pfpUrlInput ? pfpUrlInput.value.trim() : undefined
    };
    await apiPatch('/api/profile', body);
    await loadProfile();
    alert('Profile saved');
  });
}

// Optional: handle PFP file upload if an input exists with id 'pfpFile'
const pfpFileInput = document.getElementById('pfpFile');
if (pfpFileInput) {
  pfpFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: form,
        headers: { 'Authorization': `Bearer ${token}` } // if your uploads endpoint requires auth header
      });
      const json = await res.json();
      if (json && json.success && json.url) {
        // save to profile
        await apiPatch('/api/profile', { pfp_url: json.url });
        await loadProfile();
        alert('Profile picture updated');
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error('upload error', err);
      alert('Upload error');
    }
  });
}

// Load rituals, sessions and quests
async function loadRitualsAndSessions() {
  try {
    const r = await apiGet('/api/rituals');
    const s = await apiGet('/api/rituals/sessions');
    const q = await apiGet('/api/quests');

    // Next workout
    const nextWorkout = document.getElementById('nextWorkout');
    if (s && s.success && s.sessions && s.sessions.length && nextWorkout) {
      // find next upcoming not completed
      const upcoming = s.sessions.filter(ss => !ss.completed_at).sort((a,b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))[0] || s.sessions[0];
      if (upcoming && upcoming.scheduled_at) nextWorkout.textContent = new Date(upcoming.scheduled_at).toLocaleString();
    }

    // fill quests UI
    const questList = document.getElementById('questList');
    if (questList && q && q.success) {
      questList.innerHTML = '';
      q.quests.forEach(quest => {
        const li = document.createElement('li');
        li.textContent = quest.name;
        const btn = document.createElement('button');
        btn.textContent = 'Mark Complete';
        btn.addEventListener('click', async () => {
          const res = await apiPost(`/api/quests/${quest.id}/complete`, {});
          if (res && res.success) {
            alert('Quest marked complete');
            await loadProfile();
            await loadRitualsAndSessions();
          } else {
            alert('Could not complete quest');
          }
        });
        li.appendChild(btn);
        questList.appendChild(li);
      });
    }
  } catch (err) {
    console.error('loadRitualsAndSessions error', err);
  }
}

// Complete a specific session (callable by UI when user finishes)
async function completeSession(sessionId, result) {
  try {
    const res = await apiPost(`/api/rituals/sessions/${sessionId}/complete`, { result });
    if (res && res.success) {
      alert('Session completed');
      await loadProfile();
      await loadRitualsAndSessions();
    } else {
      alert('Could not complete session');
    }
  } catch (err) {
    console.error('completeSession error', err);
    alert('Network error');
  }
}

// Chat: load and send messages (polling)
async function loadChat() {
  try {
    const json = await apiGet('/api/chat?limit=100');
    if (!json || !json.success) return;
    const chatBox = document.getElementById('chatBox');
    if (!chatBox) return;
    chatBox.innerHTML = '';
    json.messages.forEach(m => {
      const p = document.createElement('div');
      p.className = 'chat-message';
      const who = m.username || (m.user_id ? `user#${m.user_id}` : 'anon');
      const ts = new Date(m.created_at).toLocaleTimeString();
      p.innerHTML = `<strong>${escapeHtml(who)}:</strong> ${escapeHtml(m.message)} <span class="ts">${ts}</span>`;
      chatBox.appendChild(p);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    console.error('loadChat error', err);
  }
}

const sendBtn = document.getElementById('sendBtn');
if (sendBtn) {
  sendBtn.addEventListener('click', async () => {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput) return;
    const txt = chatInput.value.trim();
    if (!txt) return;
    const res = await apiPost('/api/chat', { message: txt });
    if (res && res.success) {
      chatInput.value = '';
      await loadChat();
    } else {
      alert('Failed to send message');
    }
  });
}

// small utility (very basic escaping)
function escapeHtml(s) {
  return String(s).replace(/[&<>"'`]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;',"`":'&#96;'}[c]));
}

// initialize on page load
loadProfile();
loadRitualsAndSessions();
loadChat();
setInterval(loadChat, 5000); // naive polling; replace with websockets for real-time
