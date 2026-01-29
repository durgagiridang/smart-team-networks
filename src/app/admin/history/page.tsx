"use client";
import { useState, useEffect } from "react";

export default function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // १. डेटा तान्ने मुख्य फङ्सन
  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/orders');
      const json = await res.json();
      
      // API बाट डेटा निकाल्ने सही तरिका
      const allData = json.success ? json.data : json;
      
      if (Array.isArray(allData)) {
        // केवल 'Ready' भएकालाई मात्र फिल्टर गर्ने र नयाँलाई माथि राख्ने
        const readyOrders = allData
          .filter((o: any) => o.status === "Ready")
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        
        setOrders(readyOrders);
      }
    } catch (error) {
      console.error("History fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // २. पेज लोड हुँदा र प्रत्येक ५ सेकेन्डमा अपडेट गर्ने
  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  // ३. बिल प्रिन्ट गर्ने फङ्सन
  const handlePrint = (order: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${order._id.slice(-5)}</title>
            <style>
              body { font-family: sans-serif; padding: 20px; }
              .header { text-align: center; border-bottom: 2px solid #000; }
              .item { display: flex; justify-content: space-between; margin: 10px 0; }
              .total { border-top: 2px solid #000; padding-top: 10px; font-weight: bold; font-size: 1.2em; }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <div class="header">
              <h2>SMART RESTAURANT</h2>
              <p>Order ID: #${order._id.slice(-5)}</p>
            </div>
            ${order.items.map((item: any) => `
              <div class="item">
                <span>${item.name} x ${item.quantity}</span>
                <span>Rs. ${item.price * item.quantity}</span>
              </div>
            `).join('')}
            <div class="total">
              <div class="item">
                <span>TOTAL AMOUNT</span>
                <span>Rs. ${order.totalAmount}</span>
              </div>
            </div>
            <p style="text-align:center; margin-top:30px;">Thank you! Visit again.</p>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-8">
      <h1 className="text-3xl font-black mb-10 text-cyan-500 border-l-4 border-cyan-500 pl-4 uppercase">
        Order History (सम्पन्न अर्डरहरू) ✅
      </h1>

      {loading && orders.length === 0 ? (
        <p className="text-gray-500 animate-pulse">डेटा लोड हुँदैछ...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 rounded-3xl border border-dashed border-gray-700">
           <p className="text-gray-400 italic text-lg">कुनै पनि सम्पन्न अर्डर भेटिएन।</p>
           <p className="text-gray-600 text-sm mt-2">किचन मोनिटरमा गएर अर्डरलाई 'Ready' मार्क गर्नुहोस्।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order: any) => (
            <div key={order._id} className="bg-zinc-900 p-6 rounded-2xl border border-gray-800 flex justify-between items-center shadow-lg hover:border-cyan-500/50 transition-all">
              <div>
                <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-widest">Order ID: ...{order._id.slice(-5)}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {order.items.map((item: any, i: number) => (
                    <span key={i} className="text-white font-bold text-lg">
                      {item.name} <span className="text-yellow-500">x{item.quantity}</span>
                    </span>
                  ))}
                </div>
                <p className="text-cyan-400 font-black text-2xl mt-3 tracking-tighter">Rs. {order.totalAmount}</p>
              </div>
              <button 
                onClick={() => handlePrint(order)}
                className="bg-white text-black hover:bg-cyan-500 hover:text-white px-8 py-4 rounded-2xl font-black text-sm transition-all uppercase shadow-xl active:scale-95"
              >
                Print Receipt 🖨️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}