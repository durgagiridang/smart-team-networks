'use client';

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface Visitor {
  id: string;
  name: string;
  avatar: string;
  joinedAt: Date;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  message: string;
  type: string;
  timestamp: Date;
  isVendor: boolean;
}

export function useShowroomSocket(vendorId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vendorId) return;

    console.log('🔌 Connecting to socket for vendor:', vendorId);

    // Socket connection
    const newSocket = io('http://localhost:8000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setConnected(true);
      setError(null);
      
      // Join as visitor
      newSocket.emit('visitor:join', {
        vendorId,
        userId: `user_${Date.now()}`,
        userName: 'Guest ' + Math.floor(Math.random() * 1000),
        avatar: '/default-avatar.png'
      });
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ Socket error:', err.message);
      setError('Server connection failed');
      setConnected(false);
    });

    // Showroom events
    newSocket.on('showroom:live', (data) => {
      console.log('🎥 Showroom is live:', data);
      setIsLive(true);
      setViewerCount(data.viewerCount);
    });

    newSocket.on('showroom:offline', (data) => {
      console.log('🔴 Showroom offline:', data);
      setIsLive(false);
      setViewerCount(0);
    });

    // Visitor events
    newSocket.on('visitor:joined', (data) => {
      console.log('👤 Visitor joined:', data);
      setViewerCount(data.viewerCount);
      if (data.visitor) {
        setVisitors(prev => [...prev, data.visitor]);
      }
    });

    newSocket.on('visitor:left', (data) => {
      console.log('👋 Visitor left:', data);
      setViewerCount(data.viewerCount);
      setVisitors(prev => prev.filter(v => v.id !== data.socketId));
    });

    newSocket.on('visitor:list', (data) => {
      console.log('📋 Visitor list:', data);
      setVisitors(data.viewers || []);
      setViewerCount(data.count);
    });

    // Chat events
    newSocket.on('chat:new-message', (data) => {
      console.log('💬 New message:', data);
      setMessages(prev => [...prev, data]);
    });

    newSocket.on('chat:vendor-message', (data) => {
      console.log('💬 Vendor message:', data);
      setMessages(prev => [...prev, { ...data, isVendor: true }]);
    });

    setSocket(newSocket);

    return () => {
      console.log('🧹 Cleaning up socket');
      newSocket.close();
    };
  }, [vendorId]);

  const sendMessage = useCallback((message: string) => {
    if (socket && connected) {
      socket.emit('chat:message', {
        vendorId,
        message,
        type: 'text'
      });
      return true;
    }
    return false;
  }, [socket, connected, vendorId]);

  const requestContact = useCallback((type: 'whatsapp' | 'call', phone: string) => {
    if (socket && connected) {
      socket.emit('contact:request', {
        vendorId,
        type,
        phone
      });
      return true;
    }
    return false;
  }, [socket, connected, vendorId]);

  return {
    socket,
    connected,
    isLive,
    viewerCount,
    visitors,
    messages,
    error,
    sendMessage,
    requestContact
  };
}