// src/models/Product.model.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  subcategory: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  comparePrice: {
    type: Number,
    default: 0
  },
  costPrice: {
    type: Number,
    default: 0
  },
  images: [{
    url: String,
    alt: String
  }],
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  barcode: String,
  inventory: {
    quantity: {
      type: Number,
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 5
    },
    trackInventory: {
      type: Boolean,
      default: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock', 'draft'],
    default: 'active',
    index: true
  },
  attributes: [{
    name: String,
    value: String
  }],
  variants: [{
    name: String,
    options: [{
      label: String,
      priceAdjustment: Number,
      quantity: Number
    }]
  }],
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['kg', 'g', 'lb', 'oz', 'l', 'ml']
    }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'm', 'in', 'ft']
    }
  },
  tags: [String],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  views: {
    type: Number,
    default: 0
  },
  sales: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Indexes
productSchema.index({ vendor: 1, status: 1 });
productSchema.index({ vendor: 1, category: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);