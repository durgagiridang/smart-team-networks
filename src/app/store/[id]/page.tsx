'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

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

  useEffect(() => {
    fetchStoreDetails();
    initSocket();
  }, [storeId]);

  const fetchStoreDetails = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/merchants/${storeId}`);
      const data = await res.json();
      if (data.success) {
        setStore(data.merchant);
        // Demo products - replace with real API
        setProducts([
          { _id: '1', name: 'Chicken Momo', price: 150 },
          { _id: '2', name: 'Veg Chowmein', price: 120 },
          { _id: '3', name: 'Pizza', price: 350 },
          { _id: '4', name: 'Burger', price: 250 },
        ]);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const initSocket = () => {
    const newSocket = io('http://localhost:8000');
    
    newSocket.on('connect', () => {
      setConnected(true);
      newSocket.emit('visitor:join', {
        vendorId: storeId,
        userId: localStorage.getItem('userId') || `guest_${Date.now()}`,
        userName: user?.name || 'Guest',
      });
    });

    newSocket.on('chat:new-message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    setSocket(newSocket);
    return () => newSocket.close();
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !socket) return;
    socket.emit('chat:message', {
      vendorId: storeId,
      message: inputMessage,
      type: 'text'
    });
    setInputMessage('');
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      vendorId: storeId,
      vendorName: store?.business_name,
    });
    alert(`${product.name} कार्टमा थपियो!`);
  };

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="animate-spin text-4xl">⏳</div>
    </div>
  );
  
  if (!store) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p>Store not found</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pb-24">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-br from-cyan-900 via-black to-cyan-900 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-2xl">←</button>
        <div className="flex-1">
          <h1 className="text-xl font-black italic">{store.business_name}</h1>
          <p className="text-xs text-cyan-400">
            {connected ? '🟢 Connected' : '🔴 Disconnected'}
            {store.isLive ? ' • 🔴 LIVE' : ''}
          </p>
        </div>
        <Link href="/cart" className="text-2xl">🛒</Link>
      </div>

      {/* Live CCTV */}
      <div className="aspect-video bg-black relative">
        {store.cctv_url ? (
          <iframe 
            src={store.cctv_url} 
            className="w-full h-full"
            allow="autoplay; fullscreen"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <span className="text-6xl">🏪</span>
          </div>
        )}
        {store.isLive && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
            🔴 LIVE
          </div>
        )}
      </div>

      {/* Products */}
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">🛍️ Products</h2>
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product._id} className="bg-[#1a1a1a] rounded-xl p-4">
              <div className="text-4xl text-center mb-2">🍽️</div>
              <h3 className="font-bold text-center text-sm">{product.name}</h3>
              <p className="text-cyan-400 text-center">Rs. {product.price}</p>
              <button 
                onClick={() => handleAddToCart(product)}
                className="w-full mt-2 bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded-lg text-sm"
              >
                + Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Live Chat */}
      <div className="p-4 bg-[#1a1a1a] mx-4 rounded-2xl">
        <h2 className="text-lg font-bold mb-4">💬 Live Chat</h2>
        
        <div className="h-48 overflow-y-auto space-y-2 mb-4">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">कुनै message छैन</p>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`p-2 rounded-lg ${msg.isVendor ? 'bg-cyan-900/30' : 'bg-gray-800'}`}>
                <p className="text-xs text-gray-400">{msg.senderName}</p>
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
            className="flex-1 bg-black border border-white/20 rounded-lg px-4 py-2 text-white"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            disabled={!connected}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>

      {/* View Cart Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/90 border-t border-white/10">
        <button 
          onClick={() => router.push('/cart')}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl"
        >
          🛒 View Cart →
        </button>
      </div>
    </div>
  );
}