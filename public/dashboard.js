// comms.js
document.addEventListener('DOMContentLoaded', () => {
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
  const signupUsernameInput = document.getElementById('signup-username');

  // Show Sign In form
  signInBtn.addEventListener('click', () => {
    mainBox.classList.add('hidden');
    signinBox.classList.remove('hidden');
  });

  // Show New Account form
  newAccountBtn.addEventListener('click', () => {
    mainBox.classList.add('hidden');
    newAccountBox.classList.remove('hidden');
  });

  // Go back to main
  backFromSignIn.addEventListener('click', () => {
    signinBox.classList.add('hidden');
    mainBox.classList.remove('hidden');
  });

  backFromSignup.addEventListener('click', () => {
    newAccountBox.classList.add('hidden');
    mainBox.classList.remove('hidden');
  });

  // Sign In -> Dashboard
  signinSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const username = signinUsernameInput.value.trim();
    if (username) localStorage.setItem('softhelmUsername', username);
    window.location.href = 'dashboard.html';
  });

  // New Account -> Welcome
  signupSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const username = signupUsernameInput.value.trim();
    if (username) localStorage.setItem('softhelmUsername', username);
    window.location.href = 'welcome.html';
  });
});
