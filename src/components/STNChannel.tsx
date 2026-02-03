"use client";

export default function STNChannel() {
  // तपाईँको YouTube भिडियो ID
  const videoId = "C_6S1C_F_2A"; 

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      {/* YouTube Iframe - यसले पुरै स्क्रिन भरिन्छ */}
      <iframe
        className="absolute top-0 left-0 w-full h-full border-0"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1`}
        title="STN Global Live"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      {/* बायाँ कुनामा 'STN LIVE KITCHEN' नाम */}
      <div className="absolute top-10 left-10 flex items-center gap-3 pointer-events-none z-50">
        <div className="relative flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
        </div>
        <span className="text-sm font-black text-white uppercase tracking-[0.5em] bg-black/70 backdrop-blur-xl px-6 py-3 rounded-xl border border-white/20 shadow-2xl">
          STN LIVE KITCHEN
        </span>
      </div>

      {/* दायाँ कुनामा 'CLOSE' बटन */}
      <button 
        onClick={() => window.location.reload()} 
        className="absolute top-10 right-10 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-full z-[100] shadow-2xl transition-all hover:scale-105 active:scale-95"
      >
        ✕ CLOSE PLAYER
      </button>

      {/* भिडियो माथि ट्याप गर्दा अनम्युट हुने हिन्ट (अलि तल) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none z-50">
        <p className="text-[10px] text-white/30 uppercase tracking-[0.5em] animate-pulse">
          Global Broadcasting Active
        </p>
      </div>
    </div>
  );
}