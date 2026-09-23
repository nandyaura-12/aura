import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ['Percentage', 'Fixed Amount'], default: 'Percentage' },
    discountValue: { type: Number, required: true },
    bannerImage: { type: String, default: '' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['Active', 'Expired', 'Scheduled'], default: 'Active' },
    minimumPurchase: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Offer = mongoose.models.Offer || mongoose.model('Offer', offerSchema);
export default Offer;
