"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";

type Booking = {
  _id: string;
  restaurantName: string;
  tableNo: string;
  guestCount: number;
  date: string;
  status: string;
  service: string;
};

export default function HistoryPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (session?.user?.email) {
        try {
          // Hamro naya API route use garne jasle email filter garchha
          const res = await fetch(`/api/restaurant?email=${session.user.email}`);
          const result = await res.json();
          if (result.success) {
            setBookings(result.data);
          }
        } catch (error) {
          console.error("Error fetching bookings:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookings();
  }, [session]);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pb-32">
      {/* Header */}
      <div className="p-6 pt-12 bg-gradient-to-b from-cyan-900/20 to-transparent flex items-center gap-4">
        <Link href="/" className="w-10 h-10 bg-[#1E1E1E] rounded-full flex items-center justify-center border border-white/10">
          <span className="text-cyan-400 text-xl font-bold">❮</span>
        </Link>
        <div>
          <h1 className="text-xl font-black tracking-tight italic uppercase">Booking History</h1>
          <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">Smart Team Networks</p>
        </div>
      </div>

      {/* History List */}
      <div className="p-4 space-y-4">
        {loading ? (
          <div className="text-center py-20 text-cyan-500 animate-pulse font-bold uppercase text-xs">Connecting to Database...</div>
        ) : bookings.length > 0 ? (
          bookings.map((item) => (
            <div
              key={item._id}
              className="bg-[#181818] border border-white/5 p-5 rounded-[32px] flex justify-between items-center transition-all hover:border-cyan-500/30"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#222] rounded-2xl flex items-center justify-center text-2xl border border-white/5">
                  {item.service === "Rider & Parcel" ? "🛵" : "📋"}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-200">
                    {item.restaurantName || "Smart Nepali Khaja"}
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Table: {item.tableNo} | Guests: {item.guestCount}
                  </p>
                  <p className="text-[9px] text-cyan-700 font-mono mt-1 uppercase">
                    ID: {item._id.slice(-6)}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="bg-green-500/10 text-green-500 text-[8px] px-3 py-1 rounded-full font-black uppercase border border-green-500/20">
                  {item.status || "Confirmed"}
                </div>
                <p className="text-[9px] text-gray-600 mt-2 font-bold">
                  {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-600">
            <p className="text-sm font-bold uppercase tracking-widest">No Bookings Found</p>
            <p className="text-[10px] mt-2">Pahila restaurant book garnuhos.</p>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#121212]/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center px-6 z-50">
        <Link href="/" className="flex flex-col items-center gap-1 text-gray-500">
          <span className="text-2xl">🏠</span>
          <span className="text-[8px] font-black uppercase tracking-tighter">Home</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-1 text-cyan-400">
          <span className="text-2xl">📋</span>
          <span className="text-[8px] font-black uppercase tracking-tighter border-b-2 border-cyan-400">History</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 text-gray-500">
          <span className="text-2xl">👤</span>
          <span className="text-[8px] font-black uppercase tracking-tighter">Profile</span>
        </Link>
      </div>
    </div>
  );
}