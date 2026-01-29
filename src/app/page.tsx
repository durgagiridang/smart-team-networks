"use client"; 

import React, { useState, useEffect } from 'react'
import RestaurantModal from "@/components/RestaurantModal"; 
import STNChannel from '@/components/STNChannel'; 
import dynamic from 'next/dynamic'; 
import ServiceCard from '@/components/Home/ServiceCard'
import ServiceLoader from '@/components/Home/ServiceLoader';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react"; // Session र SignOut थपियो

const MapPicker = dynamic(() => import('@/components/Home/MapPicker'), { 
  ssr: false,
  loading: () => <div className="h-60 bg-gray-800 animate-pulse rounded-2xl w-full mt-2" />
});

const services = [
  { label: "Restaurant", icon: "😋🍽️" },
  { label: "Hotel & Lodge", icon: "🏨" },
  { label: "Rider & Parcel", icon: "🛵" },
  { label: "Doctor's & Hospital", icon: "🏥" },
  { label: "Tour & Travel", icon: "✈️" },
  { label: "Fashion & Boutique", icon: "👗" },
  { label: "Men's Wear & Apparel", icon: "👕" },
  { label: "Party Place & Banquet", icon: "🎉" },
  { label: "Jobs & Employment", icon: "💼" },
  { label: "Auto Sell & Buy", icon: "🚗" },
  { label: "Beauty & Fitness", icon: "💄" },
  { label: "Sweets & Bakery", icon: "🍰" },
  { label: "Farmer & Farming", icon: "🚜" },
  { label: "STN Channel", icon: "📺" },
];

function Page() {
  const { data: session } = useSession(); // लगइन युजरको डाटा तान्ने
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);
  
  const [showSTNChannel, setShowSTNChannel] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const playWelcomeSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      console.log("Audio play failed", e);
    }
  };

  const handleServiceClick = (label: string) => {
    if (label === "Restaurant") {
      setIsRestModalOpen(true);
    } else if (label === "STN Channel") {
      playWelcomeSound();
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        setShowSTNChannel(true);
      }, 1500);
    } else {
      setSelectedService(label);
      setShowSTNChannel(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-[#0F0F0F] text-white overflow-x-hidden">
      
      {/* --- STN LOGO INTRO ANIMATION --- */}
      {isAnimating && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-in fade-in duration-500">
          <div className="relative">
             <h1 className="text-5xl font-black italic tracking-tighter text-cyan-500 animate-pulse shadow-cyan-500/50 drop-shadow-lg">
               STN
             </h1>
             <div className="absolute -bottom-4 left-0 w-full h-1 bg-cyan-500 animate-out slide-out-to-right fill-mode-forwards duration-1000"></div>
          </div>
          <p className="mt-8 text-cyan-300 text-xs tracking-[0.5em] uppercase font-bold animate-bounce">
            Broadcasting Live...
          </p>
        </div>
      )}

      {/* Header Section */}
      <div className="p-6 pt-10 rounded-b-[30px] shadow-md bg-gradient-to-br from-cyan-900 via-black to-cyan-900 border-b border-cyan-500/20">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-cyan-400 text-2xl font-black italic tracking-tighter">Smart Team Networks</h1>
          
          {/* User Profile & Logout Section */}
          {session && (
            <div className="flex items-center gap-3 bg-white/5 p-1 pr-3 rounded-full border border-white/10">
              <img 
                src={session.user?.image || "/default-avatar.png"} 
                alt="user" 
                className="w-8 h-8 rounded-full border border-cyan-500"
              />
              <button 
                onClick={() => signOut()} 
                className="text-[10px] font-bold text-red-400 uppercase tracking-wider hover:text-red-300"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <p className="text-cyan-300 text-sm mt-1">
          {session ? `नमस्ते, ${session.user?.name} 🙏` : "Hello, Tapailai k chahiyeko cha?"}
        </p>

        <div className="mt-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center px-4 py-3">
          <span className="mr-2">🔍</span>
          <input type="text" placeholder="Search services..." className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-400" />
        </div>
      </div>

      {/* --- STN CHANNEL SECTION --- */}
      {showSTNChannel && !isAnimating && (
        <div className="p-4 animate-in slide-in-from-top duration-700">
           <div className="flex justify-between items-center mb-2 px-2">
              <h2 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">Live Feed Active</h2>
              <button 
                onClick={() => setShowSTNChannel(false)} 
                className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white text-[10px] font-bold px-2 py-1 rounded transition-all"
              >
                CLOSE ×
              </button>
           </div>
           <STNChannel />
        </div>
      )}

      {/* Services Grid */}
      <div className="p-4">
        <h2 className="font-bold text-lg mb-4 px-1 text-white uppercase tracking-tighter flex items-center gap-2">
          <span className="w-1 h-5 bg-cyan-500 rounded-full shadow-[0_0_10px_cyan]"></span>
          Hamile Pardan Garne Sewaharu
        </h2>
        
        {isLoading ? (
          <ServiceLoader />
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {services.map((service, index) => (
              <ServiceCard 
                key={index} 
                label={service.label} 
                icon={service.icon} 
                onClick={() => handleServiceClick(service.label)} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Restaurant Modal */}
      <RestaurantModal 
        isOpen={isRestModalOpen} 
        onClose={() => setIsRestModalOpen(false)} 
        restaurantName="Smart Nepali Khaja" 
      />

      {/* --- BOTTOM NAVIGATION BAR --- */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-2xl border-t border-white/5 flex justify-around items-center px-6 z-50">
        <Link href="/" className="flex flex-col items-center gap-1 text-cyan-400">
          <span className="text-2xl">🏠</span>
          <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-1 text-gray-600 hover:text-cyan-400 transition-all">
          <span className="text-2xl">📋</span>
          <span className="text-[10px] font-black uppercase tracking-tighter">History</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 text-gray-600 hover:text-cyan-400 transition-all">
          <span className="text-2xl">👤</span>
          <span className="text-[10px] font-black uppercase tracking-tighter">Profile</span>
        </Link>
      </div>
    </div>
  )
}

export default Page;