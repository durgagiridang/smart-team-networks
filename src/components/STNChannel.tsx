"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function STNChannel() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // तपाईँको Cloudflare Tunnel लिङ्क र MediaMTX को HLS पाथ
    // Puranai localhost ko setting ma pharkana yo update garnuhos
const streamUrl = "http://localhost:8081/hls/live.m3u8";
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari को लागि
      video.src = streamUrl;
    } else if (Hls.isSupported()) {
      // Chrome/Edge/Firefox को लागि
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 0,
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.log("Auto-play failed:", e));
      });

      return () => {
        hls.destroy();
      };
    }
  }, []);

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
      <video
        ref={videoRef}
        controls
        autoPlay
        muted // ब्राउजरमा अटो-प्ले हुन म्युट हुनैपर्छ
        playsInline
        className="w-full h-full object-cover"
      />
      {/* Live Indicator Overlay */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
        <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-black/40 px-2 py-1 rounded">
          STN LIVE KITCHEN
        </span>
      </div>
    </div>
  );
}