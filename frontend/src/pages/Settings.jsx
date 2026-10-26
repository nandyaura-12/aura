import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { adminEmailHint, changeAdminPassword } from '../data/adminAuth';
import '../styles/pages/Settings.css';

const PasswordField = ({ label, value, onChange, autoComplete, visible, onToggle }) => (
  <label className="form-group settings-field">
    <span>{label}</span>
    <span className="settings-password">
      <input
        className="form-control"
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required
      />
      <button type="button" onClick={onToggle} aria-label={visible ? 'Hide password' : 'Show password'}>
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </span>
  </label>
);

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [nextPassword, setNextPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (nextPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    const result = changeAdminPassword(currentPassword, nextPassword);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    setCurrentPassword('');
    setNextPassword('');
    setConfirmPassword('');
    toast.success('Admin password updated. Use it the next time you sign in.');
  };

  return (
    <div className="admin-settings">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage the password for the admin panel.</p>
        </div>
      </div>

      <section className="settings-card">
        <div className="settings-card__head">
          <span className="settings-card__icon">
            <Lock size={18} />
          </span>
          <div>
            <h2>Change password</h2>
            <p>
              Signed in as <strong>{adminEmailHint}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
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

          {error && <p className="settings-error">{error}</p>}

          <p className="settings-note">
            Password is saved in this browser. Use at least 6 characters.
          </p>

          <button type="submit" className="btn btn-primary">
            Update password
          </button>
        </form>
      </section>
    </div>
  );
};

export default Settings;
