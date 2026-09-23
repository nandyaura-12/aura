import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Gem,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  BarChart3,
} from 'lucide-react';
import logo from '../img/logo.png';

const Sidebar = () => {
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/admin/products', label: 'Jewellery Catalogue', icon: Gem },
    { path: '/admin/categories', label: 'Collections', icon: Layers },
    { path: '/admin/orders', label: 'Orders & Deliveries', icon: ShoppingBag },
    { path: '/admin/customers', label: 'Valued Clients', icon: Users },
    { path: '/admin/offers', label: 'Festive Offers', icon: Tag },
    { path: '/admin/reports', label: 'Sales & Gold Reports', icon: BarChart3 },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-brand" aria-label="Nandys Aura home">
          <img src={logo} alt="Nandys Aura" className="sidebar-logo-img" />
        </Link>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <Link to="/" className="admin-home-link">
        ← View Storefront
      </Link>
    </aside>
  );
};

export default Sidebar;
