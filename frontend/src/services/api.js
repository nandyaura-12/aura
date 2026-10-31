import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const fetchProducts = (search = '', category = '') =>
  api.get(`/products`, { params: { search, category } });
export const createProductApi = (productData) => api.post(`/products`, productData);
export const updateProductApi = (id, productData) => api.put(`/products/${id}`, productData);
export const deleteProductApi = (id) => api.delete(`/products/${id}`);

// Categories API
export const CATEGORIES_CHANGED_EVENT = 'aura-categories-changed';
export const notifyCategoriesChanged = () => {
  window.dispatchEvent(new Event(CATEGORIES_CHANGED_EVENT));
};
export const fetchCategories = () => api.get(`/categories`);
export const createCategoryApi = (categoryData) => api.post(`/categories`, categoryData);
export const updateCategoryApi = (id, categoryData) => api.put(`/categories/${id}`, categoryData);
export const deleteCategoryApi = (id) => api.delete(`/categories/${id}`);

// Orders API
export const fetchOrders = (status = '', search = '') =>
  api.get(`/orders`, { params: { status, search } });
export const createOrderApi = (orderData) => api.post(`/orders`, orderData);
export const updateOrderStatusApi = (id, statusData) =>
  api.put(`/orders/${id}/status`, statusData);
export const deleteOrderApi = (id) => api.delete(`/orders/${id}`);

// Customers API
export const fetchCustomers = (search = '', status = '') =>
  api.get(`/customers`, { params: { search, status } });
export const updateCustomerStatusApi = (id, status) =>
  api.put(`/customers/${id}/status`, { status });

// Offers API
export const fetchOffers = () => api.get(`/offers`);
export const createOfferApi = (offerData) => api.post(`/offers`, offerData);
export const updateOfferApi = (id, offerData) => api.put(`/offers/${id}`, offerData);
export const deleteOfferApi = (id) => api.delete(`/offers/${id}`);

// Storefront User Auth API
export const registerUserApi = (userData) => api.post(`/customers/register`, userData);
export const loginUserApi = (credentials) => api.post(`/customers/login`, credentials);
export const googleLoginApi = (payload) => api.post(`/customers/google`, payload);
export const fetchMyOrders = (email) => api.get(`/orders`, { params: { email } });

// Reports API (Customized date range & product based)
export const fetchReports = (startDate = '', endDate = '', productId = '') =>
  api.get(`/reports`, { params: { startDate, endDate, productId } });

// Upload API
export const uploadImageApi = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post(`/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;
