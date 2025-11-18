// comms.js
document.addEventListener('DOMContentLoaded', () => {
  // Grab elements
  const mainBox = document.getElementById('main-box');
  const signinBox = document.getElementById('signin-box');
  const newAccountBox = document.getElementById('newaccount-box');

  const signInBtn = document.getElementById('signInBtn');
  const newAccountBtn = document.getElementById('newAccountBtn');

  const backFromSignIn = document.getElementById('backFromSignIn');
  const backFromSignup = document.getElementById('backFromSignup');

  const signinSubmit = document.getElementById('signinSubmit');
  const signupSubmit = document.getElementById('signupSubmit');

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

  // Back buttons
  backFromSignIn.addEventListener('click', () => {
    signinBox.classList.add('hidden');
    mainBox.classList.remove('hidden');
  });

  backFromSignup.addEventListener('click', () => {
    newAccountBox.classList.add('hidden');
    mainBox.classList.remove('hidden');
  });

  // Enter button on Sign In
  signinSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    // Here you can later add API call to backend for real login
    window.location.href = 'dashboard.html';
  });

  // Register button on New Account
  signupSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    // Here you can later add API call to backend for registration
    window.location.href = 'welcome.html';
  });
});
