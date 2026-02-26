'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  inventory: {
    quantity: number;
  };
  category: string;
  status: string;
  description?: string;
  image?: string;
}

export default function ProductsPage() {
  const [vendorId, setVendorId] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedId = localStorage.getItem('vendorId') || '699e968b775b17d7892a3131';
    setVendorId(storedId);
    fetchProducts(storedId);
  }, []);

  const fetchProducts = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`http://localhost:8000/api/vendor/products/${id}`);
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const json = await res.json();
      
      if (json.success) {
        setProducts(json.data);
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      setError(err.message);
      toast.error('प्रोडक्ट लोड गर्न असफल');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (productId: string, currentStatus: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/vendor/products/${productId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: currentStatus === 'active' ? 'inactive' : 'active' })
      });
      
      if (res.ok) {
        toast.success('Status अपडेट भयो');
        fetchProducts(vendorId);
      }
    } catch (err) {
      toast.error('अपडेट असफल');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <p className="text-red-700 mb-4">❌ {error}</p>
          <button 
            onClick={() => fetchProducts(vendorId)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            पुनः प्रयास गर्नुहोस्
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-auto bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🛍️ Products</h1>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <span>+</span> नयाँ प्रोडक्ट
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 प्रोडक्ट खोज्नुहोस्..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <span className="text-6xl mb-4 block">📭</span>
            <p className="text-gray-500 text-lg">कुनै प्रोडक्ट भेटिएन</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl bg-gray-100">
                      🖼️
                    </div>
                  )}
                  <button
                    onClick={() => toggleStatus(product._id, product.status)}
                    className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === 'active' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    {product.status === 'active' ? '✓ Active' : '✕ Inactive'}
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">Rs. {product.price?.toLocaleString()}</span>
                    <span className={`text-sm ${product.inventory?.quantity > 10 ? 'text-green-600' : 'text-red-600'}`}>
                      Stock: {product.inventory?.quantity || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}