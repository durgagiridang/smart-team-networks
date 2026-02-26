'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const services = [
  { id: 'restaurant', label: "Restaurant", icon: "😋🍽️", link: '/category/restaurant' },
  { id: 'hotel', label: "Hotel & Lodge", icon: "🏨", link: '/category/hotel' },
  { id: 'rider', label: "Rider & Parcel", icon: "🛵", link: '/category/rider' },
  { id: 'doctor', label: "Doctor's & Hospital", icon: "🏥", link: '/category/doctor' },
  { id: 'tour', label: "Tour & Travel", icon: "✈️", link: '/category/tour' },
  { id: 'fashion', label: "Fashion & Boutique", icon: "👗", link: '/category/fashion' },
  { id: 'beauty', label: "Beauty & Fitness", icon: "💄", link: '/category/beauty' },
  { id: 'bakery', label: "Sweets & Bakery", icon: "🍰", link: '/category/bakery' },
  { id: 'farmer', label: "Farmer & Farming", icon: "🚜", link: '/category/farmer' },
  { id: 'channel', label: "STN Channel", icon: "📺", link: '/stn-channel/live' },
];

export default function HomeClient() {
  const [merchants, setMerchants] = useState([]);
  const [merchantsLoading, setMerchantsLoading] = useState(true);
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    fetch('http://localhost:8000/api/merchants')
      .then(res => res.json())
      .then(data => {
        setMerchants(data.merchants || []);
        setMerchantsLoading(false);
      })
      .catch(() => setMerchantsLoading(false));
  }, []);

  // यो हटाउने - loading ले stuck गराइरहेको छ
  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen pb-24 bg-[#0F0F0F] text-white">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-br from-cyan-900 via-black to-cyan-900">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black italic">STN</h1>
            <p className="text-xs text-cyan-400">Smart Team Networks</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">📍 तुलसिपुर, दाङ</p>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm">Namaste, {user.name || user.phone}</span>
                <button onClick={logout} className="text-red-400 text-xs">Logout</button>
              </div>
            ) : (
              <Link href="/login" className="text-cyan-400 text-sm">Login</Link>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="पसल खोज्नुहोस्..." 
            className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 pl-12 text-white"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2">🔍</span>
        </div>
      </div>

      {/* Categories */}
      <div className="p-4">
        <h2 className="font-bold text-sm mb-4 text-gray-400 uppercase">Our Services</h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {services.map((service) => (
            <Link key={service.id} href={service.link}>
              <div className="bg-[#1a1a1a] hover:bg-[#252525] border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all">
                <span className="text-3xl">{service.icon}</span>
                <span className="text-[9px] font-bold uppercase text-center text-gray-400">
                  {service.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Live Shopping */}
      <div className="p-4">
        <h2 className="font-black text-xl mb-4 flex items-center gap-2">
          <span className="animate-pulse text-red-500">🔴</span>
          Live Shopping ({merchants.length})
        </h2>

        {merchantsLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : merchants.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>कुनै पसल भेटिएन</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {merchants.map((merchant: any) => (
              <Link key={merchant._id} href={`/store/${merchant._id}`}>
                <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500 transition-all">
                  <div className="h-48 bg-black relative">
                    {merchant.cctv_url ? (
                      <iframe src={merchant.cctv_url} className="w-full h-full" allow="autoplay" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <span className="text-4xl">🏪</span>
                      </div>
                    )}
                    {merchant.isLive && (
                      <span className="absolute top-2 left-2 bg-red-600 text-xs px-2 py-1 rounded animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{merchant.business_name}</h3>
                    <p className="text-sm text-gray-400">{merchant.category}</p>
                    <button className="w-full mt-3 bg-cyan-600 text-white py-2 rounded-lg font-bold">
                      Live Showroom हेर्नुहोस् →
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/90 border-t border-white/10 flex justify-around items-center">
        <Link href="/" className="text-cyan-400 flex flex-col items-center">
          <span className="text-xl">🏠</span>
          <span className="text-[10px]">Home</span>
        </Link>
        <Link href="/orders" className="text-gray-400 flex flex-col items-center">
          <span className="text-xl">📦</span>
          <span className="text-[10px]">Orders</span>
        </Link>
        <Link href="/cart" className="text-gray-400 flex flex-col items-center">
          <span className="text-xl">🛒</span>
          <span className="text-[10px]">Cart</span>
        </Link>
        <Link href="/profile" className="text-gray-400 flex flex-col items-center">
          <span className="text-xl">👤</span>
          <span className="text-[10px]">Profile</span>
        </Link>
      </div>
    </div>
  );
}