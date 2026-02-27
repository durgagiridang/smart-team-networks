// src/app/checkout/page.tsx
'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');

  const handleOrder = async () => {
    if (!address) {
      toast.error('ठेगाना भर्नुहोस्');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('stn_token')}`
        },
        body: JSON.stringify({
          items,
          total,
          address,
          phone,
          notes,
          customerId: user?.id
        })
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success('अर्डर सफल भयो!');
        clearCart();
        router.push(`/order-success/${data.orderId}`);
      } else {
        toast.error(data.message || 'अर्डर हुन सकेन');
      }
    } catch (err) {
      toast.error('सर्भरमा समस्या');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold">कार्ट खाली छ</h2>
        <button 
          onClick={() => router.push('/')}
          className="mt-4 bg-cyan-600 px-6 py-3 rounded-xl"
        >
          पसल हेर्नुहोस्
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pb-24">
      {/* Header */}
      <div className="p-4 bg-gradient-to-br from-cyan-900 via-black to-cyan-900">
        <button onClick={() => router.back()} className="text-2xl">←</button>
        <h1 className="text-xl font-black mt-2">चेकआउट</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Order Summary */}
        <div className="bg-[#1a1a1a] rounded-xl p-4">
          <h2 className="font-bold mb-3">अर्डर सारांश</h2>
          {items.map(item => (
            <div key={item.id} className="flex justify-between py-2 border-b border-white/10">
              <span>{item.name} x {item.quantity}</span>
              <span>रु. {item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 font-bold text-lg">
            <span>जम्मा:</span>
            <span className="text-cyan-400">रु. {total}</span>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-4">
          <h2 className="font-bold">डेलिभरी विवरण</h2>
          
          <div>
            <label className="text-sm text-gray-400">फोन नम्बर</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-black/50 border border-white/20 rounded-xl p-3 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">ठेगाना *</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="पूरा ठेगाना लेख्नुहोस्..."
              className="w-full bg-black/50 border border-white/20 rounded-xl p-3 mt-1 h-24"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">नोट्स (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="विशेष अनुरोध..."
              className="w-full bg-black/50 border border-white/20 rounded-xl p-3 mt-1 h-20"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-[#1a1a1a] rounded-xl p-4">
          <h2 className="font-bold mb-3">भुक्तानी विधि</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 bg-black/30 rounded-xl cursor-pointer">
              <input type="radio" name="payment" defaultChecked className="w-5 h-5" />
              <span>🚚 क्यास अन डेलिभरी</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-black/30 rounded-xl cursor-not-allowed opacity-50">
              <input type="radio" name="payment" disabled className="w-5 h-5" />
              <span>💳 अनलाइन भुक्तानी (छिट्टै आउँदैछ)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 border-t border-white/10">
        <button
          onClick={handleOrder}
          disabled={loading || !address}
          className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white font-bold py-4 rounded-xl"
        >
          {loading ? 'प्रक्रियामा...' : `अर्डर गर्नुहोस् (रु. ${total})`}
        </button>
      </div>
    </div>
  );
}