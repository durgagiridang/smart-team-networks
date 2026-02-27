const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  // Basic Info
  businessName: { type: String, required: true },
  ownerName: { type: String, required: true },
  phone: { type: String, required: true },
  category: { type: String, required: true },
  address: { type: String },
  city: { type: String, default: 'तुलसिपुर' },
  
  // Visuals
  cctvLink: { type: String }, // YouTube Live URL
  bannerImage: { type: String },
  
  // Payment
  qrImage: { type: String },
  bankDetails: { type: String },
  
  // Status
  isLive: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Merchant', merchantSchema);