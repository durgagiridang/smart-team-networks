"use client";

import React, { useState, useEffect } from 'react'
import RestaurantModal from "@/components/RestaurantModal";
import ServiceCard from '@/components/Home/ServiceCard'
import ServiceLoader from '@/components/Home/ServiceLoader';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

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

const navItems = [
  { href: "/", icon: "🏠", label: "Home" },
  { href: "/history", icon: "📜", label: "History" },
  { href: "/profile", icon: "👤", label: "Profile" },
];

function Page() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);
  const [merchants, setMerchants] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // १. लगइन चेक गर्ने
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);

    const timer = setTimeout(() => setIsLoading(false), 2000);

    const fetchMerchants = async () => {
      try {
        // ब्राउजरको hostname बाट आफैँ सही IP एड्रेस पत्ता लगाउने
        const currentHost = window.location.hostname;
        const backendUrl = `http://${currentHost}:8000/api/merchants_list`;

        const response = await fetch(backendUrl, { cache: 'no-store' });
        const data = await response.json();
        
        if (data && data.length > 0) {
          setMerchants(data);
        }
      } catch (err) {
        console.error("❌ ब्याकइन्ड अफलाइन छ...");
        // सर्भर नचल्दा देखिने नमुना डेटा
        setMerchants([{
          _id: 'temp-1',
          business_name: 'Smart Team Fashion',
          city: 'Dang',
          category: 'Fashion & Boutique',
          phone: '9847852880',
          cctv_url: ''
        }]);
      }
    };

    fetchMerchants();
    return () => clearTimeout(timer);
  }, []);

  // २. WhatsApp अर्डर ह्यान्डल गर्ने फङ्सन
  const handleOrder = (phoneNumber: string, shopName: string) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("अर्डर गर्नको लागि कृपया पहिले लगइन वा दर्ता गर्नुहोस्।");
      router.push('/login');
      return;
    }

    const text = `नमस्ते ${shopName}, मलाई STN Networks मार्फत तपाईंको पसलको सामान मन पर्यो। के यो उपलब्ध छ?`;
    const encodedText = encodeURIComponent(text);
    const cleanPhone = phoneNumber.replace(/\D/g, ''); 
    window.open(`https://wa.me/977${cleanPhone}?text=${encodedText}`, '_blank');
  };

  const handleServiceClick = (label: string) => {
    if (label === "Restaurant") {
      setIsRestModalOpen(true);
    } else {
      router.push('/stn-channel');
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-[#0F0F0F] text-white overflow-x-hidden font-sans">
      
      {/* Header */}
      <div className="p-6 pt-10 bg-gradient-to-br from-cyan-900 via-black to-cyan-900 border-b border-cyan-500/20">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-cyan-400 text-2xl font-black italic tracking-tighter uppercase">Smart Team Networks</h1>
            <p className="text-cyan-300 text-[10px] mt-1 font-bold tracking-widest uppercase">
              {isLoggedIn ? "✅ Connected to Network" : "👋 Welcome to STN"}
            </p>
          </div>
          {!isLoggedIn && (
            <Link href="/login" className="bg-cyan-500 text-black px-5 py-2 rounded-full text-[10px] font-black uppercase shadow-lg shadow-cyan-500/30 transition-all active:scale-90">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Services Grid */}
      <div className="p-4">
        <h2 className="font-bold text-sm mb-4 text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-1 h-4 bg-cyan-500 rounded-full"></span> 
          Our Services
        </h2>
        {isLoading ? <ServiceLoader /> : (
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

      {/* Live Shopping Section */}
      <div className="p-4 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-black text-xl text-white uppercase tracking-tighter flex items-center gap-3 italic">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            Live Shopping 📹
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {merchants.map((merchant) => (
            <div 
              key={merchant._id}
              className="group relative bg-slate-900/40 rounded-[35px] border border-white/5 overflow-hidden transition-all hover:border-cyan-500/40 shadow-2xl"
            >
              <div className="relative h-64 bg-black">
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <span className="bg-red-600 text-[9px] px-2 py-1 rounded-md font-black uppercase tracking-tighter shadow-lg">LIVE FEED</span>
                </div>
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center italic text-gray-700 text-xs">
                    Camera Connecting...
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent"></div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-black text-lg text-white tracking-tight uppercase italic">{merchant.business_name}</h3>
                    <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mt-0.5">
                      📍 {merchant.city} • {merchant.category}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-2">
                  <button 
                    onClick={() => router.push('/stn-channel')}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black py-4 rounded-2xl border border-white/10 uppercase tracking-widest transition-all"
                  >
                    Details
                  </button>
                  <button 
                    onClick={() => handleOrder(merchant.phone || "9800000000", merchant.business_name)}
                    className="flex-[1.5] bg-cyan-600 hover:bg-white hover:text-black text-white text-[10px] font-black py-4 rounded-2xl shadow-xl shadow-cyan-600/20 uppercase tracking-[0.2em] transition-all active:scale-95"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-3xl border-t border-white/5 flex justify-around items-center z-50 rounded-t-[30px]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-cyan-400 scale-110' : 'text-gray-500'}`}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Restaurant Modal */}
      <RestaurantModal 
        isOpen={isRestModalOpen} 
        onClose={() => setIsRestModalOpen(false)} 
        restaurantName="Smart Nepali Khaja" 
      />
    </div>
  );
}

export default Page;