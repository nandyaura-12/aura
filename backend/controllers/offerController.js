import Offer from '../models/Offer.js';

// @desc    Get all offers
// @route   GET /api/offers
export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find({}).sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new offer
// @route   POST /api/offers
export const createOffer = async (req, res) => {
  try {
    const { title, code, discountType, discountValue, bannerImage, startDate, endDate, status, minimumPurchase } = req.body;

    const offer = new Offer({
      title,
      code: code.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      bannerImage,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: status || 'Active',
      minimumPurchase: Number(minimumPurchase) || 0,
    });

    const savedOffer = await offer.save();
    res.status(201).json(savedOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update offer
// @route   PUT /api/offers/:id
export const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    Object.assign(offer, req.body);
    if (req.body.code) offer.code = req.body.code.toUpperCase();

    const updatedOffer = await offer.save();
    res.json(updatedOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    await offer.deleteOne();
    res.json({ message: 'Offer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
