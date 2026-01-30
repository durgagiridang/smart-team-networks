"use client";
import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface Props {
  videoUrl?: string;
}

const STNChannel: React.FC<Props> = ({ videoUrl = "/live.m3u8" }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
      });
    }
  }, [videoUrl]);

  return (
    <div className="w-full h-full bg-black relative">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        autoPlay
        muted
        playsInline
      />
    </div>
  );
};

export default STNChannel;