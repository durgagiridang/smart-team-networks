"use client";
import { useState } from "react";

export default function VendorUpload() {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({ name: "", price: "" });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert("कृपया फोटो छान्नुहोस्!");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "stn_uploads"); // तपाईँले Cloudinary Settings मा बनाएको Preset

    try {
      // १. Cloudinary मा फोटो अपलोड गर्ने (तपाईँको Cloud Name: dup1efv6k)
      const res = await fetch("https://api.cloudinary.com/v1_1/dup1efv6k/image/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      
      if (data.secure_url) {
        console.log("इमेज लाइभ भयो:", data.secure_url);

        // २. अब यो डेटालाई MongoDB मा सेभ गर्ने API कल गर्ने
        const saveRes = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: productData.name,
            price: productData.price,
            img: data.secure_url, // Cloudinary को स्थायी लिङ्क
          })
        });

        if (saveRes.ok) {
          alert("बधाई छ! तपाईँको सामान सोरुममा सजियो।");
        }
      }
    } catch (err) {
      alert("अपलोडमा समस्या आयो, कृपया इन्टरनेट र Preset चेक गर्नुहोस्।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-md mx-auto bg-zinc-900 border border-white/5 p-10 rounded-[40px] shadow-2xl">
        <h1 className="text-2xl font-black italic text-cyan-500 uppercase mb-8">Add to Showroom</h1>
        
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="relative h-48 bg-black border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center overflow-hidden">
            {image ? (
              <img src={URL.createObjectURL(image)} className="w-full h-full object-cover" />
            ) : (
              <p className="text-xs text-zinc-500">फोल्डरबाट फोटो छान्नुहोस्</p>
            )}
            <input 
              type="file" 
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          <input 
            type="text" placeholder="सामानको नाम" 
            className="w-full bg-black p-4 rounded-2xl border border-white/5 outline-none focus:border-cyan-500"
            onChange={(e) => setProductData({...productData, name: e.target.value})}
          />
          <input 
            type="number" placeholder="मूल्य (Rs.)" 
            className="w-full bg-black p-4 rounded-2xl border border-white/5 outline-none focus:border-cyan-500 font-mono"
            onChange={(e) => setProductData({...productData, price: e.target.value})}
          />

          <button 
            disabled={loading}
            className="w-full bg-cyan-600 text-black p-5 rounded-2xl font-black uppercase hover:bg-white transition-all"
          >
            {loading ? "सजावट हुँदैछ..." : "Showroom मा सजाउनुहोस् 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}