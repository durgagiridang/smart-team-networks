'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from "socket.io-client";

// 🔥 Types
interface ChatMessage {
  id: string;
  text: string;
  username: string;
  timestamp: number;
}

interface Order {
  name: string;
  product: string;
  timestamp?: number;
}

interface BroadcastData {
  videoUrl: string;
  activeProducts: Product[];
  overlay: string;
  speed: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image_url?: string;
}

export default function VmixAdmin() {
  // State
  const [previewUrl, setPreviewUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("https://www.youtube.com/embed/p3NTcz4SNHQ");
  const [status, setStatus] = useState<"ready" | "transitioning" | "live" | "error">("ready");
  const [overlayText, setOverlayText] = useState("Welcome to STN Live Shopping!");
  const [tickerSpeed, setTickerSpeed] = useState("12s");
  const [products, setProducts] = useState<Product[]>([]);
  const [volume, setVolume] = useState(85);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [adminReply, setAdminReply] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔥 FIXED: Use relative URL or env variable
  const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";
console.log('Connecting to:', SOCKET_URL);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket connection
  useEffect(() => {
  console.log('🎯 Connecting to Socket:', SOCKET_URL);
  
  socketRef.current = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    timeout: 10000,
    withCredentials: false,
  });

  socketRef.current.on("connect", () => {
    console.log('✅ Socket Connected! ID:', socketRef.current?.id);
    setIsConnected(true);
    setError(null);
  });

  socketRef.current.on("connect_error", (err) => {
    console.error('❌ Socket Error:', err.message);
    setError(`Connection failed: ${err.message}`);
    setIsConnected(false);
  });

  socketRef.current.on("disconnect", (reason) => {
    console.log('⚠️ Socket Disconnected:', reason);
    setIsConnected(false);
  });

  // Event listeners
  socketRef.current.on("receive-chat-message", (msg: ChatMessage) => {
    console.log('📨 Message received:', msg);
    setMessages((prev) => [...prev, { ...msg, id: Math.random().toString(36).substr(2, 9) }]);
  });

  return () => {
    console.log('🔌 Cleaning up socket...');
    socketRef.current?.disconnect();
  };
}, []); // Empty dependency array // 🔥 FIXED: Empty dependency array

  // Send audio updates when changed
  useEffect(() => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("audio-control", { volume, isMuted });
    }
  }, [volume, isMuted, isConnected]);

  const sendReply = useCallback(() => {
    if (!adminReply.trim() || !socketRef.current || !isConnected) {
      if (!isConnected) alert("Server disconnected!");
      return;
    }

    const message: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      text: adminReply,
      username: "ADMIN (STN)",
      timestamp: Date.now(),
    };

    socketRef.current.emit("send-chat-message", message);
    setMessages(prev => [...prev, message]);
    setAdminReply("");
  }, [adminReply, isConnected]);

  const sendToLive = async () => {
    if (!previewUrl) {
      alert("पहिले Preview मा लिङ्क हाल्नुहोस्!");
      return;
    }

    setStatus("transitioning");
    
    try {
      const res = await fetch(`${API_URL}/api/broadcast/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl: previewUrl,
          activeProducts: products,
          overlay: overlayText,
          speed: tickerSpeed
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setLiveUrl(previewUrl);
      setStatus("live");
      
      // Reset after 3 seconds
      setTimeout(() => setStatus("ready"), 3000);
      
    } catch (err) {
      console.error('Broadcast error:', err);
      setStatus("error");
      setError("Server offline or unreachable");
      setTimeout(() => setStatus("ready"), 3000);
    }
  };

  const sendTestOrder = useCallback(() => {
    if (!socketRef.current || !isConnected) {
      alert("Server disconnected!");
      return;
    }

    const fakeOrders: Order[] = [
      { name: "Ram Thapa", product: "Classic T-Shirt" },
      { name: "Sita Rai", product: "Red Kurti" },
      { name: "Hari Bahadur", product: "Smart Watch" },
      { name: "Gita Devi", product: "Designer Saree" }
    ];
    
    const randomOrder = fakeOrders[Math.floor(Math.random() * fakeOrders.length)];
    
    socketRef.current.emit("new-order-alert", {
      ...randomOrder,
      timestamp: Date.now()
    });
    
    setStatus("live");
    setTimeout(() => setStatus("ready"), 3000);
  }, [isConnected]);

  const getStatusDisplay = () => {
    switch (status) {
      case "live": return { text: "🔴 LIVE", class: "bg-red-600 animate-pulse text-white" };
      case "transitioning": return { text: "TRANSITIONING...", class: "bg-yellow-600 text-white" };
      case "error": return { text: "⚠️ ERROR", class: "bg-red-800 text-white" };
      default: return { text: "System Ready", class: "bg-zinc-800" };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 p-4 font-sans overflow-y-auto">
      {/* Connection Status Bar */}
      {!isConnected && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 text-xs font-bold z-50">
          ⚠️ Server Disconnected - Retrying...
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-zinc-900 p-4 rounded-xl border border-white/5 shadow-2xl">
        <div>
          <h1 className="text-xl font-black italic text-cyan-500 uppercase tracking-tighter">STN vMix Studio</h1>
          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest italic">Master Production Controller</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
          <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${statusDisplay.class}`}>
            {statusDisplay.text}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left & Center: Monitors */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Preview Monitor */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase ml-2 italic">Preview (Next Source)</span>
                <span className="text-[8px] text-zinc-600">{isConnected ? '🟢 Online' : '🔴 Offline'}</span>
              </div>
              <div className="aspect-video bg-black border-2 border-zinc-700 rounded-lg overflow-hidden relative shadow-2xl">
                {previewUrl ? (
                  <iframe 
                    className="w-full h-full pointer-events-none" 
                    src={`${previewUrl}${previewUrl.includes('?') ? '&' : '?'}autoplay=1&mute=1&controls=0`} 
                    allow="autoplay; encrypted-media"
                    title="Preview"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase font-black text-zinc-800 italic">
                    No Input
                  </div>
                )}
              </div>
              <input 
                value={previewUrl} 
                onChange={(e) => setPreviewUrl(e.target.value)} 
                placeholder="Paste YouTube URL..." 
                className="w-full bg-zinc-900 border border-white/5 p-3 rounded-lg text-xs outline-none focus:border-cyan-500 shadow-inner"
              />
            </div>

            {/* Live Monitor */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-red-500 uppercase ml-2 italic tracking-widest animate-pulse">Program (On Air)</span>
              <div className="aspect-video bg-black border-2 border-red-600 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.2)] relative">
                <iframe 
                  className="w-full h-full pointer-events-none" 
                  src={`${liveUrl}${liveUrl.includes('?') ? '&' : '?'}autoplay=1&mute=${isMuted ? 1 : 0}&controls=0`} 
                  allow="autoplay; encrypted-media"
                  title="Live"
                />
                {isMuted && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-[8px] px-2 py-1 rounded font-bold">
                    🔇 MUTED
                  </div>
                )}
              </div>
              <div className="bg-zinc-900 p-3 rounded-lg text-[10px] text-zinc-600 truncate border border-white/5 italic">
                Source: {liveUrl.substring(0, 50)}...
              </div>
            </div>
          </div>

          {/* Ticker Control */}
          <div className="bg-zinc-900 p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
            <h3 className="text-[10px] font-black uppercase text-cyan-600 tracking-[0.2em]">Ticker Control Studio</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                value={overlayText} 
                onChange={(e) => setOverlayText(e.target.value)} 
                className="flex-1 bg-black border border-white/10 p-3 rounded-xl text-xs text-white outline-none focus:border-cyan-900" 
                placeholder="Breaking news text..." 
              />
              <select 
                className="bg-zinc-800 text-[10px] p-3 rounded-xl border border-white/10 text-white outline-none" 
                value={tickerSpeed} 
                onChange={(e) => setTickerSpeed(e.target.value)}
              >
                <option value="25s">🐢 Slow</option>
                <option value="12s">🚶 Normal</option>
                <option value="6s">🏃 Fast</option>
                <option value="3s">⚡ Super Fast</option>
              </select>
            </div>
            <button 
              onClick={sendToLive} 
              disabled={status === "transitioning" || !isConnected}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-black rounded-xl font-black text-[10px] uppercase shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
            >
              {status === "transitioning" ? "⏳ Sending..." : "Push Update to Live Screen 🚀"}
            </button>
          </div>

          {/* Products Section (New) */}
          <div className="bg-zinc-900 p-6 rounded-2xl border border-white/5 shadow-xl">
            <h3 className="text-[10px] font-black uppercase text-zinc-600 tracking-widest mb-4">Active Products ({products.length})</h3>
            {products.length === 0 ? (
              <p className="text-zinc-600 text-xs italic">No products loaded. Add products from the merchant dashboard.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {products.map((product) => (
                  <div key={product._id} className="bg-black/40 p-3 rounded-lg border border-white/5">
                    <p className="text-[10px] font-bold text-cyan-400 truncate">{product.name}</p>
                    <p className="text-[8px] text-zinc-500">रू {product.price?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Audio Control */}
          <div className="bg-zinc-900 p-5 rounded-2xl border border-white/5 shadow-xl">
            <h3 className="text-[10px] font-black uppercase mb-4 text-zinc-600 tracking-widest">Master Audio</h3>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] text-zinc-500">{volume}%</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume} 
                onChange={(e) => setVolume(Number(e.target.value))} 
                className="flex-1 h-1.5 bg-black rounded-lg appearance-none cursor-pointer accent-cyan-500" 
              />
            </div>
            <button 
              onClick={() => setIsMuted(!isMuted)} 
              className={`w-full py-3 rounded-xl text-[10px] font-black uppercase shadow-md transition-all ${isMuted ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
            >
              {isMuted ? "🔇 Unmute" : "🔊 Mute Audio"}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-zinc-900 p-5 rounded-2xl border border-white/5 shadow-xl">
            <h3 className="text-[10px] font-black uppercase mb-4 text-zinc-600 tracking-widest italic">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={sendTestOrder} 
                disabled={!isConnected}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 disabled:from-zinc-700 disabled:to-zinc-700 text-white rounded-xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all"
              >
                🛍️ Send Test Order
              </button>
              <button 
                onClick={() => setMessages([])}
                className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-xl font-bold text-[9px] uppercase transition-all"
              >
                🗑️ Clear Chat
              </button>
            </div>
          </div>

          {/* Chat Monitor */}
          <div className="bg-zinc-900 p-5 rounded-2xl border border-white/5 h-[400px] flex flex-col shadow-xl">
            <h3 className="text-[10px] font-black uppercase mb-4 text-cyan-500 tracking-widest italic flex justify-between">
              <span>Chat Monitor</span>
              <span className="text-zinc-600">{messages.length}</span>
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 custom-scrollbar">
              {messages.length === 0 && (
                <div className="text-center mt-10">
                  <p className="text-4xl mb-2">💬</p>
                  <p className="text-[8px] text-zinc-700 uppercase font-black italic">No messages yet...</p>
                </div>
              )}
              
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  className={`p-3 rounded-lg text-xs ${m.username.includes("ADMIN") ? "bg-cyan-900/20 border border-cyan-500/30" : "bg-black/40 border border-white/5"}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[8px] font-black uppercase ${m.username.includes("ADMIN") ? "text-cyan-400" : "text-zinc-500"}`}>
                      {m.username}
                    </span>
                    <span className="text-[7px] text-zinc-600">
                      {new Date(m.timestamp).toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-zinc-200 font-medium leading-relaxed">{m.text}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
              <input 
                value={adminReply} 
                onChange={(e) => setAdminReply(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && sendReply()} 
                placeholder={isConnected ? "Type reply..." : "Reconnecting..."}
                disabled={!isConnected}
                className="flex-1 bg-black border border-white/10 rounded-lg p-3 text-[11px] text-white outline-none focus:border-cyan-600 disabled:opacity-50"
              />
              <button 
                onClick={sendReply} 
                disabled={!isConnected || !adminReply.trim()}
                className="bg-cyan-600 disabled:bg-zinc-700 text-black px-4 py-2 rounded-lg text-[10px] font-black uppercase active:scale-95 transition-all"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-xl shadow-2xl text-xs font-bold animate-bounce">
          ⚠️ {error}
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1a1a1a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
        
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: #06b6d4;
          border-radius: 50%;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}