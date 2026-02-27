const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    address: {
      type: String,
      default: ''
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['customer', 'vendor', 'rider', 'admin'],
    default: 'customer'
  },
  otp: {
    code: String,
    expiresAt: Date
  }
}, {
  timestamps: true
});

userSchema.index({ location: '2dsphere' });

// ✅ यहीँ सम्म मात्र! तल केही नलेख्नुहोस्
module.exports = mongoose.model('User', userSchema);