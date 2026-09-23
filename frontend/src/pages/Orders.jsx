import React, { useState, useEffect } from 'react';
import { fetchOrders, updateOrderStatusApi, deleteOrderApi } from '../services/api';
import Modal from '../components/Modal';
import { Eye, Search, Filter, ShoppingBag } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Invoice Modal
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      loadOrders();
    } catch (err) {
      alert('Error updating order status: ' + err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Customer Orders</h1>
          <p className="page-subtitle">Track, update order statuses, and inspect purchase invoices</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-box" style={{ flex: 1 }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by Order ID or Customer Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-control"
          style={{ width: '180px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
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
                      <select
                        className="form-control"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem', width: '130px' }}
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ fontWeight: '700' }}>₹{order.totalAmount}</td>
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
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ₹{item.price}</div>
                  </div>
                  <div style={{ fontWeight: '700' }}>₹{item.quantity * item.price}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '2px solid var(--border-color)', fontWeight: '800', fontSize: '1.1rem' }}>
              <span>Total Amount</span>
              <span style={{ color: 'var(--primary-orange)' }}>₹{selectedOrder.totalAmount}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
