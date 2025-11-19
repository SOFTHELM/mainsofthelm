const backendURL = "https://mainsofthelm.onrender.com";
let username = localStorage.getItem('softhelmUsername') || 'Initiate';

// Display username
const displayNameEl = document.getElementById('displayName');
const usernameInput = document.getElementById('usernameDisplay');
displayNameEl.innerText = username;
usernameInput.value = username;

// Load user data from server
async function loadUserData() {
  try {
    const res = await fetch(`${backendURL}/getUserData?username=${username}`);
    const data = await res.json();
    
    document.getElementById('userLevel').innerText = data.level || 1;

    const listDiv = document.getElementById('legendaryItems');
    listDiv.innerHTML = '';
    (data.items || []).forEach(item => {
      const div = document.createElement('div');
      div.className = 'item-box';
      div.innerText = item;
      listDiv.appendChild(div);
    });

  } catch (err) {
    console.error('Failed to load user data', err);
  }
}

// Auto-save username when changed
usernameInput.addEventListener('change', async () => {
  const newUsername = usernameInput.value.trim();
  if (!newUsername || newUsername === username) return;

  try {
    const res = await fetch(`${backendURL}/updateUsername`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldUsername: username, newUsername })
    });
    const data = await res.json();

    if (data.success) {
      username = newUsername;
      localStorage.setItem('softhelmUsername', newUsername);
      displayNameEl.innerText = username;
      alert('Username updated on server');
    } else {
      alert('Failed to update username');
      usernameInput.value = username; // revert
    }
  } catch (err) {
    console.error(err);
    alert('Server error updating username');
    usernameInput.value = username;
  }
});

// Example: add legendary item
async function addLegendaryItem(itemName) {
  try {
    const res = await fetch(`${backendURL}/addItem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, item: itemName })
    });
    const data = await res.json();
    if (data.success) {
      loadUserData(); // refresh dashboard
    } else {
      alert('Failed to add item');
    }
  } catch (err) {
    console.error(err);
  }
}

// Initial load
loadUserData();
