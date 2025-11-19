const backendURL = "https://mainsofthelm.onrender.com";

// Load username
const username = localStorage.getItem('softhelmUsername') || 'Initiate';
document.getElementById('username-display').innerText = `✶ ${username} ✶`;

// Enter Realm button
document.getElementById('enterRealmBtn').addEventListener('click', async () => {
  const traits = {
    gender: document.getElementById('gender').value,
    hair: document.getElementById('hair').value,
    eyes: document.getElementById('eyes').value
  };

  try {
    const res = await fetch(`${backendURL}/saveTraits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, traits })
    });
    const data = await res.json();
    if (data.success) {
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Failed to save traits to server');
    }
  } catch (err) {
    console.error(err);
    alert('Network error saving traits');
  }
});
