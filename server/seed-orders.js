/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require('mongoose');
const Order = require('../src/models/Order.model');
const Merchant = require('../src/models/Merchant.model');
const Product = require('../src/models/Product.model');

async function seedOrders() {
  try {
    await mongoose.connect('mongodb+srv://smart-team:stn-nepal123@cluster0.4kapzvk.mongodb.net/smart-team-networks');
    console.log('✅ MongoDB Connected');
    
    const merchant = await Merchant.findOne({ email: 'test123@test.com' });
    const products = await Product.find({ vendor: merchant._id });
    
    console.log('🎯 Found', products.length, 'products');
    
    await Order.deleteMany({ vendor: merchant._id });
    
    // Get product IDs
    const momo = products.find(p => p.name.includes('मोमो'));
    const chowmein = products.find(p => p.name.includes('चाउमीन'));
    
    const orders = await Order.insertMany([
      {
        vendor: merchant._id,
        customerName: 'Ram Bahadur',
        customerPhone: '9801234567',
        customerEmail: 'ram@test.com',
        total: 300,
        subtotal: 300,
        tax: 0,
        deliveryFee: 0,
        status: 'completed',
        paymentStatus: 'paid',
        paymentMethod: 'cash',
        deliveryAddress: {
          street: 'Kathmandu',
          city: 'Kathmandu',
          phone: '9801234567'
        },
        items: [
          {
            product: momo._id,
            name: momo.name,
            quantity: 2,
            price: 150,
            total: 300
          }
        ],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        vendor: merchant._id,
        customerName: 'Sita Kumari',
        customerPhone: '9809876543',
        customerEmail: 'sita@test.com',
        total: 120,
        subtotal: 120,
        tax: 0,
        deliveryFee: 0,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'online',
        deliveryAddress: {
          street: 'Lalitpur',
          city: 'Lalitpur',
          phone: '9809876543'
        },
        items: [
          {
            product: chowmein._id,
            name: chowmein.name,
            quantity: 1,
            price: 120,
            total: 120
          }
        ],
        createdAt: new Date()
      },
      {
        vendor: merchant._id,
        customerName: 'Hari Prasad',
        customerPhone: '9811111111',
        customerEmail: 'hari@test.com',
        total: 570,
        subtotal: 570,
        tax: 0,
        deliveryFee: 0,
        status: 'processing',
        paymentStatus: 'paid',
        paymentMethod: 'cash',
        deliveryAddress: {
          street: 'Bhaktapur',
          city: 'Bhaktapur',
          phone: '9811111111'
        },
        items: [
          {
            product: products[2]._id, // Pizza
            name: products[2].name,
            quantity: 1,
            price: 450,
            total: 450
          },
          {
            product: products[3]._id, // Burger
            name: products[3].name,
            quantity: 1,
            price: 250,
            total: 250
          }
        ],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      }
    ]);
    
    console.log('✅', orders.length, 'orders created!');
    console.log('📦 Orders:');
    orders.forEach(o => console.log('  -', o.customerName, 'Rs.', o.total, '-', o.status));
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seedOrders();