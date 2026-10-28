import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { brandLogo } from '../../data/images';
import { getStoredUser, USER_CHANGED_EVENT } from '../../data/userAuth';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { fetchOffers } from '../../services/api';
import {
  DEFAULT_STORE_SETTINGS,
  getStoreSettings,
  STORE_SETTINGS_CHANGED,
} from '../../data/storeSettings';
import {
  TYPE_CATEGORIES,
  OCCASION_CATEGORIES,
  categoryPath,
} from '../../data/shopCategories';
import '../../styles/components/StoreHeader.css';
import '../../styles/pages/Wishlist.css';

const StoreHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const collectionsRef = useRef(null);
  const [banner, setBanner] = useState(() => {
    const settings = getStoreSettings();
    return settings.useCustomBanner
      ? settings.bannerText
      : DEFAULT_STORE_SETTINGS.bannerText;
  });
  const [user, setUser] = useState(() => getStoredUser());
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    const refresh = () => setUser(getStoredUser());
    window.addEventListener(USER_CHANGED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(USER_CHANGED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  useEffect(() => {
    const applyCustomBanner = () => {
      const settings = getStoreSettings();
      if (settings.useCustomBanner) {
        setBanner(settings.bannerText || DEFAULT_STORE_SETTINGS.bannerText);
      } else {
        setBanner(DEFAULT_STORE_SETTINGS.bannerText);
      }
    };
    applyCustomBanner();
    window.addEventListener(STORE_SETTINGS_CHANGED, applyCustomBanner);
    window.addEventListener('storage', applyCustomBanner);
    return () => {
      window.removeEventListener(STORE_SETTINGS_CHANGED, applyCustomBanner);
      window.removeEventListener('storage', applyCustomBanner);
    };
  }, []);

  useEffect(() => {
    if (!collectionsOpen) return undefined;
    const onPointerDown = (e) => {
      if (collectionsRef.current && !collectionsRef.current.contains(e.target)) {
        setCollectionsOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setCollectionsOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [collectionsOpen]);

  const closeCollections = () => setCollectionsOpen(false);

  useEffect(() => {
    let cancelled = false;
    const loadOfferBanner = () => {
      if (getStoreSettings().useCustomBanner) return;
      fetchOffers()
        .then((res) => {
          if (cancelled || getStoreSettings().useCustomBanner) return;
          const active = (res.data || []).find((offer) => offer.status === 'Active');
          if (!active) return;
          if (active.discountType === 'Percentage') {
            setBanner(`Flat ${active.discountValue}% off on VA for Online Gold Jewellery.`);
          } else {
            setBanner(
              `Flat ₹${Number(active.discountValue).toLocaleString('en-IN')} off on VA for Online Gold Jewellery.`
            );
          }
        })
        .catch(() => {});
    };
    loadOfferBanner();
    const onSettings = () => {
      if (getStoreSettings().useCustomBanner) return;
      loadOfferBanner();
    };
    window.addEventListener(STORE_SETTINGS_CHANGED, onSettings);
    return () => {
      cancelled = true;
      window.removeEventListener(STORE_SETTINGS_CHANGED, onSettings);
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
          <div
            className="nav-dropdown"
            ref={collectionsRef}
            onMouseEnter={() => setCollectionsOpen(true)}
            onMouseLeave={() => setCollectionsOpen(false)}
          >
            <button
              type="button"
              className="nav-dropdown__toggle"
              onClick={() => setCollectionsOpen((open) => !open)}
              aria-haspopup="true"
              aria-expanded={collectionsOpen}
            >
              COLLECTIONS
              <ChevronDown
                size={15}
                className={`nav-dropdown__chevron${collectionsOpen ? ' is-open' : ''}`}
              />
            </button>
            {collectionsOpen && (
              <div className="collections-dropdown">
                <Link to="/collections" onClick={closeCollections}>Just Arrived</Link>
                <Link to="/#bestsellers" onClick={closeCollections}>Best Sellers</Link>
                <span className="collections-dropdown__label">Shop by Category</span>
                {TYPE_CATEGORIES.map((category) => (
                  <Link
                    key={category.slug}
                    to={categoryPath(category.slug)}
                    className="collections-dropdown__sub"
                    onClick={closeCollections}
                  >
                    {category.name}
                  </Link>
                ))}
                {OCCASION_CATEGORIES.map((category) => (
                  <Link
                    key={category.slug}
                    to={categoryPath(category.slug)}
                    onClick={closeCollections}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/about">ABOUT US</Link>
          <Link to="/contact">CONTACT US</Link>
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
            <Link
              to="/wishlist"
              className={`wishlist-link${wishlistCount > 0 ? ' active' : ''}`}
              aria-label={
                wishlistCount
                  ? `Wishlist, ${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'}`
                  : 'Wishlist'
              }
              title="My Wishlist"
            >
              <Heart size={20} strokeWidth={1.5} />
              {wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
            </Link>
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
            <Link
              to={user ? '/account' : '/login'}
              aria-label={user ? `Account — ${user.name}` : 'Login'}
              title={user ? `${user.name} · My Orders` : 'Login'}
              className="account-link"
            >
              {user ? (
                <span className="account-initial">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              ) : (
                <User size={20} strokeWidth={1.5} />
              )}
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
          <div className="mobile-nav__search">
            <Search size={16} />
            <input type="search" placeholder="Search anything..." aria-label="Search" />
          </div>
          <Link to="/#shop" onClick={() => setMenuOpen(false)}>SHOP</Link>
          <button
            type="button"
            className="mobile-nav__toggle"
            onClick={() => setCollectionsOpen((open) => !open)}
            aria-expanded={collectionsOpen}
          >
            COLLECTIONS
            <ChevronDown
              size={15}
              className={`nav-dropdown__chevron${collectionsOpen ? ' is-open' : ''}`}
            />
          </button>
          {collectionsOpen && (
            <div className="mobile-nav__sub">
              <Link to="/collections" onClick={() => setMenuOpen(false)}>Just Arrived</Link>
              <Link to="/#bestsellers" onClick={() => setMenuOpen(false)}>Best Sellers</Link>
              <span>Shop by Category</span>
              {TYPE_CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  to={categoryPath(category.slug)}
                  onClick={() => setMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              {OCCASION_CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  to={categoryPath(category.slug)}
                  onClick={() => setMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
          <Link to="/about" onClick={() => setMenuOpen(false)}>ABOUT US</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>CONTACT US</Link>
          <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
            WISHLIST{wishlistCount ? ` (${wishlistCount})` : ''}
          </Link>
          <Link to={user ? '/account' : '/login'} onClick={() => setMenuOpen(false)}>
            {user ? 'MY ORDERS' : 'LOGIN'}
          </Link>
        </div>
      )}
    </header>
  );
};

export default StoreHeader;
