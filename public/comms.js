document.addEventListener('DOMContentLoaded', () => {
  // Elements
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

  // Go back to main
  backFromSignIn.addEventListener('click', () => {
    signinBox.classList.add('hidden');
    mainBox.classList.remove('hidden');
  });

  backFromSignup.addEventListener('click', () => {
    newAccountBox.classList.add('hidden');
    mainBox.classList.remove('hidden');
  });

  // Redirect buttons
  signinSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'dashboard.html';
  });

  signupSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'welcome.html';
  });
});
