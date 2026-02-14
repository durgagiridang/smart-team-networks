"use client";

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Types
type ChatMessage = {
  id: number;
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

  useEffect(() => {
    // १. घडी अपडेट गर्ने
    setCurrentTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);

    // २. पुराना म्यासेजहरू Supabase बाट लोड गर्ने
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true });
      
      if (data) setMessages(data);
    };
    fetchMessages();

    // ३. Real-time Subscription: नयाँ म्यासेज आउने बित्तिकै स्क्रिनमा देखाउने
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' }, 
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();
    
    return () => {
      clearInterval(timer);
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const joinChat = () => { if (username.trim()) setIsJoined(true); };
  
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isJoined) return;

    // ४. Supabase मा म्यासेज पठाउने
    const { error } = await supabase
      .from('messages')
      .insert([{ username, text: newMessage }]);

    if (error) {
      console.error("Error sending message:", error.message);
    } else {
      setNewMessage('');
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
            <div className="w-12 h-12 rounded-full border border-cyan-500/30 overflow-hidden bg-slate-900">
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

          <div className="text-[10px] font-mono text-cyan-500 font-bold bg-cyan-500/5 px-3 py-1 rounded-full border border-cyan-500/20">
            {currentTime}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* VIDEO SECTION */}
        <div className="flex-1 relative bg-slate-950 flex flex-col">
          <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
            <iframe 
              className="w-full h-full aspect-video"
              src="https://www.youtube.com/embed/xSc7AcHeYAE?autoplay=1&mute=0" 
              title="STN LIVE"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Featured Product */}
          <div className="h-28 bg-gradient-to-t from-black to-slate-950 p-4 flex gap-4 overflow-x-auto scrollbar-hide border-t border-white/5 shrink-0">
            <div className="min-w-[240px] bg-white/5 backdrop-blur-2xl border border-white/10 p-3 rounded-2xl flex items-center gap-3 group hover:border-cyan-500/5 transition-all text-white">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-xl">👗</div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Today's Hot Deal</p>
                  <p className="text-xs font-black text-white">Cotton Kurti - New</p>
                  <p className="text-cyan-400 text-xs font-black italic">Rs. 1,550</p>
                </div>
                <button className="bg-cyan-600 text-black text-[9px] font-black px-3 py-2 rounded-lg ml-auto">ORDER</button>
            </div>
          </div>
        </div>

        {/* CHAT SECTION */}
        <div className="w-full lg:w-[380px] bg-slate-950 border-l border-white/5 flex flex-col shrink-0">
          <div className="p-4 border-b border-white/5 bg-slate-900/30 flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Live Interaction</h3>
            <span className="text-[10px] text-green-500 font-black flex items-center gap-1.5 uppercase">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!isJoined ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center text-2xl">💬</div>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Your Name..." 
                  className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl text-center text-sm outline-none focus:border-cyan-500 text-white" 
                />
                <button 
                  onClick={joinChat} 
                  className="w-full bg-white text-black p-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-cyan-500 transition-all"
                >
                  Join Chat
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`p-3 rounded-xl text-xs ${msg.username === 'Merchant' ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-white/5 border border-white/5'}`}>
                      <span className={`font-black uppercase text-[10px] block mb-1 tracking-wider ${msg.username === 'Merchant' ? 'text-cyan-400' : 'text-slate-500'}`}>{msg.username}</span>
                      <p className="text-slate-200 leading-relaxed">{msg.text}</p>
                    </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {isJoined && (
            <form onSubmit={sendMessage} className="p-4 bg-slate-900/50 border-t border-white/5">
              <div className="relative">
                <input 
                  type="text" 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)} 
                  placeholder="Type a message..." 
                  className="w-full bg-black border border-white/10 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 pr-12 text-white" 
                />
                <button type="submit" className="absolute right-2.5 top-2 bg-cyan-600 p-1.5 rounded-lg text-xs font-bold text-black">SEND</button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer News Marquee */}
      <footer className="h-10 bg-red-700 border-t-2 border-yellow-500 flex items-center overflow-hidden shrink-0 relative">
        <div className="bg-yellow-500 text-black px-4 h-full flex items-center font-black italic text-[10px] z-10 shadow-xl">NEWS FEED</div>
        <div className="flex-1 whitespace-nowrap overflow-hidden">
          <div className="animate-marquee inline-block text-lg font-black italic uppercase py-3">
            {newsTicker} &nbsp;&nbsp; • &nbsp;&nbsp; {newsTicker}
          </div>
        </div>
      </footer>
      <style jsx>{`
        .animate-marquee { animation: marquee 30s linear infinite; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}