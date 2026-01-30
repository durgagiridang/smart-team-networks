"use client";
import { useState, useEffect } from "react";

export default function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      const json = await res.json();
      
      let allData = [];
      if (json.success && Array.isArray(json.data)) {
        allData = json.data;
      } else if (Array.isArray(json)) {
        allData = json;
      }
      
      const readyOrders = allData
        .filter((o: any) => o.status === "Ready")
        .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      
      setOrders(readyOrders);
    } catch (error) {
      console.error("History fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- मोबाइलका लागि सुधारिएको प्रिन्ट फङ्सन ---
  const handlePrint = (order: any) => {
    // १. एउटा अस्थायी Iframe बनाउने (मोबाइलमा पप-अप ब्लक नहुने गरी)
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const pri = iframe.contentWindow;
    if (!pri) return;

    // २. बिलको कन्टेन्ट लेख्ने
    pri.document.open();
    pri.document.write(`
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #000; }
            .text-center { text-align: center; }
            hr { border: 0; border-top: 1px dashed #000; margin: 10px 0; }
            .flex-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .total { font-weight: bold; font-size: 1.2em; margin-top: 10px; }
          </style>
        </head>
        <body>
          <h2 class="text-center">SMART RESTAURANT</h2>
          <p class="text-center">Order ID: ${order._id.slice(-5)}</p>
          <hr/>
          ${order.items.map((item: any) => `
            <div class="flex-row">
              <span>${item.name} x ${item.quantity}</span>
              <span>Rs. ${item.price * item.quantity}</span>
            </div>
          `).join('')}
          <hr/>
          <div class="flex-row total">
            <span>Total:</span>
            <span>Rs. ${order.totalAmount}</span>
          </div>
          <p class="text-center" style="margin-top:30px; font-size: 12px;">थ्याङ्क यू! फेरि आउनुहोला।</p>
        </body>
      </html>
    `);
    pri.document.close();

    // ३. मोबाइलको प्रिन्ट डाइलग खोल्ने
    setTimeout(() => {
      pri.focus();
      pri.print();
      // प्रिन्ट पछि iframe हटाउने
      setTimeout(() => { document.body.removeChild(iframe); }, 1000);
    }, 500);
  };

  return (
    <div className="bg-black min-h-screen text-white p-8">
      <h1 className="text-3xl font-black mb-10 text-cyan-500 border-l-4 border-cyan-500 pl-4 uppercase">
        Order History ✅
      </h1>

      {loading ? (
        <p className="text-gray-500 animate-pulse">डेटा लोड हुँदैछ...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 rounded-3xl border border-dashed border-gray-700">
           <p className="text-gray-400 italic text-lg">कुनै पनि सम्पन्न अर्डर भेटिएन।</p>
           <p className="text-xs text-gray-600 mt-2">किचन मोनिटरमा गएर अर्डरलाई 'Ready' मार्क गर्नुहोस्।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order: any) => (
            <div key={order._id} className="bg-zinc-900 p-6 rounded-2xl border border-gray-800 flex justify-between items-center shadow-lg">
              <div>
                <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-widest">Order ID: ...{order._id.slice(-5)}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {order.items.map((item: any, i: number) => (
                    <span key={i} className="text-white font-bold text-lg">
                      {item.name} <span className="text-yellow-500">x{item.quantity}</span>
                    </span>
                  ))}
                </div>
                <p className="text-cyan-400 font-black text-2xl mt-3">Rs. {order.totalAmount}</p>
              </div>
              <button 
                onClick={() => handlePrint(order)}
                className="bg-white text-black hover:bg-cyan-500 hover:text-white px-8 py-4 rounded-xl font-black text-sm transition-all uppercase"
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