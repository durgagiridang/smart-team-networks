"use client"; 
import React, { useState, useEffect } from 'react'
import RestaurantModal from "@/components/RestaurantModal"; 
import STNChannel from '@/components/STNChannel'; 
import dynamic from 'next/dynamic'; 
import ServiceCard from '@/components/Home/ServiceCard'
import ServiceLoader from '@/components/Home/ServiceLoader';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";

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
      
      {/* १. एनिमेसन */}
      {isAnimating && (
        <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center">
          <h1 className="text-7xl font-black italic tracking-tighter text-cyan-500 animate-pulse">STN</h1>
          <p className="mt-8 text-cyan-300 text-[10px] tracking-[0.5em] uppercase font-bold">Broadcasting...</p>
        </div>
      )}

      {/* २. STN Channel - यसले कार्डहरूलाई छोप्छ (Fixed Z-Index) */}
      {showSTNChannel && !isAnimating && (
        <div className="fixed inset-0 z-[9999] bg-black w-screen h-screen overflow-hidden">
           <STNChannel />
        </div>
      )}

      {/* ३. होम पेजका सामग्रीहरू */}
      <div className="relative z-10">
          <div className="p-6 pt-10 bg-gradient-to-br from-cyan-900 via-black to-cyan-900 border-b border-cyan-500/20">
            <h1 className="text-cyan-400 text-2xl font-black italic tracking-tighter uppercase">Smart Team Networks</h1>
            <p className="text-cyan-300 text-sm mt-2">{session ? `नमस्ते, ${session.user?.name} 🙏` : "Hello, Welcome to STN"}</p>
          </div>

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
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-2xl border-t border-white/5 flex justify-around items-center z-50">
        <Link href="/" className="flex flex-col items-center gap-1 text-cyan-400">
          <span className="text-2xl">🏠</span>
          <span className="text-[10px] font-black uppercase">Home</span>
        </Link>
      </div>
    </div>
  )
}

export default Page;