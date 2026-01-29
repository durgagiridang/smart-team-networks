"use client";

import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Router थपियो

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
}

export default function RestaurantModal({ isOpen, onClose, restaurantName }: ModalProps) {
  const { data: session, status } = useSession();
  const router = useRouter(); // Redirect गर्नका लागि
  const [tableNo, setTableNo] = useState("T-1");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // Success UI को लागि state

  if (!isOpen) return null;

  const handleBooking = async () => {
    if (status === "loading") return; 

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
      service: "Restaurant",
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
        setShowSuccess(true); // Alert को सट्टा Success UI देखाउने
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

  // बुकिङ सफल भएपछिको 'Success' मेसेज बक्स
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <div className="bg-[#181818] border border-green-500/50 w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Booking Success!</h2>
          <p className="text-gray-400 mb-8">तपाईँको टेबल सुरक्षित भयो। विवरण इतिहासमा हेर्नुहोस्।</p>
          <button 
            onClick={() => {
              setShowSuccess(false);
              onClose();
              router.push('/history'); // हिस्ट्री पेजमा लैजाने
            }}
            className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-green-900/20"
          >
            Go to History
          </button>
        </div>
      </div>
    );
  }

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