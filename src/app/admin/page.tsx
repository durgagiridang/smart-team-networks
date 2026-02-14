"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // States
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAIL = "durga98578giri22921@gmail.com"; 

  // १. नयाँ अर्डरहरू तान्ने फङ्सन
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const json = await res.json();
      if (json.success) {
        setOrders(json.data);
      }
    } catch (err) {
      console.error("Orders fetch error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated" || (session && session.user?.email !== ADMIN_EMAIL)) {
      router.push("/");
    }

    if (session?.user?.email === ADMIN_EMAIL) {
      fetchOrders();
    }
  }, [session, status, router]);

  // २. अर्डर स्टेटस अपडेट गर्ने (Pending -> Completed/Delivered)
  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        // अपडेट भएपछि लिस्ट फेरि लोड गर्ने
        fetchOrders();
        alert(`Status updated to ${newStatus}`);
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  if (status === "loading") return <div className="p-10 text-white bg-black min-h-screen font-mono italic text-center animate-pulse">STN_SECURE_ACCESS_VERIFYING...</div>;
  if (!session || session.user?.email !== ADMIN_EMAIL) return null;

  return (
    <div className="p-8 bg-black min-h-screen text-white font-sans selection:bg-cyan-500 selection:text-black">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-4xl font-black text-cyan-400 tracking-tighter uppercase italic">STN Unified Admin</h1>
          <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">System Status: <span className="text-green-500 animate-pulse">Operational</span></p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase font-bold italic tracking-widest">Root Access</p>
          <button onClick={fetchOrders} className="text-[10px] bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded mt-2 hover:bg-cyan-500 hover:text-black transition-all">REFRESH DATA</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Order Management Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 shadow-2xl backdrop-blur-sm">
          <div className="p-4 border-b border-gray-800 bg-gray-800/20 flex justify-between items-center">
            <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400 italic">Live Channel Order Queue</h2>
            <span className="text-[10px] bg-cyan-900/40 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full uppercase font-black">{orders.length} Total Orders</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800/40 text-gray-400 text-[10px] uppercase tracking-widest border-b border-gray-800">
                  <th className="p-4 text-left">Customer Details</th>
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-center">Manage Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-sm">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="p-4">
                      <p className="font-bold text-gray-200 group-hover:text-cyan-400 transition-colors">
                        {order.customerName || "No Name"}
                      </p>
                      <p className="text-[11px] text-cyan-500 font-mono tracking-tighter">{order.phone || "No Phone"}</p>
                      <p className="text-[9px] text-gray-600 uppercase mt-1 italic">{new Date(order.createdAt).toLocaleString()}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-xs font-bold text-gray-300">{order.productName || "General Item"}</p>
                      <p className="text-[10px] text-gray-500">Live Stream Order</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${
                        order.status === 'Pending' 
                        ? 'text-yellow-500 bg-yellow-500/10 border border-yellow-500/20' 
                        : 'text-green-500 bg-green-500/10 border border-green-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded font-mono uppercase">
                        {order.orderType}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <select 
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          value={order.status}
                          className="bg-black border border-gray-700 text-[10px] p-1.5 rounded text-gray-300 outline-none focus:border-cyan-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Completed">Completed</option>
                        </select>
                        {order.status === 'Pending' && (
                          <button 
                            onClick={() => updateOrderStatus(order._id, 'Completed')}
                            className="bg-white text-black px-3 py-1 rounded text-[9px] font-black hover:bg-cyan-400 transition-all uppercase"
                          >
                            Finish
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && !loading && (
            <div className="p-20 text-center">
              <p className="text-gray-700 text-sm font-mono tracking-tighter italic uppercase">Order Queue Empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}