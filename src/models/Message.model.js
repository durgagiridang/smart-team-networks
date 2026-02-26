const mongoose = require('mongoose');  // यो line थप्नुहोस्!

const messageSchema = new mongoose.Schema({
  vendorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Merchant', 
    required: true,
    index: true 
  },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  senderAvatar: { type: String, default: '/default-avatar.png' },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['text', 'image', 'product'], 
    default: 'text' 
  },
  isVendor: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
});

messageSchema.index({ vendorId: 1, timestamp: -1 });

module.exports = mongoose.model('Message', messageSchema);