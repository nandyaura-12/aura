import express from 'express';
import {
  getCustomers,
  updateCustomerStatus,
  registerCustomer,
  loginCustomer,
  googleLoginCustomer,
} from '../controllers/customerController.js';

const router = express.Router();

router.route('/register').post(registerCustomer);
router.route('/login').post(loginCustomer);
router.route('/google').post(googleLoginCustomer);
router.route('/').get(getCustomers);
router.route('/:id/status').put(updateCustomerStatus);

export default router;
