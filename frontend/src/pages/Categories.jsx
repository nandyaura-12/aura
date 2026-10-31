import React, { useState, useEffect, useRef } from 'react';
import {
  fetchCategories,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
  uploadImageApi,
  notifyCategoriesChanged,
} from '../services/api';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { confirmToast } from '../lib/confirmToast';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';
import {
  DEFAULT_MENU_NAMES,
  resolveCategoryMenuName,
} from '../data/shopCategories';
import '../styles/pages/Categories.css';

const emptyForm = {
  name: '',
  description: '',
  image: '',
  menuName: 'Shop by Category',
  status: 'Active',
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const imageInputRef = useRef(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetchCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast.error('Could not load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData(emptyForm);
    setSaving(false);
  };

  const existingMenuNames = Array.from(
    new Set([
      ...DEFAULT_MENU_NAMES,
      ...categories.map((cat) => resolveCategoryMenuName(cat)),
    ])
  );

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || '',
        description: category.description || '',
        image: category.image || '',
        menuName: resolveCategoryMenuName(category),
        status: category.status || 'Active',
      });
    } else {
      setEditingCategory(null);
      setFormData({ ...emptyForm });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await uploadImageApi(file);
      setFormData((prev) => ({ ...prev, image: res.data.url }));
      toast.success('Category image uploaded');
    } catch (err) {
      toast.error('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = String(formData.name || '').trim();
    if (!name) {
      toast.error('Enter a category name.');
      return;
    }

    const payload = {
      ...formData,
      name,
      description: String(formData.description || '').trim(),
      menuName: String(formData.menuName || '').trim() || 'Shop by Category',
    };

    try {
      setSaving(true);
      if (editingCategory) {
        await updateCategoryApi(editingCategory._id, payload);
        toast.success('Category updated successfully');
        closeModal();
      } else {
        await createCategoryApi(payload);
        toast.success(`"${name}" category added`);
        setFormData({ ...emptyForm });
        setEditingCategory(null);
        // Keep modal open so another different category can be added immediately.
      }
      await loadCategories();
      notifyCategoriesChanged();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Error saving category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!(await confirmToast('Are you sure you want to delete this category?'))) return;
    try {
      await deleteCategoryApi(id);
      toast.success('Category deleted');
      loadCategories();
      notifyCategoriesChanged();
    } catch (err) {
      toast.error('Error deleting category: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Antique Categories</h1>
          <p className="page-subtitle">
            Category name is required. Type any menu name — new names create a new menu section.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="categories-grid">
        {categories.map((cat) => (
          <div key={cat._id} className="stat-card category-admin-card">
            <img
              src={
                cat.image ||
                'https://res.cloudinary.com/mxihlfki/image/upload/f_auto,q_auto,w_500/aura/jewellery/img09'
              }
              alt={cat.name}
              className="category-admin-card__image"
            />
            <div className="category-admin-card__header">
              <h3 className="category-admin-card__title">{cat.name}</h3>
              <span className={`badge badge-${String(cat.status || 'active').toLowerCase()}`}>
                {cat.status}
              </span>
            </div>
            <p className="category-admin-card__group">{resolveCategoryMenuName(cat)}</p>
            <p className="category-admin-card__desc">
              {cat.description || 'No description provided'}
            </p>
            <div className="category-admin-card__footer">
              <span className="category-admin-card__count">{cat.productCount || 0} Products</span>
              <div className="category-admin-card__actions">
                <button type="button" className="btn-icon" onClick={() => handleOpenModal(cat)}>
                  <Edit2 size={16} />
                </button>
                <button
                  type="button"
                  className="btn-icon btn-icon--danger"
                  onClick={() => handleDelete(cat._id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {!loading && categories.length === 0 && (
          <p className="categories-empty">No categories yet. Click Add Category to create one.</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category-name">
              Category Name <span className="required-star">*</span>
            </label>
            <input
              id="category-name"
              type="text"
              className="form-control"
              required
              autoFocus
              placeholder="e.g. Temple Sets, Anklets, Kids Wear"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            />
            <p className="form-hint">Only category name is required. Duplicates are not allowed.</p>
          </div>
          <div className="form-group">
            <label htmlFor="category-menu-name">Menu name</label>
            <input
              id="category-menu-name"
              type="text"
              className="form-control"
              list="category-menu-name-options"
              placeholder="Type a menu name, e.g. Shop by Occasion / Kids Wear"
              value={formData.menuName}
              onChange={(e) => setFormData((prev) => ({ ...prev, menuName: e.target.value }))}
            />
            <datalist id="category-menu-name-options">
              {existingMenuNames.map((menu) => (
                <option key={menu} value={menu} />
              ))}
            </datalist>
          </div>
          <div className="form-group">
            <label htmlFor="category-description">Description (optional)</label>
            <textarea
              id="category-description"
              className="form-control"
              rows="3"
              placeholder="Short description for this category"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Category Image (optional)</label>
            <div
              className="upload-dropzone"
              onClick={() => imageInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') imageInputRef.current?.click();
              }}
              role="button"
              tabIndex={0}
            >
              <Upload size={20} className="upload-dropzone__icon" />
              <div>Click to upload category banner</div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="sr-only-file"
                onChange={handleImageUpload}
              />
            </div>
            {formData.image && (
              <img src={formData.image} alt="preview" className="category-form-preview" />
            )}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={saving}>
              {editingCategory ? 'Cancel' : 'Done'}
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving
                ? 'Saving…'
                : editingCategory
                  ? 'Save Changes'
                  : 'Save & Add Another'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
