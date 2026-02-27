'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const businessServices = [
  "रेस्टुरेन्ट", "होटल", "राइडर", "डाक्टर", 
  "टुर", "फेसन", "ब्युटी", "बेकरी"
];

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'user' | 'merchant' | 'rider' | null>(null);
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Details
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    gender: 'Male',
    businessName: '',
    category: '',
    city: '',
  });

  // OTP पठाउने
  const sendOTP = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success('OTP पठाइयो!');
        setStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('सर्भरमा समस्या');
    } finally {
      setLoading(false);
    }
  };

  // OTP Verify गर्ने
  const verifyOTP = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success('OTP सही!');
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        
        // नयाँ user भए details भर्न पठाउने
        if (data.user.isNewUser) {
          setStep(3);
        } else {
          router.push('/');
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('सर्भरमा समस्या');
    } finally {
      setLoading(false);
    }
  };

  // Profile Update गर्ने
  const completeRegistration = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const res = await fetch('http://localhost:8000/api/auth/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          name: formData.fullName,
          email: formData.email,
          role,
          ...formData
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success('दर्ता सफल!');
        router.push('/');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('सर्भरमा समस्या');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Phone Input
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-black to-cyan-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-black/50 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {role === 'merchant' ? 'व्यापारी दर्ता' : role === 'rider' ? 'राइडर दर्ता' : 'ग्राहक दर्ता'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">फोन नम्बर</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🇳🇵 +977</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98XXXXXXXX"
                  className="w-full bg-white/5 border border-white/20 rounded-xl py-4 pl-20 pr-4 text-white"
                  maxLength={10}
                />
              </div>
            </div>

            <button
              onClick={sendOTP}
              disabled={loading || phone.length < 10}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 text-white font-bold py-4 rounded-xl"
            >
              {loading ? 'पठाइँदैछ...' : 'OTP पठाउनुहोस्'}
            </button>
            
            <button onClick={() => setRole(null)} className="w-full text-gray-400 text-sm">
              ← फर्किनुहोस्
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: OTP Verify
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-black to-cyan-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-black/50 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">OTP प्रवेश गर्नुहोस्</h2>
          <p className="text-gray-400 text-center mb-6">{phone} मा पठाइएको</p>
          
          <div className="space-y-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="६ अंकको OTP"
              className="w-full bg-white/5 border border-white/20 rounded-xl py-4 px-4 text-white text-center text-2xl tracking-widest"
              maxLength={6}
            />

            <button
              onClick={verifyOTP}
              disabled={loading || otp.length < 6}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 text-white font-bold py-4 rounded-xl"
            >
              {loading ? 'जाँच गरिँदैछ...' : 'पुष्टि गर्नुहोस्'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Details (नयाँ user को लागि)
  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10">
      <div className="max-w-2xl mx-auto bg-slate-900/20 border border-white/5 p-8 rounded-3xl">
        <h2 className="text-2xl font-bold mb-6">थप विवरण भर्नुहोस्</h2>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="पूरा नाम"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            className="w-full bg-black/50 border border-white/10 p-4 rounded-xl"
          />
          
          <input
            type="email"
            placeholder="इमेल"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-black/50 border border-white/10 p-4 rounded-xl"
          />
          
          <select
            value={formData.gender}
            onChange={(e) => setFormData({...formData, gender: e.target.value})}
            className="w-full bg-black/50 border border-white/10 p-4 rounded-xl"
          >
            <option value="Male">पुरुष</option>
            <option value="Female">महिला</option>
          </select>

          {role === 'merchant' && (
            <>
              <input
                type="text"
                placeholder="व्यवसायको नाम"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                className="w-full bg-black/50 border border-white/10 p-4 rounded-xl"
              />
              
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-black/50 border border-white/10 p-4 rounded-xl"
              >
                <option value="">श्रेणी छान्नुहोस्</option>
                {businessServices.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </>
          )}

          <input
            type="text"
            placeholder="शहर"
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
            className="w-full bg-black/50 border border-white/10 p-4 rounded-xl"
          />

          <button
            onClick={completeRegistration}
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl"
          >
            {loading ? 'दर्ता हुँदैछ...' : 'दर्ता पूरा गर्नुहोस्'}
          </button>
        </div>
      </div>
    </div>
  );
}