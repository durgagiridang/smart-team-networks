"use client";

export default function STNChannel() {
  const videoId = "C_6S1C_F_2A"; 

  return (
    // 'h-screen' ले पुरै स्क्रिनको उचाई लिन्छ
    <div className="fixed inset-0 w-full h-screen bg-black overflow-hidden z-50">
      <iframe
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3`}
        title="STN Global Live"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>

      {/* Live Status Overlay - यसलाई अलि आकर्षक बनाइएको छ */}
      <div className="absolute top-6 left-6 flex items-center gap-3 pointer-events-none z-10">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
        </div>
        <span className="text-xs font-black text-white uppercase tracking-[0.2em] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
          STN LIVE KITCHEN
        </span>
      </div>
    </div>
  );
}