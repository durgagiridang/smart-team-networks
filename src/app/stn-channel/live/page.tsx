'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type ChatMessage = {
  _id: string;
  username: string;
  text: string;
  timestamp: string;
};

const products = [
  { id: 1, name: "Cotton Kurti - New", price: "1,550", emoji: "👗" },
  { id: 2, name: "Silk Saree - Special", price: "4,200", emoji: "👘" },
  { id: 3, name: "Designer Lehenga", price: "8,500", emoji: "💃" },
  { id: 4, name: "Casual Summer Dress", price: "2,100", emoji: "👗" },
  { id: 5, name: "Party Wear Gown", price: "5,500", emoji: "👗" },
];

export default function STNChannelPage() {
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [orderData, setOrderData] = useState({ name: '', phone: '' });
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/chat');
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) { console.error("Chat error"); }
    };
    fetchMessages();
    const chatInterval = setInterval(fetchMessages, 3000);
    return () => { clearInterval(timer); clearInterval(chatInterval); };
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const joinChat = () => { if (username.trim()) setIsJoined(true); };
  
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isJoined) return;
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, text: newMessage }),
      });
      setNewMessage('');
    } catch (error) { console.error("Send error"); }
  };

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderData.name || !orderData.phone) return alert("नाम र नम्बर राख्नुहोस्!");
    
    setIsOrdering(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          customerName: orderData.name,
          phone: orderData.phone,
          productName: selectedProduct.name,
          orderType: 'Live-Order'
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        alert(`सफल! ${selectedProduct.name} अर्डर भयो।`);
        setShowOrderForm(false);
        setOrderData({ name: '', phone: '' });
      } else {
        alert("अर्डर फेल भयो: " + (result.error || "Unknown Error"));
      }
    } catch (error) {
      alert("इन्टरनेट चेक गर्नुहोस् र फेरि प्रयास गर्नुहोस्।");
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="bg-black/95 border-b border-white/5 p-4 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/')} className="text-cyan-500 font-black text-xs">← EXIT</button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border border-cyan-500 overflow-hidden">
              <img src="/logo.png" alt="STN" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-sm font-black text-white hidden sm:block uppercase">STN LIVE CHANNEL</h1>
          </div>
          <div className="text-[10px] font-mono text-cyan-500">{currentTime}</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 relative bg-slate-950 flex flex-col">
          <div className="flex-1 relative bg-black">
            <iframe className="w-full h-full aspect-video" src="https://www.youtube.com/embed/xSc7AcHeYAE?autoplay=1&mute=0" frameBorder="0" allowFullScreen></iframe>
          </div>
          
          {/* Product Slider */}
          <div className="h-32 bg-gradient-to-t from-black to-slate-950 p-4 flex gap-4 overflow-x-auto scrollbar-hide border-t border-white/5">
            {products.map((p) => (
              <div key={p.id} className="min-w-[240px] bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center gap-3">
                <div className="text-2xl">{p.emoji}</div>
                <div className="flex-1">
                  <p className="text-[10px] text-cyan-400 font-bold uppercase">{p.name}</p>
                  <p className="text-xs font-black">Rs. {p.price}</p>
                </div>
                <button onClick={() => { setSelectedProduct(p); setShowOrderForm(true); }} className="bg-cyan-600 text-black text-[10px] font-black px-3 py-2 rounded-lg">ORDER</button>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Section */}
        <div className="w-full lg:w-[350px] bg-slate-950 border-l border-white/5 flex flex-col">
          <div className="p-4 border-b border-white/5 bg-slate-900/30 text-[10px] font-bold uppercase text-slate-400">Live Chat</div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {!isJoined ? (
              <div className="space-y-4">
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your Name" className="w-full bg-slate-900 p-3 rounded-xl border border-white/10" />
                <button onClick={joinChat} className="w-full bg-cyan-600 text-black p-3 rounded-xl font-bold">JOIN</button>
              </div>
            ) : (
              messages.map((m) => (
                <div key={m._id} className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="text-cyan-500 font-bold text-[10px] uppercase">{m.username}</span>
                  <p className="text-xs text-slate-200">{m.text}</p>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>
          {isJoined && (
            <form onSubmit={sendMessage} className="p-4 border-t border-white/5">
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type..." className="w-full bg-black p-3 rounded-xl border border-white/10 text-xs" />
            </form>
          )}
        </div>
      </main>

      {/* Order Popup */}
      {showOrderForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90">
          <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-3xl p-6">
            <h2 className="text-cyan-500 font-black mb-4 uppercase">Confirm Order</h2>
            <div className="bg-white/5 p-4 rounded-xl mb-4 flex items-center gap-4">
              <span className="text-3xl">{selectedProduct.emoji}</span>
              <div>
                <p className="font-bold">{selectedProduct.name}</p>
                <p className="text-cyan-400">Rs. {selectedProduct.price}</p>
              </div>
            </div>
            <form onSubmit={submitOrder} className="space-y-3">
              <input required type="text" value={orderData.name} onChange={(e) => setOrderData({...orderData, name: e.target.value})} placeholder="Your Name" className="w-full bg-black p-4 rounded-xl border border-white/10" />
              <input required type="tel" value={orderData.phone} onChange={(e) => setOrderData({...orderData, phone: e.target.value})} placeholder="Phone Number" className="w-full bg-black p-4 rounded-xl border border-white/10" />
              <button type="submit" disabled={isOrdering} className="w-full bg-cyan-600 text-black p-4 rounded-xl font-black uppercase">{isOrdering ? 'WAIT...' : 'CONFIRM NOW'}</button>
              <button type="button" onClick={() => setShowOrderForm(false)} className="w-full text-xs text-slate-500 py-2">CANCEL</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}