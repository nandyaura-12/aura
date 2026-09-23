import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    ordersCount: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Blocked', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
export default Customer;
