import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import { loginUserApi, registerUserApi } from '../services/api';
import { loginAdmin } from '../data/adminAuth';
import { storeUser } from '../data/userAuth';
import loginHero from '../assets/auth/login-hero.jpg';
import '../styles/pages/storefront.css';
import '../styles/pages/UserAuth.css';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.2 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.7-6.5 7.1l.1.1 6.2 5.2C36.8 39.2 44 34 44 24c0-1.2-.1-2.3-.4-3.5z"
    />
  </svg>
);

const UserLogin = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [remember, setRemember] = useState(true);
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const switchMode = (next) => {
    setMode(next);
    setShowPassword(false);
    setShowConfirm(false);
  };

  const handleGoogle = () => {
    toast.info('Google sign-in is coming soon. Please use email for now.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'register') {
      if (form.password !== form.confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }
      if (!agree) {
        toast.error('Please agree to the Terms & Privacy Policy.');
        return;
      }
    }

    if (mode === 'login' && loginAdmin(form.email, form.password)) {
      toast.success('Welcome back, admin!');
      navigate('/admin');
      return;
    }

    try {
      setBusy(true);
      const res =
        mode === 'login'
          ? await loginUserApi({ email: form.email, password: form.password })
          : await registerUserApi({
              name: form.name,
              email: form.email,
              password: form.password,
            });
      storeUser(res.data);
      toast.success(
        mode === 'login'
          ? `Welcome back, ${res.data.name}!`
          : `Account created — welcome, ${res.data.name}!`
      );
      navigate('/account');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <div className="storefront">
      <StoreHeader />
      <main className="auth-page">
      <div className="auth-shell">
        <aside className="auth-hero" aria-hidden="false">
          <img src={loginHero} alt="Nandys Aura jewellery" className="auth-hero__img" />
          <div className="auth-hero__overlay">
            <p className="auth-hero__brand">NANDYS AURA</p>
            <h2 className="auth-hero__tagline">
              Crafted to be treasured,
              <br />
              for generations.
            </h2>
            <p className="auth-hero__trust">
              CERTIFIED DIAMONDS <span>|</span> 18K RECYCLED GOLD <span>|</span> LIFETIME CARE
            </p>
          </div>
        </aside>

        <section className="auth-panel">
          <div className="auth-tabs" role="tablist" aria-label="Sign in or register">
            <button
              type="button"
              role="tab"
              aria-selected={isLogin}
              className={isLogin ? 'is-active' : ''}
              onClick={() => switchMode('login')}
            >
              SIGN IN
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isLogin}
              className={!isLogin ? 'is-active' : ''}
              onClick={() => switchMode('register')}
            >
              REGISTER
            </button>
          </div>

          <div className="auth-panel__intro">
            <p className="auth-eyebrow">{isLogin ? 'SIGN IN' : 'CREATE YOUR ACCOUNT'}</p>
            <h1>{isLogin ? 'Welcome back' : 'Discover your next treasure'}</h1>
            <p className="auth-sub">
              {isLogin
                ? 'Sign in to revisit your wishlist, orders and private appointments.'
                : 'Join for early access to new collections, a personal wishlist and complimentary engraving.'}
            </p>
          </div>

          {!isLogin && (
            <>
              <button type="button" className="auth-google" onClick={handleGoogle}>
                <GoogleIcon /> Sign up with Google
              </button>
              <div className="auth-or" role="separator">
                <span>OR</span>
              </div>
            </>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <label className="auth-field">
                <span>Full name</span>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Isabella Laurent"
                  value={form.name}
                  onChange={update('name')}
                />
              </label>
            )}

            <label className="auth-field">
              <span>Email address</span>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={update('email')}
              />
            </label>

            {isLogin ? (
              <label className="auth-field">
                <span>Password</span>
                <span className="auth-password">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={update('password')}
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </span>
              </label>
            ) : (
              <div className="auth-row">
                <label className="auth-field">
                  <span>Password</span>
                  <span className="auth-password">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={update('password')}
                    />
                    <button type="button" onClick={() => setShowPassword((v) => !v)}>
                      {showPassword ? 'HIDE' : 'SHOW'}
                    </button>
                  </span>
                </label>
                <label className="auth-field">
                  <span>Confirm password</span>
                  <span className="auth-password">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={update('confirmPassword')}
                    />
                    <button type="button" onClick={() => setShowConfirm((v) => !v)}>
                      {showConfirm ? 'HIDE' : 'SHOW'}
                    </button>
                  </span>
                </label>
              </div>
            )}

            {isLogin ? (
              <div className="auth-meta">
                <label className="auth-check">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember me
                </label>
                <button type="button" className="auth-link" onClick={() => toast.info('Password reset coming soon.')}>
                  Forgot password?
                </button>
              </div>
            ) : (
              <label className="auth-check auth-check--block">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span>
                  I agree to the <Link to="/">Terms &amp; Conditions</Link> and{' '}
                  <Link to="/">Privacy Policy</Link>.
                </span>
              </label>
            )}

            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? 'Please wait…' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </button>
          </form>

          {isLogin && (
            <>
              <div className="auth-or" role="separator">
                <span>OR</span>
              </div>
              <button type="button" className="auth-google" onClick={handleGoogle}>
                <GoogleIcon /> Continue with Google
              </button>
            </>
          )}

          <p className="auth-switch">
            {isLogin ? (
              <>
                New to us?{' '}
                <button type="button" className="auth-link" onClick={() => switchMode('register')}>
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" className="auth-link" onClick={() => switchMode('login')}>
                  Sign in
                </button>
              </>
            )}
          </p>

          <div className="auth-footer">
            <span className="auth-footer__secure">
              <Lock size={12} strokeWidth={2} /> Secure, encrypted sign in
            </span>
            <Link to="/contact">Need help?</Link>
            <Link to="/">Privacy</Link>
          </div>
        </section>
      </div>
      </main>
      <StoreFooter />
    </div>
  );
};

export default UserLogin;
