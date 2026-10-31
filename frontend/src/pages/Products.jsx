import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  fetchProducts,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  fetchCategories,
  createCategoryApi,
  notifyCategoriesChanged,
  uploadImageApi,
} from '../services/api';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { confirmToast } from '../lib/confirmToast';
import { Plus, Edit2, Trash2, Search, Upload, ChevronDown } from 'lucide-react';
import {
  DEFAULT_MENU_NAMES,
  resolveCategoryMenuName,
} from '../data/shopCategories';
import '../styles/pages/Products.css';

const categoryLabel = (category) => (category === 'All' ? 'All Collections' : category);

const RING_TYPES = [
  'Temple Ring',
  'Cocktail Ring',
  'Statement Ring',
  'Stackable Ring',
  'Bridal Ring',
  'Toe Ring',
  'Adjustable Ring',
  'Other',
];

const isRingsCategory = (category) => String(category || '').toLowerCase() === 'rings';

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const categoryMenuRef = useRef(null);

  // Sidebar Collections dropdown links here with ?category=…
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    if (!categoryMenuOpen) return;
    const onPointerDown = (e) => {
      if (!categoryMenuRef.current?.contains(e.target)) setCategoryMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setCategoryMenuOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [categoryMenuOpen]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    menuName: 'Shop by Category',
  });

  const existingMenuNames = Array.from(
    new Set([
      ...DEFAULT_MENU_NAMES,
      ...categories.map((cat) => resolveCategoryMenuName(cat)),
    ])
  );

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discountPrice: '',
    stock: '',
    sku: '',
    purity: '',
    weightGrams: '',
    makingCharge: '',
    ringType: '',
    images: [],
    offerTag: '',
    status: 'Active',
  });

  const formIsRings = isRingsCategory(formData.category);

  const applyCategoryToForm = (categoryName) => {
    const rings = isRingsCategory(categoryName);
    setFormData((prev) => ({
      ...prev,
      category: categoryName,
      purity: '',
      weightGrams: '',
      ringType: rings ? prev.ringType : '',
    }));
  };

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
        purity: '',
        weightGrams: '',
        makingCharge: product.makingCharge || '',
        ringType: product.ringType || '',
        images: product.images || [],
        offerTag: product.offerTag || '',
        status: product.status || 'Active',
      });
    } else {
      setEditingProduct(null);
      const defaultCategory = categories[0]?.name || 'Necklace Sets';
      setFormData({
        name: '',
        description: '',
        category: defaultCategory,
        price: '',
        discountPrice: '',
        stock: '1',
        sku: `SKU-AQ-${Math.floor(1000 + Math.random() * 9000)}`,
        purity: '',
        weightGrams: '',
        makingCharge: '',
        ringType: '',
        images: [],
        offerTag: '',
        status: 'Active',
      });
    }
    setShowNewCategory(false);
    setNewCategory({ name: '', menuName: 'Shop by Category' });
    setIsModalOpen(true);
  };

  const handleCreateCategoryInline = async () => {
    const name = String(newCategory.name || '').trim();
    if (!name) {
      toast.error('Category name is required.');
      return;
    }
    try {
      setCreatingCategory(true);
      const res = await createCategoryApi({
        name,
        menuName: String(newCategory.menuName || '').trim() || 'Shop by Category',
      });
      const created = res.data;
      setCategories((prev) => {
        const next = [created, ...prev.filter((c) => c._id !== created._id)];
        return next;
      });
      applyCategoryToForm(created.name);
      setShowNewCategory(false);
      setNewCategory({ name: '', menuName: 'Shop by Category' });
      notifyCategoriesChanged();
      toast.success(`Category "${created.name}" added`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Could not add category');
    } finally {
      setCreatingCategory(false);
    }
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
    const rings = isRingsCategory(formData.category);
    if (rings && !String(formData.ringType || '').trim()) {
      toast.error('Please select a Ring Type.');
      return;
    }
    const payload = {
      ...formData,
      purity: '',
      weightGrams: '',
      ringType: rings ? formData.ringType : '',
    };
    try {
      if (editingProduct) {
        await updateProductApi(editingProduct._id, payload);
      } else {
        await createProductApi(payload);
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
          <p className="page-subtitle">Manage Necklace Sets, Earrings, Pendant Sets, Bangles &amp; Rings</p>
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
            placeholder="Search name, finish, SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-dropdown" ref={categoryMenuRef}>
          <button
            type="button"
            className={`category-dropdown__trigger${categoryMenuOpen ? ' is-open' : ''}`}
            aria-haspopup="listbox"
            aria-expanded={categoryMenuOpen}
            onClick={() => setCategoryMenuOpen((open) => !open)}
          >
            <span>{categoryLabel(selectedCategory)}</span>
            <ChevronDown size={15} aria-hidden />
          </button>
          {categoryMenuOpen && (
            <ul className="category-dropdown__menu" role="listbox" aria-label="Filter by collection">
              <li role="option" aria-selected={selectedCategory === 'All'}>
                <button
                  type="button"
                  className={`category-dropdown__option${selectedCategory === 'All' ? ' is-active' : ''}`}
                  onClick={() => {
                    setSelectedCategory('All');
                    setCategoryMenuOpen(false);
                  }}
                >
                  All Collections
                </button>
              </li>
              {categories.map((cat) => (
                <li
                  key={cat._id || cat.name}
                  role="option"
                  aria-selected={selectedCategory === cat.name}
                >
                  <button
                    type="button"
                    className={`category-dropdown__option${selectedCategory === cat.name ? ' is-active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setCategoryMenuOpen(false);
                    }}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card-table-wrapper admin-mobile-table-wrap products-table-wrap">
        <div className="table-container">
          <table className="custom-table admin-mobile-table products-table">
            <thead>
              <tr>
                <th>Antique Piece</th>
                <th>Category</th>
                <th>Ring Type</th>
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
                    <td data-label="Piece" data-span="full" data-hide-label>
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
                    <td data-label="Category">{product.category}</td>
                    <td data-label="Ring Type">
                      <span className="badge badge-gold">
                        {isRingsCategory(product.category) ? product.ringType || '—' : '—'}
                      </span>
                    </td>
                    <td data-label="Price">
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
                    <td className="td-stock" data-label="Stock">{product.stock} pcs</td>
                    <td data-label="Status">
                      <span className={`badge badge-${product.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="td-right mobile-actions" data-label="Actions">
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
                  <td colSpan="7" className="td-empty">
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
              placeholder="e.g. Floral Ruby Bangle"
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
                onChange={(e) => applyCategoryToForm(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat._id || cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="product-add-category-toggle"
                onClick={() => setShowNewCategory((open) => !open)}
              >
                {showNewCategory ? 'Cancel new category' : '+ Add new category here'}
              </button>
            </div>
            {formIsRings && (
              <div className="form-group">
                <label>Ring Type</label>
                <select
                  className="form-control"
                  required
                  value={formData.ringType}
                  onChange={(e) => setFormData({ ...formData, ringType: e.target.value })}
                >
                  <option value="">Select ring type</option>
                  {RING_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {showNewCategory && (
            <div className="product-new-category">
              <p className="product-new-category__title">New category</p>
              <div className="form-row">
                <div className="form-group">
                  <label>Category Name <span className="required-star">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Anklets"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
                  />
                  <p className="form-hint">Only name is required.</p>
                </div>
                <div className="form-group">
                  <label>Menu name</label>
                  <input
                    type="text"
                    className="form-control"
                    list="product-menu-name-options"
                    placeholder="Type menu name, e.g. Kids Wear"
                    value={newCategory.menuName}
                    onChange={(e) =>
                      setNewCategory((prev) => ({ ...prev, menuName: e.target.value }))
                    }
                  />
                  <datalist id="product-menu-name-options">
                    {existingMenuNames.map((menu) => (
                      <option key={menu} value={menu} />
                    ))}
                  </datalist>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={creatingCategory}
                onClick={handleCreateCategoryInline}
              >
                {creatingCategory ? 'Adding…' : 'Create category & use it'}
              </button>
            </div>
          )}

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
              <label>MRP Price (₹)</label>
              <input
                type="number"
                className="form-control"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
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
