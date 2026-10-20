// One-time helper: give existing customers (created by seed/checkout, no password yet)
// a login password so they can use the storefront account. Default: Aura@123
// Usage: node scripts/setDemoPasswords.js [password]
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Customer from '../models/Customer.js';
import { hashPassword } from '../utils/password.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aura_admin';
const password = process.argv[2] || 'Aura@123';

await mongoose.connect(MONGO_URI);
const result = await Customer.updateMany(
  { $or: [{ passwordHash: '' }, { passwordHash: { $exists: false } }] },
  { $set: { passwordHash: hashPassword(password) } }
);
console.log(`Updated ${result.modifiedCount} customer(s) with login password.`);
await mongoose.disconnect();
process.exit(0);
