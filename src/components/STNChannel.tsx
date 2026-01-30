"use client";
import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function STNPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource("/live.m3u8");
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = "/live.m3u8";
    }
  }, []);

  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10">
      <video ref={videoRef} muted playsInline controls className="w-full h-full" />
    </div>
  );
}