'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface StoreData {
  businessName: string;
  category: string;
  cctvLink: string;
  phone: string;
  qrImage: string;
  bankDetails: string;
  bannerImage: string;
  address?: string;
  city?: string;
  ownerName?: string;
}

export default function StoreBuilder() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [storeData, setStoreData] = useState<StoreData>({
    businessName: "",
    category: "Boutique",
    cctvLink: "",
    phone: "",
    qrImage: "",
    bankDetails: "",
    bannerImage: "",
    address: "",
    city: "",
    ownerName: ""
  });

  const validateStep = (currentStep: number): boolean => {
    setError(null);
    
    switch (currentStep) {
      case 1:
        if (!storeData.businessName.trim()) {
          setError("व्यवसायको नाम आवश्यक छ");
          return false;
        }
        if (!storeData.ownerName?.trim()) {
          setError("मालिकको नाम आवश्यक छ");
          return false;
        }
        if (!storeData.phone.trim()) {
          setError("फोन नम्बर आवश्यक छ");
          return false;
        }
        if (!/^\d{10}$/.test(storeData.phone)) {
          setError("१० अंकको मान्य फोन नम्बर हाल्नुहोस्");
          return false;
        }
        return true;
        
      case 2:
        if (!storeData.cctvLink.trim()) {
          setError("CCTV लिङ्क आवश्यक छ (YouTube Live)");
          return false;
        }
        return true;
        
      case 3:
        if (!storeData.qrImage.trim()) {
          setError("QR Code आवश्यक छ");
          return false;
        }
        if (!storeData.bankDetails.trim()) {
          setError("बैंक विवरण आवश्यक छ");
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/merchants/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storeData),
      });

      const data = await response.json();

      if (data.success) {
        alert("🎉 बधाई छ! तपाईँको 'Mini Digital Showroom' तयार भयो!");
        // StorePage मा जाने
        router.push(`/store/${data.storeId}`);
      } else {
        setError(data.message || "केही गलत भयो");
      }
    } catch (err) {
      console.error('Error:', err);
      setError("सर्भरसँग जडान हुन सकेन");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 font-sans">
      
      {/* 🔥 Error Toast */}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full text-sm font-bold z-50 animate-bounce">
          ⚠️ {error}
        </div>
      )}

      <div className="max-w-2xl w-full bg-[#0f0f0f] border border-white/5 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
        
        {/* 🔥 Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10" />

        {/* Progress Bar */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1">
              <div className={`h-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-cyan-500' : 'bg-white/10'}`} />
              <span className={`text-[8px] uppercase mt-1 block text-center ${step >= s ? 'text-cyan-500' : 'text-white/30'}`}>
                {s === 1 ? 'Identity' : s === 2 ? 'Visuals' : 'Payment'}
              </span>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-cyan-500">STN Suite</h1>
          <p className="text-[10px] text-gray-500 font-mono tracking-[0.3em] uppercase mt-2">Virtual Showroom Builder v2.0</p>
          <p className="text-xs text-gray-400 mt-2">🚀 घरबेटी, भाडा, डेपोजिट बिना आफ्नो पसल सुरु गर्नुहोस्</p>
        </div>

        {/* 🔥 Preview Mode Toggle */}
        <button 
          onClick={togglePreview}
          className="absolute top-6 right-6 bg-white/5 hover:bg-white/10 p-2 rounded-full text-xs"
        >
          {previewMode ? '✏️ Edit' : '👁️ Preview'}
        </button>

        {/* Step 1: Basic Identity */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold mb-6 italic flex items-center gap-2">
              <span className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-black text-sm">1</span>
              Basic Identity
            </h2>
            
            <input 
              type="text" 
              placeholder="व्यवसायको नाम (जस्तै: दुर्गा साडी सेन्टर)"
              value={storeData.businessName}
              className="w-full bg-black border border-white/10 p-5 rounded-3xl outline-none focus:border-cyan-500 transition-all placeholder:text-gray-600"
              onChange={(e) => setStoreData({...storeData, businessName: e.target.value})}
            />
            
            <input 
              type="text" 
              placeholder="मालिकको पूरा नाम"
              value={storeData.ownerName}
              className="w-full bg-black border border-white/10 p-5 rounded-3xl outline-none focus:border-cyan-500 transition-all placeholder:text-gray-600"
              onChange={(e) => setStoreData({...storeData, ownerName: e.target.value})}
            />
            
            <input 
              type="tel" 
              placeholder="फोन नम्बर (९८०१२३४५६७८)"
              value={storeData.phone}
              maxLength={10}
              className="w-full bg-black border border-white/10 p-5 rounded-3xl outline-none focus:border-cyan-500 transition-all placeholder:text-gray-600"
              onChange={(e) => setStoreData({...storeData, phone: e.target.value.replace(/\D/g, '')})}
            />
            
            <select 
              value={storeData.category}
              className="w-full bg-black border border-white/10 p-5 rounded-3xl outline-none focus:border-cyan-500 text-gray-300"
              onChange={(e) => setStoreData({...storeData, category: e.target.value})}
            >
              <option value="Boutique">👗 फेसन र बुटीक</option>
              <option value="Restaurant">🍽️ रेस्टुरेन्ट र क्याफे</option>
              <option value="Mart">🛒 किराना र मार्ट</option>
              <option value="Electronics">📱 इलेक्ट्रोनिक्स</option>
              <option value="Furniture">🪑 फर्निचर</option>
              <option value="Jewelry">💎 गहना</option>
            </select>

            <input 
              type="text" 
              placeholder="ठेगाना (सहर)"
              value={storeData.city}
              className="w-full bg-black border border-white/10 p-5 rounded-3xl outline-none focus:border-cyan-500 transition-all placeholder:text-gray-600"
              onChange={(e) => setStoreData({...storeData, city: e.target.value})}
            />
            
            <button 
              onClick={nextStep} 
              className="w-full bg-white text-black font-black p-5 rounded-3xl uppercase mt-4 hover:bg-cyan-400 transition-all active:scale-95"
            >
              अर्को चरण →
            </button>
          </div>
        )}

        {/* Step 2: Live Setup */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold mb-6 italic flex items-center gap-2">
              <span className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-black text-sm">2</span>
              Live Setup & Visuals
            </h2>
            
            <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-2xl mb-4">
              <p className="text-xs text-cyan-400">💡 YouTube Live Stream लिङ्क हाल्नुहोस्। ग्राहकले तपाईंको पसल LIVE हेर्न सक्छन्!</p>
            </div>
            
            <input 
              type="text" 
              placeholder="YouTube Live Stream URL"
              value={storeData.cctvLink}
              className="w-full bg-black border border-white/10 p-5 rounded-3xl outline-none focus:border-cyan-500"
              onChange={(e) => setStoreData({...storeData, cctvLink: e.target.value})}
            />
            
            <input 
              type="text" 
              placeholder="पसल बन्द हुँदा देखाउने ब्यानर फोटो URL"
              value={storeData.bannerImage}
              className="w-full bg-black border border-white/10 p-5 rounded-3xl outline-none focus:border-cyan-500"
              onChange={(e) => setStoreData({...storeData, bannerImage: e.target.value})}
            />
            
            {/* 🔥 Live Preview */}
            {storeData.bannerImage && (
              <div className="relative h-40 bg-black rounded-2xl overflow-hidden border border-white/10">
                <Image 
                  src={storeData.bannerImage} 
                  alt="Banner Preview" 
                  fill 
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="flex gap-4 mt-4">
              <button 
                onClick={() => setStep(1)} 
                className="flex-1 border border-white/10 p-5 rounded-3xl font-bold uppercase hover:bg-white/5 transition-all"
              >
                ← पछाडि
              </button>
              <button 
                onClick={nextStep} 
                className="flex-1 bg-white text-black font-black p-5 rounded-3xl uppercase hover:bg-cyan-400 transition-all active:scale-95"
              >
                अर्को चरण →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold mb-6 italic flex items-center gap-2">
              <span className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-black text-sm">3</span>
              Payment Setup
            </h2>
            
            <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-2xl mb-4">
              <p className="text-xs text-green-400">💰 ग्राहकले यही QR Code बाट भुक्तानी गर्नेछन्</p>
            </div>
            
            <input 
              type="text" 
              placeholder="eSewa / Fonepay / Khalti QR Code Image URL"
              value={storeData.qrImage}
              className="w-full bg-black border border-white/10 p-5 rounded-3xl outline-none focus:border-cyan-500"
              onChange={(e) => setStoreData({...storeData, qrImage: e.target.value})}
            />
            
            {/* 🔥 QR Preview */}
            {storeData.qrImage && (
              <div className="flex justify-center p-4 bg-white rounded-2xl">
                <Image 
                  src={storeData.qrImage} 
                  alt="QR Preview" 
                  width={150} 
                  height={150} 
                  className="rounded-lg"
                />
              </div>
            )}
            
            <textarea 
              placeholder="बैंक खाता विवरण (खाता नं, नाम, शाखा)"
              value={storeData.bankDetails}
              className="w-full bg-black border border-white/10 p-5 rounded-3xl outline-none focus:border-cyan-500 h-32 resize-none"
              onChange={(e) => setStoreData({...storeData, bankDetails: e.target.value})}
            />
            
            {/* 🔥 Terms Checkbox */}
            <label className="flex items-center gap-3 text-xs text-gray-400 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-black text-cyan-500" />
              <span>म STN को <a href="#" className="text-cyan-500">नियम र सर्तहरू</a> स्वीकार गर्छु</span>
            </label>
            
            <div className="flex gap-4 mt-4">
              <button 
                onClick={() => setStep(2)} 
                className="flex-1 border border-white/10 p-5 rounded-3xl font-bold uppercase hover:bg-white/5 transition-all"
              >
                ← पछाडि
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="flex-1 bg-cyan-600 text-black font-black p-5 rounded-3xl uppercase hover:bg-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span> पठाइँदैछ...
                  </>
                ) : (
                  <>🚀 पसल सुरु गर्नुहोस्</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* 🔥 Footer Info */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-[10px] text-gray-600">
            🔒 तपाईंको डाटा सुरक्षित छ | STN ले कुनै शुल्क लिँदैन
          </p>
          <p className="text-[9px] text-gray-700 mt-1">
            केही सोध्नु छ? <span className="text-cyan-500">९८०१२३४५६७</span> मा कल गर्नुहोस्
          </p>
        </div>
      </div>
    </div>
  );
}