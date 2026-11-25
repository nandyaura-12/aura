import express from 'express';
import {
  createCashfreeSession,
  verifyCashfreePayment,
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/cashfree/session', createCashfreeSession);
router.post('/cashfree/verify', verifyCashfreePayment);

export default router;
