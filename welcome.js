// ===== DISPLAY USER INFO =====
document.addEventListener('DOMContentLoaded', async () => {
  const usernameEl = document.getElementById('username-display');
  const enterBtn = document.getElementById('enter-btn');

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/comms.html'; // redirect to login/signup if not logged in
    return;
  }

  const res = await fetch('/api/profile/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();

  if (data.error) {
    alert(data.error);
    localStorage.removeItem('token');
    window.location.href = '/comms.html';
    return;
  }

  usernameEl.textContent = data.username || data.real_name || 'User';

  // ===== ENTER REALM =====
  enterBtn.addEventListener('click', () => {
    window.location.href = '/dashboard.html';
  });
});
