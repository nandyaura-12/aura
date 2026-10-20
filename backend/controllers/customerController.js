import Customer from '../models/Customer.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

const publicCustomer = (customer) => ({
  _id: customer._id,
  name: customer.name,
  email: customer.email,
  phone: customer.phone || '',
  address: customer.address || '',
  ordersCount: customer.ordersCount || 0,
  totalSpent: customer.totalSpent || 0,
  status: customer.status,
  createdAt: customer.createdAt,
});

// @desc    Register a storefront user
// @route   POST /api/customers/register
export const registerCustomer = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const phone = String(req.body.phone || '').trim();

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Enter your name and a valid email.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existing = await Customer.findOne({ email });
    if (existing && existing.passwordHash) {
      return res.status(409).json({ message: 'An account with this email already exists. Please login.' });
    }

    if (existing) {
      // Checkout-created customer (no password yet) — let them claim the account.
      existing.name = name;
      if (phone) existing.phone = phone;
      existing.passwordHash = hashPassword(password);
      existing.status = 'Active';
      const saved = await existing.save();
      return res.status(200).json(publicCustomer(saved));
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      passwordHash: hashPassword(password),
    });
    res.status(201).json(publicCustomer(customer));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Login a storefront user
// @route   POST /api/customers/login
export const loginCustomer = async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    const customer = await Customer.findOne({ email });
    if (!customer || !customer.passwordHash || !verifyPassword(password, customer.passwordHash)) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    if (customer.status === 'Blocked') {
      return res.status(403).json({ message: 'This account is blocked. Please contact us.' });
    }
    res.json(publicCustomer(customer));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all customers
// @route   GET /api/customers
export const getCustomers = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    if (status && status !== 'All') {
      query.status = status;
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });
    res.json(customers.map(publicCustomer));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle customer status
// @route   PUT /api/customers/:id/status
export const updateCustomerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    customer.status = status;
    const updatedCustomer = await customer.save();
    res.json(publicCustomer(updatedCustomer));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
