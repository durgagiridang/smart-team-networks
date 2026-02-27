'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function StorePage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.id as string;
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [store, setStore] = useState<any>(null);
  const [socket, setSocket] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'chat'>('products');

  useEffect(() => {
    if (storeId) {
      fetchStoreDetails();
      fetchProducts();
      initSocket();
    }
    
    return () => {
      if (socket) socket.close();
    };
  }, [storeId]);

  // पसलको विवरण ल्याउने
  const fetchStoreDetails = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/merchants/${storeId}`);
      const data = await res.json();
      
      if (data.success) {
        setStore(data.merchant);
      } else {
        toast.error('पसलको जानकारी लोड गर्न सकिएन');
      }
    } catch (err) {
      console.error('Error fetching store:', err);
      toast.error('सर्भरमा समस्या भयो');
    } finally {
      setLoading(false);
    }
  };

  // उत्पादनहरू ल्याउने
  const fetchProducts = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/products?vendorId=${storeId}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data.success && data.products) {
        setProducts(data.products);
      } else {
        // डेमो उत्पादनहरू (API नभएसम्म)
        setProducts([
          { _id: '1', name: 'चिकन मोमो', price: 150, image: '🥟' },
          { _id: '2', name: 'भेज चाउमिन', price: 120, image: '🍜' },
          { _id: '3', name: 'पिज्जा', price: 350, image: '🍕' },
          { _id: '4', name: 'बर्गर', price: 250, image: '🍔' },
        ]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  // Socket जडान गर्ने
  const initSocket = () => {
    try {
      const newSocket = io('http://localhost:8000');
      
      newSocket.on('connect', () => {
        setConnected(true);
        newSocket.emit('visitor:join', {
          vendorId: storeId,
          userId: localStorage.getItem('userId') || `guest_${Date.now()}`,
          userName: user?.name || 'अतिथि',
        });
      });

      newSocket.on('disconnect', () => {
        setConnected(false);
      });

      newSocket.on('chat:new-message', (data) => {
        setMessages(prev => [...prev, data]);
      });

      setSocket(newSocket);
    } catch (err) {
      console.error('Socket error:', err);
    }
  };

  // Message पठाउने
  const sendMessage = () => {
    if (!inputMessage.trim() || !socket || !connected) {
      toast.error('कृपया message लेख्नुहोस्');
      return;
    }
    
    socket.emit('chat:message', {
      vendorId: storeId,
      message: inputMessage,
      type: 'text',
      senderName: user?.name || 'अतिथि',
    });
    
    // आफ्नो message पनि देखाउने
    setMessages(prev => [...prev, {
      message: inputMessage,
      senderName: 'तपाईं',
      isVendor: false,
    }]);
    
    setInputMessage('');
  };

  // कार्टमा थप्ने
  const handleAddToCart = (product: any) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      vendorId: storeId,
      vendorName: store?.business_name,
    });
    toast.success(`${product.name} कार्टमा थपियो!`);
  };

  // लोडिङ स्क्रिन
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
  
  // पसल फेला नपरेमा
  if (!store) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl">🏪</span>
          <p className="mt-4 text-xl">पसल फेला परेन</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 bg-cyan-600 px-6 py-2 rounded-lg"
          >
            ← फर्किनुहोस्
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pb-28">
      
      {/* हेडर */}
      <div className="p-4 bg-gradient-to-br from-cyan-900 via-black to-cyan-900 flex items-center gap-4 sticky top-0 z-10">
        <button 
          onClick={() => router.back()} 
          className="text-2xl hover:text-cyan-400 transition-colors"
        >
          ←
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-black italic truncate">{store.business_name}</h1>
          <p className="text-xs text-cyan-400 flex items-center gap-2">
            <span>{connected ? '🟢 अनलाइन' : '🔴 अफलाइन'}</span>
            {store.isLive && <span className="text-red-400">• 🔴 लाइभ</span>}
          </p>
        </div>
        <Link href="/cart" className="text-2xl relative">
          🛒
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
            0
          </span>
        </Link>
      </div>

      {/* लाइभ CCTV */}
      <div className="aspect-video bg-black relative">
        {store.cctv_url ? (
          <iframe 
            src={store.cctv_url} 
            className="w-full h-full"
            allow="autoplay; fullscreen"
            title="Live CCTV"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center">
              <span className="text-6xl">🏪</span>
              <p className="mt-2 text-gray-400">लाइभ भिडियो उपलब्ध छैन</p>
            </div>
          </div>
        )}
        
        {store.isLive && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse flex items-center gap-1">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            लाइभ
          </div>
        )}
        
        {/* Viewer count */}
        <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-1 rounded-full text-sm">
          👥 {store.viewerCount || 0} हेर्दै
        </div>
      </div>

      {/* पसलको जानकारी */}
      <div className="p-4 bg-[#1a1a1a] mx-4 -mt-4 rounded-2xl relative z-10 border border-white/10">
        <h2 className="font-bold text-lg">{store.business_name}</h2>
        <p className="text-gray-400 text-sm">📍 {store.address || store.city || 'तुलसिपुर'}</p>
        <p className="text-gray-400 text-sm">📞 {store.phone || 'फोन उपलब्ध छैन'}</p>
        {store.rating && (
          <p className="text-yellow-500 text-sm mt-1">⭐ {store.rating} रेटिङ</p>
        )}
      </div>

      {/* ट्याब्स */}
      <div className="flex mx-4 mt-4 bg-[#1a1a1a] rounded-xl p-1">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
            activeTab === 'products' ? 'bg-cyan-600 text-white' : 'text-gray-400'
          }`}
        >
          🛍️ उत्पादनहरू
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
            activeTab === 'chat' ? 'bg-cyan-600 text-white' : 'text-gray-400'
          }`}
        >
          💬 च्याट {messages.length > 0 && `(${messages.length})`}
        </button>
      </div>

      {/* उत्पादनहरू */}
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
                <div key={product._id} className="bg-[#1a1a1a] rounded-xl p-4 border border-white/10 hover:border-cyan-500 transition-all">
                  <div className="text-4xl text-center mb-2">{product.image || '📦'}</div>
                  <h3 className="font-bold text-center text-sm truncate">{product.name}</h3>
                  <p className="text-cyan-400 text-center font-bold">रु. {product.price}</p>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full mt-3 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    + कार्टमा थप्नुहोस्
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* च्याट */}
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
                    className={`p-3 rounded-xl ${
                      msg.isVendor 
                        ? 'bg-cyan-900/30 border border-cyan-500/30' 
                        : 'bg-gray-800'
                    }`}
                  >
                    <p className="text-xs text-gray-400 mb-1">{msg.senderName}</p>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                ))
              )}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Message लेख्नुहोस्..."
                className="flex-1 bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={!connected}
              />
              <button 
                onClick={sendMessage}
                disabled={!connected || !inputMessage.trim()}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-colors"
              >
                पठाउनुहोस्
              </button>
            </div>
            
            {!connected && (
              <p className="text-red-400 text-xs mt-2 text-center">
                च्याटको लागि कृपया पर्खिनुहोस्...
              </p>
            )}
          </div>
        </div>
      )}

      {/* कार्ट हेर्ने बटन */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent">
        <button 
          onClick={() => router.push('/cart')}
          className="w-full bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
        >
          <span>🛒</span>
          <span>कार्ट हेर्नुहोस्</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}