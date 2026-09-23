import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../img/logo.png';

const StoreFooter = () => {
  return (
    <footer className="store-footer" id="contact">
      <div className="store-container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={logo} alt="Nandys Aura — Made to complement every version of you" className="footer-logo-img" />
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
          <Link to="/#about">About Us</Link>
          <Link to="/#contact">Contact Us</Link>
          <a href="#">Blog & Insights</a>
          <a href="#">FAQ&apos;s</a>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/#shop">Rings</Link>
          <Link to="/#shop">Earrings</Link>
          <Link to="/#shop">Necklaces & Pendants</Link>
        </div>

        <div className="footer-social">
          <a href="#" aria-label="X">𝕏</a>
          <a href="#" aria-label="Facebook">f</a>
          <a href="#" aria-label="Instagram">◎</a>
          <a href="#" aria-label="LinkedIn">in</a>
        </div>
      </div>

      <div className="footer-bottom store-container">
        <p>Copyright © 2026 Nandys Aura. All Rights Reserved.</p>
        <div>
          <a href="#">Terms & Conditions</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default StoreFooter;
