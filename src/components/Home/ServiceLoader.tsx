"use client";
import React from 'react';

const ServiceLoader = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {[...Array(10)].map((_, i) => (
        <div 
          key={i} 
          className="h-36 w-full bg-[#1E1E1E] rounded-2xl border border-[#333] relative overflow-hidden"
        >
          {/* Shimmer Effect Animation */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-orange-500/10 to-transparent" />
          
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-12 h-12 bg-[#2a2a2a] rounded-full" />
            <div className="w-16 h-2 bg-[#2a2a2a] rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceLoader;