'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const categoryNames: Record<string, string> = {
  food: 'रेस्टुरेन्ट',
  restaurant: 'रेस्टुरेन्ट',
  hotel: 'होटल',
  rider: 'राइडर',
  doctor: 'अस्पताल',
  hospital: 'अस्पताल',
  fashion: 'फेसन',
  beauty: 'ब्युटी',
  bakery: 'बेकरी',
  farmer: 'कृषि',
  farming: 'कृषि',
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.slug as string;  // ✅ params.id बाट params.slug मा बदलियो
  
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryId) {
      fetchVendors();
    }
  }, [categoryId]);

  const fetchVendors = async () => {
    try {
      console.log("🔍 Fetching vendors for:", categoryId);
      
      const res = await fetch(`http://localhost:8000/api/merchants?category=${categoryId}`);
      const data = await res.json();
      
      console.log("✅ API Response:", data);
      
      if (Array.isArray(data)) {
        const filtered = data.filter((v: any) => 
          v.category?.toLowerCase() === categoryId?.toLowerCase()
        );
        setVendors(filtered);
      } else {
        setVendors([]);
      }
    } catch (err) {
      console.error('❌ Error fetching vendors:', err);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pb-20">
      {/* हेडर */}
      <div className="p-4 bg-gradient-to-br from-cyan-900 via-black to-cyan-900">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="text-2xl hover:text-cyan-400 transition-colors"
          >
            ←
          </button>
          <h1 className="text-xl font-black">
            {categoryNames[categoryId] || categoryId}
          </h1>
        </div>
      </div>

      {/* विक्रेताहरूको सूची */}
      <div className="p-4 space-y-4">
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-400">लोड हुँदैछ...</p>
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">कुनै पसल छैन</p>
            <p className="text-gray-600 text-sm mt-1">यस श्रेणीमा अहिले कुनै विक्रेता छैन</p>
          </div>
        ) : (
          vendors.map((vendor: any) => (
            <Link 
              key={vendor._id} 
              href={`/store/${vendor._id}`}
              className="block"
            >
              <div className="bg-[#1a1a1a] rounded-xl p-4 flex items-center gap-4 border border-white/10 hover:border-cyan-500 transition-all hover:bg-[#252525]">
                <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center text-3xl overflow-hidden">
                  {vendor.logo ? (
                    <img 
                      src={vendor.logo} 
                      alt={vendor.business_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    '🏪'
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{vendor.business_name}</h3>
                  <p className="text-sm text-gray-400">
                    {vendor.city || vendor.address || 'तुलसिपुर'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {vendor.isLive && (
                      <span className="text-red-500 text-xs flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        लाइभ
                      </span>
                    )}
                    {vendor.rating && (
                      <span className="text-yellow-500 text-xs">⭐ {vendor.rating}</span>
                    )}
                  </div>
                </div>
                <span className="text-cyan-400 text-xl">→</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}