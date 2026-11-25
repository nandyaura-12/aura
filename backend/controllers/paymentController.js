import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import {
  getCashfreeClient,
  getCashfreeFrontendMode,
  isCashfreeConfigured,
} from '../config/cashfree.js';

const makeOrderId = () => `NA-${Math.floor(10000 + Math.random() * 90000)}`;

const normalizePhone = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length >= 10) return digits.slice(-10);
  return '';
};

const normalizeItems = (items = []) =>
  items.map((item) => ({
    productId: String(item.productId || item.id || ''),
    productName: String(item.productName || item.title || '').trim(),
    quantity: Number(item.quantity ?? item.qty),
    price: Number(item.price ?? item.unitPrice),
    image: item.image || '',
  }));

// @desc    Create local pending order + Cashfree payment session
// @route   POST /api/payments/cashfree/session
export const createCashfreeSession = async (req, res) => {
  try {
    if (!isCashfreeConfigured()) {
      return res.status(503).json({
        message:
          'Cashfree is not configured. Add CASHFREE_APP_ID and CASHFREE_SECRET_KEY to backend/.env',
      });
    }

    const {
      customerName,
      customerEmail,
      customerPhone = '',
      items,
      totalAmount,
      shippingAddress,
    } = req.body;

    const email = String(customerEmail || '').trim().toLowerCase();
    const name = String(customerName || '').trim();
    const address = String(shippingAddress || '').trim();
    const amount = Number(totalAmount);
    const phone = normalizePhone(customerPhone);

    if (!name || !email || !address || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order is missing a customer, address, or items.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Enter a valid email for this order.' });
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Order total is invalid.' });
    }
    if (!phone) {
      return res.status(400).json({
        message: 'Cashfree needs a 10-digit mobile number. Add it in shipping contact.',
      });
    }

    const normalizedItems = normalizeItems(items);
    if (
      normalizedItems.some(
        (item) => !item.productName || !(item.quantity >= 1) || !Number.isFinite(item.price)
      )
    ) {
      return res.status(400).json({ message: 'Each item needs a name, quantity, and price.' });
    }

    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
    let order;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        order = await Order.create({
          orderId: makeOrderId(),
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          items: normalizedItems,
          totalAmount: amount,
          paymentStatus: 'Pending',
          orderStatus: 'Pending',
          paymentMethod: 'Cashfree',
          shippingAddress: address,
        });
        break;
      } catch (error) {
        if (error.code !== 11000 || attempt === 2) throw error;
      }
    }

    const cashfree = getCashfreeClient();
    const request = {
      order_id: order.orderId,
      order_amount: Number(amount.toFixed(2)),
      order_currency: 'INR',
      customer_details: {
        customer_id: email.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50) || order.orderId,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
      },
      order_meta: {
        return_url: `${clientUrl}/checkout/payment-return?order_id={order_id}`,
      },
      order_note: `Aura jewellery order ${order.orderId}`,
    };

    let cfResponse;
    try {
      cfResponse = await cashfree.PGCreateOrder(request);
    } catch (error) {
      await order.deleteOne();
      const cfMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Cashfree could not create this payment session.';
      return res.status(502).json({ message: cfMessage });
    }

    const sessionId = cfResponse?.data?.payment_session_id;
    if (!sessionId) {
      await order.deleteOne();
      return res.status(502).json({ message: 'Cashfree did not return a payment session.' });
    }

    order.cashfreeOrderId = cfResponse.data.cf_order_id || '';
    order.paymentSessionId = sessionId;
    await order.save();

    res.status(201).json({
      orderId: order.orderId,
      paymentSessionId: sessionId,
      mode: getCashfreeFrontendMode(),
      amount: order.totalAmount,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const isPaymentSuccess = (orderPayload, paymentsPayload) => {
  const orderStatus = String(orderPayload?.order_status || '').toUpperCase();
  if (orderStatus === 'PAID') return true;

  const payments = Array.isArray(paymentsPayload) ? paymentsPayload : [];
  return payments.some((payment) => {
    const status = String(payment?.payment_status || '').toUpperCase();
    return status === 'SUCCESS' || status === 'PAID';
  });
};

// @desc    Verify Cashfree payment and mark order paid
// @route   POST /api/payments/cashfree/verify
export const verifyCashfreePayment = async (req, res) => {
  try {
    if (!isCashfreeConfigured()) {
      return res.status(503).json({ message: 'Cashfree is not configured on the server.' });
    }

    const orderId = String(req.body.orderId || req.query.order_id || '').trim();
    if (!orderId) {
      return res.status(400).json({ message: 'Missing order id.' });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (order.paymentStatus === 'Paid') {
      return res.json({
        status: 'Paid',
        order,
        alreadyPaid: true,
      });
    }

    const cashfree = getCashfreeClient();
    const [orderRes, paymentsRes] = await Promise.all([
      cashfree.PGFetchOrder(orderId),
      cashfree.PGOrderFetchPayments(orderId).catch(() => ({ data: [] })),
    ]);

    const paid = isPaymentSuccess(orderRes?.data, paymentsRes?.data);
    if (!paid) {
      const status = String(orderRes?.data?.order_status || 'PENDING').toUpperCase();
      if (status === 'EXPIRED' || status === 'TERMINATED' || status === 'CANCELLED') {
        order.paymentStatus = 'Failed';
        await order.save();
      }
      return res.status(402).json({
        message: 'Payment is not completed yet.',
        status: orderRes?.data?.order_status || 'PENDING',
        order,
      });
    }

    order.paymentStatus = 'Paid';
    order.orderStatus = order.orderStatus === 'Pending' ? 'Processing' : order.orderStatus;
    order.paymentMethod = 'Cashfree';
    await order.save();

    await Customer.findOneAndUpdate(
      { email: order.customerEmail },
      {
        $set: {
          name: order.customerName,
          phone: order.customerPhone || '',
          address: order.shippingAddress,
          status: 'Active',
        },
        $inc: { ordersCount: 1, totalSpent: order.totalAmount },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ status: 'Paid', order });
  } catch (error) {
    const cfMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Could not verify Cashfree payment.';
    res.status(502).json({ message: cfMessage });
  }
};
