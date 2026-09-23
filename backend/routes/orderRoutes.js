import express from 'express';
import { getOrders, updateOrderStatus, deleteOrder } from '../controllers/orderController.js';

const router = express.Router();

router.route('/').get(getOrders);
router.route('/:id/status').put(updateOrderStatus);
router.route('/:id').delete(deleteOrder);

export default router;
