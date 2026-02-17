"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StoreBuilder() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [storeData, setStoreData] = useState({
    businessName: "",
    category: "Boutique",
    cctvLink: "",
    phone: "",
    qrImage: "", // QR कोडको लिङ्क
    bankDetails: "", // बैंक खाता विवरण
    bannerImage: "" // पसल बन्द हुँदा देखाउने फोटो
  });

  const handleSubmit = async () => {
    // यहाँ डेटा MongoDB मा सेभ गर्ने लजिक हुनेछ
    console.log("Saving Store Data:", storeData);
    alert("बधाई छ! तपाईँको 'Mini Digital Showroom' तयार भयो।");
    // पछि यहाँ router.push(`/showroom/${generatedId}`) गरिन्छ
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 font-sans">
      <div className="max-w-xl w-full bg-[#0f0f0f] border border-white/5 rounded-[40px] p-10 shadow-2xl">
        
        {/* Progress Bar */}
        <div className="flex gap-2 mb-10">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-cyan-500' : 'bg-white/10'}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-cyan-500' : 'bg-white/10'}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-cyan-500' : 'bg-white/10'}`} />
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-cyan-500">STN Suite</h1>
          <p className="text-[10px] text-gray-500 font-mono tracking-[0.3em] uppercase">Vendor Onboarding v2.0</p>
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold mb-6 italic">Basic Identity</h2>
            <input 
              type="text" placeholder="Business Name (e.g. Durga Saree Center)"
              className="w-full bg-black border border-white/10 p-5 rounded-3xl outline-none focus:border-cyan-500 transition-all"
              onChange={(e) => setStoreData({...storeData, businessName: e.target.value})}
            />
            <select 
              className="w-full bg-black border border-white/10 p-5 rounded-3xl outline-none focus:border-cyan-500 text-gray-400"
              onChange={(e) => setStoreData({...storeData, category: e.target.value})}
            >
              <option value="Boutique">Fashion & Boutique</option>
              <option value="Restaurant">Restaurant & Cafe</option>
              <option value="Mart">Grocery & Mart</option>
            </select>
            <button onClick={() => setStep(2)} className="w-full bg-white text-black font-black p-5 rounded-3xl uppercase mt-4 hover:bg-cyan-400 transition-all">Continue</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold mb-6 italic">Live Setup & Visuals</h2>
            <input 
              type="text" placeholder="CCTV Stream (YouTube Live Link)"
              className="w-full bg-black border border-white/10 p-5 rounded-3xl outline-none focus:border-cyan-500"
              onChange={(e) => setStoreData({...storeData, cctvLink: e.target.value})}
            />
            <input 
              type="text" placeholder="Offline Banner Image URL"
              className="w-full bg-black border border-white/10 p-5 rounded-3xl outline-none focus:border-cyan-500"
              onChange={(e) => setStoreData({...storeData, bannerImage: e.target.value})}
            />
            <div className="flex gap-4 mt-4">
              <button onClick={() => setStep(1)} className="flex-1 border border-white/10 p-5 rounded-3xl font-bold uppercase">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-white text-black font-black p-5 rounded-3xl uppercase hover:bg-cyan-400 transition-all">Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold mb-6 italic">Payment & Launch</h2>
            <input 
              type="text" placeholder="QR Code Image URL (e.g. eSewa/Fonepay)"
              className="w-full bg-black border border-white/10 p-5 rounded-3xl outline-none focus:border-cyan-500"
              onChange={(e) => setStoreData({...storeData, qrImage: e.target.value})}
            />
            <textarea 
              placeholder="Bank Account Details (Account No, Name, Branch)"
              className="w-full bg-black border border-white/10 p-5 rounded-3xl outline-none focus:border-cyan-500 h-32"
              onChange={(e) => setStoreData({...storeData, bankDetails: e.target.value})}
            />
            <div className="flex gap-4 mt-4">
              <button onClick={() => setStep(2)} className="flex-1 border border-white/10 p-5 rounded-3xl font-bold uppercase">Back</button>
              <button onClick={handleSubmit} className="flex-1 bg-cyan-600 text-black font-black p-5 rounded-3xl uppercase hover:bg-white transition-all">Launch Store 🚀</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}