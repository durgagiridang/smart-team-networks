"use client";
import { useState, useEffect, useRef } from "react";

export default function KitchenMonitor() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const prevOrderCount = useRef(0);

  // १. साउन्ड बजाउने फङ्सन
  const playNotification = () => {
    // फाइलको नाम public/notification.mp3 सँग मिल्नुपर्छ
    const audio = new Audio("/notification.mp3"); 
    audio.play().catch((err) => {
      console.log("Audio Error: पेजमा एक पटक क्लिक गर्नुहोस्!", err);
    });
  };

  // २. अर्डर तान्ने लोजिक
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const json = await res.json();
      const allOrders = json.success ? json.data : json;
      const currentPendingOrders = allOrders.filter((o: any) => o.status === 'Pending');

      // यदि नयाँ अर्डर थपियो भने मात्र आवाज बजाउने
      if (currentPendingOrders.length > prevOrderCount.current) {
        playNotification();
      }

      prevOrderCount.current = currentPendingOrders.length;
      setOrders(allOrders);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // ३. मार्क रेडी लोजिक
  const updateStatus = async (orderId: string, newStatus: string) => {
  try {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    const result = await res.json();

    if (result.success) {
      // १. स्क्रिनबाट अर्डर हटाउने
      setOrders(prev => prev.filter(order => order._id !== orderId));
      // २. साउन्ड काउन्ट मिलाउने
      prevOrderCount.current -= 1; 
      console.log("Order updated to Ready!");
    } else {
      console.error("Update failed:", result.error);
    }
  } catch (error) {
    console.error("Status update error:", error);
  }
};

  const pendingOrders = orders.filter((o: any) => o.status === 'Pending');

  return (
    <div className="bg-black min-h-screen text-white p-8 font-sans">
      <h1 className="text-4xl font-black mb-10 text-yellow-500 border-b-4 border-yellow-500 pb-4 uppercase tracking-tighter">
        Kitchen Monitor 👨‍🍳
      </h1>

      {loading && orders.length === 0 ? (
        <p className="animate-pulse text-gray-500 text-center">अर्डरहरू लोड हुँदैछन्...</p>
      ) : pendingOrders.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 rounded-3xl border border-dashed border-gray-700">
           <p className="text-gray-400 italic text-lg">हाल कुनै पनि नयाँ अर्डर छैन।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingOrders.map((order: any) => (
            <div key={order._id} className="p-6 rounded-3xl border-2 border-red-500 bg-red-500/5 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] bg-white text-black px-3 py-1 rounded-full font-black uppercase">
                  ID: ...{order._id.slice(-5)}
                </span>
                <span className="font-black uppercase text-xs text-red-500 animate-pulse">● PENDING</span>
              </div>
              <div className="space-y-3 mb-6">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="font-bold text-lg">{item.name}</span>
                    <span className="text-yellow-500 font-black">x {item.quantity}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => updateStatus(order._id, 'Ready')}
                className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-2xl font-black text-xs uppercase"
              >
                Mark Ready ✅
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}