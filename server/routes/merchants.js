const express = require('express');
const router = express.Router();
const Merchant = require('../models/Merchant');

// Register new merchant (from StoreBuilder)
router.post('/register', async (req, res) => {
  try {
    const {
      businessName,
      ownerName,
      phone,
      category,
      address,
      city,
      cctvLink,
      bannerImage,
      qrImage,
      bankDetails
    } = req.body;

    // Validation
    if (!businessName || !ownerName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'आवश्यक फिल्डहरू भरनुहोस्'
      });
    }

    // Create merchant
    const merchant = new Merchant({
      businessName,
      ownerName,
      phone,
      category,
      address,
      city,
      cctvLink,
      bannerImage,
      qrImage,
      bankDetails
    });

    await merchant.save();

    res.status(201).json({
      success: true,
      message: 'पसल सफलतापूर्वक दर्ता भयो',
      storeId: merchant._id,
      merchant: merchant
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'सर्भरमा समस्या भयो'
    });
  }
});

// Get merchant by ID (for StorePage)
router.get('/:id', async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id);
    
    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'पसल फेला परेन'
      });
    }

    res.json({
      success: true,
      merchant: {
        _id: merchant._id,
        business_name: merchant.businessName,
        businessName: merchant.businessName,
        ownerName: merchant.ownerName,
        phone: merchant.phone,
        category: merchant.category,
        address: merchant.address,
        city: merchant.city,
        cctv_url: merchant.cctvLink, // YouTube Live Link
        bannerImage: merchant.bannerImage,
        qrImage: merchant.qrImage,
        bankDetails: merchant.bankDetails,
        isLive: merchant.isLive,
        isActive: merchant.isActive
      }
    });

  } catch (error) {
    console.error('Get merchant error:', error);
    res.status(500).json({
      success: false,
      message: 'सर्भरमा समस्या भयो'
    });
  }
});

// Get all merchants
router.get('/', async (req, res) => {
  try {
    const merchants = await Merchant.find({ isActive: true });
    res.json({
      success: true,
      merchants: merchants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'सर्भरमा समस्या भयो'
    });
  }
});

module.exports = router;