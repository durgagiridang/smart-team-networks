// src/models/Order.model.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant',
    required: true,
    index: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  customerName: {
    type: String,
    default: 'Walk-in Customer'
  },
  customerPhone: {
    type: String,
    default: ''
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'ready', 'out_for_delivery', 'completed', 'cancelled', 'refunded'],
    default: 'pending',
    index: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online', 'wallet'],
    default: 'cash'
  },
  deliveryAddress: {
    street: String,
    city: String,
    landmark: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  notes: String,
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  assignedRider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rider'
  }
}, {
  timestamps: true
});

// Indexes for performance
orderSchema.index({ vendor: 1, status: 1 });
orderSchema.index({ vendor: 1, createdAt: -1 });
orderSchema.index({ customer: 1 });

module.exports = mongoose.model('Order', orderSchema);