"use client";
import { useState } from 'react';

export default function STNChannel() {
  const videoId = "9kB0YsNpcAg"; 
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      {/* भिडियो प्लेयर */}
      <iframe
        className="absolute top-0 left-0 w-full h-full border-0 scale-[1.05]"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`}
        title="STN Live"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      {/* अडियो खोल्नका लागि पारदर्शी बटन */}
      {isMuted && (
        <button 
          onClick={() => setIsMuted(false)}
          className="absolute inset-0 z-[50] flex flex-col items-center justify-center bg-black/40 hover:bg-black/20 transition-all"
        >
          <div className="bg-cyan-500 p-8 rounded-full animate-bounce shadow-[0_0_30px_cyan]">
             <span className="text-5xl text-white">🔊</span>
          </div>
          <p className="mt-4 text-white font-black tracking-widest uppercase bg-black/50 px-6 py-2 rounded-full">
            Tap to enable Audio
          </p>
        </button>
      )}

      {/* दायाँ माथि कुनामा बन्द गर्ने बटन */}
      <button 
        onClick={() => window.location.reload()} 
        className="absolute top-10 right-10 bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-4 rounded-full z-[100] shadow-2xl transition-transform hover:scale-105"
      >
        ✕ CLOSE PLAYER
      </button>

      {/* बायाँ माथि कुनामा च्यानलको नाम */}
      <div className="absolute top-10 left-10 flex items-center gap-3 z-[100] pointer-events-none">
        <div className="h-4 w-4 bg-red-600 rounded-full animate-ping"></div>
        <span className="text-white font-black tracking-[0.5em] bg-black/60 px-6 py-3 rounded-xl border border-white/10 uppercase text-xs">
          STN LIVE KITCHEN
        </span>
      </div>
    </div>
  );
}