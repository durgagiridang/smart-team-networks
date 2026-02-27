'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function StorePage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.id as string;
  
  const [store, setStore] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'chat'>('products');
  const [viewerCount, setViewerCount] = useState(0);
  
  const socketRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Socket Connect
  useEffect(() => {
    if (!storeId) return;
    
    const socket = io('http://localhost:8000', {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
    });
    
    socketRef.current = socket;
    
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      setConnected(true);
      
      socket.emit('visitor:join', {
        vendorId: storeId,
        userId: localStorage.getItem('userId') || `guest_${Date.now()}`,
        userName: localStorage.getItem('userName') || 'अतिथि',
      });
    });

    socket.on('disconnect', () => setConnected(false));
    
    socket.on('chat:new-message', (data) => {
      setMessages(prev => [...prev, data]);
    });
    
    socket.on('visitor:count', (data) => {
      setViewerCount(data.count);
    });

    return () => {
      socket.disconnect();
    };
  }, [storeId]);

  // Fetch Store
  useEffect(() => {
    if (storeId) {
      fetchStore();
      fetchProducts();
    }
  }, [storeId]);

  const fetchStore = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/merchants/${storeId}`);
      const data = await res.json();
      
      if (data.success) {
        setStore(data.merchant);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/products?vendorId=${storeId}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !socketRef.current || !connected) {
      toast.error('कृपया message लेख्नुहोस्');
      return;
    }
    
    socketRef.current.emit('chat:message', {
      vendorId: storeId,
      message: inputMessage,
      senderName: localStorage.getItem('userName') || 'अतिथि',
    });
    
    setMessages(prev => [...prev, {
      message: inputMessage,
      senderName: 'तपाईं',
      isMe: true,
      timestamp: new Date().toISOString()
    }]);
    
    setInputMessage('');
  };

  // YouTube Embed URL बनाउने
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // youtu.be/xxxxx → youtube.com/embed/xxxxx
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
    }
    
    // youtube.com/watch?v=xxxxx → youtube.com/embed/xxxxx
    if (url.includes('watch?v=')) {
      const id = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
    }
    
    // Already embed URL
    if (url.includes('embed')) {
      return url;
    }
    
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }
  
  if (!store) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl">🏪</span>
          <p className="mt-4 text-xl">पसल फेला परेन</p>
          <button onClick={() => router.back()} className="mt-4 bg-cyan-600 px-6 py-2 rounded-lg">
            ← फर्किनुहोस्
          </button>
        </div>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(store.cctv_url);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pb-28">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-br from-cyan-900 via-black to-cyan-900 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-2xl hover:text-cyan-400">←</button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-black italic truncate">{store.business_name || store.businessName}</h1>
          <p className="text-xs flex items-center gap-2">
            {connected ? (
              <span className="text-green-400">🟢 अनलाइन</span>
            ) : (
              <span className="text-red-400">🔴 अफलाइन</span>
            )}
            {embedUrl && <span className="text-red-400">• 🔴 लाइभ</span>}
            <span className="text-gray-400">• 👥 {viewerCount}</span>
          </p>
        </div>
        <Link href="/cart" className="text-2xl relative">🛒</Link>
      </div>

      {/* YouTube Live Video */}
      <div className="aspect-video bg-black relative">
        {embedUrl ? (
          <iframe 
            src={embedUrl}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            title="Live Stream"
            frameBorder="0"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center">
              <span className="text-6xl">🏪</span>
              <p className="mt-2 text-gray-400">लाइभ भिडियो उपलब्ध छैन</p>
              <p className="text-gray-500 text-sm">पसलले अहिले लाइभ गरेको छैन</p>
            </div>
          </div>
        )}
        
        {embedUrl && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
            🔴 LIVE
          </div>
        )}
      </div>

      {/* Store Info */}
      <div className="p-4 bg-[#1a1a1a] mx-4 -mt-4 rounded-2xl relative z-10 border border-white/10">
        <h2 className="font-bold text-lg">{store.business_name || store.businessName}</h2>
        <p className="text-gray-400 text-sm">📍 {store.address || store.city || 'तुलसिपुर'}</p>
        <p className="text-gray-400 text-sm">📞 {store.phone || 'फोन उपलब्ध छैन'}</p>
        {store.ownerName && (
          <p className="text-gray-400 text-sm">👤 {store.ownerName}</p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex mx-4 mt-4 bg-[#1a1a1a] rounded-xl p-1">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold ${activeTab === 'products' ? 'bg-cyan-600 text-white' : 'text-gray-400'}`}
        >
          🛍️ उत्पादनहरू
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold ${activeTab === 'chat' ? 'bg-cyan-600 text-white' : 'text-gray-400'}`}
        >
          💬 च्याट {messages.length > 0 && `(${messages.length})`}
        </button>
      </div>

      {/* Products */}
      {activeTab === 'products' && (
        <div className="p-4">
          {products.length === 0 ? (
            <div className="text-center py-10">
              <span className="text-4xl">📭</span>
              <p className="mt-2 text-gray-500">कुनै उत्पादन छैन</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <div key={product._id} className="bg-[#1a1a1a] rounded-xl p-4 border border-white/10">
                  <div className="h-32 bg-gray-800 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">📦</span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm truncate">{product.name}</h3>
                  <p className="text-cyan-400 font-bold">रु. {product.price}</p>
                  <button 
                    onClick={() => {
                      // Add to cart logic
                      toast.success(`${product.name} कार्टमा थपियो!`);
                    }}
                    className="w-full mt-2 bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded-lg text-sm font-bold"
                  >
                    + कार्टमा थप्नुहोस्
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chat */}
      {activeTab === 'chat' && (
        <div className="p-4">
          <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/10">
            <div className="h-64 overflow-y-auto space-y-3 mb-4">
              {messages.length === 0 ? (
                <div className="text-center py-10">
                  <span className="text-4xl">💬</span>
                  <p className="mt-2 text-gray-500">कुनै message छैन</p>
                  <p className="text-gray-600 text-sm">पहिलो message पठाउनुहोस्!</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`p-3 rounded-xl ${msg.isMe ? 'bg-cyan-600/30 border border-cyan-500/30' : 'bg-gray-800'}`}
                  >
                    <p className="text-xs text-gray-400 mb-1">{msg.senderName}</p>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={connected ? "Message लेख्नुहोस्..." : "जडान हुँदैछ..."}
                className="flex-1 bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none disabled:opacity-50"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={!connected}
              />
              <button 
                onClick={sendMessage}
                disabled={!connected || !inputMessage.trim()}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold"
              >
                पठाउनुहोस्
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
        <button 
          onClick={() => router.push('/cart')}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
        >
          🛒 कार्ट हेर्नुहोस् →
        </button>
      </div>
    </div>
  );
}