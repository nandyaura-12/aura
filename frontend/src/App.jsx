import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Collections from './pages/Collections';
import CategoryShop from './pages/CategoryShop';
import About from './pages/About';
import Cart from './pages/Cart';
import Shipping from './pages/Shipping';
import Payment from './pages/Payment';
import OrderConfirmed from './pages/OrderConfirmed';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Contact from './pages/Contact';
import ReturnsPolicy from './pages/ReturnsPolicy';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Offers from './pages/Offers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AdminLogin from './pages/AdminLogin';
import UserLogin from './pages/UserLogin';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';
import FestivalOfferPopup from './components/store/FestivalOfferPopup';
import { isAdminLoggedIn } from './data/adminAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/pages/AdminLayout.css';
import './styles/components/AdminShared.css';
import './styles/components/Toast.css';

function AdminLayout() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  // Sidebar starts collapsed on every screen — hover/touch opens it.
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarDragWidth, setSidebarDragWidth] = useState(null);
  const [sidebarHoverOpen, setSidebarHoverOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth <= 1024) {
        setSidebarExpanded(false);
        setSidebarHoverOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarExpanded(false);
      setSidebarHoverOpen(false);
    }
  }, [location.pathname]);

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  const sidebarOpen = sidebarExpanded || sidebarHoverOpen;

  return (
    <div className={`app-container${sidebarOpen ? ' sidebar-is-open' : ''}`}>
      {sidebarOpen && (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => {
            setSidebarExpanded(false);
            setSidebarHoverOpen(false);
          }}
        />
      )}
      <Sidebar
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded((open) => !open)}
        onSetExpanded={setSidebarExpanded}
        dragWidth={sidebarDragWidth}
        setDragWidth={setSidebarDragWidth}
        hoverOpen={sidebarHoverOpen}
        onHoverChange={setSidebarHoverOpen}
      />
      <div
        className={`main-content ${sidebarOpen ? '' : 'sidebar-collapsed'}`}
        style={
          sidebarDragWidth != null
            ? { marginLeft: `${sidebarDragWidth}px`, transition: 'none' }
            : undefined
        }
      >
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onToggleSidebar={() => {
            setSidebarHoverOpen(false);
            setSidebarExpanded((open) => !open);
          }}
          sidebarOpen={sidebarOpen}
        />
        <div className="page-wrapper">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="offers" element={<Offers />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
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
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo(0, 0);
        }
      };
      // Wait a tick so settings sections are in the DOM before scrolling.
      const timer = window.setTimeout(scrollToSection, 50);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo(0, 0);
    return undefined;
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <Router>
      <CartProvider>
       <WishlistProvider>
        <ScrollToTop />
        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
          toastClassName="aura-toast"
        />
        <FestivalOfferPopup />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/shop/:categorySlug" element={<CategoryShop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/returns-policy" element={<ReturnsPolicy />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/account" element={<Account />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout/shipping" element={<Shipping />} />
          <Route path="/checkout/payment" element={<Payment />} />
          <Route path="/checkout/confirmation" element={<OrderConfirmed />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
       </WishlistProvider>
      </CartProvider>
    </Router>
  );
}

export default App;
