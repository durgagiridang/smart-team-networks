// src/app/vendor/showroom/components/ChatBox.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, Paperclip, Phone, Video, MoreHorizontal } from 'lucide-react';

interface ChatMessage {
  id?: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  type: 'text' | 'image' | 'file';
  timestamp: Date | string;
  isVendor: boolean;
}

interface ChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, type?: string) => void;
  isConnected: boolean;
  useDemo?: boolean;
}

export default function ChatBox({ messages, onSendMessage, isConnected, useDemo = false }: ChatBoxProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allMessages = useDemo ? [...messages, ...localMessages] : messages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    if (useDemo) {
      // Demo mode - local messages
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'user1',
        senderName: 'You',
        senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
        message: inputMessage,
        type: 'text',
        timestamp: new Date(),
        isVendor: false
      };
      
      setLocalMessages(prev => [...prev, newMessage]);
      setInputMessage('');
      
      // Auto reply
      setTimeout(() => {
        const reply: ChatMessage = {
          id: (Date.now() + 1).toString(),
          senderId: 'vendor1',
          senderName: 'Demo Store',
          senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vendor1',
          message: 'Thanks for your message! 😊',
          type: 'text',
          timestamp: new Date(),
          isVendor: true
        };
        setLocalMessages(prev => [...prev, reply]);
      }, 1000);
      
      inputRef.current?.focus();
    } else {
      if (!isConnected) return;
      onSendMessage(inputMessage, 'text');
      setInputMessage('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              V
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Vendor Support</h3>
            <p className="text-xs text-green-600">Online</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Video className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {allMessages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Send className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-gray-500 text-sm">No messages yet</p>
              <p className="text-gray-400 text-xs mt-1">Start the conversation!</p>
            </motion.div>
          ) : (
            allMessages.map((msg, index) => (
              <motion.div
                key={msg.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${msg.isVendor ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex max-w-[80%] ${msg.isVendor ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="flex-shrink-0 mx-2">
                    <img
                      src={msg.senderAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderId}`}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full bg-gray-200"
                    />
                  </div>
                  <div className={`flex flex-col ${msg.isVendor ? 'items-start' : 'items-end'}`}>
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm ${
                        msg.isVendor
                          ? 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                          : 'bg-blue-600 text-white rounded-tr-none'
                      }`}
                    >
                      {!msg.isVendor && <p className="text-xs opacity-75 mb-1">{msg.senderName}</p>}
                      <p>{msg.message}</p>
                    </div>
                    <span className="text-xs text-gray-400 mt-1 px-1">{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={useDemo || isConnected ? "Type a message..." : "Connecting..."}
              disabled={!useDemo && !isConnected}
              className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-full text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
              <Smile className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!inputMessage.trim() || (!useDemo && !isConnected)}
            className={`p-2.5 rounded-full transition-all ${
              inputMessage.trim() && (useDemo || isConnected)
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}