/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express');
const router = express.Router();
const Merchant = require('../models/Merchant');

// सबै merchants get गर्ने
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    
    const merchants = await Merchant.find(query);
    res.json(merchants);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Single merchant get गर्ने - यो थप्नुहोस्!
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