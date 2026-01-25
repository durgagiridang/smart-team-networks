"use client"; 

import React, { useState, useEffect } from 'react'
import RestaurantModal from "@/components/RestaurantModal"; // 1. Restaurant Modal Import gareko
import dynamic from 'next/dynamic'; 
import ServiceCard from '@/components/Home/ServiceCard'
import ServiceLoader from '@/components/Home/ServiceLoader';
import Link from 'next/link';

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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  
  // Restaurant Modal ko lagi extra state
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);

  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupCoords, setPickupCoords] = useState({ lat: 27.7172, lng: 85.3240 });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Service thichda k hune bhanne function
  const handleServiceClick = (label: string) => {
    if (label === "Restaurant") {
      setIsRestModalOpen(true); // Restaurant bhaye Modal kholne
    } else {
      setSelectedService(label); // Aru bhaye purano Rider modal kholne
    }
  };

  const handleConfirm = async () => {
    if (!pickupAddress || !dropoffLocation) {
      alert("Address haru bharnuhos!");
      return;
    }

    const bookingData = {
      service: selectedService,
      pickupAddress: pickupAddress, 
      dropoffLocation: dropoffLocation,
      coords: pickupCoords,
      status: "Pending"
    };

    try {
      // Rider ko lagi purano api call (Yo api/bookings ma chha)
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (res.ok) {
        alert("✅ Booking Safal Bhayo!");
        setSelectedService(null);
        setPickupAddress(""); 
        setDropoffLocation("");
      }
    } catch (error) {
      alert("❌ Error aayo, pheri prayas garnuhos.");
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-[#0F0F0F]">
      {/* Header Section */}
      <div className="p-6 pt-10 rounded-b-[30px] shadow-md bg-gradient-to-br from-cyan-900 via-black to-cyan-900">
        <h1 className="text-cyan-400 text-2xl font-black italic">Smart Team Networks</h1>
        <p className="text-cyan-300 text-sm mt-1">Hello, Tapailai k chahiyeko cha?</p>
        <div className="mt-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center px-4 py-3">
          <span className="mr-2">🔍</span>
          <input type="text" placeholder="Search services..." className="bg-transparent outline-none text-sm w-full text-white" />
        </div>
      </div>

      {/* Services Grid */}
      <div className="p-4">
        <h2 className="font-bold text-lg mb-4 px-1 text-white uppercase tracking-tighter">Hamile Pardan Garne Sewaharu</h2>
        {isLoading ? (
          <ServiceLoader />
        ) : (
          <div className="grid grid-cols-3 gap-3">
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

      {/* --- RESTAURANT MODAL (Hamile banayeko naya) --- */}
      <RestaurantModal 
        isOpen={isRestModalOpen} 
        onClose={() => setIsRestModalOpen(false)} 
        restaurantName="Smart Nepali Khaja" 
      />

      {/* --- RIDER & PARCEL MODAL --- */}
      {selectedService === "Rider & Parcel" && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#1E1E1E] w-full max-w-lg rounded-t-[30px] sm:rounded-3xl p-6 border-t border-cyan-500/30 animate-in slide-in-from-bottom duration-300 my-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🛵</span> Rider & Parcel Booking
              </h3>
              <button onClick={() => setSelectedService(null)} className="text-gray-400 text-2xl p-2">×</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-cyan-400 uppercase font-bold tracking-wider">Select Pickup Point on Map</label>
                <MapPicker onLocationSelect={(lat, lng) => setPickupCoords({ lat, lng })} />
              </div>

              <div>
                <label className="text-xs text-cyan-400 uppercase font-bold">Pick-up Address</label>
                <input 
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  type="text" 
                  placeholder="Tole wa Ghar ko nam..." 
                  className="w-full bg-[#2A2A2A] border border-[#444] p-3 rounded-xl mt-1 text-white outline-none focus:border-cyan-500 transition-all" 
                />
              </div>

              <div>
                <label className="text-xs text-cyan-400 uppercase font-bold">Drop-off Location</label>
                <input 
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  type="text" 
                  placeholder="Kahan puryaune?" 
                  className="w-full bg-[#2A2A2A] border border-[#444] p-3 rounded-xl mt-1 text-white outline-none focus:border-cyan-500 transition-all" 
                />
              </div>
              
              <button 
                onClick={handleConfirm} 
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-cyan-900/40 transition-all active:scale-95 mt-4 mb-2"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- BOTTOM NAVIGATION BAR --- */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#121212]/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center px-6 z-50">
        <Link href="/" className="flex flex-col items-center gap-1 text-cyan-400">
          <span className="text-2xl">🏠</span>
          <span className="text-[10px] font-bold uppercase">Home</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-1 text-gray-500 hover:text-cyan-400 transition-colors">
          <span className="text-2xl">📋</span>
          <span className="text-[10px] font-bold uppercase">History</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 text-gray-500 hover:text-cyan-400 transition-colors">
          <span className="text-2xl">👤</span>
          <span className="text-[10px] font-bold uppercase">Profile</span>
        </Link>
      </div>
    </div>
  )
}

export default Page;