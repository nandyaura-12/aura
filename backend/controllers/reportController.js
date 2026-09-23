import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Get custom date range and product-wise reports
// @route   GET /api/reports
export const getReports = async (req, res) => {
  try {
    const { startDate, endDate, productId } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.createdAt = { $gte: start, $lte: end };
    }

    // Fetch orders matching date filter
    const orders = await Order.find(dateFilter).sort({ createdAt: -1 });

    // Calculate aggregated metrics
    let totalRevenue = 0;
    let totalOrders = orders.length;
    let totalUnitsSold = 0;

    const salesByDateMap = {};
    const productSalesMap = {};
    const categorySalesMap = {};

    orders.forEach((order) => {
      // Date formatting for trend chart
      const dateKey = new Date(order.createdAt).toISOString().split('T')[0];
      if (!salesByDateMap[dateKey]) {
        salesByDateMap[dateKey] = { date: dateKey, revenue: 0, ordersCount: 0, units: 0 };
      }

      order.items.forEach((item) => {
        // Filter by specific product if selected
        if (productId && productId !== 'All' && item.productId !== productId && item.productName !== productId) {
          return;
        }

        const itemTotal = item.price * item.quantity;
        totalRevenue += itemTotal;
        totalUnitsSold += item.quantity;

        salesByDateMap[dateKey].revenue += itemTotal;
        salesByDateMap[dateKey].units += item.quantity;

        // Product stats
        const pName = item.productName || 'Unknown Product';
        if (!productSalesMap[pName]) {
          productSalesMap[pName] = { name: pName, revenue: 0, units: 0, orders: 0 };
        }
        productSalesMap[pName].revenue += itemTotal;
        productSalesMap[pName].units += item.quantity;
        productSalesMap[pName].orders += 1;
      });

      salesByDateMap[dateKey].ordersCount += 1;
    });

    // Prepare chart format data
    const salesTrend = Object.values(salesByDateMap).sort((a, b) => new Date(a.date) - new Date(b.date));
    const topProducts = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue);
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    res.json({
      summary: {
        totalRevenue,
        totalOrders,
        totalUnitsSold,
        avgOrderValue,
      },
      salesTrend,
      topProducts,
      matchingOrdersCount: orders.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
