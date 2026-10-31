import { OAuth2Client } from 'google-auth-library';
import Customer from '../models/Customer.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { validatePassword } from '../utils/passwordValidation.js';

const getGoogleClient = () =>
  new OAuth2Client(process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID);

const publicCustomer = (customer) => ({
  _id: customer._id,
  name: customer.name,
  email: customer.email,
  phone: customer.phone || '',
  address: customer.address || '',
  ordersCount: customer.ordersCount || 0,
  totalSpent: customer.totalSpent || 0,
  status: customer.status,
  authProvider: customer.authProvider || 'local',
  createdAt: customer.createdAt,
});

const upsertGoogleCustomer = async ({ googleId, email, name }) => {
  let customer =
    (googleId && (await Customer.findOne({ googleId }))) ||
    (email && (await Customer.findOne({ email })));

  if (customer) {
    if (customer.status === 'Blocked') {
      const err = new Error('This account is blocked. Please contact us.');
      err.status = 403;
      throw err;
    }
    customer.googleId = googleId || customer.googleId;
    customer.authProvider = customer.authProvider === 'local' && customer.passwordHash ? customer.authProvider : 'google';
    if (name && !customer.name) customer.name = name;
    if (name && customer.authProvider === 'google') customer.name = name;
    return customer.save();
  }

  return Customer.create({
    name: name || email.split('@')[0],
    email,
    googleId,
    authProvider: 'google',
  });
};

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
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
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

// @desc    Login / register with Google (ID token or access token)
// @route   POST /api/customers/google
export const googleLoginCustomer = async (req, res) => {
  try {
    const credential = String(req.body.credential || '').trim();
    const accessToken = String(req.body.accessToken || '').trim();
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      return res.status(503).json({
        message: 'Google sign-in is not configured on the server. Add GOOGLE_CLIENT_ID to backend/.env.',
      });
    }

    let googleId = '';
    let email = '';
    let name = '';

    if (credential) {
      const ticket = await getGoogleClient().verifyIdToken({
        idToken: credential,
        audience: clientId,
      });
      const payload = ticket.getPayload() || {};
      if (!payload.email_verified) {
        return res.status(401).json({ message: 'Google email is not verified.' });
      }
      googleId = payload.sub;
      email = String(payload.email || '').trim().toLowerCase();
      name = String(payload.name || '').trim();
    } else if (accessToken) {
      const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!profileRes.ok) {
        return res.status(401).json({ message: 'Could not verify Google account.' });
      }
      const profile = await profileRes.json();
      if (!profile.email || profile.email_verified === false) {
        return res.status(401).json({ message: 'Google email is not verified.' });
      }
      googleId = String(profile.sub || '');
      email = String(profile.email || '').trim().toLowerCase();
      name = String(profile.name || '').trim();
    } else {
      return res.status(400).json({ message: 'Missing Google credential.' });
    }

    if (!email || !googleId) {
      return res.status(401).json({ message: 'Google account details incomplete.' });
    }

    const customer = await upsertGoogleCustomer({ googleId, email, name });
    res.json(publicCustomer(customer));
  } catch (error) {
    const status = error.status || 400;
    res.status(status).json({ message: error.message || 'Google sign-in failed.' });
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
