"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, ShieldCheck, Eye, VideoOff } from "lucide-react";

export default function LiveKitchen() {
  const [orderStep] = useState(2); // 2 = Cooking
  // CCTV camera chhaina bhane false rakhnuhos, jodyo bhane true garnuhos
  const [cameraAvailable] = useState(false); 

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 flex flex-col items-center">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-lg mb-6 flex justify-between items-center"
      >
        <div>
          <h1 className="text-xl font-bold italic tracking-tight">Order #STN-992</h1>
          <p className="text-xs text-gray-500">From: Smart Nepali Khaja</p>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/30">
          <ShieldCheck size={14} className="text-green-400" />
          <span className="text-[10px] text-green-400 font-bold uppercase">Verified Kitchen</span>
        </div>
      </motion.div>

      {/* Live Stream Window - Hybrid Logic */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-lg aspect-video bg-neutral-900 rounded-[32px] overflow-hidden border border-white/5 shadow-2xl flex items-center justify-center"
      >
        {cameraAvailable ? (
          <>
            <video 
              autoPlay loop muted playsInline 
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-pizza-in-a-professional-kitchen-4584-large.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/20" />
            <div className="bg-black/40 backdrop-blur-md p-4 rounded-full border border-white/10 pointer-events-none">
              <Play className="text-white fill-white" size={32} />
            </div>
          </>
        ) : (
          /* Offline UI - Tapaile khojeko layout */
          <div className="flex flex-col items-center text-center p-6">
            <div className="relative mb-4">
              <div className="w-20 h-20 bg-red-500/5 rounded-full flex items-center justify-center border border-red-500/10">
                <VideoOff size={32} className="text-red-500/30" />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1 right-1 w-4 h-4 bg-red-600 rounded-full border-4 border-neutral-900" 
              />
            </div>
            <h3 className="text-xs font-black text-gray-300 uppercase tracking-[3px]">
              Kitchen Feed Offline
            </h3>
            <p className="text-[10px] text-gray-600 mt-2 max-w-[220px] leading-relaxed">
              Ahile yo kitchen ma CCTV camera setup bhayeko chhaina. 
              Tapai ko order Cooking stage ma chha.
            </p>
          </div>
        )}

        {/* Live indicator overlay */}
        <div className="absolute top-5 left-5 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
          <div className={`w-2 h-2 rounded-full ${cameraAvailable ? 'bg-red-600 animate-pulse' : 'bg-gray-600'}`} />
          <span className="text-[9px] font-black tracking-widest uppercase">
            {cameraAvailable ? 'Live Feed' : 'Offline'}
          </span>
        </div>
      </motion.div>

      {/* Trust message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center px-10 text-[10px] text-gray-600 leading-relaxed italic"
      >
        Tapai ko khana kasari pakkirahechha, live hernus. Transparency nai hamro thulo bishwas ho.
      </motion.p>

      {/* Progress steps */}
      <div className="w-full max-w-lg mt-10 space-y-8">
        <div className="flex justify-between relative px-4">
          <div className="absolute top-5 left-0 w-full h-[1px] bg-neutral-800 z-0" />
          {[1, 2, 3].map((s) => (
            <div key={s} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${
                  orderStep >= s ? "bg-cyan-500 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]" : "bg-neutral-900 border-neutral-800 text-gray-600"
                }`}
              >
                <span className="text-xs font-black">{s}</span>
              </div>
              <span className={`text-[9px] mt-3 font-black uppercase tracking-widest ${orderStep >= s ? "text-cyan-500" : "text-gray-700"}`}>
                {s === 1 ? "Received" : s === 2 ? "Cooking" : "Delivering"}
              </span>
            </div>
          ))}
        </div>

        {/* Action button */}
        <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-black py-5 rounded-[24px] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-cyan-500/20">
          <Eye size={20} />
          <span className="text-xs uppercase tracking-widest">Full Screen View</span>
        </button>
      </div>
    </div>
  );
}