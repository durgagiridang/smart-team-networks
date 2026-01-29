"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [bookingCount, setBookingCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      // सेसन र युजरको इमेल छ भने मात्र डाटा तान्ने
      if (session?.user?.email) {
        try {
          const res = await fetch(`/api/restaurant?email=${session.user.email}`);
          const result = await res.json();
          // तपाईँको टर्मिनल लग अनुसार यो इमेलको बुकिङ काउन्ट यहाँ अपडेट हुन्छ
          if (result.success) setBookingCount(result.data.length);
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      }
    };
    fetchStats();
  }, [session]);

  // यदि युजर लगइन छैन भने सिधै लगइन पेजमा फर्काइदिने
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-500"></div>
    </div>
  );

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-6 pb-32">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-black italic text-cyan-500 tracking-tighter">MY PROFILE</h1>
        <button 
  onClick={() => signOut({ 
    callbackUrl: "/login", // लगआउट पछि सिधै लगइन पेजमा पठाउने
    redirect: true 
  })} 
  className="..."
>
  SWITCH ACCOUNT / LOGOUT
</button>
      </div>

      {/* User Card */}
      <div className="bg-gradient-to-br from-[#181818] to-[#111111] p-8 rounded-[40px] border border-white/5 shadow-2xl mb-8 flex flex-col items-center">
        <div className="relative">
          <img 
            src={session.user?.image || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} 
            className="w-28 h-28 rounded-full border-4 border-cyan-500/20 p-1 shadow-[0_0_30px_rgba(6,182,212,0.1)]" 
            alt="Profile"
          />
          <div className="absolute bottom-2 right-1 w-6 h-6 bg-green-500 border-4 border-[#181818] rounded-full"></div>
        </div>
        <h2 className="mt-5 text-2xl font-black italic tracking-tight">{session.user?.name}</h2>
        <p className="text-gray-500 text-sm font-medium">{session.user?.email}</p>
        <span className="mt-3 px-4 py-1 bg-cyan-500/10 text-cyan-500 text-[10px] font-bold rounded-full border border-cyan-500/20">
          STN VERIFIED MEMBER
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-b from-[#181818] to-[#121212] p-6 rounded-3xl border border-white/5 shadow-lg">
          <p className="text-4xl font-black text-cyan-400 leading-none">{bookingCount}</p>
          <p className="text-[10px] font-black text-gray-500 uppercase mt-2 tracking-widest">Total Bookings</p>
        </div>
        <div className="bg-[#181818] p-6 rounded-3xl border border-white/5 opacity-40">
          <p className="text-4xl font-black text-gray-500 leading-none">0</p>
          <p className="text-[10px] font-black text-gray-500 uppercase mt-2 tracking-widest">Rider Trips</p>
        </div>
      </div>

      {/* Footer Message */}
      <p className="mt-12 text-center text-gray-600 text-[9px] font-bold uppercase tracking-[0.4em]">
        Nepali ko Sath Nepali kai Bikash
      </p>
    </div>
  );
}