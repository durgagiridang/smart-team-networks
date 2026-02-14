"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Types
type ChatMessage = {
  _id: string;
  username: string;
  text: string;
  timestamp: string;
};

export default function STNChannelPage() {
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [newsTicker, setNewsTicker] = useState("🚀 STN CHANNEL: नेपालकै पहिलो AI-Driven लाइभ सपिङ प्लेटफर्ममा स्वागत छ! • पसलको लाइभ दृश्य हेर्दै सिधै सामान अर्डर गर्नुहोस् • Smart Team Networks 🔥");
  const [currentTime, setCurrentTime] = useState<string>("");

  // १. घडी र डाटा फेचिङ (Polling)
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
      } catch (err) {
        console.error("Chat sync error");
      }
    };

    fetchMessages(); // सुरुमा लोड गर्ने
    const chatInterval = setInterval(fetchMessages, 3000); // हरेक ३ सेकेन्डमा नयाँ म्यासेज हेर्ने

    return () => {
      clearInterval(timer);
      clearInterval(chatInterval);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const joinChat = () => { if (username.trim()) setIsJoined(true); };
  
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isJoined) return;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, text: newMessage }),
      });

      if (res.ok) {
        setNewMessage('');
        // पठाउने बित्तिकै स्थानीय रूपमा म्यासेज थप्ने (UX को लागि)
        const sentMsg = await res.json();
        setMessages(prev => [...prev, sentMsg]);
      }
    } catch (error) {
      console.error("Error sending message");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="bg-black/95 border-b border-white/5 p-4 z-50 backdrop-blur-md shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/')} className="text-cyan-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">
            <span className="text-lg">←</span> Exit
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-cyan-500/30 overflow-hidden bg-slate-900">
                <img src="/logo.png" alt="STN Logo" className="w-full h-full object-contain p-1" onError={(e) => { e.currentTarget.src = "https://ui-avatars.com/api/?name=STN&background=06b6d4&color=fff"; }} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                  <span className="bg-red-600 px-2 py-0.5 rounded-sm text-[8px] font-black animate-pulse">LIVE</span>
                  <h1 className="text-sm font-black uppercase tracking-tighter text-white">Smart Team Networks - STN</h1>
              </div>
              <p className="text-[8px] text-slate-500 uppercase font-bold mt-0.5 tracking-[0.2em]">Nepal's First AI-Driven Channel</p>
            </div>
          </div>
          <div className="text-[10px] font-mono text-cyan-500 font-bold bg-cyan-500/5 px-3 py-1 rounded-full border border-cyan-500/20">{currentTime}</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 relative bg-slate-950 flex flex-col min-h-0">
          <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
            <iframe className="w-full h-full aspect-video" src="https://www.youtube.com/embed/xSc7AcHeYAE?autoplay=1&mute=0" title="STN LIVE" frameBorder="0" allowFullScreen></iframe>
          </div>
          <div className="h-28 bg-gradient-to-t from-black to-slate-950 p-4 flex gap-4 overflow-x-auto border-t border-white/5 shrink-0 scrollbar-hide">
            <div className="min-w-[240px] bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center gap-3 text-white">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-xl">👗</div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold">Today's Hot Deal</p>
                  <p className="text-xs font-black">Cotton Kurti - New</p>
                  <p className="text-cyan-400 text-xs font-black">Rs. 1,550</p>
                </div>
                <button className="bg-cyan-600 text-black text-[9px] font-black px-3 py-2 rounded-lg ml-auto">ORDER</button>
            </div>
          </div>
        </div>

        {/* CHAT SECTION */}
        <div className="w-full lg:w-[380px] bg-slate-950 border-l border-white/5 flex flex-col shrink-0 min-h-0">
          <div className="p-4 border-b border-white/5 bg-slate-900/30 flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Live Interaction</h3>
            <span className="text-[10px] text-green-500 font-black flex items-center gap-1.5 uppercase">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {!isJoined ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center text-2xl">💬</div>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your Name..." className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl text-sm outline-none text-white focus:border-cyan-500" />
                <button onClick={joinChat} className="w-full bg-white text-black p-4 rounded-xl font-black text-xs uppercase hover:bg-cyan-500 transition-all">Join Chat</button>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                    <div key={msg._id} className="p-3 rounded-xl text-xs bg-white/5 border border-white/5">
                      <span className="font-black uppercase text-[10px] block mb-1 text-cyan-400">{msg.username}</span>
                      <p className="text-slate-200">{msg.text}</p>
                    </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {isJoined && (
            <form onSubmit={sendMessage} className="p-4 bg-slate-900/50 border-t border-white/5">
              <div className="flex gap-2">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 bg-black border border-white/10 p-3 rounded-xl text-xs text-white outline-none focus:border-cyan-500" />
                <button type="submit" className="bg-cyan-600 px-4 py-2 rounded-xl text-xs font-black text-black">SEND</button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer News */}
      <footer className="h-10 bg-red-700 border-t-2 border-yellow-500 flex items-center overflow-hidden shrink-0">
        <div className="bg-yellow-500 text-black px-4 h-full flex items-center font-black italic text-[10px] z-10">NEWS FEED</div>
        <div className="flex-1 whitespace-nowrap overflow-hidden">
          <div className="animate-marquee inline-block text-lg font-black italic uppercase py-3">
            {newsTicker} &nbsp;&nbsp; • &nbsp;&nbsp; {newsTicker}
          </div>
        </div>
      </footer>
      <style jsx>{`
        .animate-marquee { animation: marquee 30s linear infinite; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}