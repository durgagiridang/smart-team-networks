"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const businessServices = [
  "Restaurant", "Hotel & Lodge", "Rider & Parcel", "Doctor's & Hospital", 
  "Tour & Travel", "Fashion & Boutique", "Beauty & Fitness", "Sweets & Bakery"
];

export default function AuthPage() {
  const router = useRouter();
  const [role, setRole] = useState<'user' | 'merchant' | 'rider' | null>(null);
  const [gender, setGender] = useState('Male');
  const [rent, setRent] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', phone: '',
    businessName: '', category: '', city: '', identityNumber: '', isForeign: false
  });

  // १. सुधारिएको दर्ता प्रक्रिया (Submit Logic)
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    // ✅ Next.js API Route प्रयोग गर्ने
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, role, gender, monthlyRent: rent })
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert("बधाई छ! दर्ता सफल भयो। अब लगइन गर्नुहोस्।");
      router.push('/auth');  // ✅ '/login' होइन, '/auth'
    } else {
      alert("दर्ता हुन सकेन: " + (data.error || "विवरण चेक गर्नुहोस्"));
    }
  } catch (err) {
    console.error('Register Error:', err);
    alert("Error: " + err.message);
  }
};

  useEffect(() => {
    if (role === 'merchant') setRent(gender === 'Male' ? 1500 : 1000);
    else if (role === 'rider') setRent(gender === 'Male' ? 1000 : 700);
    else setRent(0);
  }, [role, gender]);

  if (!role) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-white font-sans text-center">
        <h1 className="text-4xl font-black italic text-cyan-400 mb-2 uppercase tracking-tighter">Smart Team Networks</h1>
        <p className="text-gray-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-12 italic">Nepali ko Sath Nepali kai Bikash</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <button onClick={() => setRole('user')} className="group bg-slate-900/30 border border-white/5 p-12 rounded-[50px] hover:border-cyan-500 transition-all backdrop-blur-md">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🛍️</div>
            <h2 className="text-xl font-black uppercase">Customer</h2>
          </button>
          <button onClick={() => setRole('merchant')} className="group bg-slate-900/30 border border-white/5 p-12 rounded-[50px] hover:border-red-500 transition-all backdrop-blur-md shadow-2xl shadow-red-500/5">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏢</div>
            <h2 className="text-xl font-black uppercase">Merchant</h2>
          </button>
          <button onClick={() => setRole('rider')} className="group bg-slate-900/30 border border-white/5 p-12 rounded-[50px] hover:border-yellow-500 transition-all backdrop-blur-md shadow-2xl shadow-yellow-500/5">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🛵</div>
            <h2 className="text-xl font-black uppercase">Rider</h2>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-slate-900/20 border border-white/5 p-10 rounded-[60px] backdrop-blur-3xl shadow-2xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <button onClick={() => setRole(null)} className="text-cyan-500 text-[10px] font-black mb-2 uppercase tracking-widest hover:underline">← Go Back</button>
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">
              {role === 'merchant' ? 'Merchant Registration' : role === 'rider' ? 'Rider Registration' : 'User Registration'}
            </h2>
          </div>
          {role !== 'user' && (
            <div className="bg-cyan-500 text-black px-8 py-3 rounded-full font-black text-sm uppercase shadow-lg shadow-cyan-500/20 border-2 border-white/20">
              Monthly Rent: रू {rent}
            </div>
          )}
        </div>

        {/* २. Form मा onSubmit थपियो */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Left Column: Personal Info */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-cyan-500 uppercase ml-2">Gender</label>
                <select 
                  className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-sm outline-none focus:border-cyan-500"
                  onChange={(e) => setGender(e.target.value)}
                  value={gender}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-cyan-500 uppercase ml-2">Full Name</label>
                <input type="text" placeholder="John Doe" required className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-sm outline-none focus:border-cyan-500" onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              </div>
            </div>
            <input type="email" placeholder="Email Address" required className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-sm outline-none focus:border-cyan-500" onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <input type="tel" placeholder="Mobile Number" required className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-sm outline-none focus:border-cyan-500" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            <input type="password" placeholder="Create Password" required className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-sm outline-none focus:border-cyan-500" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          {/* Right Column: Business Info */}
          <div className="space-y-6">
            {role !== 'user' ? (
              <>
                <h3 className="text-xs font-black text-red-500 uppercase tracking-widest mb-4">Verification & Business</h3>
                <div className="flex items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <input type="checkbox" id="foreignCheck" onChange={(e) => setFormData({...formData, isForeign: e.target.checked})} className="w-4 h-4 accent-red-500" />
                  <label htmlFor="foreignCheck" className="text-[10px] text-gray-400 font-bold uppercase tracking-wide cursor-pointer">I am a Foreign National (विदेशी नागरिक)</label>
                </div>
                
                {!formData.isForeign && (
                  <input type="text" placeholder="Citizenship or PAN Number" required className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-sm outline-none focus:border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]" onChange={(e) => setFormData({...formData, identityNumber: e.target.value})} />
                )}

                {role === 'merchant' && (
                  <>
                    <input type="text" placeholder="Business Name" required className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-sm outline-none focus:border-cyan-500" onChange={(e) => setFormData({...formData, businessName: e.target.value})} />
                    <select 
                      className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-sm outline-none focus:border-cyan-500"
                      required
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="">Select Service Category</option>
                      {businessServices.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </>
                )}
                <input type="text" placeholder="City (e.g. Dang, Butwal)" required className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-sm outline-none focus:border-cyan-500" onChange={(e) => setFormData({...formData, city: e.target.value})} />
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-10 border-2 border-dashed border-white/5 rounded-[40px] bg-cyan-500/5">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-center text-xs text-gray-400 italic font-bold leading-relaxed uppercase">
                  ग्राहकको लागि थप विवरण <br/> आवश्यक छैन। <br/> <span className="text-cyan-500">सिधै दर्ता गर्नुहोस्!</span>
                </p>
              </div>
            )}
          </div>

          {/* ३. बटनमा type="submit" थपियो */}
          <div className="md:col-span-2 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
             <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest max-w-md text-center md:text-left leading-relaxed italic">
               By clicking Finalize Registration, you agree to the Smart Team Networks terms of service, payment rules, and initial 6-month trial policy.
             </p>
             <button 
               type="submit"
               className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-white hover:to-white hover:text-black text-white px-20 py-5 rounded-3xl font-black uppercase text-xs tracking-[0.3em] transition-all shadow-2xl shadow-cyan-500/30 active:scale-95 border-2 border-white/10"
             >
               Finalize Registration
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}