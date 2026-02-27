/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://192.168.1.65:3001"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://192.168.1.65:3001"],
  credentials: true
}));
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://smart-team:stn-nepal123@cluster0.4kapzvk.mongodb.net/smart-team-networks?retryWrites=true&w=majority';

console.log('🔗 Connecting to:', MONGODB_URI ? 'URI found' : 'URI NOT found!');

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const merchantRoutes = require('./routes/merchants');
const orderRoutes = require('./routes/orders');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/merchants', merchantRoutes);
app.use('/api/vendors', merchantRoutes);
app.use('/api/orders', orderRoutes);

const activeVisitors = new Map();

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);
  
  socket.on('visitor:join', (data) => {
    console.log('👤 Visitor joined:', data);
    const { vendorId, userId, userName } = data;
    
    socket.join(`vendor:${vendorId}`);
    
    activeVisitors.set(socket.id, {
      vendorId,
      userId,
      userName,
      socketId: socket.id
    });
    
    io.to(`vendor:${vendorId}`).emit('visitor:joined', {
      userId,
      userName,
      timestamp: new Date().toISOString()
    });
    
    const visitorCount = Array.from(activeVisitors.values())
      .filter(v => v.vendorId === vendorId).length;
    io.to(`vendor:${vendorId}`).emit('visitor:count', { count: visitorCount });
  });
  
  socket.on('chat:message', (data) => {
    console.log('💬 Message received:', data);
    const { vendorId, message, type, senderName } = data;
    
    io.to(`vendor:${vendorId}`).emit('chat:new-message', {
      message,
      senderName,
      type: type || 'text',
      timestamp: new Date().toISOString(),
      isVendor: false
    });
  });
  
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
    
    const visitor = activeVisitors.get(socket.id);
    if (visitor) {
      const { vendorId } = visitor;
      activeVisitors.delete(socket.id);
      
      const visitorCount = Array.from(activeVisitors.values())
        .filter(v => v.vendorId === vendorId).length;
      io.to(`vendor:${vendorId}`).emit('visitor:count', { count: visitorCount });
    }
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'STN Server Running',
    socket: 'Socket.IO Active',
    visitors: activeVisitors.size
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO ready on ws://localhost:${PORT}`);
});