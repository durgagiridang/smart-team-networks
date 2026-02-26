/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require('mongoose');
const Merchant = require('./models/Merchant');

async function seedMerchants() {
  try {
    await mongoose.connect('mongodb+srv://smart-team:stn-nepal123@cluster0.4kapzvk.mongodb.net/smart-team-networks');
    console.log('✅ MongoDB Connected');

    // Delete old merchants
    await Merchant.deleteMany({});
    console.log('🗑️ Old merchants deleted');

    // Create merchants
    const merchants = await Merchant.insertMany([
      {
        business_name: 'Tulsipur Momo Center',
        category: 'Restaurant',
        status: 'active',
        email: 'momo@test.com',
        phone: '9801234567',
        address: 'Tulsipur, Dang',
        cctv_url: 'https://www.youtube.com/embed/live_stream?channel=UC_x5XG1OV2P6uZZ5FSM9Ttw',
        isLive: true
      },
      {
        business_name: 'Dang Hotel & Lodge',
        category: 'Hotel',
        status: 'active',
        email: 'hotel@test.com',
        phone: '9809876543',
        address: 'Tulsipur, Dang',
        cctv_url: null,
        isLive: false
      },
      {
        business_name: 'Fast Delivery Rider',
        category: 'Rider',
        status: 'active',
        email: 'rider@test.com',
        phone: '9811111111',
        address: 'Tulsipur, Dang',
        cctv_url: null,
        isLive: true
      },
      {
        business_name: 'City Fashion Boutique',
        category: 'Fashion',
        status: 'active',
        email: 'fashion@test.com',
        phone: '9822222222',
        address: 'Tulsipur, Dang',
        cctv_url: null,
        isLive: false
      }
    ]);

    console.log('✅', merchants.length, 'merchants created!');
    console.log('🏪 Merchants:');
    merchants.forEach(m => console.log('  -', m.business_name, '-', m.category));

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seedMerchants();