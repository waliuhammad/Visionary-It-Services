// Central API client. All pages call the backend through this — no raw inline fetch anywhere.
//
// VITE_API_BASE_URL:
//   - development: leave unset; Vite proxies /api/v1 to the local backend (see vite.config.js)
//   - production:  full URL of the deployed API, e.g. https://api.visionaryitservices.com/api/v1

export const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_ADMIN_API_BASE_URL ||
  '/api/v1'
).replace(/\/+$/, '');

const toError = (status, body) => {
  const error = new Error(body?.error?.message || `Request failed: ${status}`);
  error.status = status;
  error.details = body?.error?.details;
  return error;
};

async function request(path, options = {}) {
  const isForm = options.body instanceof FormData;
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      credentials: 'include', // sends the __session cookie
      headers: { ...(!isForm && { 'Content-Type': 'application/json' }), ...options.headers },
    });
  } catch {
    throw new Error('Cannot reach the server. Please check your connection and try again.');
  }

  if (!res.ok) {
    throw toError(res.status, await res.json().catch(() => ({})));
  }

  // 204 No Content
  if (res.status === 204) return null;

  return res.json();
}

/**
 * Upload image files to Cloudinary through the API.
 * @param {File[]} files
 * @param {{ folder?: string, onProgress?: (percent: number) => void }} options
 * @returns {Promise<Array<{ url: string, publicId: string, width: number, height: number }>>}
 */
function upload(files, { folder = 'products', onProgress } = {}) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    files.forEach((file) => form.append('files', file));

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/uploads?folder=${encodeURIComponent(folder)}`);
    xhr.withCredentials = true;
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      let body = null;
      try { body = JSON.parse(xhr.responseText); } catch { /* not JSON */ }
      if (xhr.status >= 200 && xhr.status < 300) resolve(body.data);
      else reject(toError(xhr.status, body));
    };
    xhr.onerror = () => reject(new Error('Upload failed. Please check your connection.'));
    xhr.send(form);
  });
}

export const api = {
  get:    (path)       => request(path),
  post:   (path, body) => request(path, { method: 'POST',   body: JSON.stringify(body ?? {}) }),
  patch:  (path, body) => request(path, { method: 'PATCH',  body: JSON.stringify(body ?? {}) }),
  del:    (path, body) => request(path, { method: 'DELETE', ...(body && { body: JSON.stringify(body) }) }),
  upload,
};

/** Human-readable message including field-level validation details. */
export const errorMessage = (err) => {
  if (Array.isArray(err?.details) && err.details.length) {
    return err.details.map((d) => (d.path ? `${d.path}: ${d.message}` : d.message)).join('\n');
  }
  return err?.message || 'Something went wrong';
};
