"use client";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function STNChannel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource("/live.m3u8");
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, async () => {
        await video.play();
        setPlaying(true);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = "/live.m3u8";
      video.addEventListener("loadedmetadata", async () => {
        await video.play();
        setPlaying(true);
      });
    } else {
      alert("Browser does not support HLS.");
    }
  };

  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/5">
      {!playing ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <button onClick={handlePlay} className="bg-red-600 hover:bg-red-700 text-white font-black px-6 py-3 rounded-full flex items-center gap-2 animate-pulse">▶ Play STN Channel</button>
        </div>
      ) : (
        <video ref={videoRef} muted playsInline controls className="w-full h-full" />
      )}
    </div>
  );
}