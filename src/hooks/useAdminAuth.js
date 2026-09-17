import { useState, useEffect } from 'react';
import { api } from '../lib/api';

/**
 * Hook that verifies the current user is an authenticated admin.
 * Uses the real GET /api/v1/auth/me endpoint with the __session cookie.
 *
 * Returns { user, loading, error }.
 * Redirects to /login via window.location.href if:
 *   - The session is invalid / expired (API returns 401)
 *   - The user exists but is not an admin
 */
export function useAdminAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const res = await api.get('/auth/me');
        const userData = res.data;

        if (!cancelled) {
          if (!userData || userData.role !== 'admin') {
            // User is logged in but not an admin — kick them out
            window.location.href = '/login';
            return;
          }
          setUser(userData);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          // 401 / network error — not authenticated
          setError(err.message);
          setLoading(false);
          window.location.href = '/login';
        }
      }
    }

    checkAuth();
    return () => { cancelled = true; };
  }, []);

  return { user, loading, error };
}
