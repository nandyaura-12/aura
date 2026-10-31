import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Megaphone, PartyPopper, Phone } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  changeAdminEmail,
  changeAdminPassword,
  getAdminEmail,
  isCustomAdminPassword,
} from '../data/adminAuth';
import {
  DEFAULT_STORE_SETTINGS,
  getStoreSettings,
  saveStoreSettings,
  STORE_SETTINGS_CHANGED,
} from '../data/storeSettings';
import '../styles/pages/Settings.css';

const SETTINGS_SECTIONS = {
  password: {
    title: 'Change password',
    subtitle: 'Update the password used to open the admin panel.',
  },
  email: {
    title: 'Admin email',
    subtitle: 'Change the email used on the admin and store sign-in screens.',
  },
  banner: {
    title: 'Store banner',
    subtitle: 'Edit the top announcement bar on the storefront header.',
  },
  contact: {
    title: 'Contact details',
    subtitle: 'Update contact info and social links shown on the store.',
  },
  festival: {
    title: 'Festival popup',
    subtitle: 'Control whether the festival offer popup appears on the storefront.',
  },
};

const PasswordField = ({ label, value, onChange, autoComplete, visible, onToggle, required = true }) => (
  <label className="form-group settings-field">
    <span>{label}</span>
    <span className="settings-password">
      <input
        className="form-control"
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
      />
      <button type="button" onClick={onToggle} aria-label={visible ? 'Hide password' : 'Show password'}>
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </span>
  </label>
);

const TextField = ({ label, value, onChange, type = 'text', placeholder, required }) => (
  <label className="form-group settings-field">
    <span>{label}</span>
    <input
      className="form-control"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
    />
  </label>
);

const Settings = () => {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const section = (hash || '#password').slice(1);
  const active = SETTINGS_SECTIONS[section] ? section : 'password';

  const [adminEmail, setAdminEmail] = useState(() => getAdminEmail());
  const [store, setStore] = useState(() => getStoreSettings());
  const [currentPassword, setCurrentPassword] = useState('');
  const [nextPassword, setNextPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [nextEmail, setNextEmail] = useState(() => getAdminEmail());
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (!hash || !SETTINGS_SECTIONS[section]) {
      navigate('/admin/settings#password', { replace: true });
    }
  }, [hash, section, navigate]);

  useEffect(() => {
    const refresh = () => setStore(getStoreSettings());
    window.addEventListener(STORE_SETTINGS_CHANGED, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(STORE_SETTINGS_CHANGED, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const updateStore = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setStore((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    if (nextPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }
    const result = changeAdminPassword(currentPassword, nextPassword);
    if (!result.ok) {
      setPasswordError(result.message);
      return;
    }
    setCurrentPassword('');
    setNextPassword('');
    setConfirmPassword('');
    toast.success('Admin password updated. Use it the next time you sign in.');
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setEmailError('');
    const result = changeAdminEmail(emailPassword, nextEmail);
    if (!result.ok) {
      setEmailError(result.message);
      return;
    }
    setAdminEmail(result.email);
    setNextEmail(result.email);
    setEmailPassword('');
    toast.success('Admin email updated. Use it the next time you sign in.');
  };

  const persistStore = (partial = {}) => {
    const next = { ...store, ...partial };
    const delay = Number(next.festivalDelayMs);
    if (!Number.isFinite(delay) || delay < 0) {
      toast.error('Festival delay must be 0 or more milliseconds.');
      return false;
    }
    if (!next.contactEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.contactEmail.trim())) {
      toast.error('Enter a valid store contact email.');
      return false;
    }
    const result = saveStoreSettings({
      ...next,
      bannerText: String(next.bannerText || '').trim() || DEFAULT_STORE_SETTINGS.bannerText,
      contactEmail: next.contactEmail.trim().toLowerCase(),
      contactPhone: String(next.contactPhone || '').trim(),
      contactWhatsapp: String(next.contactWhatsapp || '').trim(),
      contactAddress: String(next.contactAddress || '').trim(),
      festivalDelayMs: Math.round(delay),
      festivalShowAgain: next.festivalShowAgain === 'forever' ? 'forever' : 'session',
    });
    if (!result.ok) {
      toast.error(result.message);
      return false;
    }
    setStore(result.settings);
    toast.success('Settings saved. The storefront will use them right away.');
    return true;
  };

  const meta = SETTINGS_SECTIONS[active];

  return (
    <div className="admin-settings">
      <div className="page-header">
        <div>
          <h1 className="page-title">{meta.title}</h1>
          <p className="page-subtitle">{meta.subtitle}</p>
        </div>
      </div>

      {active === 'password' && (
        <section id="password" className="settings-card">
          <div className="settings-card__head">
            <span className="settings-card__icon">
              <Lock size={18} />
            </span>
            <div>
              <h2>Change password</h2>
              <p>
                Signed in as <strong>{adminEmail}</strong>
                {!isCustomAdminPassword() ? ' · default password still in use' : ''}
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <PasswordField
              label="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              visible={showCurrent}
              onToggle={() => setShowCurrent((open) => !open)}
            />
            <PasswordField
              label="New password"
              value={nextPassword}
              onChange={(e) => setNextPassword(e.target.value)}
              autoComplete="new-password"
              visible={showNext}
              onToggle={() => setShowNext((open) => !open)}
            />
            <PasswordField
              label="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              visible={showConfirm}
              onToggle={() => setShowConfirm((open) => !open)}
            />
            {passwordError && <p className="settings-error">{passwordError}</p>}
            <p className="settings-note">
              Password is saved in this browser. Use at least 8 characters with letters, numbers, and a
              special character.
            </p>
            <button type="submit" className="btn btn-primary">
              Update password
            </button>
          </form>
        </section>
      )}

      {active === 'email' && (
        <section id="email" className="settings-card">
          <div className="settings-card__head">
            <span className="settings-card__icon">
              <Mail size={18} />
            </span>
            <div>
              <h2>Change admin email</h2>
              <p>This is the email used on the admin and store sign-in screens.</p>
            </div>
          </div>

          <form onSubmit={handleEmailSubmit}>
            <TextField
              label="New admin email"
              type="email"
              value={nextEmail}
              onChange={(e) => setNextEmail(e.target.value)}
              required
            />
            <PasswordField
              label="Confirm with current password"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              autoComplete="current-password"
              visible={showEmailPassword}
              onToggle={() => setShowEmailPassword((open) => !open)}
            />
            {emailError && <p className="settings-error">{emailError}</p>}
            <button type="submit" className="btn btn-primary">
              Update email
            </button>
          </form>
        </section>
      )}

      {active === 'banner' && (
        <section id="banner" className="settings-card">
          <div className="settings-card__head">
            <span className="settings-card__icon">
              <Megaphone size={18} />
            </span>
            <div>
              <h2>Store banner</h2>
              <p>Top announcement bar on the storefront header.</p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Save always applies this text on the storefront
              persistStore({ useCustomBanner: true });
            }}
          >
            <label className="settings-check">
              <input
                type="checkbox"
                checked={Boolean(store.useCustomBanner)}
                onChange={updateStore('useCustomBanner')}
              />
              Use custom banner text (instead of the active offer line)
            </label>
            <TextField
              label="Banner text"
              value={store.bannerText}
              onChange={(e) => {
                setStore((prev) => ({
                  ...prev,
                  bannerText: e.target.value,
                  useCustomBanner: true,
                }));
              }}
              placeholder={DEFAULT_STORE_SETTINGS.bannerText}
            />
            <div className="settings-actions">
              <button type="submit" className="btn btn-primary">
                Save banner
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  persistStore({
                    useCustomBanner: false,
                    bannerText: DEFAULT_STORE_SETTINGS.bannerText,
                  })
                }
              >
                Remove banner
              </button>
            </div>
          </form>
        </section>
      )}

      {active === 'contact' && (
        <section id="contact" className="settings-card">
          <div className="settings-card__head">
            <span className="settings-card__icon">
              <Phone size={18} />
            </span>
            <div>
              <h2>Contact details</h2>
              <p>Shown on the Contact page and footer social links.</p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              persistStore();
            }}
          >
            <div className="settings-grid">
              <TextField
                label="Contact email"
                type="email"
                value={store.contactEmail}
                onChange={updateStore('contactEmail')}
                required
              />
              <TextField
                label="Phone"
                value={store.contactPhone}
                onChange={updateStore('contactPhone')}
                placeholder="+91 44 4850 0321"
              />
              <TextField
                label="WhatsApp"
                value={store.contactWhatsapp}
                onChange={updateStore('contactWhatsapp')}
                placeholder="+91 98765 43210"
              />
              <TextField
                label="Address"
                value={store.contactAddress}
                onChange={updateStore('contactAddress')}
                placeholder="Chennai, Tamil Nadu"
              />
            </div>

            <div className="settings-grid">
              <TextField
                label="Instagram URL"
                value={store.socialInstagram}
                onChange={updateStore('socialInstagram')}
              />
              <TextField
                label="Facebook URL"
                value={store.socialFacebook}
                onChange={updateStore('socialFacebook')}
              />
              <TextField
                label="LinkedIn URL"
                value={store.socialLinkedin}
                onChange={updateStore('socialLinkedin')}
              />
              <TextField label="X / Twitter URL" value={store.socialX} onChange={updateStore('socialX')} />
            </div>

            <button type="submit" className="btn btn-primary">
              Save contact details
            </button>
          </form>
        </section>
      )}

      {active === 'festival' && (
        <section id="festival" className="settings-card">
          <div className="settings-card__head">
            <span className="settings-card__icon">
              <PartyPopper size={18} />
            </span>
            <div>
              <h2>Festival popup</h2>
              <p>Controls the auto popup on the storefront. Offer content still comes from Offers.</p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              persistStore();
            }}
          >
            <label className="settings-check">
              <input
                type="checkbox"
                checked={Boolean(store.festivalEnabled)}
                onChange={updateStore('festivalEnabled')}
              />
              Show festival offer popup on the storefront
            </label>

            <div className="settings-grid">
              <TextField
                label="Auto-open delay (ms)"
                type="number"
                value={store.festivalDelayMs}
                onChange={updateStore('festivalDelayMs')}
              />
              <label className="form-group settings-field">
                <span>After close, hide again until</span>
                <select
                  className="form-control"
                  value={store.festivalShowAgain}
                  onChange={updateStore('festivalShowAgain')}
                >
                  <option value="session">This browser session</option>
                  <option value="forever">Forever (this browser)</option>
                </select>
              </label>
            </div>

            <p className="settings-note">
              These settings are saved in this browser and apply immediately on the storefront.
            </p>
            <button type="submit" className="btn btn-primary">
              Save festival popup
            </button>
          </form>
        </section>
      )}
    </div>
  );
};

export default Settings;
