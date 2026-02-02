"use client";

export default function STNChannel() {
  // YouTube भिडियोको ID (v= पछाडिको भाग)
  const videoId = "C_6S1C_F_2A"; 

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`}
        title="STN Music Player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>

      {/* Live Status Overlay */}
      <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
        <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
        <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-black/40 px-2 py-1 rounded">
          STN GLOBAL LIVE
        </span>
      </div>
    </div>
  );
}