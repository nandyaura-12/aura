import React, { useState, useEffect } from 'react';
import { fetchCustomers, updateCustomerStatusApi } from '../services/api';
import { Search, User, ShieldAlert, CheckCircle } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetchCustomers(search);
      setCustomers(res.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
    try {
      await updateCustomerStatusApi(id, newStatus);
      loadCustomers();
    } catch (err) {
      alert('Error updating customer status: ' + err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Customers</h1>
          <p className="page-subtitle">View customer database, total spend, and account access</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-box" style={{ flex: 1 }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search customer by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card-table-wrapper">
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Orders Placed</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((cust) => (
                  <tr key={cust._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="avatar">{cust.name?.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: '700' }}>{cust.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cust.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{cust.phone || 'N/A'}</td>
                    <td style={{ fontWeight: '600' }}>{cust.ordersCount || 0} orders</td>
                    <td style={{ fontWeight: '700', color: 'var(--primary-orange)' }}>
                      ₹{(cust.totalSpent || 0).toLocaleString()}
                    </td>
                    <td>
                      <span className={`badge badge-${cust.status.toLowerCase()}`}>
                        {cust.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className={`btn ${cust.status === 'Active' ? 'btn-danger' : 'btn-secondary'}`}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        onClick={() => handleToggleStatus(cust._id, cust.status)}
                      >
                        {cust.status === 'Active' ? (
                          <>
                            <ShieldAlert size={14} /> Block
                          </>
                        ) : (
                          <>
                            <CheckCircle size={14} /> Unblock
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    {loading ? 'Loading customer records...' : 'No customers found.'}
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

export default Customers;
