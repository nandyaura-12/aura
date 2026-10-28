import React, { useState, useEffect, useRef } from 'react';
import { fetchOrders, updateOrderStatusApi } from '../services/api';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { Eye, Search, ChevronDown } from 'lucide-react';
import { formatInr } from '../data/catalog';
import '../styles/pages/Orders.css';

const STATUS_FILTERS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const statusLabel = (status) => (status === 'All' ? 'All Statuses' : status);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const statusMenuRef = useRef(null);

  // Invoice Modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!statusMenuOpen) return;
    const onPointerDown = (e) => {
      if (!statusMenuRef.current?.contains(e.target)) setStatusMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setStatusMenuOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [statusMenuOpen]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await fetchOrders(statusFilter, search);
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, search]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatusApi(orderId, { orderStatus: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      loadOrders();
    } catch (err) {
      toast.error('Error updating order status: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Antique Orders</h1>
          <p className="page-subtitle">Track antique piece orders, update delivery statuses, and inspect purchase invoices</p>
        </div>
      </div>

      <div className="filter-bar orders-filter-bar">
        <div className="search-box" style={{ flex: 1 }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by Order ID or Customer Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="status-dropdown" ref={statusMenuRef}>
          <button
            type="button"
            className={`status-dropdown__trigger${statusMenuOpen ? ' is-open' : ''}`}
            aria-haspopup="listbox"
            aria-expanded={statusMenuOpen}
            onClick={() => setStatusMenuOpen((open) => !open)}
          >
            <span>{statusLabel(statusFilter)}</span>
            <ChevronDown size={15} aria-hidden />
          </button>
          {statusMenuOpen && (
            <ul className="status-dropdown__menu" role="listbox" aria-label="Filter by status">
              {STATUS_FILTERS.map((status) => (
                <li key={status} role="option" aria-selected={statusFilter === status}>
                  <button
                    type="button"
                    className={`status-dropdown__option${statusFilter === status ? ' is-active' : ''}`}
                    onClick={() => {
                      setStatusFilter(status);
                      setStatusMenuOpen(false);
                    }}
                  >
                    {statusLabel(status)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card-table-wrapper">
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Payment Status</th>
                <th>Order Status</th>
                <th>Total</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id || order.orderId}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                      {order.orderId}
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{order.customerName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{order.customerEmail}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${order.paymentStatus?.toLowerCase()}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <label className="status-select-wrap">
                        <select
                          className="status-select"
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          aria-label={`Status for ${order.orderId}`}
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={14} aria-hidden />
                      </label>
                    </td>
                    <td style={{ fontWeight: '700' }}>{formatInr(order.totalAmount)}</td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setSelectedOrder(order)}>
                        <Eye size={14} /> View Invoice
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    {loading ? 'Loading orders...' : 'No orders found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details - ${selectedOrder?.orderId}`}
      >
        {selectedOrder && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem', padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customer</div>
                <div style={{ fontWeight: '700' }}>{selectedOrder.customerName}</div>
                <div style={{ fontSize: '0.85rem' }}>{selectedOrder.customerPhone}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Shipping Address</div>
                <div style={{ fontSize: '0.85rem' }}>{selectedOrder.shippingAddress}</div>
              </div>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem' }}>Line Items</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justify: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{item.productName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × {formatInr(item.price)}</div>
                  </div>
                  <div style={{ fontWeight: '700' }}>{formatInr(item.quantity * item.price)}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '2px solid var(--border-color)', fontWeight: '800', fontSize: '1.1rem' }}>
              <span>Total Amount</span>
              <span style={{ color: 'var(--primary-orange)' }}>{formatInr(selectedOrder.totalAmount)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
