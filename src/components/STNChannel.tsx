"use client";

export default function STNChannel() {
  // परीक्षणका लागि यो एउटा चल्ने भिडियो ID हो। 
  // पछि तपाईँले यसको साटो आफ्नो च्यानलको लाइभ भिडियो ID राख्नुहोला।
  const videoId = "jfKfPfyJRdk"; 

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black z-[9999] overflow-hidden flex items-center justify-center">
      {/* १. भिडियो प्लेयर - डेस्कटपका लागि टम्म मिलाइएको */}
      <iframe
        className="absolute top-0 left-0 w-full h-full border-0 shadow-2xl"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`}
        title="STN Live"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      {/* २. माथि कर्नरमा नाम (Overlay) */}
      <div className="absolute top-10 left-10 flex items-center gap-3 pointer-events-none z-[10000]">
        <div className="relative flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
        </div>
        <span className="text-sm font-black text-white uppercase tracking-[0.4em] bg-black/60 backdrop-blur-lg px-6 py-3 rounded-xl border border-white/20">
          STN LIVE KITCHEN
        </span>
      </div>

      {/* ३. बन्द गर्ने बटन (ठुलो र प्रस्ट) */}
      <button 
        onClick={() => window.location.reload()} 
        className="absolute top-10 right-10 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-full z-[10001] shadow-2xl transition-all hover:scale-105 active:scale-95"
      >
        ✕ CLOSE PLAYER
      </button>

      {/* डेस्कटपमा भिडियो कहिलेकाहीँ म्युटमा खुल्छ, अनम्युट गर्न सिकाउने हिन्ट */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none z-[10000]">
        <p className="text-[10px] text-white/40 uppercase tracking-[0.5em] animate-pulse">
          Tap on video to Unmute
        </p>
      </div>
    </div>
  );
}