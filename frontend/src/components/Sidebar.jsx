import React, { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Gem,
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
import { fetchCategories } from '../services/api';
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
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetchCategories()
      .then((res) => {
        if (!cancelled) setCategories(res.data || []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/admin/categories')) setCollectionsOpen(true);
  }, [location.pathname]);

  const handleCollectionsToggle = () => {
    if (!effectiveExpanded) {
      onSetExpanded(true);
      setCollectionsOpen(true);
      return;
    }
    setCollectionsOpen((open) => !open);
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
  const handleMouseEnter = () => {
    if (!expanded) onHoverChange(true);
  };
  // mouseEnter only fires when crossing the sidebar edge — if the pointer is
  // already inside after a collapse click, moving it must open the sidebar too.
  const handleMouseMove = () => {
    if (!expanded && !hoverOpen) onHoverChange(true);
  };
  const handleMouseLeave = () => onHoverChange(false);
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
    { path: '/admin/products', label: 'Antique Catalogue', icon: Gem },
    { path: '/admin/orders', label: 'Orders & Deliveries', icon: ShoppingBag },
    { path: '/admin/customers', label: 'Valued Clients', icon: Users },
    { path: '/admin/offers', label: 'Festive Offers', icon: Tag },
    { path: '/admin/reports', label: 'Sales & Revenue Reports', icon: BarChart3 },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
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
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title={item.label}
            >
              <Icon />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* Antique Collections dropdown — same logic as the storefront */}
        <div className="sidebar-nav-group">
          <button
            type="button"
            className={`nav-item nav-group-toggle ${location.pathname.startsWith('/admin/categories') ? 'active' : ''}`}
            onClick={handleCollectionsToggle}
            aria-expanded={collectionsOpen}
            title="Antique Collections"
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
                to="/admin/categories"
                className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
              >
                All Collections
              </NavLink>
              {categories.map((cat) => (
                <Link
                  key={cat._id || cat.name}
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

        {navItems.slice(2).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title={item.label}
            >
              <Icon />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <Link to="/" className="admin-home-link" title="View Storefront">
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
