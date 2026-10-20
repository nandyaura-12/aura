// Admin login gate (UI level). Override via frontend/.env:
//   VITE_ADMIN_EMAIL=you@example.com
//   VITE_ADMIN_PASSWORD=your-password
const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'admin@nandysaura.in').toLowerCase();
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Aura@123';

const SESSION_KEY = 'aura-admin-session';

export const isAdminLoggedIn = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
};

export const loginAdmin = (email, password) => {
  const ok =
    String(email || '').trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
  if (ok) sessionStorage.setItem(SESSION_KEY, '1');
  return ok;
};

export const logoutAdmin = () => sessionStorage.removeItem(SESSION_KEY);

export const adminEmailHint = ADMIN_EMAIL;
