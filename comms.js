// ==== Form Toggle Logic ====
const mainBox = document.getElementById("main-box");
const signinBox = document.getElementById("signin-box");
const newaccountBox = document.getElementById("newaccount-box");

// Buttons to show forms
document.getElementById("signInBtn").addEventListener("click", () => {
  mainBox.classList.add("hidden");
  signinBox.classList.remove("hidden");
});
document.getElementById("newAccountBtn").addEventListener("click", () => {
  mainBox.classList.add("hidden");
  newaccountBox.classList.remove("hidden");
});

// Back buttons
document.getElementById("backFromSignIn").addEventListener("click", () => {
  signinBox.classList.add("hidden");
  mainBox.classList.remove("hidden");
});
document.getElementById("backFromSignup").addEventListener("click", () => {
  newaccountBox.classList.add("hidden");
  mainBox.classList.remove("hidden");
});

// ==== Placeholder Hover Logic ====
const placeholderInputs = document.querySelectorAll('input[data-jp]');
placeholderInputs.forEach(input => {
  const original = input.placeholder;
  const jp = input.getAttribute('data-jp');

  input.addEventListener('mouseenter', () => input.placeholder = jp);
  input.addEventListener('mouseleave', () => input.placeholder = original);
});
