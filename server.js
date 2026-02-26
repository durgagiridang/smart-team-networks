const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ 
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '10mb' }));

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://stn_admin:stn_12345@cluster0.vot2ymv.mongodb.net/stn_db?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Database Connected"))
  .catch(err => {
    console.error("DB Connection Failed:", err.message);
    process.exit(1);
  });

// User Schema
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  phone: { type: String, unique: true, required: true },
  role: { type: String, enum: ['user', 'merchant', 'rider', 'admin'], default: 'user' },
  businessName: { type: String },
  category: { type: String },
  city: { type: String },
  cctv_url: { type: String, default: "" },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Product Schema
const ProductSchema = new mongoose.Schema({
  merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', ProductSchema);

// Routes

// Get all merchants
app.get('/api/merchants_list', async (req, res) => {
  try {
    const merchants = await User.find({ role: 'merchant' }).select('-password');
    
    const formatted = merchants.map(m => ({
      _id: m._id,
      business_name: m.businessName || m.fullName || "Unnamed Shop",
      category: m.category || "General",
      city: m.city || "Not Set",
      phone: m.phone || "",
      cctv_url: m.cctv_url || "",
      status: m.status
    }));
    
    res.json(formatted);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: "Failed to load merchants" });
  }
});

// Get single merchant with products
app.get('/api/merchant/:id', async (req, res) => {
  try {
    const merchant = await User.findById(req.params.id).select('-password');
    if (!merchant) {
      return res.status(404).json({ error: "Merchant not found" });
    }
    
    const products = await Product.find({ merchantId: req.params.id, isAvailable: true });
    
    res.json({
      merchant: {
        _id: merchant._id,
        businessName: merchant.businessName,
        city: merchant.city,
        phone: merchant.phone
      },
      products: products
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load data" });
  }
});

// Auth Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, phone } = req.body;
    
    const query = email 
      ? { $or: [{ email }, { phone: email }] }
      : { phone };
    
    const user = await User.findOne(query);
    
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Wrong password" });
    }
    
    res.json({ 
      success: true, 
      user: { 
        id: user._id, 
        fullName: user.fullName, 
        role: user.role 
      } 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// Start Server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
