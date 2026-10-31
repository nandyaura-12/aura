// Admin login gate (UI level). Override via frontend/.env:
//   VITE_ADMIN_EMAIL=you@example.com
//   VITE_ADMIN_PASSWORD=your-password
const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'admin@nandysaura.in').toLowerCase();
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Aura@123';

const SESSION_KEY = 'aura-admin-session';
const PASSWORD_KEY = 'aura-admin-password';
const EMAIL_KEY = 'aura-admin-email';

const readStoredPassword = () => {
  try {
    return localStorage.getItem(PASSWORD_KEY) || '';
  } catch {
    return '';
  }
};

const readStoredEmail = () => {
  try {
    return (localStorage.getItem(EMAIL_KEY) || '').trim().toLowerCase();
  } catch {
    return '';
  }
};

export const getAdminPassword = () => readStoredPassword() || ADMIN_PASSWORD;

export const getAdminEmail = () => readStoredEmail() || ADMIN_EMAIL;

export const isCustomAdminPassword = () => Boolean(readStoredPassword());

export const isCustomAdminEmail = () => Boolean(readStoredEmail());

export const isAdminLoggedIn = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
};

export const loginAdmin = (email, password) => {
  const ok =
    String(email || '').trim().toLowerCase() === getAdminEmail() &&
    password === getAdminPassword();
  if (ok) sessionStorage.setItem(SESSION_KEY, '1');
  return ok;
};

export const changeAdminPassword = (currentPassword, nextPassword) => {
  if (String(currentPassword || '') !== getAdminPassword()) {
    return { ok: false, message: 'Current password is incorrect.' };
  }
  const next = String(nextPassword || '');
  // Letters + numbers + special character, min 8
  if (next.length < 8 || !/[A-Za-z]/.test(next) || !/[0-9]/.test(next) || !/[^A-Za-z0-9]/.test(next)) {
    return {
      ok: false,
      message:
        'New password must be at least 8 characters and include letters, numbers, and a special character.',
    };
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

export const changeAdminEmail = (currentPassword, nextEmail) => {
  if (String(currentPassword || '') !== getAdminPassword()) {
    return { ok: false, message: 'Current password is incorrect.' };
  }
  const email = String(nextEmail || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: 'Enter a valid email address.' };
  }
  if (email === getAdminEmail()) {
    return { ok: false, message: 'That is already the current admin email.' };
  }
  try {
    localStorage.setItem(EMAIL_KEY, email);
  } catch {
    return { ok: false, message: 'Could not save the new email in this browser.' };
  }
  return { ok: true, email };
};

export const logoutAdmin = () => sessionStorage.removeItem(SESSION_KEY);

/** @deprecated Prefer getAdminEmail() — kept for older call sites. */
export const adminEmailHint = ADMIN_EMAIL;
