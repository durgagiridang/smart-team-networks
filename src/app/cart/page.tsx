'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total, itemCount, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (!user) {
      toast.error('कृपया पहिले लगइन गर्नुहोस्');
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold mb-2">कार्ट खाली छ</h2>
        <p className="text-gray-400 mb-6">केही सामान थप्नुहोस्</p>
        <Link href="/" className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold transition-colors">
          पसल हेर्नुहोस्
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pb-32">
      {/* हेडर */}
      <div className="p-4 bg-gradient-to-br from-cyan-900 via-black to-cyan-900 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-2xl hover:text-cyan-400">←</button>
            <h1 className="text-xl font-black">मेरो कार्ट ({itemCount})</h1>
          </div>
          <button 
            onClick={clearCart}
            className="text-red-400 text-sm hover:text-red-300"
          >
            सबै हटाउनुहोस्
          </button>
        </div>
      </div>

      {/* कार्ट आइटमहरू */}
      <div className="p-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-[#1a1a1a] rounded-xl p-4 flex gap-4 border border-white/10">
            <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center text-3xl">
              {item.image || '🛍️'}
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-gray-400">{item.vendorName}</p>
              <p className="text-cyan-400 font-bold">रु. {item.price}</p>
              
              {/* परिमाण */}
              <div className="flex items-center gap-3 mt-2">
                <button 
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="font-bold w-8 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  +
                </button>
                <span className="ml-auto text-gray-400">
                  रु. {item.price * item.quantity}
                </span>
              </div>
            </div>
            <button 
              onClick={() => {
                removeFromCart(item.id);
                toast.success('हटाइयो');
              }}
              className="text-red-400 hover:text-red-300 self-start"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* सारांश */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 border-t border-white/10 backdrop-blur-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-gray-400 text-sm">जम्मा ({itemCount} वस्तु):</span>
            <p className="text-2xl font-black text-cyan-400">रु. {total}</p>
          </div>
        </div>
        <button 
          onClick={handleCheckout}
          className="w-full bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <span>अर्डर गर्नुहोस्</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}