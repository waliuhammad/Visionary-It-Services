# Visionary IT Services

Multi-page React website (React 19, React Router, Tailwind CSS 4, Vite) with a separate Node.js API that uses Firebase Authentication and Firestore.

```
Visionary-It-Services/
├── src/            # React website (storefront pages + /admin dashboard)
├── public/         # Static files copied as-is into dist/ (incl. .htaccess for Hostinger)
├── backend/        # Express API: see backend/README.md
├── index.html
└── vite.config.js
```

## Local development

New to the project? [SETUP.md](SETUP.md) walks through it step by step.

```bash
# 1. API (terminal 1)
cd backend
cp .env.example .env        # add your Firebase service-account credentials
npm install
npm run dev                 # http://localhost:8080

# 2. Website (terminal 2, project root)
cp .env.example .env        # add your Firebase Web app config
npm install
npm run dev                 # http://localhost:5173 (/api is proxied to the backend)
```

## Production build (Hostinger)

1. Create `.env.production` from `.env.example` and set `VITE_API_BASE_URL` to the deployed API
   (e.g. `https://api.visionaryitservices.com/api/v1`) along with the `VITE_FIREBASE_*` values.
2. Build:
   ```bash
   npm run build
   ```
3. Upload **everything inside `dist/`** (including the hidden `.htaccess`) to `public_html/` in the Hostinger File Manager.

`.htaccess` routes every URL (`/shop`, `/product/…`, `/admin/…`) to `index.html` so page refreshes and direct links work.

The website is static and runs on any Hostinger plan. The **API needs a Node.js host** such as a Hostinger VPS; see
[backend/DEPLOY-HOSTINGER.md](backend/DEPLOY-HOSTINGER.md).

## How the site and API fit together

| Part of the site | Data |
|---|---|
| Shop, product pages, navbar search, home best sellers | Loaded live from the API; falls back to the bundled `src/data/products.json` if the API is unreachable |
| Checkout (`/checkout`) | Places a real order; the server recalculates every price |
| Contact form, newsletter | Saved through the API and shown in the admin panel |
| Admin panel (`/admin`) | Live: stats, orders, products, messages, users and on-site visitors update instantly |

Products, orders and messages therefore appear in the admin panel the moment they happen, and admin
changes show up on the website right away.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Build the production site into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint with oxlint |
