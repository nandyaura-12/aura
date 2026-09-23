import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X } from 'lucide-react';
import logo from '../../img/logo.png';

const StoreHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="store-header">
      <div className="announce-bar">
        Flat 20% off on VA for Online Gold Jewellery
      </div>

      <nav className="nav-links-bar">
        <div className="store-container nav-links-inner">
          <Link to="/#shop">SHOP</Link>
          <Link to="/collections">COLLECTIONS</Link>
          <Link to="/#about">ABOUT US</Link>
          <Link to="/#contact">CONTACT US</Link>
        </div>
      </nav>

      <div className="brand-bar">
        <div className="store-container brand-bar-inner">
          <div className="store-search">
            <Search size={16} />
            <input type="search" placeholder="Search anything..." aria-label="Search" />
          </div>

          <Link to="/" className="brand-mark" aria-label="Nandys Aura home">
            <img src={logo} alt="Nandys Aura" className="brand-logo-img" />
          </Link>

          <div className="brand-actions">
            <button type="button" aria-label="Wishlist"><Heart size={20} strokeWidth={1.5} /></button>
            <button type="button" aria-label="Account"><User size={20} strokeWidth={1.5} /></button>
            <button type="button" aria-label="Cart"><ShoppingBag size={20} strokeWidth={1.5} /></button>
            <button
              type="button"
              className="mobile-menu-btn"
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-nav">
          <Link to="/#shop" onClick={() => setMenuOpen(false)}>SHOP</Link>
          <Link to="/collections" onClick={() => setMenuOpen(false)}>COLLECTIONS</Link>
          <Link to="/#about" onClick={() => setMenuOpen(false)}>ABOUT US</Link>
          <Link to="/#contact" onClick={() => setMenuOpen(false)}>CONTACT US</Link>
          <Link to="/admin" onClick={() => setMenuOpen(false)}>ADMIN</Link>
        </div>
      )}
    </header>
  );
};

export default StoreHeader;
