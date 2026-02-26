/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express');
const router = express.Router();
const Merchant = require('../models/Merchant');

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category: new RegExp(category, 'i') } : {};
    const vendors = await Merchant.find(query);
    
    res.json({
      success: true,
      vendors
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single vendor
router.get('/:id', async (req, res) => {
  try {
    const vendor = await Merchant.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    res.json({
      success: true,
      vendor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;