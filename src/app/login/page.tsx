'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Format phone number (remove spaces, ensure +977)
      let formattedPhone = phone.replace(/\s/g, '');
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+977' + formattedPhone.replace(/^0/, '');
      }

      await login(formattedPhone);
      
      // OTP page मा जाने
      router.push(`/verify-otp?phone=${encodeURIComponent(formattedPhone)}`);
      
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-black to-cyan-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black/50 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-3xl font-black italic text-white mb-2">STN</h1>
          <p className="text-cyan-400">Smart Team Networks</p>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Login with Phone
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🇳🇵 +977
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98XXXXXXXX"
                className="w-full bg-white/5 border border-white/20 rounded-xl py-4 pl-20 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                maxLength={10}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Example: 9841234567
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || phone.length < 10}
            className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Sending OTP...
              </span>
            ) : (
              'Send OTP 📱'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-cyan-400 hover:text-cyan-300">
              Register
            </Link>
          </p>
        </div>

        {/* Development Notice */}
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <p className="text-yellow-400 text-xs text-center">
            🔧 Development Mode: OTP will be shown in console
          </p>
        </div>
      </div>
    </div>
  );
}