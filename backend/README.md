# Visionary IT Services — API

REST API for the Visionary IT Services website, built with **Node.js (Express 5)**, **Firebase Authentication** and **Cloud Firestore**.

## Project structure

```
backend/
├── data/                   # Seed data (products.json)
├── scripts/
│   ├── build.js            # Creates a production bundle in dist/
│   ├── createAdmin.js      # Creates or promotes an admin user
│   └── seed.js             # Seeds products + categories
├── src/
│   ├── config/             # env validation, Firebase Admin, cookie settings
│   ├── middleware/         # auth guards, validation, rate limiting, error handler
│   ├── modules/            # one folder per feature
│   │   └── <feature>/      #   *.routes.js → *.controller.js → *.service.js (+ *.schema.js)
│   ├── routes/index.js     # mounts all feature routers under API_PREFIX
│   ├── utils/              # ApiError, logger, mailer, response helpers
│   ├── app.js              # Express app (middleware + routes)
│   └── server.js           # HTTP server + graceful shutdown
├── firebase.json           # Firebase CLI config (rules + indexes)
├── firestore.rules
├── firestore.indexes.json
└── ecosystem.config.cjs    # PM2 config for production
```

Each layer has one job: **routes** wire middleware, **schemas** validate input (Zod), **controllers** translate HTTP to service calls, and **services** hold the business logic and Firestore access.

## Setup

Requires Node.js 20 or newer.

1. **Create a Firebase project** at <https://console.firebase.google.com>:
   - *Authentication → Sign-in method* → enable **Email/Password**.
   - *Firestore Database* → create a database.
   - *Project settings → Service accounts* → **Generate new private key**.
2. **Configure the environment:**
   ```bash
   cp .env.example .env
   ```
   Fill in `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` from the key file,
   or set `GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json`. The key file is git-ignored.
3. **Install and run:**
   ```bash
   npm install
   npm run dev            # http://localhost:8080/api/v1 (restarts on file changes)
   ```
4. **Deploy Firestore rules and indexes** (requires `npm i -g firebase-tools` and `firebase login`):
   ```bash
   firebase use --add     # select your project
   npm run deploy:firestore
   ```
5. **Cloudinary (product images):** create a free account at <https://cloudinary.com>, then copy
   *Cloud name*, *API key* and *API secret* from the dashboard into `CLOUDINARY_*` in `.env`.
6. **Seed data and create an admin:**
   ```bash
   npm run seed                                   # or: npm run seed:wipe
   npm run create-admin -- admin@example.com "StrongPass123" "Admin Name"
   ```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start with auto-reload |
| `npm start` | Start in production mode |
| `npm run build` | Create a deployable bundle in `dist/` |
| `npm run seed` / `seed:wipe` | Import `data/products.json` (optionally wiping first) |
| `npm run create-admin -- <email> [password] [name]` | Create or promote an admin |
| `npm run images:migrate` [`-- --dry-run`] | Copy all product images to Cloudinary and update Firestore + JSON data |
| `npm run deploy:firestore` | Deploy `firestore.rules` and `firestore.indexes.json` |

## Authentication

1. The React app signs the user in with the **Firebase Web SDK** and gets a short-lived ID token.
2. It sends the token to `POST /api/v1/auth/session`. The API verifies it (the sign-in must be less than 5 minutes old) and sets a 5-day **httpOnly `__session` cookie**.
3. Every later request carries the cookie, which `requireAuth` verifies (revoked sessions are rejected).
   API clients without cookies can send `Authorization: Bearer <idToken>` instead.
4. **Roles** (`customer`, `editor`, `admin`) are stored as Firebase **custom claims**, which are authoritative.
   They are mirrored to `users/{uid}` in Firestore only for listing and querying.
5. `POST /auth/logout` clears the cookie and revokes the user's refresh tokens.

### Cookie settings

| Deployment | Settings |
|---|---|
| Local dev (Vite proxy) | defaults (`COOKIE_SAMESITE=lax`, not secure) |
| Site `visionaryitservices.com` + API `api.visionaryitservices.com` | `COOKIE_SAMESITE=lax` (same site), HTTPS, `NODE_ENV=production` |
| Site and API on unrelated domains | `COOKIE_SAMESITE=none`, HTTPS (Secure is enabled automatically) |

Always add the website origin(s) to `CORS_ORIGINS`, e.g. `https://visionaryitservices.com,https://www.visionaryitservices.com`.

## Response format

```jsonc
// success
{ "success": true, "data": { ... } }
// paginated
{ "success": true, "data": [ ... ], "meta": { "page": 1, "limit": 12, "total": 226, "nextCursor": null, "hasMore": true } }
// error
{ "success": false, "error": { "message": "Validation failed", "details": [{ "path": "email", "message": "Invalid email address" }] } }
```

## Endpoints

All paths are prefixed with `/api/v1`.

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/health` | Public | Health check (also at `/health`) |
| **Auth** ||||
| POST | `/auth/register` | Public | Register a customer `{ fullName, email, password }` |
| POST | `/auth/session` | Public | Exchange `{ idToken }` for a session cookie |
| POST | `/auth/logout` | Public | Clear the session cookie and revoke tokens |
| POST | `/auth/password-reset` | Public | Email a password reset link `{ email }` |
| GET | `/auth/me` | User | Current user's profile and role |
| POST | `/auth/role` | Admin | Set a user's role `{ uid, role }` |
| **Products** ||||
| GET | `/products` | Public | List (`page, limit, category, search, minPrice, maxPrice, bestSeller, sort`) |
| GET | `/products/featured` | Public | Best sellers |
| GET | `/products/slug/:slug` | Public | Product by slug |
| GET | `/products/:id` | Public | Product by id |
| GET | `/products/:id/related` | Public | Related products |
| POST | `/products` | Admin | Create |
| PATCH | `/products/:id` | Admin | Update |
| DELETE | `/products/:id` | Admin | Delete |
| **Categories** ||||
| GET | `/categories` | Public | List |
| POST | `/categories` | Admin | Create |
| DELETE | `/categories/:id` | Admin | Delete |
| **Orders** ||||
| POST | `/orders` | Public / User | Place an order (prices are recalculated on the server) |
| GET | `/orders/mine` | User | Own order history |
| GET | `/orders/:id` | Owner / Admin | Order details |
| GET | `/orders` | Admin | All orders |
| PATCH | `/orders/:id/status` | Admin | Update order or payment status |
| **Users** ||||
| GET | `/users/me` | User | Own profile |
| PATCH | `/users/me` | User | Update own profile |
| GET | `/users` | Admin | All users |
| DELETE | `/users/:uid` | Admin | Delete a user |
| **Site** ||||
| GET | `/settings` | Public | Site settings |
| PATCH | `/settings` | Admin | Update site settings |
| GET | `/admin/dashboard/stats` | Admin | Revenue, counts and stock level |
| GET | `/admin/dashboard/chart?days=7` | Admin | Daily revenue and order counts |
| POST | `/contact` | Public | Submit the contact form |
| GET | `/contact` | Admin | List messages |
| PATCH | `/contact/:id` | Admin | Mark a message as read or unread |
| DELETE | `/contact/:id` | Admin | Delete a message |
| POST | `/newsletter/subscribe` | Public | Subscribe |
| POST | `/newsletter/unsubscribe` | Public | Unsubscribe |
| **Images (Cloudinary)** ||||
| POST | `/uploads?folder=products` | Admin / Editor | multipart upload, field `files` (max 10 × 5 MB); returns `[{ url, publicId }]` |
| DELETE | `/uploads` | Admin / Editor | Delete an image `{ publicId }` or `{ url }` |
| **Realtime & tracking** ||||
| GET | `/admin/stream` | Admin | Server-Sent Events: `snapshot`, `stats`, `change`, `activity`, `visitors` |
| GET | `/admin/activity?limit&before&entity` | Admin | Audit log (who did what, when) |
| GET | `/admin/visitors` | Admin | Visitors on the site right now |
| GET | `/admin/analytics?days=7` | Admin | Page views, visitors, top pages, devices, referrers |
| POST | `/track/pageview` | Public | Storefront page view `{ sid, path, title?, referrer? }` |
| POST | `/track/heartbeat` | Public | Visitor still on the page |

## Realtime admin panel

On startup the API subscribes to Firestore (`onSnapshot`) for orders, products, users, messages, categories,
subscribers, settings and the activity log. Every change, whether made through the API, the Firebase Console or a script,
is pushed to connected admins over `GET /admin/stream`. Each write through the API also adds an entry to `activityLog`
recording who did what. Storefront visitors are tracked anonymously (a random per-tab id, no cookies); live presence is kept
in memory and daily totals go to `analytics/{YYYY-MM-DD}`.

Run a **single** API process (the PM2 config does). Behind Nginx, SSE works with the provided config because the API sends
`X-Accel-Buffering: no`; also set `proxy_read_timeout 3600s;` in the location block.

## Security

- Prices are never trusted from the client: orders accept only `{ productId, quantity }`.
- Order numbers are generated in a Firestore transaction.
- Rate limits: 300 requests/15 min globally, 10 failed auth attempts/15 min, 8 form submissions/hour.
- The contact form has a `website` honeypot field, and every value in notification emails is HTML-escaped.
- Firestore rules deny all direct client writes except where noted; the API uses the Admin SDK.

## Deployment

The API is a long-running Node.js process. **Hostinger shared hosting cannot run it**; use a Hostinger VPS
(or any Node host). See [DEPLOY-HOSTINGER.md](DEPLOY-HOSTINGER.md).
