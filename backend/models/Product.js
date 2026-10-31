import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // Temple Sets, Jhumkas, Antique Harams, Bangles & Kadas, Bridal Antique Sets
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    sku: { type: String, required: true, unique: true },
    purity: { type: String, default: 'Antique Matte Finish (Brass Alloy)' }, // finish / material — antique-finish, NOT solid gold or silver
    weightGrams: { type: Number, default: 0 }, // approx. weight in grams
    makingCharge: { type: Number, default: 0 }, // crafting charge (%)
    ringType: { type: String, default: '' }, // Rings only — Temple, Cocktail, Bridal, etc.
    images: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    offerTag: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Draft', 'Out of Stock'], default: 'Active' },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
