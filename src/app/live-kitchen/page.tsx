"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Eye, VideoOff } from "lucide-react";
import Hls from "hls.js";

export default function LiveKitchen() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 🔥 CHANGE ONLY THIS IP
    const streamURL = "http://192.168.1.64:8080/hls/index.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls({
        lowLatencyMode: true,
        backBufferLength: 30,
      });

      hls.loadSource(streamURL);
      hls.attachMedia(video);

      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamURL;
    }
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 flex flex-col items-center">

      {/* HEADER */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-lg mb-6 flex justify-between items-center"
      >
        <div>
          <h1 className="text-xl font-bold italic tracking-tight">
            Order #STN-992
          </h1>
          <p className="text-xs text-gray-500">
            From: Smart Nepali Khaja
          </p>
        </div>

        <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/30">
          <ShieldCheck size={14} className="text-green-400" />
          <span className="text-[10px] text-green-400 font-bold uppercase">
            Verified Kitchen
          </span>
        </div>
      </motion.div>

      {/* LIVE VIDEO */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-lg aspect-video bg-neutral-900 rounded-[32px] overflow-hidden border border-white/5 shadow-2xl"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          controls
          playsInline
          className="w-full h-full object-cover"
        />

        {/* LIVE BADGE */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span className="text-[9px] font-black tracking-widest uppercase">
            LIVE
          </span>
        </div>
      </motion.div>

      {/* TRUST MESSAGE */}
      <p className="mt-6 text-center px-10 text-[10px] text-gray-600 italic">
        Tapai ko khana kasari pakkirahechha — live hernus.
        Transparency nai hamro bishwas ho.
      </p>

      {/* FULL SCREEN BUTTON */}
      <button className="mt-8 w-full max-w-lg bg-cyan-500 hover:bg-cyan-600 text-black font-black py-5 rounded-[24px] flex items-center justify-center gap-3">
        <Eye size={20} />
        Full Screen View
      </button>
    </div>
  );
}
