document.addEventListener('DOMContentLoaded', () => {
  const backendURL = "https://mainsofthelm.onrender.com"; // your Render backend

  const mainBox = document.getElementById('main-box');
  const signinBox = document.getElementById('signin-box');
  const newAccountBox = document.getElementById('newaccount-box');

  const signInBtn = document.getElementById('signInBtn');
  const newAccountBtn = document.getElementById('newAccountBtn');
  const backFromSignIn = document.getElementById('backFromSignIn');
  const backFromSignup = document.getElementById('backFromSignup');

  const signinSubmit = document.getElementById('signinSubmit');
  const signupSubmit = document.getElementById('signupSubmit');

  // Show/hide forms
  signInBtn.addEventListener('click', () => {
    mainBox.classList.add('hidden');
    signinBox.classList.remove('hidden');
  });
  newAccountBtn.addEventListener('click', () => {
    mainBox.classList.add('hidden');
    newAccountBox.classList.remove('hidden');
  });
  backFromSignIn.addEventListener('click', () => {
    signinBox.classList.add('hidden');
    mainBox.classList.remove('hidden');
  });
  backFromSignup.addEventListener('click', () => {
    newAccountBox.classList.add('hidden');
    mainBox.classList.remove('hidden');
  });

  // Sign In
  signinSubmit.addEventListener('click', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signin-username').value.trim();
    const password = document.getElementById('signin-password').value.trim();

    try {
      const res = await fetch(`${backendURL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = 'welcome.html';
      } else {
        document.getElementById('signin-message').textContent = data.message || 'Login failed';
      }
    } catch (err) {
      console.error(err);
      document.getElementById('signin-message').textContent = 'Server error';
    }
  });

  // Register
  signupSubmit.addEventListener('click', async (e) => {
    e.preventDefault();
    const payload = {
      firstname: document.getElementById('signup-firstname').value.trim(),
      lastname: document.getElementById('signup-lastname').value.trim(),
      email: document.getElementById('signup-email').value.trim(),
      username: document.getElementById('signup-username').value.trim(),
      password: document.getElementById('signup-password').value.trim(),
      confirm: document.getElementById('signup-confirm').value.trim()
    };

    if (payload.password !== payload.confirm) {
      document.getElementById('signup-message').textContent = "Passwords do not match";
      return;
    }

    try {
      const res = await fetch(`${backendURL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = 'welcome.html';
      } else {
        document.getElementById('signup-message').textContent = data.message || 'Registration failed';
      }
    } catch (err) {
      console.error(err);
      document.getElementById('signup-message').textContent = 'Server error';
    }
  });
});
