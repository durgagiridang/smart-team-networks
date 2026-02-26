/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express');
const router = express.Router();
const Merchant = require('../models/Merchant');

// Get all merchants
router.get('/', async (req, res) => {
  try {
    const merchants = await Merchant.find();
    res.json({
      success: true,
      merchants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get merchants by category
router.get('/category/:category', async (req, res) => {
  try {
    const merchants = await Merchant.find({ 
      category: new RegExp(req.params.category, 'i') 
    });
    res.json({
      success: true,
      merchants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single merchant
router.get('/:id', async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id);
    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }
    res.json({
      success: true,
      merchant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;