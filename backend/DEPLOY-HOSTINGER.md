# Deployment Guide (VPS / Hostinger)

> [!WARNING]
> **Hostinger Shared Web Hosting CANNOT run this API.**
> This is a Node.js application that requires a long-running process (PM2) and direct port access. You **MUST** have a VPS (Virtual Private Server) or a specific Node.js hosting plan to deploy this application.

## 1. Initial VPS Setup

Connect to your VPS via SSH:
```bash
ssh root@your_server_ip
```

Create a non-root user (for security):
```bash
adduser deploy
usermod -aG sudo deploy
su - deploy
```

Install Node.js 20+ (using NVM):
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

## 2. Deploying the Application

1. On your local machine, run `npm run build` in the `backend` folder.
2. Upload the contents of the `dist/` folder to your VPS (e.g., using `scp` or `rsync`):
   ```bash
   scp -r ./dist/* deploy@your_server_ip:/home/deploy/visionary-api/
   ```
3. SSH back into your VPS and install dependencies:
   ```bash
   cd ~/visionary-api
   npm install --omit=dev
   ```

## 3. Configuration & Security

1. Copy the `.env.example` to `.env` and fill in your production values:
   ```bash
   cp .env.example .env
   nano .env
   ```
2. Upload your Firebase Service Account JSON key (if using the file method).
   ```bash
   chmod 600 /path/to/serviceAccountKey.json
   ```
   *(This ensures only the owner can read the highly sensitive key).*

## 4. Database Setup

Run the seed script (if this is a fresh database):
```bash
node scripts/seed.js
```
Create your admin user:
```bash
node scripts/createAdmin.js your.email@example.com "YourSecurePassword" "Your Name"
```

## 5. Starting the Server with PM2

Install PM2 globally and start the app using the ecosystem config:
```bash
npm install -g pm2
pm2 start ecosystem.config.cjs
```
Ensure PM2 starts on reboot:
```bash
pm2 startup
# Run the command PM2 outputs, then:
pm2 save
```

## 6. Nginx Reverse Proxy

Install Nginx:
```bash
sudo apt install nginx
```

Create a site configuration:
```bash
sudo nano /etc/nginx/sites-available/api.visionaryitservices.com
```

Add the following (replace domains as needed):
```nginx
server {
    server_name api.visionaryitservices.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/api.visionaryitservices.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 7. SSL with Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.visionaryitservices.com
```

## 8. Firewall (UFW)

Secure your server by only allowing SSH, HTTP, and HTTPS:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## Frontend SPA Routing (Apache / `.htaccess`)
If your React frontend is hosted on standard shared hosting (Apache), ensure you have an `.htaccess` file in your `public_html` directory to rewrite all requests to `index.html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Troubleshooting

| Problem | Cause / Solution |
|---|---|
| `502 Bad Gateway` | Node server is down. Check PM2 logs: `pm2 logs visionary-api` |
| Rate limit triggers instantly | Nginx isn't passing IPs. Ensure `X-Forwarded-For` is set in Nginx and `app.set('trust proxy', 1)` is in `app.js`. |
| CORS errors | Add the frontend domain to `CORS_ORIGINS` in `.env`. |
| Cannot log in (cookie issues) | Ensure `API_PREFIX` and frontend proxy paths align, or that `sameSite: 'none'` and `secure: true` are working over HTTPS. |
