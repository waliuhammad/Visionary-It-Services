// Central API client for the admin panel.
// All admin pages call through this — no raw inline fetch anywhere.

const BASE = import.meta.env.VITE_ADMIN_API_BASE_URL || '/api/v1';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include', // sends the __session cookie
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message || `Request failed: ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return null;

  return res.json();
}

export const api = {
  get:   (path)       => request(path),
  post:  (path, body) => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  del:   (path)       => request(path, { method: 'DELETE' }),
};
