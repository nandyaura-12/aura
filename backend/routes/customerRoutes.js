import express from 'express';
import { getCustomers, updateCustomerStatus } from '../controllers/customerController.js';

const router = express.Router();

router.route('/').get(getCustomers);
router.route('/:id/status').put(updateCustomerStatus);

export default router;
