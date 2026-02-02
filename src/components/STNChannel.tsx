"use client";

export default function STNChannel() {
  const videoId = "C_6S1C_F_2A"; 

  return (
    <div className="fixed inset-0 w-full h-screen bg-black z-[9999] overflow-hidden">
      {/* Container to handle Aspect Ratio forcing */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] sm:w-full sm:h-full">
        <iframe
          className="w-full h-full pointer-events-none"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1`}
          title="STN Global Live"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>

      {/* Overlay: यो सधैं माथि देखिन्छ */}
      <div className="absolute top-8 left-6 flex items-center gap-3 pointer-events-none">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
        </div>
        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-2xl">
          STN LIVE KITCHEN
        </span>
      </div>

      {/* Unmute Button Hint: मोबाइलमा आवाज खोल्न सजिलो होस् भनेर */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none">
        <span className="text-[10px] text-white/40 uppercase tracking-widest animate-bounce">
          Tap to unmute
        </span>
      </div>
    </div>
  );
}