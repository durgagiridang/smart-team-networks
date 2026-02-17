"use client";
import { useState, useEffect } from 'react'; 
import { useParams } from 'next/navigation';

export default function StorePage() {
  const { id } = useParams();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  // १. डाटाबेसबाट सामान तान्ने (Smart IP Detection)
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // ब्राउजरको ठेगानाबाट आफैँ IP पत्ता लगाउने (यसले "ब्याकइन्ड अफलाइन" समस्या हटाउँछ)
        const currentIP = window.location.hostname;
        const backendUrl = `http://${currentIP}:8000/api/products`;

        const res = await fetch(backendUrl, { cache: 'no-store' }); 
        const data = await res.json();
        
        if (data && data.length > 0) {
          setProducts(data);
          setIsBackendOnline(true);
        }
      } catch (error) {
        console.error("❌ ब्याकइन्ड कनेक्सन फेल:", error);
        setIsBackendOnline(false);
      }
    };

    loadProducts();
    const interval = setInterval(loadProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  // २. WhatsApp अर्डर फङ्सन (Image Preview सुधारिएको)
  const handleWhatsAppOrder = (product: any) => {
    const myNumber = "9779847852880"; 
    const text = `नमस्ते दुर्गा बुटिक! मलाई यो सामान अर्डर गर्नु छ:

🛍️ सामान: ${product.name}
💰 मूल्य: Rs. ${product.price}

फोटो हेर्नुहोस्:
${product.img}`;

    const waUrl = `https://wa.me/${myNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30">
      
      {/* CCTV PANEL */}
      <div className="w-full aspect-video bg-zinc-950 sticky top-0 z-40 border-b border-white/5 shadow-2xl overflow-hidden">
        <img 
          src={`http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:8080/video`} 
          className="w-full h-full object-cover"
          alt="Live Stream"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000";
          }}
        />
        <div className="absolute top-6 left-6 flex items-center gap-3">
          <div className="bg-red-600 px-3 py-1 rounded-full text-[9px] font-black animate-pulse shadow-lg uppercase tracking-tighter">Live Feed</div>
          <p className="text-[10px] font-bold italic uppercase tracking-[0.2em] drop-shadow-md text-white/90">{id} Showroom</p>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="py-8">
        <div className="flex justify-between items-center px-6 mb-5">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isBackendOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500 italic">
              {isBackendOnline ? 'Online Collection' : 'Backend Offline...'}
            </h3>
          </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide px-6">
          {products.length > 0 ? (
            products.map((p, index) => (
              <div 
                key={p._id || index} 
                onClick={() => setSelectedProduct(p)}
                className="min-w-[140px] h-[220px] relative rounded-[28px] overflow-hidden border border-white/5 shadow-2xl flex-shrink-0"
              >
                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-4 left-3 right-3">
                  <p className="text-[11px] font-bold text-white uppercase line-clamp-2">{p.name}</p>
                  <p className="text-cyan-400 font-black text-[10px]">Rs. {p.price}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-20 bg-zinc-900/30 rounded-3xl mx-6">
               <p className="text-zinc-600 text-[10px] italic uppercase tracking-widest animate-pulse">
                 {isBackendOnline ? "सामानहरू लोड हुँदैछन्..." : "कृपया Node Server सुरु गर्नुहोस्..."}
               </p>
            </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-end justify-center p-0 backdrop-blur-3xl">
          <div className="bg-zinc-900 w-full max-w-lg rounded-t-[45px] overflow-hidden border-t border-white/10 relative shadow-2xl">
            <div className="h-[45vh] relative">
               <img src={selectedProduct.img} className="w-full h-full object-cover" />
               <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center text-xl">✕</button>
            </div>
            <div className="p-8 pb-12">
              <h2 className="text-2xl font-black italic uppercase leading-tight">{selectedProduct.name}</h2>
              <p className="text-cyan-400 text-3xl font-black mt-1 italic">Rs. {selectedProduct.price}</p>
              <button 
                onClick={() => handleWhatsAppOrder(selectedProduct)}
                className="w-full mt-8 bg-cyan-500 text-black py-5 rounded-[22px] font-black uppercase text-[10px] tracking-widest shadow-lg shadow-cyan-500/40"
              >
                Order on WhatsApp 🛒
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}