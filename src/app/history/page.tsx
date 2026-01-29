"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Booking {
  _id: string;
  userName: string;
  userEmail: string;
  restaurantName: string;
  tableNo: string;
  guestCount: number;
  status: string;
  date: string;
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // १. बुकिङ रद्द (Delete) गर्ने फङ्सन
  const deleteBooking = async (id: string) => {
    if (!confirm("के तपाईँ यो बुकिङ रद्द गर्न चाहनुहुन्छ?")) return;

    try {
      const res = await fetch(`/api/restaurant?id=${id}`, { method: 'DELETE' });
      const result = await res.json();
      
      if (result.success) {
        // डिलिट भएपछि लिस्टबाट त्यो बुकिङ हटाउने
        setBookings(prev => prev.filter(b => b._id !== id));
      } else {
        alert("रद्द गर्न सकिएन: " + result.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          const res = await fetch(`/api/restaurant?email=${session.user.email}`);
          const result = await res.json();
          if (result.success) {
            setBookings(result.data);
          }
        } catch (error) {
          console.error("Error fetching history:", error);
        } finally {
          setLoading(false);
        }
      } else if (status === "unauthenticated") {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [status, session]);

  if (loading) return <div className="p-10 text-white">Loading history...</div>;
  if (status === "unauthenticated") return <div className="p-10 text-white">Please login to see history.</div>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Your Bookings</h1>
      <div className="grid gap-4 max-w-2xl">
        {bookings.length > 0 ? (
          bookings.map((b) => (
            <div key={b._id} className="p-5 border border-gray-700 rounded-2xl bg-gray-800 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-black text-cyan-400">{b.restaurantName || "Smart Nepali Khaja"}</h2>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className="text-gray-400">Table: <span className="text-white font-bold">{b.tableNo}</span></p>
                    <p className="text-gray-400">Guests: <span className="text-white font-bold">{b.guestCount}</span></p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    b.status === 'Pending' ? 'bg-yellow-600/20 text-yellow-500 border border-yellow-500/50' : 'bg-green-600/20 text-green-500 border border-green-500/50'
                  }`}>
                    {b.status}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                <p className="text-[10px] text-gray-500 uppercase">{new Date(b.date).toLocaleString()}</p>
                
                {/* २. क्यान्सल बटन */}
                <button 
                  onClick={() => deleteBooking(b._id)}
                  className="text-[11px] font-black bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-xl border border-red-500/30 transition-all duration-200 uppercase"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-10 bg-gray-800 rounded-2xl border border-dashed border-gray-600">
            <p className="text-gray-400">No bookings found for {session?.user?.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}