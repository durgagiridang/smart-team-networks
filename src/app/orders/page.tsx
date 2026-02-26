'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/orders/user/${user?.id}`);
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pb-20">
      <div className="p-4 bg-gradient-to-br from-cyan-900 via-black to-cyan-900">
        <h1 className="text-xl font-black">मेरो अर्डरहरू</h1>
      </div>
      
      <div className="p-4 space-y-4">
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p className="text-4xl mb-4">📦</p>
            <p>कुनै अर्डर छैन</p>
          </div>
        ) : (
          orders.map((order: any) => (
            <div key={order._id} className="bg-[#1a1a1a] rounded-xl p-4">
              <p>Order #{order._id}</p>
              <p>Status: {order.status}</p>
              <p>Total: Rs. {order.total}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}