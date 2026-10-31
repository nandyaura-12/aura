import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { brandLogo } from '../../data/images';
import { getStoredUser, USER_CHANGED_EVENT } from '../../data/userAuth';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { fetchOffers, fetchCategories, CATEGORIES_CHANGED_EVENT } from '../../services/api';
import {
  DEFAULT_STORE_SETTINGS,
  getStoreSettings,
  STORE_SETTINGS_CHANGED,
} from '../../data/storeSettings';
import {
  TYPE_CATEGORIES,
  OCCASION_CATEGORIES,
  categoryPath,
  groupCategoriesByMenu,
} from '../../data/shopCategories';
import '../../styles/components/StoreHeader.css';
import '../../styles/pages/Wishlist.css';

const fallbackMenuSections = groupCategoriesByMenu([
  ...TYPE_CATEGORIES,
  ...OCCASION_CATEGORIES,
]);

const StoreHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [menuSections, setMenuSections] = useState(fallbackMenuSections);
  const collectionsRef = useRef(null);
  const headerRef = useRef(null);
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

  useEffect(() => {
    const el = headerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const syncHeight = () => {
      document.documentElement.style.setProperty(
        '--store-header-height',
        `${el.offsetHeight}px`
      );
    };
    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(el);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--store-header-height');
    };
  }, [menuOpen, banner]);

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

  useEffect(() => {
    let cancelled = false;
    const loadNavCategories = () => {
      fetchCategories()
        .then((res) => {
          if (cancelled) return;
          const active = (res.data || [])
            .filter((category) => category.status !== 'Inactive')
            .sort(
              (a, b) =>
                new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
            );
          if (!active.length) return;
          setMenuSections(groupCategoriesByMenu(active));
        })
        .catch(() => {});
    };
    loadNavCategories();
    window.addEventListener(CATEGORIES_CHANGED_EVENT, loadNavCategories);
    return () => {
      cancelled = true;
      window.removeEventListener(CATEGORIES_CHANGED_EVENT, loadNavCategories);
    };
  }, []);

  const searchField = (className) => (
    <div className={className}>
      <Search size={16} aria-hidden="true" />
      <input type="search" placeholder="Search anything..." aria-label="Search" />
    </div>
  );

  return (
    <header className="store-header" ref={headerRef}>
      {/* 1. Logo first */}
      <div className="brand-bar">
        <div className="store-container brand-bar-inner">
          <Link to="/" className="brand-mark" aria-label="Nandys Aura home">
            <img src={brandLogo} alt="Nandys Aura" className="brand-logo-img" />
          </Link>

          {searchField('store-search')}

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

      {/* Mobile search — always visible below logo bar */}
      <div className="mobile-search-bar">
        <div className="store-container">{searchField('mobile-nav__search')}</div>
      </div>

      {/* 2. Collection navbar after logo */}
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
                {menuSections.map((section) => (
                  <React.Fragment key={section.menuName}>
                    <span className="collections-dropdown__label">{section.menuName}</span>
                    {section.categories.map((category) => (
                      <Link
                        key={category.slug || category._id}
                        to={categoryPath(category.slug || category.name)}
                        className="collections-dropdown__sub"
                        onClick={closeCollections}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
          <Link to="/about">ABOUT US</Link>
          <Link to="/contact">CONTACT US</Link>
          <Link to="/returns-policy">RETURNS</Link>
        </div>
      </nav>

      {/* 3. Offer bar below Collection navbar */}
      <div className="announce-bar" role="note">
        {banner}
      </div>

      {menuOpen && (
        <div className="mobile-nav">
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
              {menuSections.map((section) => (
                <React.Fragment key={section.menuName}>
                  <span>{section.menuName}</span>
                  {section.categories.map((category) => (
                    <Link
                      key={category.slug || category._id}
                      to={categoryPath(category.slug || category.name)}
                      onClick={() => setMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </React.Fragment>
              ))}
            </div>
          )}
          <Link to="/about" onClick={() => setMenuOpen(false)}>ABOUT US</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>CONTACT US</Link>
          <Link to="/returns-policy" onClick={() => setMenuOpen(false)}>RETURNS &amp; POLICY</Link>
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
