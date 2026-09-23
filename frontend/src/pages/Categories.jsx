import React, { useState, useEffect } from 'react';
import { fetchCategories, createCategoryApi, updateCategoryApi, deleteCategoryApi, uploadImageApi } from '../services/api';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, Layers, Upload } from 'lucide-react';

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {categories.map((cat) => (
          <div key={cat._id} className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', position: 'relative' }}>
            <img
              src={cat.image || 'https://images.unsplash.com/photo-1498049860654-af1a5c566876?w=500&q=80'}
              alt={cat.name}
              style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem' }}
            />
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{cat.name}</h3>
              <span className={`badge badge-${cat.status.toLowerCase()}`}>{cat.status}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem', lineClamp: 2 }}>
              {cat.description || 'No description provided'}
            </p>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-orange)' }}>
                {cat.productCount || 0} Products
              </span>
              <div>
                <button className="btn-icon" onClick={() => handleOpenModal(cat)}>
                  <Edit2 size={16} />
                </button>
                <button className="btn-icon" style={{ color: 'var(--status-cancelled)' }} onClick={() => handleDelete(cat._id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Modal */}
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
              <Upload size={20} style={{ color: 'var(--primary-orange)', marginBottom: '0.4rem' }} />
              <div>Click to upload category banner</div>
              <input id="catImageInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </div>
            {formData.image && (
              <img src={formData.image} alt="preview" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '0.75rem' }} />
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
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
