"use client";
import { useState } from 'react';

export default function STNChannel() {
  const videoId = "9kB0YsNpcAg"; 
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      {/* भिडियो प्लेयर */}
      <iframe
        className="absolute top-0 left-0 w-full h-full border-0 scale-[1.02]"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&iv_load_policy=3`}
        title="STN Live Feed"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      {/* अडियो अन गर्ने बटन - जब सम्म म्युट हुन्छ तब सम्म मात्र देखिन्छ */}
      {isMuted && (
        <button 
          onClick={() => setIsMuted(false)}
          className="absolute inset-0 w-full h-full bg-black/40 flex flex-col items-center justify-center z-[50] transition-all hover:bg-black/20"
        >
          <div className="bg-cyan-500 p-8 rounded-full animate-bounce shadow-[0_0_30px_rgba(6,182,212,0.5)]">
             <span className="text-5xl text-white">🔊</span>
          </div>
          <p className="mt-6 text-white font-black tracking-[0.5em] uppercase bg-black/60 px-6 py-3 rounded-full border border-white/20 backdrop-blur-md">
            Tap to enable Audio
          </p>
        </button>
      )}

      {/* ब्रान्डिङ कुनामा */}
      <div className="absolute top-10 left-10 flex items-center gap-3 z-[100] pointer-events-none">
        <div className="relative h-4 w-4 bg-red-600 rounded-full animate-ping"></div>
        <span className="text-white font-black tracking-[0.4em] bg-black/60 px-6 py-3 rounded-xl border border-white/20 uppercase text-[10px]">
          STN LIVE KITCHEN
        </span>
      </div>

      {/* बन्द गर्ने बटन */}
      <button 
        onClick={() => window.location.reload()} 
        className="absolute top-10 right-10 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-full z-[101] shadow-2xl transition-transform hover:scale-105"
      >
        ✕ CLOSE PLAYER
      </button>
    </div>
  );
}