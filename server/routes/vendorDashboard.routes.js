// server/routes/vendorDashboard.routes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../../src/models/Order.model');
const Product = require('../../src/models/Product.model');
const Merchant = require('../../src/models/Merchant.model');

// GET /api/vendor/dashboard/stats
router.get('/stats/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;
    const today = new Date();
    const startOfDay = new Date(today.setHours(0,0,0,0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalOrders,
      todayOrders,
      totalRevenue,
      monthlyRevenue,
      totalProducts,
      activeProducts,
      recentOrders
    ] = await Promise.all([
      Order.countDocuments({ vendor: vendorId }),
      Order.countDocuments({ vendor: vendorId, createdAt: { $gte: startOfDay } }),
      Order.aggregate([
        { $match: { vendor: new mongoose.Types.ObjectId(vendorId), status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.aggregate([
        { $match: { 
          vendor: new mongoose.Types.ObjectId(vendorId), 
          status: 'completed',
          createdAt: { $gte: startOfMonth }
        }},
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Product.countDocuments({ vendor: vendorId }),
      Product.countDocuments({ vendor: vendorId, status: 'active' }),
      Order.find({ vendor: vendorId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('customer', 'name phone')
        .lean()
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalOrders,
          todayOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          monthlyRevenue: monthlyRevenue[0]?.total || 0,
          totalProducts,
          activeProducts
        },
        recentOrders: recentOrders.map(order => ({
          id: order._id,
          customer: order.customer?.name || 'Unknown',
          amount: order.totalAmount,
          status: order.status,
          date: order.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/vendor/dashboard/chart
router.get('/chart/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { range = 'week' } = req.query; // week, month, year
    
    let startDate = new Date();
    let groupFormat = '%Y-%m-%d';
    
    if (range === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (range === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
      groupFormat = '%Y-%m-%d';
    } else if (range === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
      groupFormat = '%Y-%m';
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          vendor: new mongoose.Types.ObjectId(vendorId),
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: salesData.map(item => ({
        date: item._id,
        sales: item.sales,
        orders: item.orders
      }))
    });
  } catch (error) {
    console.error('Chart data error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;