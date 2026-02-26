'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const { verifyOtp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setLoading(true);
    setError('');

    const success = await verifyOtp(phone, otpString);

    if (success) {
      // Check if new user
      const userStr = localStorage.getItem('stn_user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (user?.isNewUser) {
        router.push('/profile/setup');
      } else {
        router.push('/home');
      }
    } else {
      setError('Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
    
    setLoading(false);
  };

  const resendOtp = () => {
    setCountdown(60);
    // Resend logic here
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-black to-cyan-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black/50 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
        
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-white mb-2">Verify OTP</h1>
          <p className="text-gray-400">
            Code sent to <span className="text-cyan-400">{phone}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        {/* OTP Inputs */}
        <div className="flex justify-center gap-2 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 bg-white/5 border-2 border-white/20 rounded-xl text-center text-2xl font-bold text-white focus:border-cyan-500 focus:outline-none transition-colors"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || otp.join('').length !== 6}
          className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] mb-4"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Verifying...
            </span>
          ) : (
            'Verify & Login ✅'
          )}
        </button>

        {/* Resend */}
        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-gray-500">
              Resend in <span className="text-cyan-400">{countdown}s</span>
            </p>
          ) : (
            <button
              onClick={resendOtp}
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Resend OTP 🔄
            </button>
          )}
        </div>

        <button
          onClick={() => router.push('/login')}
          className="w-full mt-6 text-gray-400 hover:text-white text-sm"
        >
          ← Change Phone Number
        </button>
      </div>
    </div>
  );
}