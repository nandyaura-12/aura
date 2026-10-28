import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Sparkles, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { logoutAdmin } from '../data/adminAuth';
import '../styles/components/Navbar.css';

const Navbar = ({ searchTerm, setSearchTerm, onToggleSidebar, sidebarOpen }) => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    setProfileOpen(false);
    logoutAdmin();
    navigate('/admin/login', { replace: true });
  };

  useEffect(() => {
    if (!profileOpen) return undefined;
    const onPointerDown = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setProfileOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [profileOpen]);

  return (
    <header className="navbar">
      <div className="navbar-leading">
        <button
          type="button"
          className="admin-menu-btn"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={Boolean(sidebarOpen)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search pieces, orders, SKU..."
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="navbar-actions">
        <div className="gold-rate">
          <Sparkles size={16} /> Antique Temple Collection — New Festive Pieces Live
        </div>

        <button className="btn-icon" title="Notifications">
          <Bell size={20} />
        </button>

        <div className="admin-profile" ref={profileRef}>
          <button
            type="button"
            className="admin-badge"
            onClick={() => setProfileOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            title="Account menu"
          >
            <span className="avatar">NA</span>
            <span className="admin-badge__text">
              <span className="admin-badge__name">Nandys Aura</span>
              <span className="admin-badge__role">Store Manager</span>
            </span>
            <ChevronDown
              size={16}
              className={`admin-badge__chevron${profileOpen ? ' is-open' : ''}`}
            />
          </button>

          {profileOpen && (
            <div className="profile-dropdown" role="menu" aria-label="Account">
              <div className="profile-dropdown__head">
                <span className="avatar">NA</span>
                <span className="admin-badge__text">
                  <span className="admin-badge__name">Nandys Aura</span>
                  <span className="admin-badge__role">Store Manager</span>
                </span>
              </div>
              <button
                type="button"
                className="profile-dropdown__item profile-dropdown__item--logout"
                onClick={handleLogout}
                role="menuitem"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
