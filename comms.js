// ===== Hover logic for placeholders (keep as is) =====
const placeholderInputs = document.querySelectorAll('input[data-jp]');
placeholderInputs.forEach(input => {
  const original = input.placeholder;
  const jp = input.getAttribute('data-jp');

  input.addEventListener('mouseenter', () => input.placeholder = jp);
  input.addEventListener('mouseleave', () => input.placeholder = original);
});

// ===== AUTH LOGIC (login/signup) =====

// Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');

// Toggle forms
loginBtn?.addEventListener('click', () => {
  loginForm.style.display = 'block';
  signupForm.style.display = 'none';
});

signupBtn?.addEventListener('click', () => {
  signupForm.style.display = 'block';
  loginForm.style.display = 'none';
});

// Helper function for API requests
async function apiRequest(url, method, body, token) {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return res.json();
}

// LOGIN
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = loginForm.username.value.trim();
  const password = loginForm.password.value;

  const data = await apiRequest('/api/auth/login', 'POST', { username, password });
  if (data.error) return alert(data.error);

  localStorage.setItem('token', data.token);
  localStorage.setItem('username', username);
  window.location.href = '/welcome.html';
});

// SIGNUP
signupForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = signupForm.username.value.trim();
  const email = signupForm.email.value.trim();
  const realName = signupForm.realName.value.trim();
  const password = signupForm.password.value;

  const data = await apiRequest('/api/auth/signup', 'POST', { username, email, realName, password });
  if (data.error) return alert(data.error);

  localStorage.setItem('token', data.token);
  localStorage.setItem('username', data.user.username);
  window.location.href = '/welcome.html';
});
