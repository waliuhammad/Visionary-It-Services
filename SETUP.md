# Running this project on your machine

Visionary IT Services is two programs that run side by side:

| Folder | What it is | Runs on |
|---|---|---|
| project root | the website (React + Vite) | http://localhost:5173 |
| `backend/` | the API (Express + Firebase) | http://localhost:8080 |

You need **both** running. The website talks to the API for login, checkout, the contact form and the whole admin panel.

## 1. Install Node.js

Node.js **20 or newer** (check with `node -v`). Get it from <https://nodejs.org>.

## 2. Get the code

```bash
git clone https://github.com/waliuhammad/Visionary-It-Services.git
cd Visionary-It-Services
```

## 3. Install the packages

Two folders, two installs:

```bash
npm install
cd backend
npm install
cd ..
```

> Seeing `Cannot find package 'cloudinary'` or similar later means you skipped the install in `backend/`.

## 4. Add the credentials

The **API** cannot start without credentials, and they are not in this repository. Ask the project owner for:

| File | Where it goes | What it holds |
|---|---|---|
| `.env` | project root | *Optional in development.* Only needed to point at a different Firebase project or a deployed API |
| `backend/.env` | `backend/` | Firebase service account, Cloudinary keys, SMTP |
| `backend/serviceAccountKey.json` | `backend/` | Firebase Admin key (only if `backend/.env` points at it) |

Each folder has an `.env.example` showing every setting with an empty value — copy it to `.env` and fill it in.

**Treat these files as passwords.** They give full access to the live database and image storage. Never commit them (they are git-ignored), never paste them into chat, email or a ticket.

Prefer your own key: ask to be added to the Firebase project (*Firebase Console → Project settings → Users and permissions*), then generate your own under *Service accounts → Generate new private key*. Then only `backend/.env` needs sharing, for the Cloudinary and SMTP values.

## 5. Run it

Two terminals, both stay open:

**Terminal 1 — API**
```bash
cd backend
npm run dev
```
Wait for `API running in development mode on http://localhost:8080/api/v1`.

**Terminal 2 — website**
```bash
npm run dev
```
Open <http://localhost:5173>.

In development the website forwards `/api` to the API for you, so no extra configuration is needed.

## 6. Get into the admin panel

The admin panel is at <http://localhost:5173/admin> and needs an account with the admin role. Either ask the owner to promote your account, or run in `backend/`:

```bash
npm run create-admin -- you@example.com "YourPassword" "Your Name"
```

Then sign in at <http://localhost:5173/login>.

## Everyday commands

| In | Command | Does |
|---|---|---|
| root | `npm run dev` | website with hot reload |
| root | `npm run build` | production site into `dist/` |
| root | `npm run lint` | lint the React code |
| `backend/` | `npm run dev` | API, restarts on save |
| `backend/` | `npm run seed` | import `data/products.json` into Firestore |
| `backend/` | `npm run create-admin -- <email> [password] [name]` | create or promote an admin |
| `backend/` | `npm run images:migrate` | copy product images to Cloudinary |
| `backend/` | `npm run deploy:firestore` | deploy security rules and indexes |

## When something breaks

| Message | Cause and fix |
|---|---|
| `Cannot find package 'x'` | Run `npm install` in that folder |
| `Invalid environment variables` | `backend/.env` is missing or incomplete (step 4) |
| `http proxy error … ECONNREFUSED` | The API is not running — start terminal 1 |
| `Cannot reach the server` in the browser | Same: the API is down |
| `EADDRINUSE: 8080` | Another API is already running; close it or set `PORT` in `backend/.env` |
| `Image storage is not configured` | The `CLOUDINARY_*` values are missing from `backend/.env` |
| `firebase use must be run from a Firebase project directory` | Run Firebase CLI commands inside `backend/` |
| Admin panel bounces you to `/login` | Your account is not an admin (step 6) |

## Working on the code

One branch, `main`. Commit and push straight to it — no feature branches on this project.

```bash
git pull
# ...make your changes...
git add -A
git commit -m "What you changed"
git push origin main
```

Before pushing, check `git status` for `.env` files: they should never appear.

More detail: [README.md](README.md) for the project layout and the Hostinger build,
[backend/README.md](backend/README.md) for the API endpoints and how authentication works.
