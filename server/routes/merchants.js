const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Merchant Schema
const merchantSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  createdAt: { type: Date, default: Date.now }
});

const Merchant = mongoose.model('Merchant', merchantSchema);

// GET all merchants
router.get('/', async (req, res) => {
  try {
    const merchants = await Merchant.find();
    res.json(merchants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new merchant
router.post('/', async (req, res) => {
  try {
    const merchant = new Merchant(req.body);
    await merchant.save();
    res.status(201).json(merchant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;