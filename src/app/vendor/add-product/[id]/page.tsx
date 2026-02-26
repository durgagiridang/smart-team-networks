"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// 🔥 Types Definition
interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  size?: string;
  image_url: string;
  stock?: number;
  category?: string;
}

interface BusinessDetails {
  business_name: string;
  business_email?: string;
  business_phone?: string;
  address?: string;
  logo_url?: string;
}

interface Merchant {
  _id: string;
  name: string;
  email: string;
  business_details?: BusinessDetails;
  profile_image?: string;
  createdAt?: string;
}

interface ApiError {
  message: string;
  status?: number;
}

// 🔥 Loading Skeleton Component
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// 🔥 Story Card Component
const StoryCard = ({ product, index }: { product: Product; index: number }) => (
  <div 
    className="min-w-[110px] h-48 bg-white rounded-xl shadow-sm border overflow-hidden relative cursor-pointer hover:opacity-90 transition-all group"
    role="button"
    tabIndex={0}
    aria-label={`View story for ${product.name}`}
  >
    <Image
      src={product.image_url}
      alt={product.name}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-300"
      sizes="110px"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
    
    {/* Profile Ring */}
    <div className="absolute top-2 left-2 w-9 h-9 border-4 border-cyan-600 rounded-full overflow-hidden shadow-lg bg-white">
      <Image
        src={product.image_url}
        alt=""
        width={36}
        height={36}
        className="object-cover"
      />
    </div>
    
    {/* Product Name */}
    <div className="absolute bottom-2 left-2 right-2">
      <span className="text-white text-[10px] font-black shadow-lg uppercase italic bg-black/40 px-2 py-1 rounded backdrop-blur-sm line-clamp-2">
        {product.name}
      </span>
    </div>
  </div>
);

// 🔥 Product Post Component
const ProductPost = ({ 
  product, 
  merchant 
}: { 
  product: Product; 
  merchant: Merchant | null 
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const businessName = merchant?.business_details?.business_name || merchant?.name || "Merchant";
  const logoUrl = merchant?.business_details?.logo_url || merchant?.profile_image;
  
  return (
    <article className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="relative">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={businessName}
                width={40}
                height={40}
                className="rounded-full border-2 border-white shadow-md object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-black text-xs italic uppercase border-2 border-white shadow-md">
                {businessName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          
          <div>
            <h3 className="font-bold text-sm italic leading-tight hover:underline cursor-pointer">
              {businessName}
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
              Just now • <span className="text-xs" aria-hidden="true">🌎</span>
            </p>
          </div>
        </div>
        
        <button 
          className="text-gray-400 font-bold hover:bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
          aria-label="More options"
        >
          •••
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className={`text-sm font-medium mb-3 text-gray-800 leading-relaxed ${!showFullDesc && 'line-clamp-3'}`}>
          {product.description || "Fresh arrival! आजै अर्डर गर्नुहोस्। 🛍️"}
        </p>
        {product.description && product.description.length > 100 && (
          <button 
            onClick={() => setShowFullDesc(!showFullDesc)}
            className="text-cyan-600 text-xs font-semibold hover:underline mb-2"
          >
            {showFullDesc ? "See less" : "See more"}
          </button>
        )}
        
        {/* Price Tag */}
        <div className="bg-cyan-50 border-l-4 border-cyan-600 p-3 rounded-r-lg flex justify-between items-center shadow-sm">
          <div className="flex flex-col">
            <span className="font-black italic uppercase text-xs text-cyan-800">
              {product.name}
            </span>
            {product.size && (
              <span className="text-[10px] text-cyan-600 font-semibold">
                Size: {product.size}
              </span>
            )}
          </div>
          <span className="font-black text-cyan-700 bg-white px-3 py-1 rounded-full border border-cyan-100 shadow-sm">
            रू {product.price.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Image */}
      <div className="relative h-[450px] w-full bg-gray-50 border-y group">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-contain group-hover:scale-[1.02] transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 600px"
          priority
        />
        {product.stock !== undefined && product.stock < 5 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
            Only {product.stock} left!
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-2 flex gap-1 px-2">
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className={`flex-1 py-2 rounded-lg text-sm font-bold uppercase italic transition-all flex justify-center items-center gap-2 ${
            isLiked 
              ? "bg-blue-50 text-blue-600" 
              : "hover:bg-gray-100 text-gray-500"
          }`}
        >
          <span className={isLiked ? "transform scale-125 transition-transform" : ""}>
            {isLiked ? "👍" : "👍"}
          </span>
          {isLiked ? "Liked" : "Like"}
        </button>
        
        <button className="flex-1 py-2 hover:bg-gray-100 rounded-lg text-sm font-bold text-gray-500 uppercase italic transition-all flex justify-center items-center gap-2">
          💬 Comment
        </button>
        
        <button className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-black uppercase italic transition-all flex justify-center items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
          🛒 Order Now
        </button>
      </div>
    </article>
  );
};

// 🔥 Main Component
export default function SocialStorePage() {
  const { id } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);

        // ✅ FIXED: Removed localhost:8000, using relative URLs
        const [merchantRes, productsRes] = await Promise.all([
          fetch(`/api/merchant/${id}`),
          fetch(`/api/products/merchant/${id}`)
        ]);

        // Check responses
        if (!merchantRes.ok) {
          throw new Error(`Merchant fetch failed: ${merchantRes.status}`);
        }
        if (!productsRes.ok) {
          throw new Error(`Products fetch failed: ${productsRes.status}`);
        }

        const merchantData = await merchantRes.json();
        const productsData = await productsRes.json();

        setMerchant(merchantData);
        
        // Safe array handling
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else if (productsData.products && Array.isArray(productsData.products)) {
          setProducts(productsData.products);
        } else {
          setProducts([]);
          console.warn("Products data is not an array:", productsData);
        }

      } catch (err) {
        console.error("Fetch Error:", err);
        setError({
          message: err instanceof Error ? err.message : "Failed to load data"
        });
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 🔥 Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F2F5]">
        {/* Navbar Skeleton */}
        <nav className="bg-white shadow-sm sticky top-0 z-50 px-4 h-14 flex items-center justify-between">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex gap-4">
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="w-8 h-8 rounded" />
          </div>
          <Skeleton className="w-10 h-10 rounded-full" />
        </nav>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 pt-6 px-4">
          {/* Left Sidebar Skeleton */}
          <aside className="hidden lg:block space-y-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </aside>

          {/* Main Content Skeleton */}
          <main className="lg:col-span-2 space-y-5">
            {/* Stories Skeleton */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="min-w-[110px] h-48 rounded-xl flex-shrink-0" />
              ))}
            </div>
            
            {/* Post Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border p-4 space-y-4">
              <div className="flex gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="flex-1 h-10 rounded-full" />
              </div>
              <Skeleton className="h-64 w-full rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="flex-1 h-10 rounded-lg" />
                <Skeleton className="flex-1 h-10 rounded-lg" />
                <Skeleton className="flex-1 h-10 rounded-lg" />
              </div>
            </div>
          </main>

          {/* Right Sidebar Skeleton */}
          <aside className="hidden lg:block space-y-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </aside>
        </div>
      </div>
    );
  }

  // 🔥 Error State
  if (error) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-red-100">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-cyan-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-cyan-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const businessName = merchant?.business_details?.business_name || merchant?.name || "Merchant";

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-black font-sans">
      
      {/* 1. Top Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="bg-cyan-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-xl italic shadow-lg hover:bg-cyan-700 transition-colors">
            S
          </Link>
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search in store..." 
              className="bg-[#F0F2F5] rounded-full px-4 py-2 pl-10 text-sm outline-none w-64 focus:ring-2 focus:ring-cyan-500 transition-all"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>
        
        <div className="flex gap-2 md:gap-8 text-2xl text-gray-400">
          <button className="cursor-pointer text-cyan-600 border-b-4 border-cyan-600 pb-1 px-4 hover:bg-gray-50 rounded-t-lg transition-colors" aria-label="Home">
            🏠
          </button>
          <button className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors" aria-label="Watch">
            📺
          </button>
          <button className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors" aria-label="Marketplace">
            🛍️
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors" aria-label="Notifications">
            🔔
          </button>
          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-md relative">
            {merchant?.profile_image ? (
              <Image
                src={merchant.profile_image}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-cyan-600 text-white font-bold">
                {businessName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 pt-6 px-4 pb-10">
        
        {/* 2. Left Sidebar */}
        <aside className="hidden lg:flex flex-col gap-2 sticky top-20 h-fit">
          <Link 
            href={`/merchant/${id}`}
            className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-xl cursor-pointer bg-white/50 transition-colors"
          >
            <div className="w-9 h-9 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase italic shadow-md">
              {businessName.charAt(0).toUpperCase()}
            </div>
            <span className="font-bold text-sm italic truncate">{businessName}</span>
          </Link>
          
          <div className="mt-2 space-y-1">
            {[
              { icon: "👥", label: "Friends", count: "2.5k" },
              { icon: "📰", label: "Feeds", count: "12" },
              { icon: "🏪", label: "Marketplace", count: "New" },
              { icon: "📹", label: "Watch", count: "" },
              { icon: "🕐", label: "Memories", count: "" }
            ].map((item) => (
              <button 
                key={item.label}
                className="w-full p-3 hover:bg-gray-200 rounded-xl cursor-pointer text-sm font-semibold text-gray-700 flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                    {item.icon}
                  </span>
                  {item.label}
                </div>
                {item.count && (
                  <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full font-bold">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Shortcuts */}
          <div className="mt-6 pt-4 border-t border-gray-300">
            <p className="text-gray-500 font-bold text-xs mb-3 uppercase tracking-wider px-3">Your Shortcuts</p>
            <button className="w-full p-3 hover:bg-gray-200 rounded-xl flex items-center gap-3 transition-colors">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                🎯
              </div>
              <span className="font-semibold text-sm text-gray-700">Saved Items</span>
            </button>
          </div>
        </aside>

        {/* 3. Middle Content (Feeds) */}
        <main className="lg:col-span-2 space-y-5">
          
          {/* 🔥 Stories Section */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {/* Create Story */}
            <button className="min-w-[110px] h-48 bg-white rounded-xl shadow-sm border overflow-hidden relative group cursor-pointer hover:shadow-md transition-shadow flex-shrink-0">
              <div className="h-3/4 bg-gray-100 flex items-center justify-center text-4xl group-hover:bg-gray-200 transition-colors">
                📸
              </div>
              <div className="absolute bottom-0 w-full bg-white p-2 text-center">
                <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white text-lg mx-auto -mt-6 border-4 border-white shadow-md">
                  +
                </div>
                <span className="text-[10px] font-bold block mt-1">Create Story</span>
              </div>
            </button>

            {/* Product Stories */}
            {products.slice(0, 5).map((product, index) => (
              <StoryCard key={product._id} product={product} index={index} />
            ))}
          </div>

          {/* Create Post Box */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full border overflow-hidden relative flex-shrink-0">
                {merchant?.profile_image ? (
                  <Image
                    src={merchant.profile_image}
                    alt=""
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-cyan-600 flex items-center justify-center text-white font-bold">
                    {businessName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <button className="bg-[#F0F2F5] hover:bg-gray-200 rounded-full flex-1 px-4 flex items-center text-gray-500 text-sm transition-colors text-left">
                आज तपाईँको मनमा के छ, {businessName}?
              </button>
            </div>
            <div className="flex border-t pt-3 gap-1">
              <button className="flex-1 py-2 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-500 flex justify-center gap-2 items-center transition-colors">
                📹 <span className="hidden sm:inline">Live Video</span>
              </button>
              <button className="flex-1 py-2 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-500 flex justify-center gap-2 items-center transition-colors">
                🖼️ <span className="hidden sm:inline">Photo/Video</span>
              </button>
              <button className="flex-1 py-2 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-500 flex justify-center gap-2 items-center transition-colors">
                😊 <span className="hidden sm:inline">Feeling</span>
              </button>
            </div>
          </div>

          {/* 🍗 Product Posts */}
          {products.length > 0 ? (
            products.map((product) => (
              <ProductPost 
                key={product._id} 
                product={product} 
                merchant={merchant} 
              />
            ))
          ) : (
            <div className="bg-white p-16 rounded-xl text-center shadow-sm border text-gray-400">
              <div className="text-6xl mb-4 animate-bounce">📭</div>
              <p className="text-sm font-black uppercase tracking-widest italic mb-2">
                No products yet from this merchant.
              </p>
              <p className="text-xs text-gray-400">Check back later for new arrivals!</p>
            </div>
          )}
        </main>

        {/* 4. Right Sidebar */}
        <aside className="hidden lg:block space-y-6">
          <div className="sticky top-20 space-y-6">
            
            {/* Sponsored */}
            <div>
              <p className="text-gray-500 font-bold text-xs mb-4 uppercase tracking-[0.2em] italic">
                Sponsored
              </p>
              <div className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-all cursor-pointer group">
                <div className="h-32 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg mb-3 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">
                  🚀
                </div>
                <p className="text-[10px] font-black uppercase italic tracking-tighter text-cyan-700">
                  STN Fast Delivery
                </p>
                <p className="text-[9px] text-gray-500 font-bold mt-1 leading-tight">
                  तपाईँको सहरमा सबैभन्दा छिटो डेलिभरी सेवा।
                </p>
              </div>
            </div>

            {/* Contacts */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.2em] italic">
                  Contacts
                </p>
                <div className="flex gap-2 text-gray-400">
                  <button className="hover:bg-gray-200 p-1 rounded-full">🔍</button>
                  <button className="hover:bg-gray-200 p-1 rounded-full">•••</button>
                </div>
              </div>
              
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-200 rounded-xl cursor-pointer transition-colors">
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full border flex items-center justify-center text-white text-xs">
                      CS
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-xs italic text-gray-700 block">Customer Support</span>
                    <span className="text-[10px] text-green-600 font-semibold">Online</span>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-200 rounded-xl cursor-pointer transition-colors">
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full border flex items-center justify-center text-white text-xs">
                      SL
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-xs italic text-gray-700 block">Sales Team</span>
                    <span className="text-[10px] text-gray-400">Offline</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Group Conversations */}
            <div className="border-t pt-6">
              <p className="text-gray-500 font-bold text-xs mb-4 uppercase tracking-[0.2em] italic">
                Group Conversations
              </p>
              <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-200 rounded-xl cursor-pointer transition-colors">
                <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                  +
                </div>
                <span className="font-bold text-xs text-gray-700">Create New Group</span>
              </button>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}