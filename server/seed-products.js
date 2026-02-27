/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Merchant = require('./models/Merchant');

async function seedProducts() {
  try {
    await mongoose.connect('mongodb+srv://smart-team:stn-nepal123@cluster0.4kapzvk.mongodb.net/smart-team-networks');
    console.log('✅ MongoDB Connected');

    // Find Tulsipur Momo Center
    const merchant = await Merchant.findOne({ business_name: 'Tulsipur Momo Center' });
    
    if (!merchant) {
      console.log('❌ Merchant not found! Run seed-merchants.js first');
      process.exit(1);
    }

    console.log('🎯 Found merchant:', merchant.business_name);

    // Delete old products
    await Product.deleteMany({ vendorId: merchant._id.toString() });
    console.log('🗑️ Old products deleted');

    // Create products - vendorId प्रयोग गर्ने
    const products = await Product.insertMany([
      {
        vendorId: merchant._id.toString(), // ✅ vendor को साटो vendorId
        name: 'Chicken Momo (10 pcs)',
        price: 150,
        quantity: 50,
        category: 'Momo',
        status: 'active',
        description: 'Delicious steamed chicken momo with special sauce'
      },
      {
        vendorId: merchant._id.toString(),
        name: 'Buff Momo (10 pcs)',
        price: 140,
        quantity: 40,
        category: 'Momo',
        status: 'active',
        description: 'Traditional buff momo'
      },
      {
        vendorId: merchant._id.toString(),
        name: 'Veg Momo (10 pcs)',
        price: 120,
        quantity: 30,
        category: 'Momo',
        status: 'active',
        description: 'Fresh vegetable momo'
      },
      {
        vendorId: merchant._id.toString(),
        name: 'Fried Momo',
        price: 180,
        quantity: 25,
        category: 'Momo',
        status: 'active',
        description: 'Crispy fried momo'
      },
      {
        vendorId: merchant._id.toString(),
        name: 'Chowmein',
        price: 130,
        quantity: 35,
        category: 'Noodles',
        status: 'active',
        description: 'Hakka noodles with vegetables'
      }
    ]);

    console.log('✅', products.length, 'products created!');
    console.log('🛍️ Products:');
    products.forEach(p => console.log('  -', p.name, 'Rs.', p.price));

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seedProducts();