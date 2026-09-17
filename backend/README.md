# Visionary IT Services API

This is the backend for the Visionary IT Services marketplace, built with Node.js, Express, and Firebase.

## Setup

1. Copy `.env.example` to `.env` and configure it:
   - Provide Firebase credentials either via `GOOGLE_APPLICATION_CREDENTIALS` (JSON path) or inline env vars.
2. `npm install`
3. Optional: Seed the database
   - `node scripts/seed.js`
4. Optional: Create an admin user
   - `node scripts/createAdmin.js admin@example.com mysecurepassword "Admin Name"`
5. `npm start` (or `npm run dev` if you add nodemon)

## Response Envelope

All endpoints return JSON in the following format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Paginated Success:**
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 226,
    "nextCursor": null,
    "hasMore": false
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": { ... }
  }
}
```

## Authentication Architecture

This API uses a split authentication model to securely manage sessions:

1. **Client-side sign-in:** The React frontend uses the Firebase Web SDK to sign in and obtains a short-lived `idToken`.
2. **Session Minting:** The frontend sends the `idToken` to `POST /api/v1/auth/session`.
3. **Cookie Storage:** The API verifies the token (rejecting it if older than 5 minutes for security) and mints a 5-day session cookie (`__session`), setting it as `httpOnly` and `secure`.
4. **Subsequent Requests:** The client makes requests; the `__session` cookie is automatically included and verified by the `requireAuth` middleware.
5. **Roles:** User roles (like `admin`) are stored in Firebase Custom Claims. They are mirrored to Firestore for querying, but the custom claim is the authoritative source for access control.

## Security Notes

- **Prices are verified server-side.** The checkout endpoint (`POST /orders`) ignores any prices sent by the client. It only accepts `{ productId, quantity }` and re-reads the authoritative price from Firestore.
- **Transactions for Order Numbers.** Order numbers are generated using `db.runTransaction()` to prevent collisions during concurrent checkouts.
- **Rate Limiting.** The API has a global limit (300/15m), an auth limit (10/15m for failed attempts), and a strict write limit (8/hour for forms).
- **Honeypot.** The contact form includes a `website` honeypot field. If filled, the request is silently discarded.

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/health` | Public | Health check |
| **Auth** |
| POST | `/api/v1/auth/register` | Public | Register a new user |
| POST | `/api/v1/auth/session` | Public | Mint a session cookie from an ID token |
| POST | `/api/v1/auth/logout` | Auth | Clear session cookie and revoke tokens |
| POST | `/api/v1/auth/password-reset` | Public | Request a password reset link |
| GET | `/api/v1/auth/me` | Auth | Get current user profile |
| POST | `/api/v1/auth/role` | Admin | Set a user's role |
| **Products** |
| GET | `/api/v1/products` | Public | List products (paginated, sort, filter) |
| GET | `/api/v1/products/featured` | Public | Get featured products |
| GET | `/api/v1/products/:id` | Public | Get product by ID |
| GET | `/api/v1/products/slug/:slug` | Public | Get product by Slug |
| GET | `/api/v1/products/:id/related` | Public | Get related products |
| POST | `/api/v1/products` | Admin | Create a product |
| PATCH | `/api/v1/products/:id` | Admin | Update a product |
| DELETE| `/api/v1/products/:id` | Admin | Delete a product |
| **Categories** |
| GET | `/api/v1/categories` | Public | List all categories |
| **Orders** |
| POST | `/api/v1/orders` | Optional| Place an order (guest or user) |
| GET | `/api/v1/orders/mine` | Auth | Get user's order history |
| GET | `/api/v1/orders/:id` | Owner/Admin| Get order details |
| GET | `/api/v1/orders` | Admin | List all orders |
| PATCH | `/api/v1/orders/:id/status`| Admin | Update order/payment status |
| **Users** |
| GET | `/api/v1/users/me` | Auth | Get current user |
| PATCH | `/api/v1/users/me` | Auth | Update current user |
| GET | `/api/v1/users` | Admin | List all users |
| DELETE| `/api/v1/users/:uid` | Admin | Delete a user |
| **Misc** |
| POST | `/api/v1/contact` | Public | Submit contact form |
| GET | `/api/v1/contact` | Admin | View contact messages |
| POST | `/api/v1/newsletter/subscribe`| Public | Subscribe to newsletter |
| POST | `/api/v1/newsletter/unsubscribe`| Public | Unsubscribe from newsletter |
