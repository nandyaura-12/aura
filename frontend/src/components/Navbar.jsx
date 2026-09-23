import React from 'react';
import { Search, Bell, Sparkles } from 'lucide-react';

const Navbar = ({ searchTerm, setSearchTerm }) => {
  return (
    <header className="navbar">
      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search jewellery, orders or SKU..."
          value={searchTerm || ''}
          onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
        />
      </div>

      <div className="navbar-actions">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            color: 'var(--olive)',
            fontWeight: '700',
          }}
        >
          <Sparkles size={16} /> 22K Gold Rate: ₹6,850/g
        </div>

        <button className="btn-icon" title="Notifications">
          <Bell size={20} />
        </button>

        <div className="admin-badge">
          <div className="avatar">NA</div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>Nandys Aura</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Store Manager</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
