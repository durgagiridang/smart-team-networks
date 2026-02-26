"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNo: string;
}

export default function BookingModal({ isOpen, onClose, tableNo }: BookingModalProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleBooking = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/restaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: session?.user?.email,
          userName: session?.user?.name,
          tableNo: tableNo,
          guestCount: guests,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setShowSuccess(true);
      } else {
        alert("Booking failed: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      {!showSuccess ? (
        // बुकिङ फर्म
        <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Confirm Booking</h2>
          <div className="space-y-4 text-gray-300">
            <p>Table: <span className="text-white font-bold">{tableNo}</span></p>
            <div>
              <label className="block mb-1 text-sm">Number of Guests</label>
              <input 
                type="number" 
                value={guests} 
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-600 p-2 rounded-lg text-white"
                min="1"
              />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={onClose} className="flex-1 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition">Cancel</button>
            <button 
              onClick={handleBooking} 
              disabled={loading}
              className="flex-1 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-500 font-bold transition disabled:opacity-50"
            >
              {loading ? "Booking..." : "Confirm"}
            </button>
          </div>
        </div>
      ) : (
        // Success UI - बुकिङ सफल भएपछि देखिने
        <div className="bg-gray-800 border border-green-500 p-8 rounded-2xl text-center shadow-2xl max-w-sm w-full animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
          <p className="text-gray-400 mb-6">तपाईँको टेबल बुक भयो।</p>
          <button 
            onClick={() => router.push("/history")}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all"
          >
            Go to History
          </button>
        </div>
      )}
    </div>
  );
}