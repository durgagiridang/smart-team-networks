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
  
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [newsTicker, setNewsTicker] = useState("🚀 STN CHANNEL: नेपालकै पहिलो AI-Driven लाइभ सपिङ प्लेटफर्ममा स्वागत छ! • Smart Team Networks 🔥");
  const [currentTime, setCurrentTime] = useState<string>("");

  // १. समय र ब्याकेन्ड कनेक्सन (Socket.io)
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);

    // ब्याकेन्ड लिङ्क - Render को लाइभ URL प्रयोग गरिएको छ
    const SERVER_URL = 'https://smart-team-networks.onrender.com';
    socketRef.current = io(SERVER_URL);
    
    socketRef.current.on('broadcast-news', (updatedNews: string) => setNewsTicker(updatedNews));
    socketRef.current.on('message', (message: ChatMessage) => setMessages(prev => [...prev, message]));
    
    return () => {
      clearInterval(timer);
      socketRef.current?.disconnect();
    };
  }, []);

  // २. भिडियो प्लेयर सेटअप (HLS)
  useEffect(() => {
    let hls: Hls;
    // यहाँ तपाईँको नयाँ भिडियो फाइलको लिङ्क हालिएको छ
    const streamUrl = 'https://smart-team-networks.onrender.com/media/live/test/2026-02-13 15-07-17.m3u8';

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
            videoRef.current?.play().catch(() => console.log("Auto-play blocked"));
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
                  <h1 className="text-sm font-black uppercase text-white">Smart Team Networks</h1>
              </div>
              <p className="text-[8px] text-slate-500 uppercase font-bold">Nepal's First AI-Driven Channel</p>
            </div>
          </div>

          <div className="text-[10px] font-mono text-cyan-500 font-bold px-3 py-1 rounded-full border border-cyan-500/20">
            {currentTime}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* VIDEO SECTION */}
        <div className="flex-1 relative bg-black flex flex-col">
          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            <video ref={videoRef} className="w-full h-full object-contain" controls muted={isMuted} playsInline autoPlay />
            
            <div className="absolute bottom-6 left-6 z-20">
                <button onClick={() => setIsMuted(!isMuted)} className="bg-black/60 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase hover:bg-cyan-500 transition-all">
                  {isMuted ? '🔇 Unmute' : '🔊 Audio On'}
                </button>
            </div>
          </div>

          {/* Featured Product */}
          <div className="h-28 bg-slate-950 p-4 flex gap-4 border-t border-white/5 shrink-0 overflow-x-auto">
            <div className="min-w-[240px] bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-xl">👗</div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Hot Deal</p>
                  <p className="text-xs font-black">Cotton Kurti</p>
                  <p className="text-cyan-400 text-xs font-black">Rs. 1,550</p>
                </div>
                <button className="bg-cyan-600 text-black text-[9px] font-black px-3 py-2 rounded-lg ml-auto">ORDER</button>
            </div>
          </div>
        </div>

        {/* CHAT SECTION */}
        <div className="w-full lg:w-[350px] bg-slate-950 border-l border-white/5 flex flex-col shrink-0">
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase text-slate-400">Live Chat</h3>
            <span className="text-[10px] text-green-500 font-black flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!isJoined ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your Name..." className="w-full bg-slate-900 border border-white/10 p-3 rounded-lg text-sm text-center outline-none focus:border-cyan-500 text-white" />
                <button onClick={joinChat} className="w-full bg-white text-black p-3 rounded-lg font-black text-[10px] uppercase">Join Chat</button>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                    <div key={i} className={`p-2 rounded-lg text-[11px] ${msg.username === 'Merchant' ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-white/5 border border-white/5'}`}>
                      <span className={`font-black uppercase text-[9px] block mb-1 ${msg.username === 'Merchant' ? 'text-cyan-400' : 'text-slate-500'}`}>{msg.username}</span>
                      <p className="text-slate-200">{msg.text}</p>
                    </div>
                ))}
                <div ref={chatEndRef} />
              </>
            )}
          </div>

          {isJoined && (
            <form onSubmit={sendMessage} className="p-4 bg-slate-900/50 border-t border-white/5">
              <div className="relative">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type here..." className="w-full bg-black border border-white/10 p-3 rounded-lg text-xs outline-none focus:border-cyan-500 pr-10 text-white" />
                <button type="submit" className="absolute right-2 top-2 bg-cyan-600 p-1.5 rounded-md text-[10px]">GO</button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer News Marquee */}
      <footer className="h-10 bg-red-700 border-t border-yellow-500 flex items-center overflow-hidden shrink-0">
        <div className="bg-yellow-500 text-black px-3 h-full flex items-center font-black text-[10px] z-10">NEWS</div>
        <div className="flex-1 whitespace-nowrap overflow-hidden">
          <div className="animate-marquee inline-block text-lg font-black italic uppercase py-2">
            {newsTicker} &nbsp;&nbsp; • &nbsp;&nbsp; {newsTicker}
          </div>
        </div>
        <style jsx>{`
          .animate-marquee { animation: marquee 35s linear infinite; }
          @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        `}</style>
      </footer>
    </div>
  );
}