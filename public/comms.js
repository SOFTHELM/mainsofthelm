document.addEventListener('DOMContentLoaded', () => {
  const backendURL = "https://mainsofthelm.onrender.com";

  const mainBox = document.getElementById('main-box');
  const signinBox = document.getElementById('signin-box');
  const newAccountBox = document.getElementById('newaccount-box');

  const signInBtn = document.getElementById('signInBtn');
  const newAccountBtn = document.getElementById('newAccountBtn');
  const backFromSignIn = document.getElementById('backFromSignIn');
  const backFromSignup = document.getElementById('backFromSignup');

  const signinSubmit = document.getElementById('signinSubmit');
  const signupSubmit = document.getElementById('signupSubmit');

  const signinUsernameInput = document.getElementById('signin-username');
  const signinPasswordInput = document.getElementById('signin-password');
  const signupUsernameInput = document.getElementById('signup-username');
  const signupPasswordInput = document.getElementById('signup-password');
  const signupConfirmInput = document.getElementById('signup-confirm');
  const signupEmailInput = document.getElementById('signup-email');
  const signupFirstnameInput = document.getElementById('signup-firstname');
  const signupLastnameInput = document.getElementById('signup-lastname');

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

  // Sign In with verification check
  signinSubmit.addEventListener('click', async (e) => {
    e.preventDefault();
    const username = signinUsernameInput.value.trim();
    const password = signinPasswordInput.value.trim();

    try {
      const res = await fetch(`${backendURL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if(data.success){
        if(!data.verified){
          document.getElementById('signin-message').textContent = "Please verify your email before signing in.";
          return;
        }
        localStorage.setItem('softhelmUsername', username);
        window.location.href = 'welcome.html';
      } else {
        document.getElementById('signin-message').textContent = data.message || 'Login failed';
      }
    } catch(err){
      console.error(err);
      document.getElementById('signin-message').textContent = 'Server error';
    }
  });

  // Register (with email verification)
  signupSubmit.addEventListener('click', async (e) => {
    e.preventDefault();
    const payload = {
      firstname: signupFirstnameInput.value.trim(),
      lastname: signupLastnameInput.value.trim(),
      email: signupEmailInput.value.trim(),
      username: signupUsernameInput.value.trim(),
      password: signupPasswordInput.value.trim(),
      confirm: signupConfirmInput.value.trim()
    };

    if(payload.password !== payload.confirm){
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

      if(data.success){
        document.getElementById('signup-message').textContent = 
          "Account created! Check your email to verify before signing in.";
      } else {
        document.getElementById('signup-message').textContent = data.message || 'Registration failed';
      }
    } catch(err){
      console.error(err);
      document.getElementById('signup-message').textContent = 'Server error';
    }
  });
});
