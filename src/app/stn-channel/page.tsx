"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Hls from 'hls.js';

// Types
type ChatMessage = {
  id: number;
  username: string;
  text: string;
  type: 'user' | 'merchant' | 'system';
  timestamp: string;
};

export default function STNChannelPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  
  // सुरुमै आवाज आउने बनाउन false राखिएको छ
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [newsTicker, setNewsTicker] = useState("🚀 STN CHANNEL: नेपालकै पहिलो AI-Driven लाइभ सपिङ प्लेटफर्ममा स्वागत छ! • पसलको लाइभ दृश्य हेर्दै सिधै सामान अर्डर गर्नुहोस् • Smart Team Networks 🔥");
  const [currentTime, setCurrentTime] = useState<string>("");

  // १. समय र सकेट जडान
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);

    // १. पहिले सकेट जडान गर्ने
    const SERVER_URL = 'https://smart-team-networks.onrender.com';
    const socket = io(SERVER_URL);
    socketRef.current = socket; // यहाँ सुरक्षित रूपमा स्टोर गर्ने

    // २. अब मात्र .on() चलाउने (पक्का भयो कि socket खाली छैन)
    socket.on('broadcast-news', (updatedNews: string) => setNewsTicker(updatedNews));
    socket.on('message', (message: ChatMessage) => setMessages(prev => [...prev, message]));
    
    return () => {
      clearInterval(timer);
      socket.disconnect(); // Cleanup गर्दा पनि सिधै भेरिएबल प्रयोग गर्ने
    };
  }, []);

  // २. HLS Player Setup
  useEffect(() => {
    let hls: Hls;
    const streamUrl = 'http://192.168.1.65:8000/test-video';

    if (videoRef.current) {
      if (Hls.isSupported()) {
        hls = new Hls({ 
            maxBufferLength: 10, 
            lowLatencyMode: true,
            enableWorker: true,
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(videoRef.current);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoRef.current?.play().catch(() => console.log("Play blocked"));
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR: hls.startLoad(); break;
              case Hls.ErrorTypes.MEDIA_ERROR: hls.recoverMediaError(); break;
              default: hls.destroy(); break;
            }
          }
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = streamUrl;
      }
    }
    return () => hls?.destroy();
  }, []);

  // ३. च्याट स्क्रोलिङ
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const joinChat = () => { if (username.trim()) setIsJoined(true); };
  
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isJoined) return;
    socketRef.current?.emit('send-message', { text: newMessage, username });
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      
      {/* Header - Logo थपिएको र डिजाइन सुधारिएको */}
      <header className="bg-black/95 border-b border-white/5 p-4 z-50 backdrop-blur-md shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.push('/')} 
            className="text-cyan-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all flex items-center gap-2"
          >
            <span className="text-lg">←</span> Exit
          </button>
          
          <div className="flex items-center gap-3">
            {/* Logo Container */}
            <div className="w-20 h-20 rounded-full border border-cyan-500/30 overflow-hidden bg-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <img 
                  src="/logo.png" 
                  alt="STN Logo" 
                  className="w-full h-full object-contain p-1"
                  onError={(e) => { e.currentTarget.src = "https://ui-avatars.com/api/?name=STN&background=06b6d4&color=fff"; }}
                />
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
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden text-white">
        
        {/* VIDEO SECTION */}
        <div className="flex-1 relative bg-slate-950 flex flex-col">
          <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
            <video 
              ref={videoRef} 
              className="w-full h-full max-h-full object-contain" 
              controls      // अडियो कन्ट्रोलको लागि अनिवार्य
              muted={isMuted} 
              playsInline 
              autoPlay 
            />
            
            {/* Unmute/Mute Toggle */}
            <div className="absolute bottom-6 left-6 flex gap-3 z-20">
                <button 
                  onClick={() => setIsMuted(!isMuted)} 
                  className="bg-black/60 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase hover:bg-cyan-500 transition-all shadow-2xl"
                >
                  {isMuted ? '🔇 Unmute Sound' : '🔊 Audio Active'}
                </button>
            </div>
          </div>

          {/* Featured Product */}
          <div className="h-32 bg-gradient-to-t from-black to-slate-950 p-4 flex gap-4 overflow-x-auto scrollbar-hide border-t border-white/5 shrink-0">
            <div className="min-w-[240px] bg-white/5 backdrop-blur-2xl border border-white/10 p-3 rounded-2xl flex items-center gap-3 group hover:border-cyan-500/5 transition-all text-white">
                <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-2xl">👗</div>
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
        <div className="w-full lg:w-[380px] bg-slate-950 border-l border-white/5 flex flex-col shrink-0 text-white">
          <div className="p-4 border-b border-white/5 bg-slate-900/30 flex justify-between items-center text-white">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Live Interaction</h3>
            <span className="text-[10px] text-green-500 font-black flex items-center gap-1.5 uppercase">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-white">
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
                <button onClick={joinChat} className="w-full bg-white text-black p-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-cyan-500 transition-all">Join Chat</button>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`p-3 rounded-xl text-xs ${msg.username === 'Merchant' ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-white/5 border border-white/5'}`}>
                      <span className={`font-black uppercase text-[10px] block mb-1 tracking-wider ${msg.username === 'Merchant' ? 'text-cyan-400' : 'text-slate-500'}`}>
                        {msg.username}
                      </span>
                      <p className="text-slate-200 leading-relaxed">{msg.text}</p>
                    </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {isJoined && (
            <form onSubmit={sendMessage} className="p-4 bg-slate-900/50 border-t border-white/5 text-white">
              <div className="relative text-white">
                <input 
                  type="text" 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)} 
                  placeholder="Ask merchant anything..." 
                  className="w-full bg-black border border-white/10 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 pr-12 text-white" 
                />
                <button type="submit" className="absolute right-2.5 top-2 bg-cyan-600 p-1.5 rounded-lg text-xs">GO</button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer News Marquee */}
      <footer className="h-12 bg-red-700 border-t-2 border-yellow-500 flex items-center overflow-hidden shrink-0">
        <div className="bg-yellow-500 text-black px-4 h-full flex items-center font-black italic text-xs z-10 shadow-xl">NEWS FEED</div>
        <div className="flex-1 whitespace-nowrap overflow-hidden">
          <div className="animate-marquee inline-block text-xl font-black italic uppercase py-3">
            {newsTicker} &nbsp;&nbsp; • &nbsp;&nbsp; {newsTicker}
          </div>
        </div>
        <style jsx>{`
          .animate-marquee { animation: marquee 30s linear infinite; }
          @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        `}</style>
      </footer>
    </div>
  );
}