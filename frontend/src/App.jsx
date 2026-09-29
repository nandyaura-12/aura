import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Collections from './pages/Collections';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Offers from './pages/Offers';
import Reports from './pages/Reports';
import './styles/pages/AdminLayout.css';
import './styles/components/AdminShared.css';

function AdminLayout() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="page-wrapper">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="offers" element={<Offers />} />
            <Route path="reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const scrollToSection = () => {
        const section = document.getElementById(id);
        if (section) section.scrollIntoView();
        else window.scrollTo(0, 0);
      };
      requestAnimationFrame(scrollToSection);
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
