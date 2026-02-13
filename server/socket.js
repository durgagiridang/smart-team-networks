const { Server } = require('socket.io');

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('👤 User connected:', socket.id);

    // Join Channel
    socket.on('join-channel', ({ channel, username }) => {
      socket.join(channel);
      socket.username = username;
      socket.channel = channel;

      const userCount = io.sockets.adapter.rooms.get(channel)?.size || 0;
      
      socket.to(channel).emit('message', {
        id: Date.now(),
        username: 'STN Bot',
        text: `${username} joined the chat`,
        type: 'system',
        timestamp: new Date().toISOString()
      });

      io.to(channel).emit('user-count', userCount);
      console.log(`👤 ${username} joined ${channel}`);
    });

    // Send Message
    socket.on('send-message', ({ text, channel }) => {
      const message = {
        id: Date.now(),
        username: socket.username,
        text: text,
        type: 'user',
        timestamp: new Date().toISOString(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${socket.username}`
      };

      io.to(channel).emit('message', message);
    });

    // Typing indicator
    socket.on('typing', ({ channel, isTyping }) => {
      socket.to(channel).emit('user-typing', {
        username: socket.username,
        isTyping
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      if (socket.channel) {
        const userCount = io.sockets.adapter.rooms.get(socket.channel)?.size || 0;
        io.to(socket.channel).emit('user-count', userCount);
        
        socket.to(socket.channel).emit('message', {
          id: Date.now(),
          username: 'STN Bot',
          text: `${socket.username} left the chat`,
          type: 'system',
          timestamp: new Date().toISOString()
        });
      }
      console.log('👤 User disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initSocket, getIO };