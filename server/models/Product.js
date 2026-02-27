const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendorId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    default: 'Food'
  },
  image: {
    type: String,
    default: '📦'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);