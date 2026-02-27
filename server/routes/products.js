const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get products by vendorId
router.get('/', async (req, res) => {
  try {
    const { vendorId } = req.query;
    
    if (!vendorId) {
      return res.status(400).json({
        success: false,
        message: 'vendorId is required'
      });
    }

    const products = await Product.find({ vendorId: vendorId });
    
    res.json({
      success: true,
      count: products.length,
      products: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;