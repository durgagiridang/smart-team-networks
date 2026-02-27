/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require('mongoose');
const path = require('path');

// ✅ सही path
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function seed() {
  try {
    // MongoDB जडान
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://smart-team:stn-nepal123@cluster0.4kapzvk.mongodb.net/smart-team-networks';
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Models लोड गर्ने
    const Product = require('./models/Product');
    const Merchant = require('./models/Merchant');

    // सबैभन्दा पहिलो merchant खोज्ने
    const merchant = await Merchant.findOne();
    
    if (!merchant) {
      console.log('❌ कुनै पसल छैन। पहिले पसल बनाउनुहोस्।');
      process.exit(1);
    }

    console.log('🎯 पसल फेला पर्यो:', merchant.business_name, '-', merchant._id);

    // पुराना उत्पादनहरू हटाउने
    await Product.deleteMany({ vendorId: merchant._id.toString() });
    console.log('🗑️ पुराना उत्पादनहरू हटाइयो');

    // नयाँ उत्पादनहरू बनाउने
    const products = await Product.insertMany([
      {
        vendorId: merchant._id.toString(),
        name: 'चिकन मोमो',
        price: 150,
        quantity: 50,
        category: 'Food',
        image: '🥟',
        status: 'active',
        description: 'ताजा चिकन मोमो'
      },
      {
        vendorId: merchant._id.toString(),
        name: 'भेज चाउमिन',
        price: 120,
        quantity: 30,
        category: 'Food',
        image: '🍜',
        status: 'active'
      },
      {
        vendorId: merchant._id.toString(),
        name: 'पिज्जा',
        price: 450,
        quantity: 15,
        category: 'Food',
        image: '🍕',
        status: 'active'
      },
      {
        vendorId: merchant._id.toString(),
        name: 'बर्गर',
        price: 250,
        quantity: 20,
        category: 'Food',
        image: '🍔',
        status: 'active'
      },
      {
        vendorId: merchant._id.toString(),
        name: 'कोल्ड ड्रिंक',
        price: 80,
        quantity: 100,
        category: 'Beverage',
        image: '🥤',
        status: 'active'
      }
    ]);

    console.log('✅', products.length, 'उत्पादनहरू सफलतापूर्वक बनाइयो!');
    console.log('📝 उत्पादनहरू:');
    products.forEach(p => console.log('  -', p.name, 'रु.', p.price));

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seed();