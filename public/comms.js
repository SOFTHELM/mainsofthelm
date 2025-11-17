// Form toggle
const mainBox = document.getElementById("main-box");
const signinBox = document.getElementById("signin-box");
const newaccountBox = document.getElementById("newaccount-box");

document.getElementById("signInBtn").addEventListener("click", () => {
  mainBox.classList.add("hidden");
  signinBox.classList.remove("hidden");
});
document.getElementById("newAccountBtn").addEventListener("click", () => {
  mainBox.classList.add("hidden");
  newaccountBox.classList.remove("hidden");
});
document.getElementById("backFromSignIn").addEventListener("click", () => {
  signinBox.classList.add("hidden");
  mainBox.classList.remove("hidden");
});
document.getElementById("backFromSignup").addEventListener("click", () => {
  newaccountBox.classList.add("hidden");
  mainBox.classList.remove("hidden");
});

// Placeholder hover
document.querySelectorAll('input[data-jp]').forEach(input => {
  const original = input.placeholder;
  const jp = input.dataset.jp;

  input.addEventListener('mouseenter', () => input.placeholder = jp);
  input.addEventListener('mouseleave', () => input.placeholder = original);
});
