import React, { useState, useEffect } from 'react';
import {
  fetchProducts,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  fetchCategories,
  uploadImageApi,
} from '../services/api';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, Search, Upload, Gem, Sparkles } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discountPrice: '',
    stock: '',
    sku: '',
    purity: '22K Gold (916 Hallmarked)',
    weightGrams: '',
    makingCharge: '',
    images: [],
    offerTag: '',
    status: 'Active',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.allSettled([
        fetchProducts(search, selectedCategory),
        fetchCategories(),
      ]);

      if (prodRes.status === 'fulfilled') setProducts(prodRes.value.data);
      if (catRes.status === 'fulfilled') setCategories(catRes.value.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, selectedCategory]);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        discountPrice: product.discountPrice || '',
        stock: product.stock,
        sku: product.sku || '',
        purity: product.purity || '22K Gold (916 Hallmarked)',
        weightGrams: product.weightGrams || '',
        makingCharge: product.makingCharge || '',
        images: product.images || [],
        offerTag: product.offerTag || '',
        status: product.status || 'Active',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category: categories[0]?.name || 'Gold Jewellery',
        price: '',
        discountPrice: '',
        stock: '1',
        sku: `SKU-JW-${Math.floor(1000 + Math.random() * 9000)}`,
        purity: '22K Gold (916 Hallmarked)',
        weightGrams: '',
        makingCharge: '10',
        images: [],
        offerTag: '',
        status: 'Active',
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await uploadImageApi(file);
      const imageUrl = res.data.url;
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
    } catch (err) {
      alert('Image upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProductApi(editingProduct._id, formData);
      } else {
        await createProductApi(formData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert('Error saving jewellery item: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this jewellery piece from catalogue?')) return;
    try {
      await deleteProductApi(id);
      loadData();
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Jewellery Catalogue Management</h1>
          <p className="page-subtitle">Manage 22K Gold, Solitaires, Gemstones, and Bridal Collections</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Jewellery Piece
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-box" style={{ flex: 1 }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by piece name, purity, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-control"
          style={{ width: '220px' }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Collections</option>
          {categories.map((cat) => (
            <option key={cat._id || cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="card-table-wrapper">
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Jewellery Piece</th>
                <th>Category</th>
                <th>Purity / Metal</th>
                <th>Weight (g)</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={product.images[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&q=80'}
                          alt={product.name}
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            border: '1px solid var(--border-color)',
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: '700' }}>{product.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            SKU: <span style={{ fontFamily: 'var(--font-mono)' }}>{product.sku}</span>
                          </div>
                          {product.offerTag && (
                            <span className="badge badge-gold" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                              🏷️ {product.offerTag}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>
                      <span className="badge badge-gold">{product.purity}</span>
                    </td>
                    <td style={{ fontWeight: '700' }}>{product.weightGrams ? `${product.weightGrams} g` : 'N/A'}</td>
                    <td>
                      <span style={{ fontWeight: '800', color: 'var(--primary-gold)' }}>
                        ₹{product.price?.toLocaleString()}
                      </span>
                      {product.discountPrice > 0 && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                          ₹{product.discountPrice?.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: '600' }}>{product.stock} pcs</td>
                    <td>
                      <span className={`badge badge-${product.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {product.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-icon" onClick={() => handleOpenModal(product)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon" style={{ color: 'var(--status-cancelled)' }} onClick={() => handleDelete(product._id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    {loading ? 'Loading jewellery catalogue...' : 'No jewellery pieces found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Jewellery Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Jewellery Piece' : 'Add New Jewellery Piece'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Name</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. 22K Gold Antique Lakshmi Necklace"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Collection / Category</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat._id || cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Purity / Metal Hallmark</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. 22K Gold (916 BIS) or VVS Diamond"
                value={formData.purity}
                onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gross Weight (Grams)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                required
                placeholder="e.g. 32.50"
                value={formData.weightGrams}
                onChange={(e) => setFormData({ ...formData, weightGrams: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Making Charge (%)</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 12"
                value={formData.makingCharge}
                onChange={(e) => setFormData({ ...formData, makingCharge: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Final Price (₹)</label>
              <input
                type="number"
                className="form-control"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Stock (Pieces)</label>
              <input
                type="number"
                className="form-control"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Promotional Offer Tag</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. AKSHAYA TRITIYA SPECIAL - 0% MAKING CHARGE"
              value={formData.offerTag}
              onChange={(e) => setFormData({ ...formData, offerTag: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Item Description & Craftsmanship</label>
            <textarea
              className="form-control"
              rows="3"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Upload High-Res Photo</label>
            <div className="upload-dropzone" onClick={() => document.getElementById('jewelImageInput').click()}>
              <Upload size={24} style={{ color: 'var(--primary-gold)', marginBottom: '0.5rem' }} />
              <div>{uploadingImage ? 'Uploading High-Res Photo...' : 'Click or Drag & Drop Jewellery Photo'}</div>
              <input id="jewelImageInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </div>
            {formData.images.length > 0 && (
              <div className="image-preview-grid">
                {formData.images.map((imgUrl, idx) => (
                  <img key={idx} src={imgUrl} alt="preview" className="preview-thumb" />
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingProduct ? 'Save Changes' : 'Save Jewellery Piece'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
