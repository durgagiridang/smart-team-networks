"use client";
import { useEffect, useState, useRef } from "react";

export default function KitchenMonitor() {
  const [orders, setOrders] = useState<any[]>([]);
  const prevOrderCount = useRef(0);

  // १. साउन्ड बजाउने फङ्सन
  const playNotification = () => {
    const audio = new Audio("/notification.mp3");
    audio.play().catch(() => console.log("Click on page to enable sound"));
  };

  // २. अर्डर तान्ने + Auto Refresh
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const json = await res.json();
      const allOrders = json.success ? json.data : json;

      if (Array.isArray(allOrders)) {
        // केवल Pending अर्डर मात्र देखाउने
        const pending = allOrders.filter((o: any) => o.status === "Pending");

        // नयाँ अर्डर आए साउन्ड बजाउने
        if (pending.length > prevOrderCount.current) {
          playNotification();
        }
        prevOrderCount.current = pending.length;
        setOrders(pending);
      }
    } catch (err) {
      console.error("Kitchen fetch error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const id = setInterval(fetchOrders, 5000);
    return () => clearInterval(id);
  }, []);

  // ३. मार्क रेडी गर्ने (API सँग मेल खाने गरी)
  const markReady = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH", // तपाईँको API PATCH हो
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Ready" }) // 'Ready' नै पठाउनुपर्छ
      });

      if (res.ok) {
        // सफ्टवेयरले सक्सेस मानेपछि मात्र लिस्टबाट हटाउने
        setOrders(prev => prev.filter(o => o._id !== id));
        prevOrderCount.current -= 1;
      }
    } catch (err) {
      console.error("Mark ready error:", err);
    }
  };

  if (!orders.length)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-500 animate-pulse text-xl">कुनै अर्डर छैन, रसोई शान्त छ !</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-black mb-8 border-l-4 border-yellow-500 pl-4 uppercase">
        Kitchen Monitor 👨‍🍳
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order: any) => (
          <div key={order._id} className="bg-zinc-900 p-6 rounded-3xl border-2 border-red-500/20 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] bg-white text-black px-2 py-1 rounded font-bold">ID: {order._id.slice(-5)}</p>
              <span className="text-red-500 text-xs font-black animate-pulse">● {order.status}</span>
            </div>

            <div className="space-y-2 mb-6">
              {order.items?.map((it: any, idx: number) => (
                <div key={idx} className="flex justify-between border-b border-gray-800 pb-1">
                  <span className="font-bold">{it.name}</span>
                  <span className="text-yellow-500">x{it.quantity || 1}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4">
              <span className="text-cyan-400 font-black text-xl">Rs. {order.totalAmount}</span>
              <button
                onClick={() => markReady(order._id)}
                className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-xl text-xs font-black uppercase transition-all active:scale-95"
              >
                Mark Ready ✅
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}