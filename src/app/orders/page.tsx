'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const res = await fetch(`http://localhost:8000/api/orders/user/${userId}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'text-yellow-400',
      confirmed: 'text-blue-400',
      preparing: 'text-orange-400',
      out_for_delivery: 'text-purple-400',
      delivered: 'text-green-400',
      cancelled: 'text-red-400'
    };
    return colors[status] || 'text-gray-400';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'पेन्डिङ',
      confirmed: 'पुष्टि भयो',
      preparing: 'तयार हुँदैछ',
      out_for_delivery: 'डेलिभरीमा',
      delivered: 'डेलिभर भयो',
      cancelled: 'रद्द भयो'
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pb-20">
      {/* Header */}
      <div className="p-4 bg-gradient-to-br from-cyan-900 via-black to-cyan-900">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-2xl">←</button>
          <h1 className="text-xl font-black">मेरो अर्डरहरू</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500">कुनै अर्डर छैन</p>
            <Link href="/" className="inline-block mt-4 bg-cyan-600 px-6 py-3 rounded-xl">
              पसल गर्नुहोस्
            </Link>
          </div>
        ) : (
          orders.map(order => (
            <div key={order._id} className="bg-[#1a1a1a] rounded-xl p-4 border border-white/10">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-400">अर्डर आईडी</p>
                  <p className="font-mono text-sm text-cyan-400">{order._id.slice(-8)}</p>
                </div>
                <span className={`text-sm font-bold ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              
              <div className="space-y-1 mb-3">
                {order.items.map((item: any, idx: number) => (
                  <p key={idx} className="text-sm text-gray-300">
                    {item.name} x {item.quantity}
                  </p>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-white/10">
                <span className="text-gray-400 text-sm">
                  {new Date(order.createdAt).toLocaleDateString('ne-NP')}
                </span>
                <span className="font-bold text-lg">रु. {order.total}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}