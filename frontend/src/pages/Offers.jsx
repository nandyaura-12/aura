import React, { useState, useEffect } from 'react';
import { fetchOffers, createOfferApi, updateOfferApi, deleteOfferApi, uploadImageApi } from '../services/api';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { confirmToast } from '../lib/confirmToast';
import { Plus, Tag, Edit2, Trash2, Calendar, Upload, Megaphone, Eye, X } from 'lucide-react';
import '../styles/components/FestivalOfferPopup.css';
import '../styles/pages/Offers.css';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [previewOffer, setPreviewOffer] = useState(null);

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
    showAsPopup: false,
    popupButtonText: 'Shop Now',
  });

  const popupOffer = offers.find((o) => o.showAsPopup);

  const handleSetPopup = async (offer) => {
    try {
      await updateOfferApi(offer._id, { showAsPopup: !offer.showAsPopup });
      toast.success(offer.showAsPopup ? 'Popup disabled' : 'Popup enabled');
      loadOffers();
    } catch (err) {
      toast.error('Error setting popup: ' + (err.response?.data?.message || err.message));
    }
  };

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
        showAsPopup: Boolean(offer.showAsPopup),
        popupButtonText: offer.popupButtonText || 'Shop Now',
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
        showAsPopup: false,
        popupButtonText: 'Shop Now',
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
      toast.success('Offer banner uploaded');
    } catch (err) {
      toast.error('Upload failed: ' + (err.response?.data?.message || err.message));
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
      toast.success(editingOffer ? 'Offer updated successfully' : 'Offer created successfully');
      loadOffers();
    } catch (err) {
      toast.error('Error saving offer: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!(await confirmToast('Delete this promotional offer?'))) return;
    try {
      await deleteOfferApi(id);
      toast.success('Offer deleted');
      loadOffers();
    } catch (err) {
      toast.error('Error deleting offer: ' + (err.response?.data?.message || err.message));
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

      {/* Festival Offer Popup — Admin Setting */}
      <div className="stat-card offers-popup-banner" style={{ width: '100%', marginBottom: '1.25rem', border: '1.5px solid var(--gold)', background: 'var(--cream)' }}>
        <Megaphone size={26} style={{ color: 'var(--olive)', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>🎉 Festival Offer Popup (Website)</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {popupOffer
              ? <>Live popup: <strong>{popupOffer.title}</strong> — {popupOffer.discountType === 'Percentage' ? `${popupOffer.discountValue}% OFF` : `₹${popupOffer.discountValue} OFF`} · code <strong>{popupOffer.code}</strong> ({popupOffer.status})</>
              : 'Popup OFF — keela oru offer la "Set as Festival Popup" click panna website la popup varum.'}
          </p>
        </div>
        {popupOffer && (
          <div className="offers-popup-banner__actions">
            <button type="button" className="btn btn-secondary" onClick={() => setPreviewOffer(popupOffer)}>
              <Eye size={16} /> Preview Popup
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => handleSetPopup(popupOffer)}>
              <X size={16} /> Turn Off
            </button>
          </div>
        )}
      </div>

      <div className="offers-grid">
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

            {offer.showAsPopup && (
              <span className="badge" style={{ marginTop: '0.6rem', background: 'var(--olive)', color: '#fff' }}>
                🎉 FESTIVAL POPUP LIVE
              </span>
            )}

            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
              <button
                type="button"
                className={offer.showAsPopup ? 'btn btn-secondary' : 'btn btn-primary'}
                style={{ fontSize: '0.78rem', padding: '0.45rem 0.8rem' }}
                onClick={() => handleSetPopup(offer)}
                title="Website la festival popup-a indha offer-a kaatu"
              >
                <Megaphone size={14} /> {offer.showAsPopup ? 'Remove Popup' : 'Set as Festival Popup'}
              </button>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn-icon" onClick={() => setPreviewOffer(offer)} title="Preview Popup">
                  <Eye size={16} />
                </button>
              <button className="btn-icon" onClick={() => handleOpenModal(offer)}>
                <Edit2 size={16} />
              </button>
              <button className="btn-icon" style={{ color: 'var(--status-cancelled)' }} onClick={() => handleDelete(offer._id)}>
                <Trash2 size={16} />
              </button>
              </div>
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

          <div className="form-group" style={{ background: 'var(--cream)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.9rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', margin: 0 }}>
              <input
                type="checkbox"
                checked={formData.showAsPopup}
                onChange={(e) => setFormData({ ...formData, showAsPopup: e.target.checked })}
              />
              🎉 Show as Festival Offer Popup on website
            </label>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.4rem 0 0 1.5rem' }}>
              Oru time-la oru offer mattum popup-a varum. Website open aana idhu auto-popup aagum.
            </p>
            {formData.showAsPopup && (
              <div style={{ marginTop: '0.75rem', marginLeft: '1.5rem' }}>
                <label>Popup Button Text</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.popupButtonText}
                  onChange={(e) => setFormData({ ...formData, popupButtonText: e.target.value })}
                  placeholder="Shop Now"
                />
              </div>
            )}
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

      {/* Festival Popup Preview */}
      <Modal isOpen={Boolean(previewOffer)} onClose={() => setPreviewOffer(null)} title="Festival Popup Preview (Website la ipdi varum)">
        {previewOffer && (
          <div className="fest-popup" style={{ animation: 'none', width: '100%' }}>
            <div className="fest-media">
              {previewOffer.bannerImage
                ? <img src={previewOffer.bannerImage} alt={previewOffer.title} />
                : <div style={{ minHeight: 320, background: 'var(--cream-deep)' }} />}
              <span className="fest-badge">
                {previewOffer.discountType === 'Percentage' ? `${previewOffer.discountValue}% OFF` : `₹${previewOffer.discountValue} OFF`}
              </span>
            </div>
            <div className="fest-body">
              <p className="fest-eyebrow">✦ Festival Special ✦</p>
              <h2 className="fest-title">{previewOffer.title}</h2>
              <p className="fest-highlight">
                {previewOffer.discountType === 'Percentage' ? `${previewOffer.discountValue}% OFF` : `₹${Number(previewOffer.discountValue).toLocaleString('en-IN')} OFF`}
              </p>
              <p className="fest-desc">Handcrafted antique &amp; temple jewellery for your festive look.</p>
              <span className="fest-code"><span>{previewOffer.code}</span> Copy</span>
              <span className="fest-cta">{previewOffer.popupButtonText || 'Shop Now'}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Offers;
