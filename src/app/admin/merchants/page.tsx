"use client";
import React, { useState } from 'react';

export default function MerchantDashboard() {
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Restaurant');
  const [city, setCity] = useState('');
  const [cctvUrl, setCctvUrl] = useState('');
  const [status, setStatus] = useState('');

  // १८ वटा सेवाहरूको सूची
  const categories = [
    "Restaurant", "Hotel & Lodge", "Rider & Parcel", 
    "Doctor's & Hospital", "Tour & Travel", "Fashion & Boutique", 
    "Men's Wear & Apparel", "Party Place & Banquet", "Jobs & Employment", 
    "Auto Sell & Buy", "Beauty & Fitness", "Sweets & Bakery", 
    "Farmer & Farming", "STN Channel"
  ];

  // पसल दर्ता गर्ने फङ्सन (मङ्गोडिबी सर्भरमा पठाउने)
  const handleRegister = async () => {
    if (!businessName || !city) {
      setStatus('⚠️ कृपया पसलको नाम र सहर भर्नुहोस्।');
      return;
    }

    setStatus('प्रक्रियामा छ...');
    try {
      const response = await fetch('http://localhost:8000/api/merchant/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          category,
          city,
          cctvUrl
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStatus('✅ ' + data.message);
        // फारम खाली गर्ने
        setBusinessName('');
        setCity('');
        setCctvUrl('');
      } else {
        setStatus('❌ दर्ता हुन सकेन।');
      }
    } catch (error) {
      setStatus('❌ सर्भरसँग जोडिन सकिएन। तपाईँको node server.js चलिरहेको छ?');
    }
  };

  return (
    <div className="p-8 bg-slate-950 text-white min-h-screen font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-cyan-500 italic tracking-tighter uppercase">
            STN MERCHANT UNIFIED
          </h1>
          <p className="text-slate-400 text-sm mt-2 italic">दाङ, बुटवल, नेपालगन्ज र धनगढीको डिजिटल सञ्जाल</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-slate-900 border border-cyan-500/20 p-8 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.1)] space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-6 bg-cyan-500 rounded-full"></span>
            नयाँ व्यवसाय दर्ता फारम
          </h2>
          
          <div className="space-y-4">
            {/* Business Name */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-2">पसल वा व्यवसायको नाम</label>
              <input 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-4 bg-slate-800 rounded-xl border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                placeholder="उदा: लक्ष्मी फेसन बुटिक"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Select */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-2">कोटि (Category)</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-4 bg-slate-800 rounded-xl border border-slate-700 outline-none focus:border-cyan-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* City Input */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-2">सहर (City)</label>
                <input 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-4 bg-slate-800 rounded-xl border border-slate-700 outline-none focus:border-cyan-500"
                  placeholder="दाङ, बुटवल, आदि"
                />
              </div>
            </div>

            {/* CCTV URL Input */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-2">CCTV Live Feed URL (Optional)</label>
              <input 
                value={cctvUrl}
                onChange={(e) => setCctvUrl(e.target.value)}
                className="w-full p-4 bg-slate-800 rounded-xl border border-slate-700 outline-none focus:border-cyan-500"
                placeholder="rtsp:// वा http:// लिंक हाल्नुहोस्"
              />
            </div>
          </div>

          {/* Register Button */}
          <button 
            onClick={handleRegister}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all mt-6 shadow-[0_0_20px_rgba(8,145,178,0.3)] active:scale-95"
          >
            STN क्लाउडमा दर्ता गर्नुहोस्
          </button>

          {/* Status Message */}
          {status && (
            <div className={`text-center p-3 rounded-lg text-sm font-bold ${status.includes('✅') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              {status}
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-black">Database Status</p>
                <p className="text-cyan-500 font-bold">MONGODB CLOUD</p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-black">System Mode</p>
                <p className="text-cyan-500 font-bold">18-HOUR BROADCAST</p>
            </div>
        </div>
      </div>
    </div>
  );
}