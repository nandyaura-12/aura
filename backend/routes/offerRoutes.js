import express from 'express';
import { getOffers, createOffer, updateOffer, deleteOffer } from '../controllers/offerController.js';

const router = express.Router();

router.route('/').get(getOffers).post(createOffer);
router.route('/:id').put(updateOffer).delete(deleteOffer);

export default router;
