"use client";

import React, { useState } from 'react';
import { useSession } from "next-auth/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
}

export default function RestaurantModal({ isOpen, onClose, restaurantName }: ModalProps) {
  const { data: session, status } = useSession(); // status le session check garchha
  const [tableNo, setTableNo] = useState("T-1");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleBooking = async () => {
    // 1. Session load bhairā-chhha ki chhaina check garne
    if (status === "loading") return; 

    // 2. Tapaile bhannu-bhāyēko naya login check logic
    if (!session?.user) {
      alert("Kripaya pahila Google bata Login garnuhos!");
      return;
    }
    
    setLoading(true);
    const bookingData = {
      userName: session.user?.name,
      userEmail: session.user?.email,
      restaurantName: restaurantName,
      tableNo: tableNo,
      guestCount: guests,
      service: "Restaurant", // Database ma filter garna sajilo hunchha
      status: "Pending",
      date: new Date()
    };

    try {
      const res = await fetch('/api/restaurant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Table Booked Successfully!");
        onClose();
        // Refresh garera profile ma count update garna
        window.location.reload(); 
      } else {
        alert("❌ Error: " + (data.error || "Booking failed"));
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("❌ Server connection error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#181818] border border-cyan-500/30 w-full max-w-md rounded-3xl p-6 shadow-2xl shadow-cyan-500/10 animate-in zoom-in duration-200">
        <h2 className="text-xl font-black text-cyan-400 mb-2">{restaurantName}</h2>
        <p className="text-gray-400 text-sm mb-6">Afno table ra guest sankhya chhannuhos.</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Table</label>
            <select 
              value={tableNo} 
              onChange={(e) => setTableNo(e.target.value)}
              className="w-full bg-[#0F0F0F] border border-white/10 p-3 rounded-xl mt-1 outline-none text-white focus:border-cyan-500 appearance-none"
            >
              <option>T-1</option>
              <option>T-2</option>
              <option>T-3</option>
              <option>T-4</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Number of Guests</label>
            <input 
              type="number" 
              min="1" 
              value={guests} 
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full bg-[#0F0F0F] border border-white/10 p-3 rounded-xl mt-1 outline-none text-white focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button 
            onClick={onClose} 
            className="flex-1 py-3 font-bold text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleBooking}
            disabled={loading}
            className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-black transition-all disabled:opacity-50 shadow-lg shadow-cyan-900/20"
          >
            {loading ? "Booking..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}