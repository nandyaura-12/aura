import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // Gold, Diamond, Silver, Gemstone, Platinum, Bridal
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    sku: { type: String, required: true, unique: true },
    purity: { type: String, default: '22K Gold (916 Hallmarked)' }, // 22K, 18K, 24K, VVS Diamond, Sterling 925
    weightGrams: { type: Number, default: 0 }, // weight in grams
    makingCharge: { type: Number, default: 0 }, // making charges
    images: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    offerTag: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Draft', 'Out of Stock'], default: 'Active' },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
