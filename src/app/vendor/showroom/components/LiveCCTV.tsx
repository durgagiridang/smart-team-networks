// src/app/vendor/showroom/components/LiveCCTV.tsx
'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Radio, Users, Video } from 'lucide-react';

interface LiveCCTVProps {
  cctvUrl?: string;
  isLive: boolean;
  vendorId: string;
}

export default function LiveCCTV({ cctvUrl, isLive, vendorId }: LiveCCTVProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  // Demo video URL if no cctvUrl provided
  const videoUrl = cctvUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  return (
    <div 
      className="relative bg-black aspect-video group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={handleLoadedData}
        className="w-full h-full object-cover"
      />

      {isLive && (
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full">
          <Radio className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-bold">LIVE</span>
        </div>
      )}

      <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full">
        <Users className="w-4 h-4" />
        <span className="text-sm">12 watching</span>
      </div>

      {!isPlaying && !isLoading && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/40"
        >
          <button
            onClick={togglePlay}
            className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Play className="w-10 h-10 text-white fill-current ml-1" />
          </button>
        </motion.div>
      )}

      <motion.div
        initial={false}
        animate={{ opacity: showControls ? 1 : 0 }}
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-20 pb-4 px-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="text-white hover:text-red-400 transition-colors">
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button onClick={toggleMute} className="text-white hover:text-red-400 transition-colors">
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
          </div>
          <button className="text-white hover:text-red-400 transition-colors">
            <Maximize className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}