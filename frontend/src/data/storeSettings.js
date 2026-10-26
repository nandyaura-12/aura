// Storefront settings edited from Admin > Settings (saved in this browser).
const STORAGE_KEY = 'aura-store-settings';
export const STORE_SETTINGS_CHANGED = 'aura-store-settings-changed';

export const DEFAULT_STORE_SETTINGS = {
  bannerText: 'Flat 20% off on VA for Online Gold Jewellery.',
  useCustomBanner: false,
  contactEmail: 'hello@nandysaura.com',
  contactPhone: '+91 44 4850 0321',
  contactWhatsapp: '+91 98765 43210',
  contactAddress: 'Chennai, Tamil Nadu',
  socialInstagram: 'https://instagram.com',
  socialFacebook: 'https://facebook.com',
  socialLinkedin: 'https://linkedin.com',
  socialX: 'https://x.com',
  festivalEnabled: true,
  festivalDelayMs: 1200,
  festivalShowAgain: 'session', // 'session' | 'forever'
};

const readRaw = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getStoreSettings = () => ({
  ...DEFAULT_STORE_SETTINGS,
  ...(readRaw() || {}),
});

export const saveStoreSettings = (partial) => {
  const next = {
    ...getStoreSettings(),
    ...partial,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    return { ok: false, message: 'Could not save settings in this browser.' };
  }
  window.dispatchEvent(new Event(STORE_SETTINGS_CHANGED));
  return { ok: true, settings: next };
};

export const phoneTelHref = (phone) =>
  `tel:${String(phone || '').replace(/[^\d+]/g, '')}`;

export const whatsappHref = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : '#';
};
