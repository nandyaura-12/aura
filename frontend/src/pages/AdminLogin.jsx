import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import {
  adminEmailHint,
  isAdminLoggedIn,
  isCustomAdminPassword,
  loginAdmin,
} from '../data/adminAuth';
import loginHero from '../assets/auth/login-hero.jpg';
import '../styles/pages/UserAuth.css';
import '../styles/pages/AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (isAdminLoggedIn()) return <Navigate to="/admin" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginAdmin(email, password)) {
      navigate(location.state?.from || '/admin', { replace: true });
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="admin-login">
      <div className="auth-shell">
        <aside className="auth-hero">
          <img src={loginHero} alt="Nandys Aura jewellery" className="auth-hero__img" />
          <div className="auth-hero__overlay">
            <p className="auth-hero__brand">NANDYS AURA</p>
            <h2 className="auth-hero__tagline">
              The studio,
              <br />
              behind the store.
            </h2>
            <p className="auth-hero__trust">
              ORDERS <span>|</span> INVENTORY <span>|</span> COLLECTIONS
            </p>
          </div>
        </aside>

        <section className="auth-panel">
          <div className="auth-panel__intro">
            <p className="auth-eyebrow">ADMIN</p>
            <h1>Sign in</h1>
            <p className="auth-sub">Access the Nandys Aura admin panel.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Email address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={adminEmailHint}
                autoComplete="username"
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <span className="auth-password">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </span>
            </label>

            {error && <p className="admin-login__error">{error}</p>}

            <button type="submit" className="auth-submit">
              SIGN IN
            </button>
          </form>

          {!isCustomAdminPassword() && (
            <p className="admin-login__hint">
              Default: <strong>{adminEmailHint}</strong> / <strong>Aura@123</strong>
              <br />
              Override in <code>frontend/.env</code> with <code>VITE_ADMIN_EMAIL</code> and{' '}
              <code>VITE_ADMIN_PASSWORD</code>.
            </p>
          )}

          <div className="auth-footer">
            <span className="auth-footer__secure">
              <Lock size={12} strokeWidth={2} /> Admin access only
            </span>
            <Link to="/">Back to store</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminLogin;
