// comms.js - UI toggles + register/login (full copy/paste ready)
// Place this in public/comms.js and ensure comms.html references it.

console.log('comms.js loaded');

const mainBox = document.getElementById("main-box");
const signinBox = document.getElementById("signin-box");
const newaccountBox = document.getElementById("newaccount-box");

// Guard for pages where these don't exist
function qs(id) { return document.getElementById(id); }

if (qs('signInBtn')) {
  qs('signInBtn').addEventListener("click", () => {
    mainBox && mainBox.classList.add("hidden");
    signinBox && signinBox.classList.remove("hidden");
  });
}
if (qs('newAccountBtn')) {
  qs('newAccountBtn').addEventListener("click", () => {
    mainBox && mainBox.classList.add("hidden");
    newaccountBox && newaccountBox.classList.remove("hidden");
  });
}
if (qs('backFromSignIn')) {
  qs('backFromSignIn').addEventListener("click", () => {
    signinBox && signinBox.classList.add("hidden");
    mainBox && mainBox.classList.remove("hidden");
  });
}
if (qs('backFromSignup')) {
  qs('backFromSignup').addEventListener("click", () => {
    newaccountBox && newaccountBox.classList.add("hidden");
    mainBox && mainBox.classList.remove("hidden");
  });
}

// Placeholder hover for inputs (data-jp)
document.querySelectorAll('input[data-jp]').forEach(input => {
  const original = input.placeholder;
  const jp = input.dataset.jp;
  input.addEventListener('mouseenter', () => input.placeholder = jp);
  input.addEventListener('mouseleave', () => input.placeholder = original);
});

// Helper: show messages
function showMessage(el, text, ok = true) {
  if (!el) return;
  el.style.color = ok ? 'lightgreen' : 'salmon';
  el.textContent = text;
}

// --- Registration ---
const signupBtn = qs('signupSubmit');
const signupMsg = qs('signup-message');
if (signupBtn) signupBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const firstname = qs('signup-firstname').value.trim();
  const lastname  = qs('signup-lastname').value.trim();
  const email     = qs('signup-email').value.trim();
  const username  = qs('signup-username').value.trim();
  const password  = qs('signup-password').value;
  const confirm   = qs('signup-confirm').value;

  if (!firstname || !lastname || !email || !username || !password) {
    showMessage(signupMsg, 'Please fill all fields.', false);
    return;
  }
  if (password !== confirm) {
    showMessage(signupMsg, 'Passwords do not match.', false);
    return;
  }

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstname, lastname, email, username, password })
    });
    const json = await res.json();
    if (json.success) {
      showMessage(signupMsg, json.message || 'Account created.', true);
      // after a short delay, show sign-in
      setTimeout(() => {
        newaccountBox && newaccountBox.classList.add('hidden');
        mainBox && mainBox.classList.remove('hidden');
      }, 900);
    } else {
      showMessage(signupMsg, json.message || 'Registration failed.', false);
    }
  } catch (err) {
    console.error(err);
    showMessage(signupMsg, 'Network or server error.', false);
  }
});

// --- Sign in ---
const signinBtnEl = qs('signinSubmit');
const signinMsg = qs('signin-message');
if (signinBtnEl) signinBtnEl.addEventListener('click', async (e) => {
  e.preventDefault();
  const username = qs('signin-username').value.trim();
  const password = qs('signin-password').value;

  if (!username || !password) {
    showMessage(signinMsg, 'Enter username and password.', false);
    return;
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const json = await res.json();
    if (json.success && json.token) {
      showMessage(signinMsg, 'Signed in.', true);
      localStorage.setItem('token', json.token);
      // redirect to welcome where user will build avatar
      setTimeout(() => window.location.href = '/welcome.html', 400);
    } else {
      showMessage(signinMsg, json.message || 'Login failed.', false);
    }
  } catch (err) {
    console.error(err);
    showMessage(signinMsg, 'Network or server error.', false);
  }
});

// Optional: logout helper if you add a logout button later
function logout() {
  localStorage.removeItem('token');
  window.location.href = '/comms.html';
}
