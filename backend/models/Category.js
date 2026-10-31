import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    // Free-text menu label in Collections nav (e.g. "Shop by Category", "Kids Wear")
    menuName: { type: String, default: 'Shop by Category', trim: true },
    // Legacy: type / occasion — kept for older rows; prefer menuName
    group: { type: String, enum: ['type', 'occasion'], default: 'type' },
    productCount: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;
