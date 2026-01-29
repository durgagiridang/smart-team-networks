"use client";
import { useState, useEffect } from "react";

export default function MenuManagement() {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", category: "Food" });

  const fetchMenu = async () => {
    const res = await fetch('/api/admin/menu-items'); // सच्याइएको बाटो
    const data = await res.json();
    if (data.success) setMenu(data.data);
  };

  useEffect(() => { fetchMenu(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/menu-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name: "", price: "", category: "Food" });
      fetchMenu();
    }
  };

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-extrabold mb-8 text-cyan-400">MENU MANAGEMENT</h1>
      
      <form onSubmit={handleAdd} className="mb-10 bg-gray-900 p-6 rounded-2xl border border-gray-800 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-[10px] font-bold text-gray-500 mb-2 tracking-widest">ITEM NAME</label>
          <input 
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            className="w-full bg-black border border-gray-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500 transition-all"
            placeholder="e.g. Special MoMo"
            required
          />
        </div>
        <div className="w-40">
          <label className="block text-[10px] font-bold text-gray-500 mb-2 tracking-widest">PRICE (NPR)</label>
          <input 
            type="number"
            value={form.price}
            onChange={(e) => setForm({...form, price: e.target.value})}
            className="w-full bg-black border border-gray-800 p-3 rounded-xl text-white outline-none focus:border-cyan-500 transition-all"
            placeholder="250"
            required
          />
        </div>
        <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3.5 rounded-xl font-black text-xs transition-all shadow-lg shadow-cyan-900/20">
          ADD TO MENU
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((item: any) => (
          <div key={item._id} className="p-5 bg-gray-900/50 border border-gray-800 rounded-2xl flex justify-between items-center hover:border-gray-700 transition-all">
            <div>
              <h3 className="font-bold text-lg text-white">{item.name}</h3>
              <p className="text-cyan-400 font-black text-sm">Rs. {item.price}</p>
            </div>
            <span className="text-[10px] bg-gray-800 px-3 py-1 rounded-full font-bold uppercase text-gray-400 border border-gray-700">
              {item.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}