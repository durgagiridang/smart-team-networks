const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  // Basic fields
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  
  // Virtual Showroom को लागि नयाँ fields
  cctvUrl: { 
    type: String, 
    default: null 
  },
  cctvType: { 
    type: String, 
    enum: ['webrtc', 'hls', 'rtmp', 'none'], 
    default: 'none' 
  },
  isLive: { 
    type: Boolean, 
    default: false 
  },
  lastLiveAt: { 
    type: Date 
  },
  
  // Store hours
  storeHours: {
    monday: { open: String, close: String, isOpen: Boolean },
    tuesday: { open: String, close: String, isOpen: Boolean },
    wednesday: { open: String, close: String, isOpen: Boolean },
    thursday: { open: String, close: String, isOpen: Boolean },
    friday: { open: String, close: String, isOpen: Boolean },
    saturday: { open: String, close: String, isOpen: Boolean },
    sunday: { open: String, close: String, isOpen: Boolean }
  },
  
  // Social links
  socialLinks: {
    facebook: String,
    instagram: String,
    tiktok: String,
    youtube: String
  },
  
  // Contact
  whatsappNumber: {
    type: String
  },
  phoneNumber: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Merchant', merchantSchema);