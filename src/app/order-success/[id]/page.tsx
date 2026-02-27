'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/orders/user/${localStorage.getItem('userId')}`);
      const data = await res.json();
      if (data.success) {
        const found = data.orders.find((o: any) => o._id === orderId);
        setOrder(found);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-4">
      <div className="max-w-md mx-auto text-center pt-10">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-green-400 mb-2">अर्डर सफल भयो!</h1>
        <p className="text-gray-400 mb-6">तपाईंको अर्डर प्राप्त भयो</p>

        <div className="bg-[#1a1a1a] rounded-xl p-6 text-left mb-6">
          <p className="text-sm text-gray-400">अर्डर आईडी</p>
          <p className="font-mono text-cyan-400 mb-4">{orderId}</p>
          
          <p className="text-sm text-gray-400">जम्मा रकम</p>
          <p className="text-2xl font-bold text-white">रु. {order?.total || 0}</p>
          
          <p className="text-sm text-gray-400 mt-4">स्थिति</p>
          <p className="text-yellow-400">⏳ पेन्डिङ</p>
        </div>

        <div className="space-y-3">
          <Link 
            href="/orders"
            className="block w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl"
          >
            मेरो अर्डरहरू हेर्नुहोस्
          </Link>
          <Link 
            href="/"
            className="block w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl"
          >
            अझै पसल गर्नुहोस्
          </Link>
        </div>
      </div>
    </div>
  );
}