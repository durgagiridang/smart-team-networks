// src/app/vendor/showroom/components/ProductGrid.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Star, Plus, Check, Package } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating?: number;
  reviews?: number;
  inStock: boolean;
  category: string;
}

interface ProductGridProps {
  vendorId: string;
  useDemo?: boolean;
}

// Demo products for testing
const DEMO_PRODUCTS: Product[] = [
  {
    _id: '1',
    name: 'Samsung Galaxy S24 Ultra',
    price: 185000,
    originalPrice: 195000,
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400'],
    rating: 4.8,
    reviews: 128,
    inStock: true,
    category: 'Electronics'
  },
  {
    _id: '2',
    name: 'Wireless Bluetooth Earbuds',
    price: 3500,
    originalPrice: 5000,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'],
    rating: 4.5,
    reviews: 89,
    inStock: true,
    category: 'Electronics'
  },
  {
    _id: '3',
    name: 'Smart Watch Pro',
    price: 15000,
    images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400'],
    rating: 4.6,
    reviews: 56,
    inStock: true,
    category: 'Electronics'
  },
  {
    _id: '4',
    name: 'Laptop Stand Adjustable',
    price: 2500,
    originalPrice: 3500,
    images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400'],
    rating: 4.3,
    reviews: 34,
    inStock: false,
    category: 'Accessories'
  },
  {
    _id: '5',
    name: 'USB-C Hub 7-in-1',
    price: 4500,
    images: ['https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400'],
    rating: 4.7,
    reviews: 112,
    inStock: true,
    category: 'Accessories'
  },
  {
    _id: '6',
    name: 'Mechanical Keyboard RGB',
    price: 8500,
    originalPrice: 12000,
    images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?w=400'],
    rating: 4.9,
    reviews: 203,
    inStock: true,
    category: 'Electronics'
  }
];

export default function ProductGrid({ vendorId, useDemo = false }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [addedToCart, setAddedToCart] = useState<string[]>([]);

  useEffect(() => {
    if (useDemo) {
      // Use demo data
      setProducts(DEMO_PRODUCTS);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products?vendorId=${vendorId}`,
          { signal: AbortSignal.timeout(5000) }
        );
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.success && Array.isArray(data.data)) {
          setProducts(data.data);
        } else if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) {
      fetchProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [vendorId, useDemo]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (productId: string) => {
    setAddedToCart(prev => [...prev, productId]);
    setTimeout(() => {
      setAddedToCart(prev => prev.filter(id => id !== productId));
    }, 2000);
  };

  if (loading) {
    return (
      <div className="p-8 grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-xl h-48 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600">No products available</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <AnimatePresence>
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.images?.[0] || '/placeholder-product.png'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-product.png';
                  }}
                />
                
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.originalPrice && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                  {!product.inStock && (
                    <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className={`p-2 rounded-full shadow-lg transition-colors ${
                      wishlist.includes(product._id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(product._id) ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => setQuickViewProduct(product)}
                    className="p-2 bg-white rounded-full shadow-lg text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                  <button
                    onClick={() => addToCart(product._id)}
                    disabled={!product.inStock}
                    className={`w-full py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                      addedToCart.includes(product._id)
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {addedToCart.includes(product._id) ? (
                      <><Check className="w-4 h-4" /> Added</>
                    ) : (
                      <><Plus className="w-4 h-4" /> Add to Cart</>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600">
                    {product.rating || '4.5'} ({product.reviews || '0'})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">Rs. {product.price?.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        Rs. {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2">
                <div className="aspect-square bg-gray-100">
                  <img
                    src={quickViewProduct.images?.[0] || '/placeholder-product.png'}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{quickViewProduct.name}</h2>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-gray-600">{quickViewProduct.rating || '4.5'} ({quickViewProduct.reviews || '0'} reviews)</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-600 mb-4">
                    Rs. {quickViewProduct.price?.toLocaleString()}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        addToCart(quickViewProduct._id);
                        setQuickViewProduct(null);
                      }}
                      disabled={!quickViewProduct.inStock}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {quickViewProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <button
                      onClick={() => toggleWishlist(quickViewProduct._id)}
                      className={`p-3 rounded-xl border-2 transition-colors ${
                        wishlist.includes(quickViewProduct._id)
                          ? 'border-red-500 text-red-500'
                          : 'border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${wishlist.includes(quickViewProduct._id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}