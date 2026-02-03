"use client";

export default function STNChannel() {
  // तपाईँले दिनुभएको नयाँ भिडियो ID
  const videoId = "9kB0YsNpcAg"; 

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black z-[9999] overflow-hidden flex items-center justify-center">
      {/* १. भिडियो प्लेयर - डेस्कटपको पुरै विन्डो भर्ने गरी */}
      <iframe
        className="absolute top-0 left-0 w-full h-full border-0"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&iv_load_policy=3`}
        title="STN Live Channel"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      {/* २. ब्रान्डिङ लेबल - कुनामा */}
      <div className="absolute top-8 left-8 flex items-center gap-3 pointer-events-none z-[10000]">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
        </div>
        <span className="text-xs font-black text-white uppercase tracking-[0.4em] bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
          STN LIVE KITCHEN
        </span>
      </div>

      {/* ३. ठुलो क्लोज बटन - बाहिर निस्कन */}
      <button 
        onClick={() => window.location.reload()} 
        className="absolute top-8 right-8 bg-white/10 hover:bg-red-600 text-white font-bold px-6 py-2 rounded-full z-[10001] backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-2xl"
      >
        ✕ CLOSE
      </button>

      {/* म्युट हटाउन जानकारी */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-[10000]">
        <p className="text-[9px] text-white/40 uppercase tracking-[0.5em] animate-pulse">
          Click Video to Unmute
        </p>
      </div>
    </div>
  );
}