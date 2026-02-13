"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        // ब्राउजरको मेमोरीमा युजर आईडी सेभ गर्ने (ताकि ड्यासबोर्डले थाहा पाओस्)
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userRole", data.user.role);
        
        alert(`नमस्ते ${data.user.fullName}! STN मा स्वागत छ।`);
        
        // यदि व्यापारी हो भने ड्यासबोर्डमा पठाउने, नत्र होमपेजमा
        if (data.user.role === 'merchant') {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("सर्भरसँग सम्पर्क हुन सकेन।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A] text-white p-6">
      <h1 className="text-5xl font-black italic tracking-tighter text-cyan-500 mb-2">STN</h1>
      <p className="text-gray-600 text-[10px] tracking-[0.5em] mb-10 uppercase font-bold">Smart Team Networks</p>
      
      <div className="bg-slate-900/40 p-10 rounded-[40px] border border-white/5 backdrop-blur-xl shadow-2xl w-full max-w-sm">
        <h2 className="text-xl font-black mb-6 text-center uppercase tracking-widest">Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            required
            className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-sm outline-none focus:border-cyan-500 transition-all"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            required
            className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-sm outline-none focus:border-cyan-500 transition-all"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black hover:bg-white hover:text-black transition-all duration-300 shadow-lg shadow-cyan-600/20 uppercase text-xs tracking-widest"
          >
            {loading ? "CHECKING..." : "ENTER NETWORK"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-4">Or continue with</p>
          <button className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
             <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" />
             <span className="text-[10px] font-black uppercase">Google</span>
          </button>
        </div>
      </div>

      <p className="mt-8 text-cyan-900 text-[9px] font-black tracking-[0.3em] uppercase">
        जो देखिन्छ त्यही बिक्छ
      </p>
    </div>
  );
};