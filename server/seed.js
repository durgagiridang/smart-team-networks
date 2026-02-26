/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require('mongoose');
const Product = require('../src/models/Product.model');
const Merchant = require('../src/models/Merchant.model');

async function seed() {
  try {
    await mongoose.connect('mongodb+srv://smart-team:stn-nepal123@cluster0.4kapzvk.mongodb.net/smart-team-networks');
    console.log('✅ MongoDB Connected');

    // Find the auto-created merchant
    const merchant = await Merchant.findOne({ email: 'test123@test.com' });
    
    if (!merchant) {
      console.log('❌ Merchant not found');
      process.exit(1);
    }

    console.log('🎯 Found merchant:', merchant._id);

    // Delete old products
    await Product.deleteMany({ vendor: merchant._id });
    console.log('🗑️ Old products deleted');

    // Create products
    const products = await Product.insertMany([
      {
        vendor: merchant._id,
        name: 'मोमो (Momo)',
        price: 150,
        inventory: { quantity: 50 },
        category: 'Food',
        status: 'active',
        description: 'Delicious steamed momo'
      },
      {
        vendor: merchant._id,
        name: 'चाउमीन (Chowmein)',
        price: 120,
        inventory: { quantity: 30 },
        category: 'Food',
        status: 'active'
      },
      {
        vendor: merchant._id,
        name: 'पिज्जा (Pizza)',
        price: 450,
        inventory: { quantity: 15 },
        category: 'Food',
        status: 'active'
      },
      {
        vendor: merchant._id,
        name: 'बर्गर (Burger)',
        price: 250,
        inventory: { quantity: 20 },
        category: 'Food',
        status: 'active'
      }
    ]);

    console.log('✅', products.length, 'products created successfully!');
    console.log('📝 Products:');
    products.forEach(p => console.log('  -', p.name, 'Rs.', p.price));

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seed();