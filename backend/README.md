# Softhelm Backend

## Setup (local)

1. Copy `.env.example` to `.env` and fill in values (DATABASE_URL, JWT_SECRET, S3 keys, BASE_URL).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create DB tables:
   ```bash
   npm run migrate
   ```
4. Start server:
   ```bash
   npm run dev
   ```

## Deploy to Render

1. Push repo to GitHub.
2. Create a new Web Service in Render and connect your GitHub repo.
   - Build command: `npm install`
   - Start command: `npm start`
3. Set environment variables on Render (`DATABASE_URL`, `JWT_SECRET`, S3 keys, `BASE_URL`).

## Notes

- Passwords are hashed with bcrypt.
- Auth uses JWT stored client-side.
- For avatar/music hosting, S3 is recommended.
