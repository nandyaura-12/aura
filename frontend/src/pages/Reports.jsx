import React, { useState, useEffect } from 'react';
import { fetchReports, fetchProducts } from '../services/api';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Calendar, Filter, Download, DollarSign, ShoppingBag, Gem, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';

const Reports = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  const thirtyDaysAgoStr = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(thirtyDaysAgoStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [selectedProduct, setSelectedProduct] = useState('All');
  const [productsList, setProductsList] = useState([]);

  const [reportData, setReportData] = useState({
    summary: { totalRevenue: 0, totalOrders: 0, totalUnitsSold: 0, avgOrderValue: 0 },
    salesTrend: [],
    topProducts: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchProducts();
        setProductsList(res.data);
      } catch (err) {
        console.error('Error loading products list for reports filter:', err);
      }
    };
    loadProducts();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      const res = await fetchReports(startDate, endDate, selectedProduct);
      setReportData(res.data);
    } catch (err) {
      console.error('Error loading analytics report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [startDate, endDate, selectedProduct]);

  const handleExportCSV = () => {
    let csv = 'Jewellery Piece,Revenue (₹),Units Sold,Orders\n';
    (reportData.topProducts || []).forEach((p) => {
      csv += `"${p.name}",${p.revenue},${p.units},${p.orders}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Aura_Jewellery_Sales_Report_${startDate}_to_${endDate}.csv`;
    a.click();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales & Gold Revenue Analytics</h1>
          <p className="page-subtitle">
            Generate customized sales reports based on custom date ranges and specific jewellery piece selection
          </p>
        </div>
        <button className="btn btn-secondary" onClick={handleExportCSV}>
          <Download size={16} /> Export CSV Report
        </button>
      </div>

      {/* Date Range & Product Filter Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} style={{ color: 'var(--primary-gold)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Customized Date Range:</span>
        </div>

        <div className="date-picker-group">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>From:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="date-picker-group">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>To:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
          <Filter size={18} style={{ color: 'var(--primary-gold)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Jewellery Piece Filter:</span>
          <select
            className="form-control"
            style={{ width: '230px' }}
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="All">All Jewellery Pieces</option>
            {productsList.map((p) => (
              <option key={p._id || p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="stats-grid">
        <StatCard
          title="Period Gold Revenue"
          value={`₹${(reportData.summary?.totalRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          title="Orders Placed"
          value={reportData.summary?.totalOrders || 0}
          icon={ShoppingBag}
        />
        <StatCard
          title="Units Sold"
          value={reportData.summary?.totalUnitsSold || 0}
          icon={Gem}
        />
        <StatCard
          title="Avg Order Value"
          value={`₹${(Number(reportData.summary?.avgOrderValue) || 0).toLocaleString()}`}
          icon={TrendingUp}
        />
      </div>

      {/* Chart Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card-table-wrapper" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem' }}>
            Gold Revenue Trend ({startDate} to {endDate})
          </h3>
          <div style={{ width: '100%', height: 280 }}>
            {reportData.salesTrend && reportData.salesTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportData.salesTrend}>
                  <defs>
                    <linearGradient id="colorRevGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4af37" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a253c" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#13111c', borderColor: '#2a253c', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#d4af37" fillOpacity={1} fill="url(#colorRevGold)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                No sales data recorded for the selected date range.
              </div>
            )}
          </div>
        </div>

        {/* Top Product Bar Chart */}
        <div className="card-table-wrapper" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem' }}>Top Pieces Sales</h3>
          <div style={{ width: '100%', height: 280 }}>
            {reportData.topProducts && reportData.topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.topProducts.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a253c" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tick={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#13111c', borderColor: '#2a253c', color: '#fff' }} />
                  <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                No item data available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breakdown Data Table */}
      <div className="card-table-wrapper">
        <div className="table-header-bar">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Jewellery Sales Performance Breakdown</h3>
        </div>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Jewellery Item</th>
                <th>Revenue Generated</th>
                <th>Units Sold</th>
                <th>Total Orders</th>
              </tr>
            </thead>
            <tbody>
              {reportData.topProducts && reportData.topProducts.length > 0 ? (
                reportData.topProducts.map((prod, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '700' }}>{prod.name}</td>
                    <td style={{ fontWeight: '800', color: 'var(--primary-gold)' }}>
                      ₹{(prod.revenue || 0).toLocaleString()}
                    </td>
                    <td>{prod.units} pcs</td>
                    <td>{prod.orders} orders</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                    No breakdown data found for this selection.
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

export default Reports;
