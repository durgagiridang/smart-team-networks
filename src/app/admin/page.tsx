"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function SmartVendorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [prevOrderCount, setPrevOrderCount] = useState(0);

  const ADMIN_EMAIL = "durga98578giri22921@gmail.com";

  // १. नयाँ अर्डरहरू तान्ने र साउन्ड बजाउने लजिक
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const json = await res.json();
      if (json.success) {
        const newOrders = json.data.filter((o: any) => o.status === 'Pending');
        
        // यदि नयाँ अर्डर थपियो भने आवाज बजाउने
        if (newOrders.length > prevOrderCount) {
          playNotificationSound(newOrders[0]?.productName);
        }
        
        setOrders(newOrders);
        setPrevOrderCount(newOrders.length);
      }
    } catch (err) { console.error("Fetch error"); }
  };

  // २. सामान अनुसारको आवाज बजाउने (कुर्तीका लागि पैसाको खनखन)
  const playNotificationSound = (productName: string) => {
    const isFashion = productName?.toLowerCase().includes('kurti') || productName?.toLowerCase().includes('saree');
    const audioPath = isFashion ? '/cash-register.mp3' : '/kitchen-bell.mp3';
    const audio = new Audio(audioPath);
    audio.play().catch(() => console.log("Audio blocked"));
  };

  useEffect(() => {
    if (session?.user?.email === ADMIN_EMAIL) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 5000); // ५ सेकेन्डमा चेक गर्ने
      return () => clearInterval(interval);
    }
  }, [session, prevOrderCount]);

  const updateStatus = async (id: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Ready' }),
    });
    if (res.ok) fetchOrders();
  };

  if (status === "loading") return <div className="bg-black min-h-screen" />;
  if (!session || session.user?.email !== ADMIN_EMAIL) return null;

  return (
    <div className="p-4 sm:p-8 bg-[#0a0a0a] min-h-screen text-white font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-cyan-500 uppercase italic">STN Vendor Desk</h1>
          <p className="text-[10px] text-gray-500 font-mono tracking-widest">LIVE MULTI-VENDOR MONITORING</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-green-500 animate-pulse font-bold">● SYSTEM ONLINE</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => {
          // ३. सामानको विधा अनुसार डिजाइन छान्ने (Fashion vs Food)
          const isFashion = order.productName?.toLowerCase().includes('kurti') || order.productName?.toLowerCase().includes('saree');

          return (
            <div key={order._id} className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-500 shadow-2xl ${
              isFashion ? 'border-pink-500/30 bg-pink-500/5' : 'border-orange-500/30 bg-orange-500/5'
            }`}>
              {/* Top Bar */}
              <div className={`p-4 flex justify-between items-center ${isFashion ? 'bg-pink-500/20' : 'bg-orange-500/20'}`}>
                <span className="text-[10px] font-black tracking-widest uppercase">
                  {isFashion ? '👗 Boutique Order' : '🍳 Kitchen Order'}
                </span>
                <span className="text-[10px] font-mono bg-black/50 px-2 py-1 rounded">#{order._id.slice(-4)}</span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-2xl font-black mb-1">{order.productName}</h2>
                <p className="text-gray-400 text-sm mb-4 italic">Customer: {order.customerName}</p>
                
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs">📞</div>
                  <span className="font-mono text-cyan-400">{order.phone}</span>
                </div>

                <button 
                  onClick={() => updateStatus(order._id)}
                  className={`w-full py-4 rounded-2xl font-black tracking-widest transition-all active:scale-95 shadow-lg ${
                    isFashion 
                    ? 'bg-pink-600 hover:bg-white hover:text-pink-600' 
                    : 'bg-orange-600 hover:bg-white hover:text-orange-600'
                  }`}
                >
                  {isFashion ? 'READY TO SHIP 📦' : 'MARK AS READY ✅'}
                </button>
              </div>

              {/* Bottom Decorative Line */}
              <div className={`h-1 w-full ${isFashion ? 'bg-pink-500' : 'bg-orange-500'} animate-pulse`} />
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-3xl mb-4 opacity-20">📦</div>
          <p className="text-gray-600 font-mono italic uppercase tracking-widest text-sm">Waiting for new orders...</p>
        </div>
      )}
    </div>
  );
}