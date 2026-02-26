'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProfileSetupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateProfile, user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({
        name,
        email: email || undefined
      });
      
      router.push('/home');
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const skip = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-black to-cyan-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black/50 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
        
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-2xl font-bold text-white mb-2">Complete Profile</h1>
          <p className="text-gray-400">Tell us about yourself</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ram Bahadur"
              className="w-full bg-white/5 border border-white/20 rounded-xl py-4 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ram@example.com"
              className="w-full bg-white/5 border border-white/20 rounded-xl py-4 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? 'Saving... 💾' : 'Complete Setup ✅'}
          </button>

          <button
            type="button"
            onClick={skip}
            className="w-full text-gray-400 hover:text-white py-3 text-sm"
          >
            Skip for now →
          </button>
        </form>
      </div>
    </div>
  );
}