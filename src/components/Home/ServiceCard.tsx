"use client";
import React from 'react';

interface ServiceCardProps {
  label: string;
  icon: string;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ label, icon, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative h-36 w-full cursor-pointer transition-all duration-300 ease-out"
    >
      {/* 1. Animated Glow Background (Button ko muni basne rang) */}
      <div className="absolute inset-0 bg-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

      {/* 2. The Main Box Button */}
      <div className="relative h-full w-full bg-[#1E1E1E] border border-[#333] rounded-2xl 
                      flex flex-col items-center justify-center p-4
                      
                      /* UP-SCALE & LIFT EFFECTS */
                      hover:-translate-y-2 hover:scale-[1.01] 
                      hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] 
                      hover:border-orange-500/50
                      
                      /* SMOOTH TRANSITION */
                      transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
                      
                      /* CLICK DEPTH EFFECT */
                      active:scale-80 active:translate-y-0 shadow-lg"
      >
        {/* Icon with Glow */}
        <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-100 drop-shadow-[0_0_10px_rgba(255,140,0,0.3)]">
          {icon}
        </div>

        {/* Text Label */}
        <span className="text-[10px] font-black text-gray-400 group-hover:text-white uppercase tracking-widest text-center transition-colors">
          {label}
        </span>

        {/* Bottom Accent Line (Halka Orange line jasto) */}
        <div className="absolute bottom-3 w-0 h-[2px] bg-orange-500 rounded-full group-hover:w-1/3 transition-all duration-500" />
      </div>
    </div>
  );
};

export default ServiceCard;