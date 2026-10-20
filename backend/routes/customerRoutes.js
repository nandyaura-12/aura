import express from 'express';
import {
  getCustomers,
  updateCustomerStatus,
  registerCustomer,
  loginCustomer,
} from '../controllers/customerController.js';

const router = express.Router();

router.route('/register').post(registerCustomer);
router.route('/login').post(loginCustomer);
router.route('/').get(getCustomers);
router.route('/:id/status').put(updateCustomerStatus);

export default router;
