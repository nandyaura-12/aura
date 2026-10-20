// Storefront user session (stored locally after login/register).
const USER_KEY = 'aura-user';

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const storeUser = (user) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // storage unavailable — session simply won't persist
  }
  window.dispatchEvent(new Event('aura-user-changed'));
};

export const clearUser = () => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event('aura-user-changed'));
};

export const USER_CHANGED_EVENT = 'aura-user-changed';
