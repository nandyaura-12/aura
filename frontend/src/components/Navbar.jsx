import React from 'react';
import { Search, Bell, Sparkles } from 'lucide-react';
import '../styles/components/Navbar.css';

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
        <div className="gold-rate">
          <Sparkles size={16} /> 22K Gold Rate: ₹6,850/g
        </div>

        <button className="btn-icon" title="Notifications">
          <Bell size={20} />
        </button>

        <div className="admin-badge">
          <div className="avatar">NA</div>
          <div>
            <div className="admin-badge__name">Nandys Aura</div>
            <div className="admin-badge__role">Store Manager</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
