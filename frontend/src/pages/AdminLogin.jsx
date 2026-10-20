import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { adminEmailHint, isAdminLoggedIn, loginAdmin } from '../data/adminAuth';
import { brandLogo } from '../data/images';
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
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <img src={brandLogo} alt="Nandys Aura" className="admin-login__logo" />
        <h1>Admin Login</h1>
        <p className="admin-login__sub">Nandys Aura admin panel-ku login pannunga</p>

        <label className="admin-login__field">
          <span>Email</span>
          <div>
            <Mail size={17} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={adminEmailHint}
              autoComplete="username"
              required
            />
          </div>
        </label>

        <label className="admin-login__field">
          <span>Password</span>
          <div>
            <Lock size={17} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </label>

        {error && <p className="admin-login__error">{error}</p>}

        <button type="submit" className="admin-login__submit">
          <ShieldCheck size={18} /> Login to Admin
        </button>

        <p className="admin-login__hint">
          Default: <strong>{adminEmailHint}</strong> / <strong>Aura@123</strong>
          <br />
          (Maathanumna <code>frontend/.env</code>-la <code>VITE_ADMIN_EMAIL</code> /{' '}
          <code>VITE_ADMIN_PASSWORD</code> set pannunga)
        </p>

        <Link to="/" className="admin-login__back">
          ← Back to Store
        </Link>
      </form>
    </div>
  );
};

export default AdminLogin;
