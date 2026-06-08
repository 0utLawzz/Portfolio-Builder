# OUTLAWZ LABS™ — Hostinger Deployment Guide

## What's in this ZIP

```
outlawz-labs-deploy/
├── frontend/          ← Static files — upload these via FTP
├── api/               ← Node.js API server
│   ├── dist/          ← Compiled server (ready to run)
│   └── .env.example   ← Copy to .env and fill in values
├── database-setup.sql ← Run this on your PostgreSQL database
└── DEPLOYMENT-GUIDE.md ← You are here
```

---

## Step 1 — Set Up PostgreSQL Database

Hostinger shared/web hosting uses **MySQL**, not PostgreSQL.
You need a **free external PostgreSQL** service:

### Option A — Neon (Recommended, completely free)
1. Go to https://neon.tech and sign up
2. Create a new project → name it `outlawz-labs`
3. Copy the **Connection string** (looks like: `postgresql://user:pass@host/dbname?sslmode=require`)
4. Open the **SQL Editor** in Neon
5. Paste the contents of `database-setup.sql` and click **Run**

### Option B — Supabase (Free tier)
1. Go to https://supabase.com and sign up
2. Create a new project
3. Go to **Settings → Database → Connection string** (URI format)
4. Go to **SQL Editor**, paste `database-setup.sql` and run it

---

## Step 2 — Deploy the Frontend (FTP)

The `frontend/` folder contains your compiled React app.

1. Connect to Hostinger FTP with your credentials
2. Upload **all contents of the `frontend/` folder** to `public_html/`
3. The site will be live immediately — but API calls won't work yet until Step 3

### If Hostinger uses .htaccess for routing:
Create a file `public_html/.htaccess` with:
```
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```
This ensures page refreshes work correctly on the SPA.

---

## Step 3 — Deploy the API Server

You need a Node.js runtime. Choose one:

### Option A — Hostinger VPS (if you have one)

1. SSH into your VPS
2. Install Node.js 20+:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
3. Install PM2 (keeps the app running):
   ```bash
   npm install -g pm2
   ```
4. Upload the `api/` folder to your VPS (e.g. `/home/user/outlawz-api/`)
5. Create your `.env` file:
   ```bash
   cp .env.example .env
   nano .env  # fill in DATABASE_URL, SESSION_SECRET, ADMIN_PASSWORD
   ```
6. Start the server:
   ```bash
   pm2 start dist/index.mjs --name outlawz-api
   pm2 save
   pm2 startup  # auto-start on reboot
   ```
7. Configure Nginx to proxy `/api` to port 3000:
   ```nginx
   location /api {
     proxy_pass http://localhost:3000;
     proxy_http_version 1.1;
     proxy_set_header Upgrade $http_upgrade;
     proxy_set_header Connection 'upgrade';
     proxy_set_header Host $host;
     proxy_cache_bypass $http_upgrade;
   }
   ```

### Option B — Hostinger Business Plan (Node.js App Manager)
1. In hPanel → go to **Advanced → Node.js**
2. Create a new Node.js app
3. Set the startup file to `dist/index.mjs`
4. Set environment variables (from `.env.example`)
5. Upload the `api/` folder contents to the app's directory
6. Click **Start**

### Option C — Free External API Host (Easiest if you only have shared hosting)
Deploy the API for free on one of these, then update the frontend's API URL:

- **Railway.app** — free tier, deploy from GitHub
- **Render.com** — free tier, connects to GitHub
- **Fly.io** — free tier

For Railway/Render: push the `api/` folder to a GitHub repo and connect it.

---

## Step 4 — Environment Variables Summary

| Variable | Where to get it |
|----------|----------------|
| `DATABASE_URL` | Neon/Supabase connection string |
| `SESSION_SECRET` | Run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `ADMIN_PASSWORD` | Your choice — default is `outlawz2025` |
| `PORT` | Set to `3000` (or whatever your host assigns) |
| `NODE_ENV` | Set to `production` |

---

## Step 5 — Connect Frontend to API

If your API is on a different domain than your frontend, you need to update the API base URL.

Edit `frontend/assets/index-*.js` (search for `/api`) — or better, redeploy with the correct API URL set.

**If frontend and API are on the same domain** (e.g. Hostinger VPS with Nginx routing `/api` to Node.js), no changes needed — it works automatically.

---

## Admin Panel

After deployment, go to: `https://yourdomain.com/admin`
- Default password: `outlawz2025`
- Change it by updating `ADMIN_PASSWORD` env variable

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Page refresh shows 404 | Add `.htaccess` file (see Step 2) |
| API calls fail | Check `CORS` — API server must allow your frontend domain |
| Database connection error | Check `DATABASE_URL` format, ensure `?sslmode=require` is present |
| Sessions not persisting | Ensure `SESSION_SECRET` is set and consistent |

---

## Questions?
Contact: net2outlawzz@gmail.com | WhatsApp: +92 332 5195959
