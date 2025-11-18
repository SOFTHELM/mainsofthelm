// comms.js
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const mainBoxEl = document.getElementById('main-box');
  const signinBoxEl = document.getElementById('signin-box');
  const newAccountBoxEl = document.getElementById('newaccount-box');

  const signInBtnEl = document.getElementById('signInBtn');
  const newAccountBtnEl = document.getElementById('newAccountBtn');

  const backFromSignInEl = document.getElementById('backFromSignIn');
  const backFromSignupEl = document.getElementById('backFromSignup');

  const signinSubmitEl = document.getElementById('signinSubmit');
  const signupSubmitEl = document.getElementById('signupSubmit');

  // Show Sign In form
  if(signInBtnEl) signInBtnEl.addEventListener('click', function() {
    mainBoxEl.classList.add('hidden');
    signinBoxEl.classList.remove('hidden');
  });

  // Show New Account form
  if(newAccountBtnEl) newAccountBtnEl.addEventListener('click', function() {
    mainBoxEl.classList.add('hidden');
    newAccountBoxEl.classList.remove('hidden');
  });

  // Go back to main
  if(backFromSignInEl) backFromSignInEl.addEventListener('click', function() {
    signinBoxEl.classList.add('hidden');
    mainBoxEl.classList.remove('hidden');
  });

  if(backFromSignupEl) backFromSignupEl.addEventListener('click', function() {
    newAccountBoxEl.classList.add('hidden');
    mainBoxEl.classList.remove('hidden');
  });

  // Sign In -> dashboard
  if(signinSubmitEl) signinSubmitEl.addEventListener('click', function(e) {
    e.preventDefault();
    // TODO: Replace with API login call later
    window.location.href = 'dashboard.html';
  });

  // New Account -> welcome
  if(signupSubmitEl) signupSubmitEl.addEventListener('click', function(e) {
    e.preventDefault();
    // TODO: Replace with API signup call later
    window.location.href = 'welcome.html';
  });
});
