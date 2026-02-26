'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function HomePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pb-20">
      {/* Header */}
      <div className="p-4 bg-gradient-to-br from-cyan-900 via-black to-cyan-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black italic">STN</h1>
            <p className="text-xs text-cyan-400">Smart Team Networks</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">Namaste, {user.name || user.phone}</span>
            <button 
              onClick={logout}
              className="text-red-400 text-sm hover:text-red-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar - अब सही ठाउँमा! */}
      <div className="p-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="पसल खोज्नुहोस्..." 
            className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Categories */}
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Categories</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🍽️', name: 'Food', color: 'bg-orange-600' },
            { icon: '🏨', name: 'Hotel', color: 'bg-blue-600' },
            { icon: '🛵', name: 'Rider', color: 'bg-green-600' },
            { icon: '🏥', name: 'Hospital', color: 'bg-red-600' },
            { icon: '👗', name: 'Fashion', color: 'bg-pink-600' },
            { icon: '💈', name: 'Beauty', color: 'bg-purple-600' },
            { icon: '🎂', name: 'Bakery', color: 'bg-yellow-600' },
            { icon: '🌾', name: 'Farming', color: 'bg-green-700' },
            { icon: '📺', name: 'STN Channel', color: 'bg-cyan-600' },
          ].map((cat, i) => (
            <Link 
              key={i} 
              href={`/category/${cat.name.toLowerCase()}`}
              className={`${cat.color} rounded-xl p-4 text-center hover:scale-105 transition-transform`}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <p className="text-xs font-bold">{cat.name}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Nearby Vendors */}
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Nearby Vendors</h2>
        <div className="space-y-3">
          {[
            { name: 'Royal Restaurant', type: 'Food', distance: '0.5 km', live: true },
            { name: 'Himalayan Hotel', type: 'Hotel', distance: '1.2 km', live: false },
            { name: 'City Fashion', type: 'Fashion', distance: '0.8 km', live: true },
          ].map((vendor, i) => (
            <Link 
              key={i} 
              href={`/store/${i + 1}`}
              className="block bg-[#1a1a1a] rounded-xl p-4 border border-white/10 hover:border-cyan-500 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center text-3xl">
                  🏪
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{vendor.name}</h3>
                  <p className="text-sm text-gray-400">{vendor.type} • {vendor.distance}</p>
                </div>
                {vendor.live && (
                  <span className="bg-red-600 text-xs px-2 py-1 rounded-full animate-pulse">
                    LIVE
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <Link 
          href="/orders"
          className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4 text-center"
        >
          <div className="text-2xl mb-2">📦</div>
          <p className="text-sm font-bold">My Orders</p>
        </Link>
        <Link 
          href="/cart"
          className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4 text-center"
        >
          <div className="text-2xl mb-2">🛒</div>
          <p className="text-sm font-bold">Cart</p>
        </Link>
      </div>
    </div>
  );
}