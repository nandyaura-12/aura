import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  fetchProducts,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  fetchCategories,
  uploadImageApi,
} from '../services/api';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { confirmToast } from '../lib/confirmToast';
import { Plus, Edit2, Trash2, Search, Upload } from 'lucide-react';
import '../styles/pages/Products.css';

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [loading, setLoading] = useState(true);

  // Sidebar Collections dropdown links here with ?category=…
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discountPrice: '',
    stock: '',
    sku: '',
    purity: 'Antique Matte Finish (Brass Alloy)',
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
        purity: product.purity || 'Antique Matte Finish (Brass Alloy)',
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
        category: categories[0]?.name || 'Temple Sets',
        price: '',
        discountPrice: '',
        stock: '1',
        sku: `SKU-AQ-${Math.floor(1000 + Math.random() * 9000)}`,
        purity: 'Antique Matte Finish (Brass Alloy)',
        weightGrams: '',
        makingCharge: '',
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
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error('Image upload failed: ' + (err.response?.data?.message || err.message));
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
      toast.success(editingProduct ? 'Antique piece updated successfully' : 'Antique piece added successfully');
      loadData();
    } catch (err) {
      toast.error('Error saving antique item: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!(await confirmToast('Remove this antique piece from catalogue?'))) return;
    try {
      await deleteProductApi(id);
      toast.success('Antique piece deleted');
      loadData();
    } catch (err) {
      toast.error('Error deleting product: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Antique Jewellery Catalogue</h1>
          <p className="page-subtitle">Manage Temple Sets, Kemp Jhumkas, Antique Harams, Bangles &amp; Bridal Antique Sets</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Antique Piece
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-box search-box--grow">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by piece name, finish, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-control filter-select"
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
                <th>Antique Piece</th>
                <th>Category</th>
                <th>Finish / Material</th>
                <th>Weight (g)</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th className="th-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="product-cell">
                        <img
                          src={product.images[0] || 'https://res.cloudinary.com/mxihlfki/image/upload/f_auto,q_auto,w_100/aura/jewellery/img18'}
                          alt={product.name}
                          className="product-cell__thumb"
                        />
                        <div>
                          <div className="product-cell__name">{product.name}</div>
                          <div className="product-cell__sku">
                            SKU: <span className="product-cell__sku-code">{product.sku}</span>
                          </div>
                          {product.offerTag && (
                            <span className="badge badge-gold product-cell__offer">
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
                    <td className="td-weight">{product.weightGrams ? `${product.weightGrams} g` : 'N/A'}</td>
                    <td>
                      {product.discountPrice > 0 && product.discountPrice < product.price ? (
                        <>
                          <span className="product-price">
                            ₹{product.discountPrice?.toLocaleString('en-IN')}
                          </span>
                          <div className="product-price--strike">
                            ₹{product.price?.toLocaleString('en-IN')}
                          </div>
                        </>
                      ) : (
                        <span className="product-price">
                          ₹{product.price?.toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>
                    <td className="td-stock">{product.stock} pcs</td>
                    <td>
                      <span className={`badge badge-${product.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="td-right">
                      <button className="btn-icon" onClick={() => handleOpenModal(product)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon btn-icon--danger" onClick={() => handleDelete(product._id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="td-empty">
                    {loading ? 'Loading antique catalogue...' : 'No antique pieces found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Antique Piece' : 'Add New Antique Piece'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Name</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Lakshmi Nakshi Temple Haram"
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
              <label>Finish / Material</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Antique Matte Finish (Brass Alloy)"
                value={formData.purity}
                onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Sale Price (₹)</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 2999 — blank-na MRP-e sale price"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Approx. Weight (Grams) — Optional</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="e.g. 32.50"
                value={formData.weightGrams}
                onChange={(e) => setFormData({ ...formData, weightGrams: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>MRP Price (₹)</label>
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
              placeholder="e.g. FESTIVE SPECIAL - ANTIQUE TEMPLE EDIT"
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
              <Upload size={24} className="upload-dropzone__icon--lg" />
              <div>{uploadingImage ? 'Uploading High-Res Photo...' : 'Click or Drag & Drop Antique Photo'}</div>
              <input id="jewelImageInput" type="file" accept="image/*" className="sr-only-file" onChange={handleImageUpload} />
            </div>
            {formData.images.length > 0 && (
              <div className="image-preview-grid">
                {formData.images.map((imgUrl, idx) => (
                  <img key={idx} src={imgUrl} alt="preview" className="preview-thumb" />
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingProduct ? 'Save Changes' : 'Save Antique Piece'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
