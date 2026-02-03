"use client"; 

import React, { useState, useEffect } from 'react'
import RestaurantModal from "@/components/RestaurantModal"; 
import STNChannel from '@/components/STNChannel'; 
import dynamic from 'next/dynamic'; 
import ServiceCard from '@/components/Home/ServiceCard'
import ServiceLoader from '@/components/Home/ServiceLoader';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";

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
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);
  const [showSTNChannel, setShowSTNChannel] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleServiceClick = (label: string) => {
    if (label === "Restaurant") {
      setIsRestModalOpen(true);
    } else if (label === "STN Channel") {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        setShowSTNChannel(true);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-[#0F0F0F] text-white overflow-x-hidden">
      
      {/* १. च्यानल खुल्दा आउने एनिमेसन (सिधै फुल स्क्रिन) */}
      {isAnimating && (
        <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center">
          <h1 className="text-7xl font-black italic tracking-tighter text-cyan-500 animate-pulse">STN</h1>
          <p className="mt-8 text-cyan-300 text-[10px] tracking-[0.5em] uppercase font-bold">Broadcasting...</p>
        </div>
      )}

      {/* २. STN Channel Overlay (डेस्कटपको कर्नर सम्म टम्म पुग्ने) */}
      {showSTNChannel && !isAnimating && (
        <div className="fixed inset-0 z-[9999] bg-black w-full h-full overflow-hidden">
           <STNChannel />
        </div>
      )}

      {/* ३. मुख्य वेबसाइटको भाग */}
      <div className="p-6 pt-10 bg-gradient-to-br from-cyan-900 via-black to-cyan-900 border-b border-cyan-500/20">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-cyan-400 text-2xl font-black italic tracking-tighter uppercase">Smart Team Networks</h1>
          {session && (
            <div className="flex items-center gap-3 bg-white/5 p-1 pr-3 rounded-full border border-white/10">
              <img src={session.user?.image || "/default-avatar.png"} alt="user" className="w-8 h-8 rounded-full border border-cyan-500" />
              <button onClick={() => signOut()} className="text-[10px] font-bold text-red-400">Logout</button>
            </div>
          )}
        </div>
        <p className="text-cyan-300 text-sm">{session ? `नमस्ते, ${session.user?.name} 🙏` : "Hello, Tapailai k chahiyeko cha?"}</p>
        <div className="mt-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center px-4 py-3">
          <input type="text" placeholder="Search services..." className="bg-transparent outline-none text-sm w-full text-white" />
        </div>
      </div>

      {/* सेवाहरूको ग्रिड */}
      <div className="p-4">
        <h2 className="font-bold text-lg mb-4 text-white uppercase tracking-tighter flex items-center gap-2">
          <span className="w-1 h-5 bg-cyan-500 rounded-full"></span> Hamile Pardan Garne Sewaharu
        </h2>
        {isLoading ? <ServiceLoader /> : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {services.map((service, index) => (
              <ServiceCard key={index} label={service.label} icon={service.icon} onClick={() => handleServiceClick(service.label)} />
            ))}
          </div>
        )}
      </div>

      <RestaurantModal isOpen={isRestModalOpen} onClose={() => setIsRestModalOpen(false)} restaurantName="Smart Nepali Khaja" />

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-2xl border-t border-white/5 flex justify-around items-center z-50">
        <Link href="/" className="flex flex-col items-center gap-1 text-cyan-400">
          <span className="text-2xl">🏠</span>
          <span className="text-[10px] font-black uppercase">Home</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-1 text-gray-600">
          <span className="text-2xl">📋</span>
          <span className="text-[10px] font-black uppercase">History</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 text-gray-600">
          <span className="text-2xl">👤</span>
          <span className="text-[10px] font-black uppercase">Profile</span>
        </Link>
      </div>
    </div>
  )
}

export default Page;