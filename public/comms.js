// comms.js
(function() {
  document.addEventListener('DOMContentLoaded', function() {
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

    // Show Sign In
    signInBtn.addEventListener('click', () => {
      mainBox.classList.add('hidden');
      signinBox.classList.remove('hidden');
    });

    // Show New Account
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

    // Enter buttons
    signinSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      // TODO: call backend login API here
      window.location.href = 'dashboard.html';
    });

    signupSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      // TODO: call backend signup API here
      window.location.href = 'welcome.html';
    });
  });
})();
