const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create Order
router.post('/', async (req, res) => {
  try {
    const { userId, items, total, address, paymentMethod } = req.body;

    const order = new Order({
      userId,
      items,
      total,
      address,
      paymentMethod: paymentMethod || 'cod',
      status: 'pending',
      createdAt: new Date()
    });

    await order.save();

    res.json({
      success: true,
      message: 'Order placed successfully',
      orderId: order._id
    });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get User Orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;