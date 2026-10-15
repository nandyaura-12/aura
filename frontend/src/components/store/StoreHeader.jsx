import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X } from 'lucide-react';
import { brandLogo } from '../../data/images';
import { useCart } from '../../context/CartContext';
import { fetchOffers } from '../../services/api';
import '../../styles/components/StoreHeader.css';

const StoreHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [banner, setBanner] = useState('Flat 20% off on VA for Online Gold Jewellery');
  const { itemCount } = useCart();

  useEffect(() => {
    let cancelled = false;
    fetchOffers()
      .then((res) => {
        const active = (res.data || []).find((offer) => offer.status === 'Active');
        if (!active || cancelled) return;
        const off =
          active.discountType === 'Percentage'
            ? `${active.discountValue}% off`
            : `₹${Number(active.discountValue).toLocaleString('en-IN')} off`;
        setBanner(`${active.title} — ${off} · code ${active.code}`);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="store-header">
      <div className="announce-bar">
        {banner}
      </div>

      <nav className="nav-links-bar">
        <div className="store-container nav-links-inner">
          <Link to="/#shop">SHOP</Link>
          <Link to="/collections">COLLECTIONS</Link>
          <Link to="/about">ABOUT US</Link>
          <Link to="/contact">CONTACT US</Link>
          <Link to="/admin">ADMIN</Link>
        </div>
      </nav>

      <div className="brand-bar">
        <div className="store-container brand-bar-inner">
          <div className="store-search">
            <Search size={16} />
            <input type="search" placeholder="Search anything..." aria-label="Search" />
          </div>

          <Link to="/" className="brand-mark" aria-label="Nandys Aura home">
            <img src={brandLogo} alt="Nandys Aura" className="brand-logo-img" />
          </Link>

          <div className="brand-actions">
            <button type="button" aria-label="Wishlist"><Heart size={20} strokeWidth={1.5} /></button>
            <button type="button" aria-label="Account"><User size={20} strokeWidth={1.5} /></button>
            <Link
              to="/cart"
              className="cart-link"
              aria-label={
                itemCount
                  ? `Cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`
                  : 'Cart'
              }
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </Link>
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
          <Link to="/about" onClick={() => setMenuOpen(false)}>ABOUT US</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>CONTACT US</Link>
          <Link to="/admin" onClick={() => setMenuOpen(false)}>ADMIN</Link>
        </div>
      )}
    </header>
  );
};

export default StoreHeader;
