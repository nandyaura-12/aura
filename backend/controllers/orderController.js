import Order from '../models/Order.js';
import Customer from '../models/Customer.js';

// @desc    Get all orders
// @route   GET /api/orders
export const getOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.orderStatus = status;
    }
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const paymentLabels = {
  card: 'Credit Card',
  upi: 'UPI',
  paypal: 'PayPal',
};

// @desc    Create an order from checkout
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone = '',
      items,
      totalAmount,
      paymentMethod,
      shippingAddress,
    } = req.body;

    const email = String(customerEmail || '').trim().toLowerCase();
    const name = String(customerName || '').trim();
    const address = String(shippingAddress || '').trim();
    const amount = Number(totalAmount);

    if (!name || !email || !address || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order is missing a customer, address, or items.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Enter a valid email for this order.' });
    }
    if (!Number.isFinite(amount) || amount < 0) {
      return res.status(400).json({ message: 'Order total is invalid.' });
    }

    const normalizedItems = items.map((item) => ({
      productId: String(item.productId || item.id || ''),
      productName: String(item.productName || item.title || '').trim(),
      quantity: Number(item.quantity ?? item.qty),
      price: Number(item.price ?? item.unitPrice),
      image: item.image || '',
    }));

    if (normalizedItems.some((item) => !item.productName || !(item.quantity >= 1) || !Number.isFinite(item.price))) {
      return res.status(400).json({ message: 'Each item needs a name, quantity, and price.' });
    }

    const method = paymentLabels[paymentMethod] || paymentMethod || 'Credit Card';
    let order;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        order = await Order.create({
          orderId: `NA-${Math.floor(10000 + Math.random() * 90000)}`,
          customerName: name,
          customerEmail: email,
          customerPhone: String(customerPhone || '').trim(),
          items: normalizedItems,
          totalAmount: amount,
          paymentStatus: 'Paid',
          orderStatus: 'Pending',
          paymentMethod: method,
          shippingAddress: address,
        });
        break;
      } catch (error) {
        if (error.code !== 11000 || attempt === 2) throw error;
      }
    }

    await Customer.findOneAndUpdate(
      { email },
      {
        $set: {
          name,
          phone: String(customerPhone || '').trim(),
          address,
          status: 'Active',
        },
        $inc: { ordersCount: 1, totalSpent: amount },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await order.deleteOne();
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
