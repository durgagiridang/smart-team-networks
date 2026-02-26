"use client";
import { useState } from 'react';

export default function STNChannel() {
  const videoId = "9kB0YsNpcAg"; 
  const [isMuted, setIsMuted] = useState(true);

  return (
    /* fixed inset-0 र z-[999999] ले कार्डहरूलाई पूर्ण रूपमा छोप्छ */
    <div className="fixed inset-0 w-screen h-screen bg-black z-[999999] overflow-hidden flex items-center justify-center">
      
      {/* १. भिडियो प्लेयर: scale-[1.05] ले कुनाका काला धर्का हटाउँछ */}
      <iframe
        className="absolute top-0 left-0 w-full h-full border-0 scale-[1.05]"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&iv_load_policy=3`}
        title="STN Live"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      {/* २. अडियो अन गर्ने ठुलो बटन (यो भिडियोको सबैभन्दा माथि देखिन्छ) */}
      {isMuted && (
        <button 
          onClick={() => setIsMuted(false)}
          className="absolute inset-0 w-full h-full bg-black/50 flex flex-col items-center justify-center z-[1000000] transition-all hover:bg-black/30"
        >
          <div className="bg-cyan-500 p-10 rounded-full animate-bounce shadow-[0_0_50px_cyan]">
             <span className="text-6xl">🔊</span>
          </div>
          <p className="mt-8 text-white font-black tracking-[0.5em] uppercase bg-black/80 px-10 py-4 rounded-full border-2 border-cyan-500/50 backdrop-blur-xl">
            Tap to enable Audio
          </p>
        </button>
      )}

      {/* ३. नाम र बन्द गर्ने रातो बटन */}
      <div className="absolute top-10 left-10 flex items-center gap-3 z-[1000001] pointer-events-none">
        <div className="h-4 w-4 bg-red-600 rounded-full animate-ping"></div>
        <span className="text-white font-black tracking-[0.4em] bg-black/60 px-6 py-3 rounded-xl border border-white/20 uppercase text-[10px]">
          STN LIVE KITCHEN
        </span>
      </div>

      <button 
        onClick={() => window.location.reload()} 
        className="absolute top-10 right-10 bg-red-600 hover:bg-red-700 text-white font-bold px-12 py-5 rounded-full z-[1000002] shadow-2xl transition-all hover:scale-110 active:scale-95"
      >
        ✕ CLOSE PLAYER
      </button>
    </div>
  );
}