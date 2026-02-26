const mongoose = require('mongoose');  // यो line थप्नुहोस्!

const visitorSchema = new mongoose.Schema({
  vendorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Merchant', 
    required: true,
    index: true 
  },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  socketId: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
  leftAt: { type: Date },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Visitor', visitorSchema);