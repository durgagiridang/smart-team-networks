const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  business_name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  city: {
    type: String,
    default: 'Tulsipur'
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  address: {
    type: String
  },
  cctv_url: {
    type: String,
    default: ''
  },
  isLive: {
    type: Boolean,
    default: false
  },
  viewerCount: {
    type: Number,
    default: 0
  },
  owner_name: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Merchant', merchantSchema);