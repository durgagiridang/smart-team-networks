"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);

  // १. तपाईँको एडमिन इमेल (अथोरिटी चेक गर्न)
  const ADMIN_EMAIL = "durga98578giri22921@gmail.com"; 

  useEffect(() => {
    // सुरक्षा: यदि लगइन छैन वा इमेल एडमिनको होइन भने होमपेजमा पठाइदिने
    if (status === "unauthenticated" || (session && session.user?.email !== ADMIN_EMAIL)) {
      router.push("/");
    }

    // यदि एडमिन हो भने मात्र डेटा तान्ने
    if (session?.user?.email === ADMIN_EMAIL) {
      fetch('/api/admin/bookings')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setBookings(data.data);
        });
    }
  }, [session, status, router]);

  // २. स्टेटस अपडेट गर्ने फङ्सन (Confirm/Reject)
  const updateStatus = async (id: string, newStatus: string) => {
    const res = await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    
    if (res.ok) {
      // पेज रिफ्रेस नगरी लिस्ट अपडेट गर्ने
      setBookings(bookings.map(b => b._id === id ? { ...b, status: newStatus } : b));
    }
  };

  // लोड भइरहेको बेला देखिने
  if (status === "loading") return <div className="p-10 text-white bg-black min-h-screen">Checking authority...</div>;

  // यदि एडमिन होइन भने केही नदेखाउने (useEffect ले पहिले नै रिडाइरेक्ट गरिसक्छ)
  if (!session || session.user?.email !== ADMIN_EMAIL) return null;

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-cyan-400 tracking-tighter uppercase">Admin Panel</h1>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase font-bold">Logged in as</p>
          <p className="text-sm text-cyan-500">{session.user?.email}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 shadow-2xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800/80 text-gray-400 text-xs uppercase tracking-widest">
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Table Info</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <tr key={b._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-white">{b.userName}</p>
                    <p className="text-xs text-gray-500">{b.userEmail}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-cyan-400 font-black">{b.tableNo}</span>
                    <p className="text-[10px] text-gray-500">{b.guestCount} Guests</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                      b.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {b.status === 'Pending' ? (
                      <button 
                        onClick={() => updateStatus(b._id, 'Confirmed')}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-xs font-black transition-all shadow-lg shadow-cyan-900/20"
                      >
                        CONFIRM
                      </button>
                    ) : (
                      <span className="text-gray-600 text-[10px] font-bold italic">No action needed</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-500">No bookings found in database.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}