const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// १. Socket.io सेटअप
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on("connection", (socket) => {
  console.log("📡 Client connected to STN Channel:", socket.id);
});

// २. MongoDB जडान
const MONGODB_URI = "mongodb+srv://channelstn97_db_user:durgaprasadgiri@cluster0.vot2ymv.mongodb.net/SmartTeamNetworks";
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ STN DATABASE CONNECTED"))
  .catch(err => console.error("❌ DB CONNECTION ERROR:", err));

// ३. Middleware (यो Static Paths भन्दा माथि हुनुपर्छ)
app.use(cors({ origin: "*", methods: ["GET", "POST", "DELETE"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ४. Static Paths सेटअप (भिडियो र फोटोका लागि)
const uploadDir = path.join(__dirname, 'uploads/products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// महत्वपूर्ण: भिडियोका टुक्राहरू (.ts) फेला पार्न यो फोल्डरलाई Root पहुँच दिने
app.use(express.static(path.join(__dirname, 'media/live/test')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ५. भिडियो रुट (Auto-Finder)
app.get('/test-video', (req, res) => {
  const directoryPath = path.join(__dirname, 'media', 'live', 'test');
  
  fs.readdir(directoryPath, (err, files) => {
    if (err) return res.status(500).send("फोल्डर फेला परेन।");

    const m3u8Files = files.filter(f => f.endsWith('.m3u8'))
                           .map(f => ({ name: f, time: fs.statSync(path.join(directoryPath, f)).mtime.getTime() }))
                           .sort((a, b) => b.time - a.time);

    if (m3u8Files.length > 0) {
      const latestFile = path.join(directoryPath, m3u8Files[0].name);
      console.log("📺 Serving latest stream:", m3u8Files[0].name);
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.sendFile(latestFile);
    } else {
      res.status(404).send("कुनै पनि .m3u8 फाइल छैन।");
    }
  });
});

// ६. Multer सेटअप
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, uploadDir); },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ७. Schemas
const UserSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  gender: String,
  role: { type: String, enum: ['user', 'merchant', 'rider', 'admin'], default: 'user' },
  business_details: {
    business_name: String, category: String, city: String,
    cctv_url: String, is_verified: { type: Boolean, default: false }
  },
  created_at: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

const ProductSchema = new mongoose.Schema({
  merchant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  size: String,
  image_url: String,
  description: String,
  created_at: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', ProductSchema);

// ८. API ROUTES
app.get('/api/merchants_list', async (req, res) => {
  try {
    const merchants = await User.find({ role: 'merchant' }).select('-password');
    res.json(merchants);
  } catch (error) { res.status(500).json({ error: "मर्चेन्ट लिस्ट लोड भएन।" }); }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password, phone, gender, role, businessName, city } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      full_name: fullName, email: email.toLowerCase(), password: hashedPassword, phone, gender, role,
      business_details: { business_name: businessName, city: city }
    });
    await newUser.save();
    res.json({ success: true, message: "दर्ता सफल भयो!" });
  } catch (error) { res.status(500).json({ error: "दर्ता असफल।" }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "गलत विवरण।" });
    }
    res.json({ success: true, user: { id: user._id, fullName: user.full_name, role: user.role } });
  } catch (error) { res.status(500).json({ error: "सर्भर एरर।" }); }
});

app.post('/api/products/add', upload.single('image'), async (req, res) => {
  try {
    const { merchant_id, name, price, size, description } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: "फोटो चाहियो!" });
    const image_url = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
    const newProduct = new Product({ merchant_id, name, price: Number(price), size, image_url, description });
    await newProduct.save();
    res.json({ success: true, message: "सामान थपियो!", product: newProduct });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.get('/api/products/:merchantId', async (req, res) => {
  try {
    const products = await Product.find({ merchant_id: req.params.merchantId }).sort({ created_at: -1 });
    res.json(products);
  } catch (error) { res.status(500).json({ error: "लोड भएन।" }); }
});

app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) { res.status(500).json({ error: "User not found" }); }
});

app.delete('/api/products/delete/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product && product.image_url) {
      const filename = product.image_url.split('/').pop();
      const filepath = path.join(__dirname, 'uploads/products', filename);
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "सामान हटाइयो!" });
  } catch (error) { res.status(500).json({ success: false }); }
});

// ९. सर्भर सुचारु
const PORT = 8000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 STN BACKEND RUNNING ON PORT ${PORT}`);
});