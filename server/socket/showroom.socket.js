/* eslint-disable @typescript-eslint/no-require-imports */
const { Server } = require('socket.io');
const Merchant = require('../../src/models/Merchant.model');
const Message = require('../../src/models/Message.model');
const Visitor = require('../../src/models/Visitor.model');

let io;

// Active showrooms और visitors track गर्ने
const activeShowrooms = new Map(); // vendorId -> { socketId, viewers: Set }
const visitorSessions = new Map(); // socketId -> { vendorId, userId, joinedAt }

const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket) => {
    console.log(`🔗 नयाँ जडान: ${socket.id}`);

    // ==================== VENDOR SHOWROOM MANAGEMENT ====================
    
    // Vendor ले आफ्नो showroom live गर्दा
    socket.on('vendor:join-showroom', async (data) => {
      const { vendorId, vendorName, cctvUrl } = data;
      
      try {
        // Merchant model मा cctv_url update गर्ने
        await Merchant.findByIdAndUpdate(vendorId, {
          cctvUrl: cctvUrl,
          isLive: true,
          lastLiveAt: new Date()
        });

        activeShowrooms.set(vendorId, {
          socketId: socket.id,
          vendorName,
          cctvUrl,
          viewers: new Set(),
          startedAt: new Date()
        });

        socket.join(`showroom:${vendorId}`);
        socket.vendorId = vendorId;
        
        console.log(`🎥 Vendor ${vendorName} को Showroom Live भयो`);
        
        // सबैलाई notification पठाउने
        io.emit('showroom:live', {
          vendorId,
          vendorName,
          viewerCount: 0
        });

      } catch (error) {
        console.error('Vendor join error:', error);
        socket.emit('error', { message: 'Showroom सुरु गर्न सकिएन' });
      }
    });

    // ==================== VISITOR MANAGEMENT ====================
    
    // Customer ले showroom हेर्न थाल्दा
    socket.on('visitor:join', async (data) => {
      const { vendorId, userId, userName, avatar } = data;
      
      try {
        const showroom = activeShowrooms.get(vendorId);
        
        if (!showroom) {
          socket.emit('showroom:offline', { message: 'यो पसल अहिले बन्द छ' });
          return;
        }

        // Visitor record बनाउने
        const visitorData = {
          socketId: socket.id,
          userId: userId || `guest_${socket.id}`,
          userName: userName || 'अतिथि',
          avatar: avatar || '/default-avatar.png',
          joinedAt: new Date(),
          vendorId
        };

        visitorSessions.set(socket.id, visitorData);
        showroom.viewers.add(socket.id);
        
        // Room मा join गर्ने
        socket.join(`showroom:${vendorId}`);
        socket.currentVendorId = vendorId;

        // Database मा visitor log गर्ने
        await Visitor.create({
          vendorId,
          userId: visitorData.userId,
          userName: visitorData.userName,
          socketId: socket.id,
          joinedAt: new Date(),
          isActive: true
        });

        // Vendor लाई नयाँ visitor को जानकारी
        io.to(`showroom:${vendorId}`).emit('visitor:joined', {
          viewerCount: showroom.viewers.size,
          visitor: {
            id: socket.id,
            name: visitorData.userName,
            avatar: visitorData.avatar,
            joinedAt: visitorData.joinedAt
          }
        });

        // अरु visitors को सूची नयाँ visitor लाई पठाउने
        const otherVisitors = Array.from(showroom.viewers)
          .filter(id => id !== socket.id)
          .map(id => {
            const v = visitorSessions.get(id);
            return v ? { id, name: v.userName, avatar: v.avatar } : null;
          })
          .filter(Boolean);

        socket.emit('visitor:list', {
          viewers: otherVisitors,
          count: showroom.viewers.size
        });

        console.log(`👤 ${visitorData.userName} ले ${showroom.vendorName} को showroom हेर्न थाले`);

      } catch (error) {
        console.error('Visitor join error:', error);
      }
    });

    // ==================== LIVE CHAT SYSTEM ====================
    
    // नयाँ message आउँदा
    socket.on('chat:message', async (data) => {
      const { vendorId, message, type = 'text' } = data;
      const visitor = visitorSessions.get(socket.id);
      
      if (!visitor) return;

      try {
        // Database मा message save गर्ने
        const newMessage = await Message.create({
          vendorId,
          senderId: visitor.userId,
          senderName: visitor.userName,
          senderAvatar: visitor.avatar,
          message,
          type,
          timestamp: new Date(),
          isVendor: false
        });

        // सबैलाई message broadcast गर्ने
        io.to(`showroom:${vendorId}`).emit('chat:new-message', {
          id: newMessage._id,
          senderId: visitor.userId,
          senderName: visitor.userName,
          senderAvatar: visitor.avatar,
          message,
          type,
          timestamp: newMessage.timestamp,
          isVendor: false
        });

      } catch (error) {
        console.error('Chat message error:', error);
      }
    });

    // Vendor ले reply गर्दा
    socket.on('chat:vendor-reply', async (data) => {
      const { vendorId, message, toSocketId } = data;
      
      if (socket.vendorId !== vendorId) {
        socket.emit('error', { message: 'अनुमति छैन' });
        return;
      }

      try {
        const newMessage = await Message.create({
          vendorId,
          senderId: vendorId,
          senderName: 'पसल मालिक',
          senderAvatar: '/vendor-avatar.png',
          message,
          type: 'text',
          timestamp: new Date(),
          isVendor: true
        });

        // Specific visitor लाई वा सबैलाई पठाउने
        if (toSocketId) {
          io.to(toSocketId).emit('chat:vendor-message', {
            id: newMessage._id,
            message,
            timestamp: newMessage.timestamp,
            isVendor: true
          });
        } else {
          io.to(`showroom:${vendorId}`).emit('chat:new-message', {
            id: newMessage._id,
            senderId: vendorId,
            senderName: 'पसल मालिक',
            senderAvatar: '/vendor-avatar.png',
            message,
            type: 'text',
            timestamp: newMessage.timestamp,
            isVendor: true
          });
        }

      } catch (error) {
        console.error('Vendor reply error:', error);
      }
    });

    // Typing indicator
    socket.on('chat:typing', (data) => {
      const { vendorId, isTyping } = data;
      const visitor = visitorSessions.get(socket.id);
      
      if (visitor) {
        socket.to(`showroom:${vendorId}`).emit('chat:typing', {
          userId: visitor.userId,
          userName: visitor.userName,
          isTyping
        });
      }
    });

    // ==================== CCTV STREAM SIGNALING ====================
    
    // WebRTC signaling (CCTV stream को लागि)
    socket.on('cctv:offer', (data) => {
      const { vendorId, offer } = data;
      // Vendor को offer सबै visitors लाई पठाउने
      socket.to(`showroom:${vendorId}`).emit('cctv:offer', {
        offer,
        vendorId
      });
    });

    socket.on('cctv:answer', (data) => {
      const { vendorId, answer } = data;
      // Visitor को answer vendor लाई पठाउने
      const showroom = activeShowrooms.get(vendorId);
      if (showroom) {
        io.to(showroom.socketId).emit('cctv:answer', {
          answer,
          socketId: socket.id
        });
      }
    });

    socket.on('cctv:ice-candidate', (data) => {
      const { vendorId, candidate, to } = data;
      if (to) {
        io.to(to).emit('cctv:ice-candidate', { candidate, from: socket.id });
      } else {
        socket.to(`showroom:${vendorId}`).emit('cctv:ice-candidate', {
          candidate,
          from: socket.id
        });
      }
    });

    // ==================== PRODUCT INTERACTIONS ====================
    
    // Product quick view
    socket.on('product:view', (data) => {
      const { vendorId, productId, productName } = data;
      const visitor = visitorSessions.get(socket.id);
      
      if (visitor) {
        // Vendor लाई notification
        io.to(`showroom:${vendorId}`).emit('product:viewing', {
          productId,
          productName,
          userName: visitor.userName
        });
      }
    });

    // WhatsApp/Call request
    socket.on('contact:request', async (data) => {
      const { vendorId, type, phone } = data;
      const visitor = visitorSessions.get(socket.id);
      
      try {
        // Vendor लाई notification
        io.to(`showroom:${vendorId}`).emit('contact:request', {
          type, // 'whatsapp' or 'call'
          phone,
          userName: visitor?.userName || 'अतिथि',
          socketId: socket.id
        });

        // Database मा log गर्ने
        console.log(`📞 ${type} request from ${visitor?.userName} to vendor ${vendorId}`);

      } catch (error) {
        console.error('Contact request error:', error);
      }
    });

    // ==================== DISCONNECT HANDLING ====================
    
    socket.on('disconnect', async () => {
      console.log(`❌ जडान टुट्यो: ${socket.id}`);
      
      const visitor = visitorSessions.get(socket.id);
      const vendorId = socket.vendorId || socket.currentVendorId;

      if (visitor && vendorId) {
        const showroom = activeShowrooms.get(vendorId);
        
        if (showroom) {
          showroom.viewers.delete(socket.id);
          
          // Visitor लाई inactive marked गर्ने
          await Visitor.findOneAndUpdate(
            { socketId: socket.id },
            { isActive: false, leftAt: new Date() }
          );

          // सबैलाई update पठाउने
          io.to(`showroom:${vendorId}`).emit('visitor:left', {
            socketId: socket.id,
            viewerCount: showroom.viewers.size
          });
        }

        visitorSessions.delete(socket.id);
      }

      // Vendor disconnect भएमा
      if (socket.vendorId && activeShowrooms.has(socket.vendorId)) {
        activeShowrooms.delete(socket.vendorId);
        
        await Merchant.findByIdAndUpdate(socket.vendorId, {
          isLive: false
        });

        io.emit('showroom:offline', { vendorId: socket.vendorId });
        console.log(`🔴 Vendor ${socket.vendorId} को Showroom बन्द भयो`);
      }
    });
  });

  return io;
};

// Helper functions
const getShowroomStats = (vendorId) => {
  const showroom = activeShowrooms.get(vendorId);
  return showroom ? {
    isLive: true,
    viewerCount: showroom.viewers.size,
    startedAt: showroom.startedAt
  } : { isLive: false, viewerCount: 0 };
};

const getIO = () => {
  if (!io) throw new Error('Socket.io initial गरिएको छैन!');
  return io;
};

module.exports = {
  initSocketServer,
  getIO,
  getShowroomStats,
  activeShowrooms
};