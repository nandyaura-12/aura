import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import { loginUserApi, registerUserApi } from '../services/api';
import { storeUser } from '../data/userAuth';
import '../styles/pages/storefront.css';
import '../styles/pages/UserAuth.css';

const UserLogin = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      const res =
        mode === 'login'
          ? await loginUserApi({ email: form.email, password: form.password })
          : await registerUserApi(form);
      storeUser(res.data);
      toast.success(
        mode === 'login' ? `Welcome back, ${res.data.name}!` : `Account created — welcome, ${res.data.name}!`
      );
      navigate('/account');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="storefront">
      <StoreHeader />
      <main className="user-auth-main">
        <div className="user-auth-card">
          <h1>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="user-auth-sub">
            {mode === 'login'
              ? 'Login to see your orders and buying history.'
              : 'Register to track your antique purchases in one place.'}
          </p>

          <div className="user-auth-tabs" role="tablist" aria-label="Login or register">
            <button
              type="button"
              className={mode === 'login' ? 'active' : ''}
              onClick={() => setMode('login')}
            >
              <LogIn size={15} /> Login
            </button>
            <button
              type="button"
              className={mode === 'register' ? 'active' : ''}
              onClick={() => setMode('register')}
            >
              <UserPlus size={15} /> Register
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                <label className="user-auth-field">
                  <span>Full name</span>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={update('name')}
                  />
                </label>
                <label className="user-auth-field">
                  <span>Phone (optional)</span>
                  <input
                    type="tel"
                    placeholder="+91 ..."
                    value={form.phone}
                    onChange={update('phone')}
                  />
                </label>
              </>
            )}
            <label className="user-auth-field">
              <span>Email</span>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={update('email')}
              />
            </label>
            <label className="user-auth-field">
              <span>Password</span>
              <span className="user-auth-password">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={update('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>

            <button type="submit" className="user-auth-submit" disabled={busy}>
              {busy ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>

          <p className="user-auth-hint">
            Demo account: <strong>meenakshi@example.com</strong> / <strong>Aura@123</strong>
            <br />
            <Link to="/">← Back to Store</Link>
          </p>
        </div>
      </main>
      <StoreFooter />
    </div>
  );
};

export default UserLogin;
