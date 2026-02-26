'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function MerchantPage() {
  const { id } = useParams();
  const [merchant, setMerchant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/merchant/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log('Merchant:', data);
        setMerchant(data.merchant || data);
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="min-h-screen bg-black text-white p-10">Loading...</div>;
  if (!merchant) return <div className="min-h-screen bg-black text-white p-10">Merchant not found</div>;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pb-24">
      {/* Header */}
      <div className="p-6 bg-gradient-to-br from-cyan-900 via-black to-cyan-900">
        <Link href="/" className="text-cyan-400 text-sm">← Back</Link>
        <h1 className="text-2xl font-black mt-4">{merchant.businessName}</h1>
        <p className="text-cyan-300">{merchant.city}</p>
      </div>

      {/* Products */}
      <div className="p-4">
        <h2 className="font-bold mb-4">Products ({products.length})</h2>
        
        {products.length === 0 ? (
          <p className="text-gray-500">No products available</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <div key={product._id} className="bg-[#1a1a1a] rounded-xl p-4">
                <h3 className="font-bold">{product.name}</h3>
                <p className="text-cyan-400">Rs. {product.price}</p>
                <button className="w-full bg-cyan-600 mt-2 py-2 rounded-lg text-sm font-bold">
                  Order
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}