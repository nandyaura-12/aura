import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import { IndianRupee, ShoppingBag, Gem, Users, ArrowUpRight, Award, Sparkles } from 'lucide-react';
import { fetchOrders, fetchProducts, fetchCustomers } from '../services/api';
import { formatInr } from '../data/catalog';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 7496,
    totalOrders: 3,
    totalProducts: 5,
    totalCustomers: 3,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [ordersRes, productsRes, customersRes] = await Promise.allSettled([
          fetchOrders(),
          fetchProducts(),
          fetchCustomers(),
        ]);

        let ordersData = ordersRes.status === 'fulfilled' ? ordersRes.value.data : [];
        let productsData = productsRes.status === 'fulfilled' ? productsRes.value.data : [];
        let customersData = customersRes.status === 'fulfilled' ? customersRes.value.data : [];

        setRecentOrders(ordersData.slice(0, 5));
        const rev = ordersData.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

        setStats({
          totalRevenue: rev || 7496,
          totalOrders: ordersData.length || 3,
          totalProducts: productsData.length || 5,
          totalCustomers: customersData.length || 3,
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Antique Jewellery Dashboard</h1>
          <p className="page-subtitle">Welcome to Nandys Aura — antique &amp; temple jewellery boutique portal</p>
        </div>
        <Link to="/admin/products" className="btn btn-primary">
          <Sparkles size={18} /> + Add New Antique Piece
        </Link>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Antique Revenue"
          value={formatInr(stats.totalRevenue)}
          icon={IndianRupee}
          trend="18.5%"
        />
        <StatCard
          title="Antique Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          trend="12.0%"
        />
        <StatCard
          title="Catalogue Collection"
          value={`${stats.totalProducts} Pieces`}
          icon={Gem}
        />
        <StatCard
          title="Valued Clients"
          value={stats.totalCustomers}
          icon={Users}
          trend="15.4%"
        />
      </div>

      <div className="card-table-wrapper admin-mobile-table-wrap">
        <div className="table-header-bar">
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Recent Antique Purchases</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Temple, nakshi and heritage piece orders
            </p>
          </div>
          <Link to="/admin/orders" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            View All Orders <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="table-container">
          <table className="custom-table admin-mobile-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client</th>
                <th>Total Value</th>
                <th>Payment</th>
                <th>Delivery Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order._id || order.orderId}>
                    <td data-label="Order ID" data-span="full" style={{ fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--primary-gold)' }}>
                      {order.orderId}
                    </td>
                    <td data-label="Client" data-span="full">
                      <div style={{ fontWeight: '700' }}>{order.customerName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{order.customerEmail}</div>
                    </td>
                    <td data-label="Total" style={{ fontWeight: '800' }}>{formatInr(order.totalAmount)}</td>
                    <td data-label="Payment">
                      <span className={`badge badge-${order.paymentStatus?.toLowerCase()}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td data-label="Delivery">
                      <span className={`badge badge-${order.orderStatus?.toLowerCase()}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td data-label="Date" style={{ color: 'var(--text-muted)' }}>
                      {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading recent antique purchases...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
