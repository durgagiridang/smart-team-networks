"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function SocialStorePage() {
  const { id } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [merchant, setMerchant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // मर्चेन्टको डेटा तान्ने
        const uRes = await fetch(`http://localhost:8000/api/user/${id}`);
        const uData = await uRes.json();
        setMerchant(uData);

        // सामानको डेटा तान्ने
        const pRes = await fetch(`http://localhost:8000/api/products/${id}`);
        const pData = await pRes.json();
        
        // 🔥 मुख्य सुधार: डेटा Array हो कि होइन चेक गर्ने
        if (Array.isArray(pData)) {
          setProducts(pData);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) return (
    <div className="h-screen bg-[#F0F2F5] flex items-center justify-center font-bold text-gray-500 animate-pulse">
      Facebook शैलीको स्टोर खुल्दैछ...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-black font-sans">
      
      {/* 1. Top Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-cyan-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-xl italic shadow-lg">S</div>
          <input type="text" placeholder="Search in store..." className="bg-[#F0F2F5] rounded-full px-4 py-2 text-sm outline-none hidden md:block w-64" />
        </div>
        <div className="flex gap-8 text-2xl text-gray-400">
           <span className="cursor-pointer text-cyan-600 border-b-4 border-cyan-600 pb-1 px-4">🏠</span>
           <span className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg">📺</span>
           <span className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg">🛍️</span>
        </div>
        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border">
           <img src="https://via.placeholder.com/100" alt="profile" />
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 pt-6 px-4">
        
        {/* 2. Left Sidebar */}
        <aside className="hidden lg:flex flex-col gap-2 sticky top-20 h-fit">
          <div className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-xl cursor-pointer bg-white/50">
             <div className="w-9 h-9 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase italic">STN</div>
             <span className="font-bold text-sm italic">{merchant?.business_details?.business_name || "Merchant Name"}</span>
          </div>
          <div className="mt-2">
             {['Friends', 'Feeds', 'Marketplace', 'Watch', 'Memories'].map(item => (
               <div key={item} className="p-3 hover:bg-gray-200 rounded-xl cursor-pointer text-sm font-semibold text-gray-700 flex items-center gap-3">
                 <span className="bg-gray-200 w-8 h-8 rounded-full"></span> {item}
               </div>
             ))}
          </div>
        </aside>

        {/* 3. Middle Content (Feeds) */}
        <main className="lg:col-span-2 space-y-5">
          
          {/* 🔥 Stories Section */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <div className="min-w-[110px] h-48 bg-white rounded-xl shadow-sm border overflow-hidden relative group cursor-pointer">
               <div className="h-3/4 bg-gray-100 flex items-center justify-center text-4xl">📸</div>
               <div className="absolute bottom-0 w-full bg-white p-2 text-center text-[10px] font-bold">Create Story</div>
            </div>

            {/* 🔥 slice(0,5) Error Fix यहाँ छ */}
            {Array.isArray(products) && products.slice(0, 5).map((p, i) => (
              <div key={i} className="min-w-[110px] h-48 bg-white rounded-xl shadow-sm border overflow-hidden relative cursor-pointer hover:opacity-90 transition-all">
                <img src={p.image_url} className="w-full h-full object-cover" alt="story" />
                <div className="absolute top-2 left-2 w-9 h-9 border-4 border-cyan-600 rounded-full overflow-hidden shadow-lg bg-white">
                   <img src={p.image_url} className="w-full h-full object-cover" alt="mini" />
                </div>
                <div className="absolute bottom-2 left-2 text-white text-[10px] font-black shadow-lg uppercase italic bg-black/20 px-1 rounded">{p.name}</div>
              </div>
            ))}
          </div>

          {/* Create Post Box */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex gap-3 mb-4">
               <div className="w-10 h-10 bg-gray-200 rounded-full border"></div>
               <div className="bg-[#F0F2F5] rounded-full flex-1 px-4 flex items-center text-gray-500 text-sm hover:bg-gray-200 cursor-pointer transition-all">आज तपाईँको मनमा के छ?</div>
            </div>
            <div className="flex border-t pt-3">
               <button className="flex-1 py-2 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-500 flex justify-center gap-2 items-center">📹 <span className="hidden sm:inline">Live</span></button>
               <button className="flex-1 py-2 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-500 flex justify-center gap-2 items-center">🖼️ <span className="hidden sm:inline">Photo</span></button>
               <button className="flex-1 py-2 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-500 flex justify-center gap-2 items-center">😊 <span className="hidden sm:inline">Feeling</span></button>
            </div>
          </div>

          {/* 🍗 Product Posts - map Error Fix यहाँ छ */}
          {Array.isArray(products) && products.length > 0 ? (
            products.map((p) => (
              <div key={p._id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 flex justify-between items-center">
                  <div className="flex gap-3">
                     <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-black text-[10px] italic uppercase border-2 border-white shadow-md">STN</div>
                     <div>
                       <p className="font-bold text-sm italic leading-tight">{merchant?.business_details?.business_name}</p>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1">Just now • <span className="text-xs">🌎</span></p>
                     </div>
                  </div>
                  <span className="text-gray-400 font-bold cursor-pointer hover:bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full">•••</span>
                </div>
                <div className="px-4 pb-3">
                   <p className="text-sm font-medium mb-3 text-gray-800 leading-relaxed">{p.description || "Fresh arrival! आजै अर्डर गर्नुहोस्।"}</p>
                   <div className="bg-cyan-50 border-l-4 border-cyan-600 p-3 rounded-r-lg flex justify-between items-center shadow-sm">
                      <span className="font-black italic uppercase text-xs text-cyan-800">{p.name} - {p.size}</span>
                      <span className="font-black text-cyan-700 bg-white px-3 py-1 rounded-full border border-cyan-100">रू {p.price}</span>
                   </div>
                </div>
                <div className="h-[450px] w-full bg-gray-50 flex items-center justify-center border-y">
                  <img src={p.image_url} className="max-w-full max-h-full object-contain" alt="post" />
                </div>
                <div className="p-1 flex gap-1 px-2">
                   <button className="flex-1 py-2 hover:bg-gray-100 rounded-lg text-sm font-bold text-gray-500 uppercase italic transition-all flex justify-center items-center gap-2">👍 Like</button>
                   <button className="flex-1 py-2 hover:bg-gray-100 rounded-lg text-sm font-bold text-gray-500 uppercase italic transition-all flex justify-center items-center gap-2">💬 Comment</button>
                   <button className="flex-1 py-2 bg-cyan-600/5 hover:bg-cyan-600 hover:text-white rounded-lg text-sm font-black text-cyan-600 uppercase italic transition-all flex justify-center items-center gap-2">🛒 Order Now</button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-16 rounded-xl text-center shadow-sm border text-gray-400">
               <div className="text-5xl mb-4">📭</div>
               <p className="text-xs font-black uppercase tracking-widest italic">No posts yet from this merchant.</p>
            </div>
          )}
        </main>

        {/* 4. Right Sidebar */}
        <aside className="hidden lg:block space-y-6">
           <div className="sticky top-20">
              <p className="text-gray-500 font-bold text-xs mb-4 uppercase tracking-[0.2em] italic">Sponsored</p>
              <div className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-all cursor-pointer">
                 <div className="h-32 bg-cyan-600/10 rounded-lg mb-3 flex items-center justify-center text-4xl">🚀</div>
                 <p className="text-[10px] font-black uppercase italic tracking-tighter text-cyan-700">STN Fast Delivery</p>
                 <p className="text-[9px] text-gray-500 font-bold mt-1 leading-tight">तपाईँको सहरमा सबैभन्दा छिटो डेलिभरी सेवा।</p>
              </div>
              
              <div className="mt-8 border-t pt-6">
                <p className="text-gray-500 font-bold text-xs mb-4 uppercase tracking-[0.2em] italic">Contacts</p>
                <div className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-xl cursor-pointer">
                   <div className="relative">
                      <div className="w-9 h-9 bg-gray-300 rounded-full border"></div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                   </div>
                   <span className="font-bold text-xs italic text-gray-700">Merchant Support</span>
                </div>
              </div>
           </div>
        </aside>

      </div>
    </div>
  );
}