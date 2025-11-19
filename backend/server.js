const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());

let users = {}; // For demo, use DB in production

// Nodemailer setup (replace with real SMTP)
const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  auth: { user: "user@example.com", pass: "password" }
});

// Register route
app.post('/register', (req, res) => {
  const { email, username, password, firstname, lastname } = req.body;
  if(users[username]) return res.json({ success:false, message:"Username taken" });

  // Create verification token
  const token = crypto.randomBytes(20).toString('hex');
  users[username] = { email, username, password, firstname, lastname, verified:false, token };

  // Send verification email
  const verifyLink = `https://yourdomain.com/verify?token=${token}`;
  transporter.sendMail({
    from: '"Softhelm" <noreply@softhelm.com>',
    to: email,
    subject: "Verify Your Softhelm Account",
    html: `<p>Hi ${firstname}, verify your account by clicking <a href="${verifyLink}">here</a>.</p>`
  });

  return res.json({ success:true, message:"Check your email for verification" });
});

// Verify endpoint
app.get('/verify', (req, res) => {
  const { token } = req.query;
  const user = Object.values(users).find(u => u.token === token);
  if(!user) return res.send("Invalid or expired token");
  user.verified = true;
  return res.send("Email verified! You can now sign in.");
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if(!user || user.password !== password) return res.json({ success:false, message:"Invalid credentials" });
  return res.json({ success:true, verified:user.verified });
});

app.listen(3000, () => console.log("Server running on port 3000"));
