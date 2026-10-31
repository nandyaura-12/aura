import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { brandLogo } from '../../data/images';
import { getStoreSettings, STORE_SETTINGS_CHANGED } from '../../data/storeSettings';
import { categoryPath } from '../../data/shopCategories';
import '../../styles/components/StoreFooter.css';

const StoreFooter = () => {
  const [settings, setSettings] = useState(() => getStoreSettings());

  useEffect(() => {
    const refresh = () => setSettings(getStoreSettings());
    window.addEventListener(STORE_SETTINGS_CHANGED, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(STORE_SETTINGS_CHANGED, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return (
    <footer className="store-footer" id="contact">
      <div className="store-container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={brandLogo} alt="Nandys Aura — Made to complement every version of you" className="footer-logo-img" />
          </div>

          <div className="footer-newsletter">
            <span>Join the newsletter</span>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email Address" required />
              <button type="submit">Shop Now!</button>
            </form>
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/returns-policy">Returns &amp; Policy</Link>
          <a href="#">FAQ&apos;s</a>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <Link to={categoryPath('rings')}>Rings</Link>
          <Link to={categoryPath('earrings')}>Earrings</Link>
          <Link to={categoryPath('necklace-sets')}>Necklace Sets</Link>
          <Link to={categoryPath('pendant-sets')}>Pendant Sets</Link>
        </div>

        <div className="footer-social">
          <a href={settings.socialX || '#'} target="_blank" rel="noreferrer" aria-label="X">
            𝕏
          </a>
          <a href={settings.socialFacebook || '#'} target="_blank" rel="noreferrer" aria-label="Facebook">
            f
          </a>
          <a href={settings.socialInstagram || '#'} target="_blank" rel="noreferrer" aria-label="Instagram">
            ◎
          </a>
          <a href={settings.socialLinkedin || '#'} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            in
          </a>
        </div>
      </div>

      <div className="footer-bottom store-container">
        <p>Copyright © 2026 Nandys Aura. All Rights Reserved.</p>
        <div>
          <Link to="/returns-policy">Terms &amp; Conditions</Link>
          <Link to="/returns-policy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default StoreFooter;
