import React, { useState, useEffect } from 'react';
import { fetchCategories, createCategoryApi, updateCategoryApi, deleteCategoryApi, uploadImageApi } from '../services/api';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';
import '../styles/pages/Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    status: 'Active',
  });

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetchCategories();
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        image: category.image || '',
        status: category.status || 'Active',
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        image: '',
        status: 'Active',
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadImageApi(file);
      setFormData((prev) => ({ ...prev, image: res.data.url }));
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategoryApi(editingCategory._id, formData);
      } else {
        await createCategoryApi(formData);
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err) {
      alert('Error saving category: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategoryApi(id);
      loadCategories();
    } catch (err) {
      alert('Error deleting category: ' + err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Categories</h1>
          <p className="page-subtitle">Organize products into categories for easy browsing</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="categories-grid">
        {categories.map((cat) => (
          <div key={cat._id} className="stat-card category-admin-card">
            <img
              src={cat.image || 'https://res.cloudinary.com/mxihlfki/image/upload/f_auto,q_auto,w_500/aura/jewellery/img09'}
              alt={cat.name}
              className="category-admin-card__image"
            />
            <div className="category-admin-card__header">
              <h3 className="category-admin-card__title">{cat.name}</h3>
              <span className={`badge badge-${cat.status.toLowerCase()}`}>{cat.status}</span>
            </div>
            <p className="category-admin-card__desc">
              {cat.description || 'No description provided'}
            </p>
            <div className="category-admin-card__footer">
              <span className="category-admin-card__count">
                {cat.productCount || 0} Products
              </span>
              <div className="category-admin-card__actions">
                <button className="btn-icon" onClick={() => handleOpenModal(cat)}>
                  <Edit2 size={16} />
                </button>
                <button className="btn-icon btn-icon--danger" onClick={() => handleDelete(cat._id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>
          <div className="form-group">
            <label>Category Image</label>
            <div className="upload-dropzone" onClick={() => document.getElementById('catImageInput').click()}>
              <Upload size={20} className="upload-dropzone__icon" />
              <div>Click to upload category banner</div>
              <input id="catImageInput" type="file" accept="image/*" className="sr-only-file" onChange={handleImageUpload} />
            </div>
            {formData.image && (
              <img src={formData.image} alt="preview" className="category-form-preview" />
            )}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Category
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
