import React, { useState, useEffect } from 'react';
import { fetchOffers, createOfferApi, updateOfferApi, deleteOfferApi, uploadImageApi } from '../services/api';
import Modal from '../components/Modal';
import { Plus, Tag, Edit2, Trash2, Calendar, Upload } from 'lucide-react';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    code: '',
    discountType: 'Percentage',
    discountValue: '',
    bannerImage: '',
    startDate: '',
    endDate: '',
    status: 'Active',
    minimumPurchase: '',
  });

  const loadOffers = async () => {
    try {
      setLoading(true);
      const res = await fetchOffers();
      setOffers(res.data);
    } catch (err) {
      console.error('Error loading offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleOpenModal = (offer = null) => {
    if (offer) {
      setEditingOffer(offer);
      setFormData({
        title: offer.title,
        code: offer.code,
        discountType: offer.discountType,
        discountValue: offer.discountValue,
        bannerImage: offer.bannerImage || '',
        startDate: offer.startDate ? offer.startDate.split('T')[0] : '',
        endDate: offer.endDate ? offer.endDate.split('T')[0] : '',
        status: offer.status || 'Active',
        minimumPurchase: offer.minimumPurchase || '',
      });
    } else {
      setEditingOffer(null);
      setFormData({
        title: '',
        code: '',
        discountType: 'Percentage',
        discountValue: '',
        bannerImage: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Active',
        minimumPurchase: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadImageApi(file);
      setFormData((prev) => ({ ...prev, bannerImage: res.data.url }));
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOffer) {
        await updateOfferApi(editingOffer._id, formData);
      } else {
        await createOfferApi(formData);
      }
      setIsModalOpen(false);
      loadOffers();
    } catch (err) {
      alert('Error saving offer: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promotional offer?')) return;
    try {
      await deleteOfferApi(id);
      loadOffers();
    } catch (err) {
      alert('Error deleting offer: ' + err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Update Offers & Discounts</h1>
          <p className="page-subtitle">Manage store promo codes, sale banners, and campaign discounts</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Create New Offer
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {offers.map((offer) => (
          <div key={offer._id} className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            {offer.bannerImage && (
              <img
                src={offer.bannerImage}
                alt={offer.title}
                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem' }}
              />
            )}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-pending" style={{ fontFamily: 'var(--font-mono)', fontWeight: '800' }}>
                🏷️ {offer.code}
              </span>
              <span className={`badge badge-${offer.status.toLowerCase()}`}>{offer.status}</span>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '0.75rem' }}>{offer.title}</h3>
            <p style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-orange)', marginTop: '0.25rem' }}>
              {offer.discountType === 'Percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
            </p>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={14} /> Valid: {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
            </div>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
              <button className="btn-icon" onClick={() => handleOpenModal(offer)}>
                <Edit2 size={16} />
              </button>
              <button className="btn-icon" style={{ color: 'var(--status-cancelled)' }} onClick={() => handleDelete(offer._id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Offer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOffer ? 'Edit Offer' : 'Create Offer'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Offer Title</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Promo Code</label>
              <input
                type="text"
                className="form-control"
                required
                style={{ textTransform: 'uppercase' }}
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Discount Type</label>
              <select
                className="form-control"
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="Fixed Amount">Fixed Amount (₹)</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Discount Value</label>
              <input
                type="number"
                className="form-control"
                required
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Minimum Purchase (₹)</label>
              <input
                type="number"
                className="form-control"
                value={formData.minimumPurchase}
                onChange={(e) => setFormData({ ...formData, minimumPurchase: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                className="form-control"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                className="form-control"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Offer Banner Image</label>
            <div className="upload-dropzone" onClick={() => document.getElementById('offerBannerInput').click()}>
              <Upload size={20} style={{ color: 'var(--primary-orange)', marginBottom: '0.4rem' }} />
              <div>Click to upload offer banner</div>
              <input id="offerBannerInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </div>
            {formData.bannerImage && (
              <img src={formData.bannerImage} alt="preview" style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '8px', marginTop: '0.75rem' }} />
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Offer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Offers;
