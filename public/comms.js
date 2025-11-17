// ===== Form Toggle Logic =====
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

// ===== Placeholder hover logic =====
const placeholderInputs = document.querySelectorAll('input[data-jp]');
placeholderInputs.forEach(input => {
  const original = input.placeholder;
  const jp = input.getAttribute('data-jp');

  input.addEventListener('mouseenter', () => input.placeholder = jp);
  input.addEventListener('mouseleave', () => input.placeholder = original);
});

// ===== LOGIN =====
document.getElementById("signinSubmit").addEventListener("click", async () => {
  const username = document.getElementById("signin-username").value;
  const password = document.getElementById("signin-password").value;
  const messageBox = document.getElementById("signin-message");

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.success) {
      messageBox.textContent = "Login successful!";
      messageBox.style.color = "green";
      // Redirect or show dashboard
    } else {
      messageBox.textContent = data.message || "Login failed";
      messageBox.style.color = "red";
    }
  } catch (err) {
    messageBox.textContent = "Error connecting to server";
    messageBox.style.color = "red";
    console.error(err);
  }
});

// ===== REGISTER =====
document.getElementById("signupSubmit").addEventListener("click", async () => {
  const firstname = document.getElementById("signup-firstname").value;
  const lastname = document.getElementById("signup-lastname").value;
  const email = document.getElementById("signup-email").value;
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;
  const messageBox = document.getElementById("signup-message");

  if (password !== confirm) {
    messageBox.textContent = "Passwords do not match";
    messageBox.style.color = "red";
    return;
  }

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstname, lastname, email, username, password })
    });
    const data = await res.json();

    if (data.success) {
      messageBox.textContent = "Account created!";
      messageBox.style.color = "green";
      // Optionally, switch to login form
    } else {
      messageBox.textContent = data.message || "Registration failed";
      messageBox.style.color = "red";
    }
  } catch (err) {
    messageBox.textContent = "Error connecting to server";
    messageBox.style.color = "red";
    console.error(err);
  }
});
