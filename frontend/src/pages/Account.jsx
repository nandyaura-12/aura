import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Package, ShoppingBag, IndianRupee, CalendarDays } from 'lucide-react';
import { toast } from 'react-toastify';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import { fetchMyOrders } from '../services/api';
import { getStoredUser, clearUser } from '../data/userAuth';
import { formatInr } from '../data/catalog';
import '../styles/pages/storefront.css';
import '../styles/pages/UserAuth.css';

const Account = () => {
  const navigate = useNavigate();
  const [user] = useState(() => getStoredUser());
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    let cancelled = false;
    fetchMyOrders(user.email)
      .then((res) => {
        if (!cancelled) setOrders(res.data || []);
      })
      .catch(() => {
        if (!cancelled) toast.error('Could not load your buying history.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, navigate]);

  if (!user) return null;

  const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  const handleLogout = () => {
    clearUser();
    toast.success('Logged out. See you soon!');
    navigate('/');
  };

  return (
    <div className="storefront">
      <StoreHeader />
      <main className="account-main">
        <div className="store-container">
          <div className="account-head">
            <div className="account-profile">
              <span className="account-avatar">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              <div>
                <h1>{user.name}</h1>
                <p>{user.email}</p>
                {user.phone && <p>{user.phone}</p>}
              </div>
            </div>
            <button type="button" className="account-logout" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </div>

          <div className="account-stats">
            <div className="account-stat">
              <ShoppingBag size={20} />
              <div>
                <strong>{orders.length}</strong>
                <span>Total Orders</span>
              </div>
            </div>
            <div className="account-stat">
              <IndianRupee size={20} />
              <div>
                <strong>{formatInr(totalSpent).replace('₹', '₹ ')}</strong>
                <span>Total Spent</span>
              </div>
            </div>
            <div className="account-stat">
              <Package size={20} />
              <div>
                <strong>{orders.filter((o) => o.orderStatus === 'Delivered').length}</strong>
                <span>Delivered</span>
              </div>
            </div>
          </div>

          <h2 className="account-section-title">Buying History</h2>

          {loading ? (
            <p className="account-empty">Loading your orders…</p>
          ) : orders.length === 0 ? (
            <div className="account-empty">
              <Package size={30} />
              <p>No purchases yet with {user.email}.</p>
              <p className="account-empty-sub">
                Buy a piece using this same email at checkout — it will appear here automatically.
              </p>
              <Link to="/collections" className="account-shop-btn">
                Shop Antique Collections
              </Link>
            </div>
          ) : (
            <div className="account-orders">
              {orders.map((order) => (
                <article key={order._id || order.orderId} className="account-order">
                  <header>
                    <div>
                      <strong>{order.orderId}</strong>
                      <span>
                        <CalendarDays size={13} />{' '}
                        {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="account-order-badges">
                      <span className={`badge badge-${String(order.paymentStatus || '').toLowerCase()}`}>
                        {order.paymentStatus}
                      </span>
                      <span className={`badge badge-${String(order.orderStatus || '').toLowerCase()}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </header>

                  <div className="account-order-items">
                    {(order.items || []).map((item, idx) => (
                      <div key={idx} className="account-order-item">
                        {item.image && <img src={item.image} alt={item.productName} />}
                        <div>
                          <strong>{item.productName}</strong>
                          <span>
                            Qty {item.quantity} × {formatInr(item.price)}
                          </span>
                        </div>
                        <strong>{formatInr(item.price * item.quantity)}</strong>
                      </div>
                    ))}
                  </div>

                  <footer>
                    <span>{order.paymentMethod}</span>
                    <strong>Total: {formatInr(order.totalAmount)}</strong>
                  </footer>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <StoreFooter />
    </div>
  );
};

export default Account;
