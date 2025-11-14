// ===== DASHBOARD LOGIC =====
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/comms.html';
    return;
  }

  // Elements
  const avatarImg = document.getElementById('avatar-img');
  const usernameEl = document.getElementById('username-display');
  const boxes = document.querySelectorAll('.box'); // draggable boxes

  // Fetch user profile
  const profileRes = await fetch('/api/profile/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const profile = await profileRes.json();

  if (profile.error) {
    alert(profile.error);
    localStorage.removeItem('token');
    window.location.href = '/comms.html';
    return;
  }

  usernameEl.textContent = profile.username;
  if (profile.avatar_url) avatarImg.src = profile.avatar_url;

  // ===== LOAD BOX POSITIONS =====
  const posRes = await fetch('/api/positions', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const positions = await posRes.json();

  positions.forEach(p => {
    const box = document.getElementById(p.box_id);
    if (box) {
      box.style.transform = `translate(${p.x}px, ${p.y}px)`;
    }
  });

  // ===== DRAG & SAVE BOX POSITIONS =====
  boxes.forEach(box => {
    let offsetX, offsetY;

    box.addEventListener('mousedown', (e) => {
      offsetX = e.clientX - box.getBoundingClientRect().left;
      offsetY = e.clientY - box.getBoundingClientRect().top;

      function onMouseMove(e) {
        box.style.transform = `translate(${e.clientX - offsetX}px, ${e.clientY - offsetY}px)`;
      }

      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        // Save position to server
        const style = box.style.transform;
        const [x, y] = style.match(/translate\((.+)px, (.+)px\)/).slice(1, 3).map(Number);
        fetch('/api/positions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ box_id: box.id, x, y })
        });
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  });
});
