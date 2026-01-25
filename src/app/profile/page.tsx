"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      if (session?.user?.email) {
        const res = await fetch(`/api/restaurant?email=${session.user.email}`);
        const result = await res.json();
        if (result.success) setBookingCount(result.data.length);
      }
    };
    fetchStats();
  }, [session]);

  if (!session) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-black italic text-cyan-500">MY PROFILE</h1>
        <button 
          onClick={() => signOut()} 
          className="text-xs font-bold text-red-500 border border-red-500/30 px-4 py-2 rounded-full"
        >
          LOGOUT
        </button>
      </div>

      {/* User Card */}
      <div className="bg-gradient-to-br from-[#181818] to-[#121212] p-8 rounded-[40px] border border-white/5 shadow-2xl mb-8 flex flex-col items-center">
        <div className="relative">
          <img 
            src={session.user?.image || ""} 
            className="w-24 h-24 rounded-full border-4 border-cyan-500/20 p-1" 
            alt="Profile"
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-[#181818] rounded-full"></div>
        </div>
        <h2 className="mt-4 text-xl font-bold">{session.user?.name}</h2>
        <p className="text-gray-500 text-sm">{session.user?.email}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#181818] p-6 rounded-3xl border border-white/5">
          <p className="text-3xl font-black text-cyan-400">{bookingCount}</p>
          <p className="text-xs font-bold text-gray-500 uppercase mt-1">Total Bookings</p>
        </div>
        <div className="bg-[#181818] p-6 rounded-3xl border border-white/5 opacity-50">
          <p className="text-3xl font-black text-gray-400">0</p>
          <p className="text-xs font-bold text-gray-500 uppercase mt-1">Rider Trips</p>
        </div>
      </div>
    </div>
  );
}