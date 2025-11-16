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
  const musicForm = document.getElementById('music-form');
  const musicInput = document.getElementById('music-file');
  const musicList = document.getElementById('music-list');

  // ===== FETCH PROFILE =====
  try {
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
  } catch (err) {
    console.error('Profile fetch error', err);
  }

  // ===== LOAD BOX POSITIONS =====
  try {
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
  } catch (err) {
    console.error('Positions fetch error', err);
  }

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

  // ===== MUSIC UPLOAD =====
  if (musicForm) {
    musicForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const file = musicInput.files[0];
      if (!file) return alert('Please select a file');

      const formData = new FormData();
      formData.append('track', file);
      formData.append('title', file.name);

      try {
        const res = await fetch('/api/music', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        const data = await res.json();
        if (data.error) return alert(data.error);

        // Add to music list
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = data.url;
        link.textContent = data.title;
        link.target = '_blank';
        li.appendChild(link);
        musicList.appendChild(li);

        musicForm.reset();
      } catch (err) {
        console.error('Music upload error', err);
      }
    });
  }

  // ===== LOAD EXISTING MUSIC =====
  try {
    const res = await fetch('/api/music', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const tracks = await res.json();
    tracks.forEach(track => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = track.url;
      link.textContent = track.title;
      link.target = '_blank';
      li.appendChild(link);
      musicList.appendChild(li);
    });
  } catch (err) {
    console.error('Music list fetch error', err);
  }
});
