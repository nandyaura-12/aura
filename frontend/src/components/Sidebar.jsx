import React, { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  BarChart3,
  Settings,
  Store,
  ChevronDown,
} from 'lucide-react';
import { brandLogo } from '../data/images';
import { TYPE_CATEGORIES, OCCASION_CATEGORIES } from '../data/shopCategories';
import '../styles/components/Sidebar.css';

const EXPANDED_WIDTH = 270;
const COLLAPSED_WIDTH = 80;
const SNAP_WIDTH = 170;
const clampWidth = (w) => Math.min(EXPANDED_WIDTH, Math.max(COLLAPSED_WIDTH, w));

const Sidebar = ({ expanded, onToggle, onSetExpanded, dragWidth, setDragWidth, hoverOpen, onHoverChange }) => {
  const location = useLocation();
  const [collectionsOpen, setCollectionsOpen] = useState(
    () => location.pathname.startsWith('/admin/categories')
  );
  const [settingsOpen, setSettingsOpen] = useState(
    () => location.pathname.startsWith('/admin/settings')
  );

  useEffect(() => {
    if (location.pathname.startsWith('/admin/categories') || location.pathname.startsWith('/admin/products')) {
      setCollectionsOpen(true);
    }
    if (location.pathname.startsWith('/admin/settings')) setSettingsOpen(true);
  }, [location.pathname]);

  const handleCollectionsToggle = () => {
    if (!effectiveExpanded) {
      onSetExpanded(true);
      setCollectionsOpen(true);
      return;
    }
    setCollectionsOpen((open) => !open);
  };

  const handleSettingsToggle = () => {
    if (!effectiveExpanded) {
      onSetExpanded(true);
      setSettingsOpen(true);
      return;
    }
    setSettingsOpen((open) => !open);
  };

  // Drag the right edge: sidebar follows the pointer, then snaps open/closed.
  const handleDragStart = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = expanded || hoverOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH;
    setDragWidth(startWidth);

    const onMove = (ev) => setDragWidth(clampWidth(startWidth + ev.clientX - startX));
    const onUp = (ev) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      onSetExpanded(clampWidth(startWidth + ev.clientX - startX) > SNAP_WIDTH);
      setDragWidth(null);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  const handleDragKeys = (e) => {
    if (e.key === 'ArrowRight') onSetExpanded(true);
    else if (e.key === 'ArrowLeft') onSetExpanded(false);
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  // Touch / hover on a collapsed sidebar auto-opens it: mouse hover opens it
  // and pushes the page content aside (closes again when the pointer leaves),
  // a touch tap pins it open.
  const isMobileNav = () =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  const handleMouseEnter = () => {
    if (isMobileNav()) return;
    if (!expanded) onHoverChange(true);
  };
  // mouseEnter only fires when crossing the sidebar edge — if the pointer is
  // already inside after a collapse click, moving it must open the sidebar too.
  const handleMouseMove = () => {
    if (isMobileNav()) return;
    if (!expanded && !hoverOpen) onHoverChange(true);
  };
  const handleMouseLeave = () => {
    if (isMobileNav()) return;
    onHoverChange(false);
  };
  const handleTouchOpen = (e) => {
    if (expanded) return;
    if (e.target.closest('button, a')) return;
    onSetExpanded(true);
  };

  const effectiveExpanded = dragWidth != null ? dragWidth > SNAP_WIDTH : expanded || hoverOpen;
  const isHoverPeek = hoverOpen && !expanded && dragWidth == null;

  const handleToggle = () => {
    // While hover-open, the toggle just closes the hover state instead of pinning it open.
    if (isHoverPeek) {
      onHoverChange(false);
      return;
    }
    onToggle();
  };
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/admin/orders', label: 'Orders & Deliveries', icon: ShoppingBag },
    { path: '/admin/customers', label: 'Valued Clients', icon: Users },
    { path: '/admin/offers', label: 'Festive Offers', icon: Tag },
    { path: '/admin/reports', label: 'Sales & Revenue Reports', icon: BarChart3 },
  ];

  const settingsSubItems = [
    { path: '/admin/settings#password', label: 'Change password' },
    { path: '/admin/settings#email', label: 'Admin email' },
    { path: '/admin/settings#banner', label: 'Store banner' },
    { path: '/admin/settings#contact', label: 'Contact details' },
    { path: '/admin/settings#festival', label: 'Festival popup' },
  ];

  return (
    <aside
      className={`sidebar ${effectiveExpanded ? 'expanded' : 'collapsed'}${dragWidth != null ? ' dragging' : ''}`}
      style={dragWidth != null ? { width: `${dragWidth}px` } : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchOpen}
    >
      <div className="sidebar-header">
        <button
          type="button"
          className="sidebar-brand"
          onClick={handleToggle}
          aria-label={effectiveExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={effectiveExpanded}
        >
          <img src={brandLogo} alt="Nandys Aura" className="sidebar-logo-img" />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.slice(0, 1).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title={effectiveExpanded ? undefined : item.label}
            >
              <Icon />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* Antique Collections — catalogue + storefront categories in one place */}
        <div className="sidebar-nav-group">
          <button
            type="button"
            className={`nav-item nav-group-toggle ${
              location.pathname.startsWith('/admin/categories') ||
              location.pathname.startsWith('/admin/products')
                ? 'active'
                : ''
            }`}
            onClick={handleCollectionsToggle}
            aria-expanded={collectionsOpen}
            title={effectiveExpanded ? undefined : 'Antique Collections'}
          >
            <Layers />
            <span>Antique Collections</span>
            <ChevronDown
              size={15}
              className={`nav-group-chevron${collectionsOpen ? ' is-open' : ''}`}
            />
          </button>
          {collectionsOpen && effectiveExpanded && (
            <div className="nav-submenu">
              <NavLink
                to="/admin/products"
                end
                className={({ isActive }) =>
                  `nav-subitem ${
                    isActive &&
                    !new URLSearchParams(location.search).get('category') &&
                    !new URLSearchParams(location.search).get('filter')
                      ? 'active'
                      : ''
                  }`
                }
              >
                All Products
              </NavLink>
              <NavLink
                to="/admin/categories"
                end
                className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
              >
                All Collections
              </NavLink>
              <Link
                to="/admin/products?filter=just-arrived"
                className={`nav-subitem ${
                  new URLSearchParams(location.search).get('filter') === 'just-arrived'
                    ? 'active'
                    : ''
                }`}
              >
                Just Arrived
              </Link>
              <Link
                to="/admin/products?filter=best-sellers"
                className={`nav-subitem ${
                  new URLSearchParams(location.search).get('filter') === 'best-sellers'
                    ? 'active'
                    : ''
                }`}
              >
                Best Sellers
              </Link>
              <span className="nav-sublabel">Shop by Category</span>
              {TYPE_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/admin/products?category=${encodeURIComponent(cat.name)}`}
                  className={`nav-subitem nav-subitem--indent ${
                    new URLSearchParams(location.search).get('category') === cat.name
                      ? 'active'
                      : ''
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
              {OCCASION_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/admin/products?category=${encodeURIComponent(cat.name)}`}
                  className={`nav-subitem ${
                    new URLSearchParams(location.search).get('category') === cat.name
                      ? 'active'
                      : ''
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {navItems.slice(1).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title={effectiveExpanded ? undefined : item.label}
            >
              <Icon />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div className="sidebar-nav-group">
          <button
            type="button"
            className={`nav-item nav-group-toggle ${location.pathname.startsWith('/admin/settings') ? 'active' : ''}`}
            onClick={handleSettingsToggle}
            aria-expanded={settingsOpen}
            title={effectiveExpanded ? undefined : 'Settings'}
          >
            <Settings />
            <span>Settings</span>
            <ChevronDown
              size={15}
              className={`nav-group-chevron${settingsOpen ? ' is-open' : ''}`}
            />
          </button>
          {settingsOpen && effectiveExpanded && (
            <div className="nav-submenu">
              {settingsSubItems.map((item) => {
                const currentHash = location.hash || '#password';
                const active =
                  location.pathname === '/admin/settings' &&
                  item.path.endsWith(currentHash);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-subitem ${active ? 'active' : ''}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      <Link to="/" className="admin-home-link" title={effectiveExpanded ? undefined : 'View Storefront'}>
        <Store size={18} className="admin-home-icon" />
        <span>← View Storefront</span>
      </Link>

      <div
        className="sidebar-drag-handle"
        role="separator"
        aria-orientation="vertical"
        aria-label="Drag to open or close sidebar"
        title="Drag to open / close"
        tabIndex={0}
        onPointerDown={handleDragStart}
        onKeyDown={handleDragKeys}
      >
        <span className="sidebar-drag-grip" />
      </div>
    </aside>
  );
};

export default Sidebar;
