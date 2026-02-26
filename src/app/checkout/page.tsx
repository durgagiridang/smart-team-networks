'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import PaymentMethods from '@/components/PaymentMethods';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1); // 1: Address, 2: Payment
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (items.length === 0 && !orderComplete) {
    router.push('/cart');
    return null;
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      alert("ठेगाना राख्नुहोस्!");
      return;
    }
    setStep(2);
  };

  const handlePaymentComplete = async (method: string, paymentData: any) => {
    setLoading(true);
    
    // ✅ Get userId from auth or localStorage or guest
    const userId = user?.id || localStorage.getItem('userId') || `guest_${Date.now()}`;
    
    // ✅ Check if user is logged in (optional - remove if guest order allowed)
    if (!user?.id && !localStorage.getItem('userId')) {
      alert("कृपया पहिले login गर्नुहोस्!");
      router.push('/login');
      setLoading(false);
      return;
    }
    
    try {
      // Create Order
      const res = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,  // ✅ Now sending userId
          items,
          total,
          address,
          paymentMethod: method,
          paymentData,
          status: method === 'cod' ? 'pending' : 'payment_pending'
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        clearCart();
        setOrderComplete(true);
        setTimeout(() => {
          router.push('/orders');
        }, 2000);
      } else {
        alert("अर्डर फेल भयो: " + data.message);
      }
    } catch (err) {
      console.error('Order error:', err);
      alert("इन्टरनेट चेक गर्नुहोस्");
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-400">अर्डर सफल भयो!</h2>
          <p className="text-gray-400 mt-2">Order History मा जाँदैछ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pb-24">
      {/* Header */}
      <div className="p-4 bg-gradient-to-br from-cyan-900 via-black to-cyan-900">
        <div className="flex items-center gap-4">
          <button onClick={() => step === 2 ? setStep(1) : router.back()} className="text-2xl">←</button>
          <h1 className="text-xl font-black">
            {step === 1 ? 'ठेगाना' : 'भुक्तानी'} (Step {step}/2)
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Summary */}
        <div className="bg-[#1a1a1a] rounded-xl p-4">
          <h2 className="font-bold mb-3">अर्डर सारांश</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 border-b border-white/10 text-sm">
              <span>{item.name} x{item.quantity}</span>
              <span className="text-cyan-400">Rs. {item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 font-bold text-lg">
            <span>जम्मा</span>
            <span className="text-cyan-400">Rs. {total}</span>
          </div>
        </div>

        {step === 1 ? (
          /* Step 1: Address */
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div className="bg-[#1a1a1a] rounded-xl p-4">
              <h2 className="font-bold mb-3">डेलिभरी ठेगाना</h2>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="पूरा ठेगाना लेख्नुहोस्..."
                className="w-full bg-black border border-white/20 rounded-xl p-3 text-white h-24 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl"
            >
              अगाडि बढ्नुहोस् →
            </button>
          </form>
        ) : (
          /* Step 2: Payment */
          <div className="space-y-4">
            <div className="bg-[#1a1a1a] rounded-xl p-4">
              <h2 className="font-bold mb-4">भुक्तानी विधि छान्नुहोस्</h2>
              <PaymentMethods 
                amount={total} 
                onPaymentComplete={handlePaymentComplete}
              />
            </div>

            {loading && (
              <div className="text-center py-4">
                <div className="animate-spin inline-block w-8 h-8 border-2 border-cyan-500 rounded-full"></div>
                <p className="text-sm text-gray-400 mt-2">Processing...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}