'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useShowroomSocket } from '@/hooks/useShowroomSocket';

export default function ShowroomPage() {
  const searchParams = useSearchParams();
  const vendorId = searchParams.get('vendorId') || 'test123';
  
  const {
    connected,
    isLive,
    viewerCount,
    visitors,
    messages,
    error,
    sendMessage
  } = useShowroomSocket(vendorId);

  const [inputMessage, setInputMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && sendMessage(inputMessage)) {
      setInputMessage('');
    }
  };

  if (error) {
    return (
      <div className="flex-1 p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-700">⚠️ {error}</p>
          <p className="text-sm text-yellow-600 mt-2">Demo mode मा देखाइँदैछ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🎥 Live Showroom</h1>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className={`flex items-center gap-1 ${connected ? 'text-green-600' : 'text-red-600'}`}>
                {connected ? '🟢 Connected' : '🔴 Disconnected'}
              </span>
              <span className="text-blue-600">👥 {viewerCount} watching</span>
              <span className={`px-2 py-1 rounded text-xs ${isLive ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                {isLive ? '🔴 LIVE' : '⚫ OFFLINE'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Section */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-xl aspect-video flex items-center justify-center relative overflow-hidden">
              {isLive ? (
                <div className="text-white text-center">
                  <div className="text-6xl mb-4">📹</div>
                  <p>Live CCTV Stream</p>
                  <p className="text-sm text-gray-400 mt-2">Connected to store camera</p>
                </div>
              ) : (
                <div className="text-white text-center">
                  <div className="text-6xl mb-4">📵</div>
                  <p>Store is currently offline</p>
                  <p className="text-sm text-gray-400 mt-2">Please check back later</p>
                </div>
              )}
              
              {/* Live Badge */}
              {isLive && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  🔴 LIVE
                </div>
              )}
            </div>

            {/* Products Grid */}
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">🛍️ Featured Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['मोमो', 'चाउमीन', 'पिज्जा', 'बर्गर'].map((item, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                    <div className="text-4xl mb-2">🍽️</div>
                    <p className="font-medium text-sm">{item}</p>
                    <p className="text-blue-600 text-sm">Rs. {150 + i * 100}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="bg-white rounded-xl shadow-sm flex flex-col h-[600px]">
            <div className="p-4 border-b">
              <h3 className="font-semibold">💬 Live Chat</h3>
              <p className="text-xs text-gray-500">{messages.length} messages</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <p className="text-center text-gray-400 text-sm">No messages yet. Start chatting!</p>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.isVendor ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                      {msg.senderName?.[0] || '?'}
                    </div>
                    <div className={`max-w-[70%] p-3 rounded-lg text-sm ${
                      msg.isVendor ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="font-medium text-xs mb-1">{msg.senderName}</p>
                      <p>{msg.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!connected || !inputMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </form>

            {/* Visitors List */}
            <div className="p-4 border-t bg-gray-50">
              <h4 className="text-xs font-medium text-gray-500 mb-2">Active Visitors ({visitors.length})</h4>
              <div className="flex flex-wrap gap-2">
                {visitors.map((v, i) => (
                  <div key={i} className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs border">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs">
                      {v.name?.[0] || '?'}
                    </div>
                    <span className="truncate max-w-[80px]">{v.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}