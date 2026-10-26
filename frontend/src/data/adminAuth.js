// Admin login gate (UI level). Override via frontend/.env:
//   VITE_ADMIN_EMAIL=you@example.com
//   VITE_ADMIN_PASSWORD=your-password
const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'admin@nandysaura.in').toLowerCase();
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Aura@123';

const SESSION_KEY = 'aura-admin-session';
const PASSWORD_KEY = 'aura-admin-password';

const readStoredPassword = () => {
  try {
    return localStorage.getItem(PASSWORD_KEY) || '';
  } catch {
    return '';
  }
};

export const getAdminPassword = () => readStoredPassword() || ADMIN_PASSWORD;

export const isCustomAdminPassword = () => Boolean(readStoredPassword());

export const isAdminLoggedIn = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
};

export const loginAdmin = (email, password) => {
  const ok =
    String(email || '').trim().toLowerCase() === ADMIN_EMAIL && password === getAdminPassword();
  if (ok) sessionStorage.setItem(SESSION_KEY, '1');
  return ok;
};

export const changeAdminPassword = (currentPassword, nextPassword) => {
  if (String(currentPassword || '') !== getAdminPassword()) {
    return { ok: false, message: 'Current password is incorrect.' };
  }
  const next = String(nextPassword || '');
  if (next.length < 6) {
    return { ok: false, message: 'New password must be at least 6 characters.' };
  }
  if (next === currentPassword) {
    return { ok: false, message: 'Choose a password different from the current one.' };
  }
  try {
    localStorage.setItem(PASSWORD_KEY, next);
  } catch {
    return { ok: false, message: 'Could not save the new password in this browser.' };
  }
  return { ok: true };
};

export const logoutAdmin = () => sessionStorage.removeItem(SESSION_KEY);

export const adminEmailHint = ADMIN_EMAIL;
