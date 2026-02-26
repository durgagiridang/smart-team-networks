'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total, itemCount } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold mb-2">कार्ट खाली छ</h2>
        <p className="text-gray-400 mb-6">केही सामान थप्नुहोस्</p>
        <Link href="/" className="bg-cyan-600 text-white px-6 py-3 rounded-xl font-bold">
          पसल हेर्नुहोस्
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pb-24">
      {/* Header */}
      <div className="p-4 bg-gradient-to-br from-cyan-900 via-black to-cyan-900">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-2xl">←</button>
          <h1 className="text-xl font-black">मेरो कार्ट ({itemCount})</h1>
        </div>
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-[#1a1a1a] rounded-xl p-4 flex gap-4">
            <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center text-3xl">
              🛍️
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-gray-400">{item.vendorName}</p>
              <p className="text-cyan-400 font-bold">Rs. {item.price}</p>
              
              {/* Quantity */}
              <div className="flex items-center gap-3 mt-2">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-bold">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center"
                >
                  +
                </button>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="ml-auto text-red-400 text-sm"
                >
                  हटाउनुहोस्
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/90 border-t border-white/10">
        <div className="flex justify-between mb-4">
          <span className="text-gray-400">जम्मा:</span>
          <span className="text-2xl font-black text-cyan-400">Rs. {total}</span>
        </div>
        <button 
          onClick={() => router.push('/checkout')}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl"
        >
          अर्डर गर्नुहोस् →
        </button>
      </div>
    </div>
  );
}