const express = require('express');
const router = express.Router();
const { getShowroomStats } = require('../socket/showroom.socket');
const Message = require('../../src/models/Message.model');
const Visitor = require('../../src/models/Visitor.model');
const Merchant = require('../../src/models/Merchant.model');

// Get showroom status
router.get('/status/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;
    const stats = getShowroomStats(vendorId);
    
    const merchant = await Merchant.findById(vendorId).select('name cctvUrl isLive storeHours');
    
    res.json({
      success: true,
      data: {
        ...stats,
        merchant
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get chat history
router.get('/chat/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { limit = 50, before } = req.query;
    
    const query = { vendorId };
    if (before) {
      query.timestamp = { $lt: new Date(before) };
    }
    
    const messages = await Message.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .lean();
    
    res.json({
      success: true,
      data: messages.reverse()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get visitor analytics
router.get('/analytics/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { date = new Date() } = req.query;
    
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const [totalVisitors, activeVisitors, peakHours] = await Promise.all([
      Visitor.countDocuments({ vendorId, joinedAt: { $gte: startOfDay, $lte: endOfDay } }),
      Visitor.countDocuments({ vendorId, isActive: true }),
      Visitor.aggregate([
        { $match: { vendorId: mongoose.Types.ObjectId(vendorId), joinedAt: { $gte: startOfDay, $lte: endOfDay } } },
        { $group: { _id: { $hour: '$joinedAt' }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);
    
    res.json({
      success: true,
      data: {
        totalVisitors,
        activeVisitors,
        peakHours
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update CCTV settings
router.put('/cctv/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { cctvUrl, cctvType } = req.body;
    
    const merchant = await Merchant.findByIdAndUpdate(
      vendorId,
      { cctvUrl, cctvType },
      { new: true }
    );
    
    res.json({
      success: true,
      data: merchant
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;