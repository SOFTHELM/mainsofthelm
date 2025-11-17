(() => {
  // ===== Form Elements =====
  const mainBox = document.getElementById("main-box");
  const signinBox = document.getElementById("signin-box");
  const newaccountBox = document.getElementById("newaccount-box");

  const signInBtn = document.getElementById("signInBtn");
  const newAccountBtn = document.getElementById("newAccountBtn");
  const backFromSignIn = document.getElementById("backFromSignIn");
  const backFromSignup = document.getElementById("backFromSignup");

  const signinSubmit = document.getElementById("signinSubmit");
  const signupSubmit = document.getElementById("signupSubmit");

  // ===== Toggle Forms =====
  signInBtn.addEventListener("click", () => {
    mainBox.classList.add("hidden");
    signinBox.classList.remove("hidden");
  });

  newAccountBtn.addEventListener("click", () => {
    mainBox.classList.add("hidden");
    newaccountBox.classList.remove("hidden");
  });

  backFromSignIn.addEventListener("click", () => {
    signinBox.classList.add("hidden");
    mainBox.classList.remove("hidden");
  });

  backFromSignup.addEventListener("click", () => {
    newaccountBox.classList.add("hidden");
    mainBox.classList.remove("hidden");
  });

  // ===== Placeholder hover text =====
  document.querySelectorAll('input[data-jp]').forEach(input => {
    const original = input.placeholder;
    const jp = input.getAttribute('data-jp');
    input.addEventListener('mouseenter', () => input.placeholder = jp);
    input.addEventListener('mouseleave', () => input.placeholder = original);
  });

  // ===== LOGIN =====
  signinSubmit.addEventListener("click", async () => {
    const username = document.getElementById("signin-username").value;
    const password = document.getElementById("signin-password").value;

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    document.getElementById("signin-message").textContent = data.message || '';
    if (data.success) {
      alert("Login successful!"); // replace with redirect logic
    }
  });

  // ===== REGISTER =====
  signupSubmit.addEventListener("click", async () => {
    const firstname = document.getElementById("signup-firstname").value;
    const lastname = document.getElementById("signup-lastname").value;
    const email = document.getElementById("signup-email").value;
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;
    const confirm = document.getElementById("signup-confirm").value;

    if (password !== confirm) {
      document.getElementById("signup-message").textContent = "Passwords do not match";
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstname, lastname, email, username, password })
    });

    const data = await res.json();
    document.getElementById("signup-message").textContent = data.message || '';
    if (data.success) {
      alert("Account created!"); // replace with redirect logic
    }
  });
})();
