"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MerchantDashboard() {
  const router = useRouter();
  const [merchantData, setMerchantData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // सामान थप्नको लागि स्टेट
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', size: '', description: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
    } else {
      fetchData(userId);
    }
  }, []);

  const fetchData = async (userId: string) => {
    try {
      const userRes = await fetch(`http://localhost:8000/api/user/${userId}`);
      const userData = await userRes.json();
      setMerchantData(userData);

      const prodRes = await fetch(`http://localhost:8000/api/products/${userId}`);
      const prodData = await prodRes.json();
      setProducts(prodData);
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  // १. फोटो छान्ने फङ्सन
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // २. सामान थप्ने (Photo Upload सहित)
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    
    if (!selectedFile) {
      alert("कृपया एउटा फोटो छान्नुहोस्!");
      return;
    }

    const formData = new FormData();
    formData.append('merchant_id', userId!);
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('size', newProduct.size);
    formData.append('description', newProduct.description);
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/api/products/add', {
        method: 'POST',
        body: formData, // JSON को सट्टा FormData पठाइयो
      });
      const data = await response.json();
      if (data.success) {
        alert("बधाई छ! फोटोसहित सामान थपियो।");
        setNewProduct({ name: '', price: '', size: '', description: '' });
        setSelectedFile(null);
        fetchData(userId!); 
      }
    } catch (err) {
      alert("अपलोड गर्दा समस्या आयो। ब्याकइन्ड चलेको छ कि छैन चेक गर्नुहोस्।");
    }
  };

  // ३. सामान हटाउने (Delete Fix)
  const handleDelete = async (productId: string) => {
    if (confirm("के तपाईं यो सामान पसलबाट सधैँका लागि हटाउन चाहनुहुन्छ?")) {
      try {
        const res = await fetch(`http://localhost:8000/api/products/delete/${productId}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.success) {
          alert("सामान र फोटो सफलतापूर्वक हटाइयो!");
          const userId = localStorage.getItem("userId");
          fetchData(userId!); 
        }
      } catch (err) {
        alert("हटाउन सकिएन।");
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-500 font-black italic animate-pulse">CONNECTING TO STN...</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-black italic text-cyan-400 uppercase tracking-tighter">
              {merchantData?.business_details?.business_name || "Merchant"} Control
            </h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1 italic italic">Real-time Management</p>
          </div>
          <button onClick={() => {localStorage.clear(); router.push('/login');}} className="bg-red-600/10 text-red-500 border border-red-500/30 px-8 py-2 rounded-full text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">Logout</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* १. सामान थप्ने फारम */}
          <div className="bg-slate-900/40 p-8 rounded-[40px] border border-white/5 shadow-2xl h-fit sticky top-8">
            <h2 className="text-[10px] font-black uppercase text-cyan-500 mb-8 tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></span> सामानको विवरण भर्नुहोस्
            </h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <input type="text" placeholder="सामानको नाम" required className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-cyan-500" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="मूल्य (रू)" required className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-cyan-500" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                <input type="text" placeholder="साइज" className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-cyan-500" value={newProduct.size} onChange={e => setNewProduct({...newProduct, size: e.target.value})} />
              </div>

              {/* फोटो अपलोड इनपुट */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-500 uppercase ml-1 tracking-widest">सामानको फोटो छान्नुहोस्</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full bg-black/50 border border-white/10 p-3 rounded-2xl text-[10px] file:bg-cyan-600 file:border-none file:text-white file:px-3 file:py-1 file:rounded-lg file:mr-4 file:font-bold cursor-pointer" />
              </div>

              <textarea placeholder="विवरण (Description)" rows={2} className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-cyan-500" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
              <button type="submit" className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all shadow-xl">
                पसलमा राख्नुहोस्
              </button>
            </form>
          </div>

          {/* २. सामानको लिस्ट */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] px-4">स्टक लिस्ट ({products.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((item) => (
                <div key={item._id} className="relative group bg-slate-900/30 border border-white/5 p-5 rounded-[35px] flex gap-5 items-center hover:border-cyan-500/30 transition-all shadow-lg">
                  
                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="absolute top-4 right-4 bg-red-600/10 text-red-500 p-2 rounded-xl hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    🗑️
                  </button>

                  <div className="w-20 h-20 bg-black rounded-2xl overflow-hidden flex-shrink-0 border border-white/5">
                    <img src={item.image_url} className="w-full h-full object-cover" alt={item.name} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase italic text-white leading-tight">{item.name}</h3>
                    <p className="text-cyan-500 font-black text-xs mt-1">रू {item.price}</p>
                    <span className="inline-block mt-2 px-3 py-0.5 bg-white/5 rounded-md text-[8px] font-bold text-gray-500 uppercase tracking-widest">Size: {item.size || 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}