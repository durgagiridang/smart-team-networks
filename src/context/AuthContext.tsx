'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  role: string;
  isNewUser?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:8000/api/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Mount हुँदा localStorage बाट लोड गर्ने
    const savedToken = localStorage.getItem('stn_token');
    const savedUser = localStorage.getItem('stn_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      validateToken(savedToken);
    }
    setLoading(false);
  }, []);

  const validateToken = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) {
        logout();
      }
    } catch (error) {
      console.error('Token validation error:', error);
    }
  };

  const login = async (phone: string) => {
    try {
      const res = await fetch(`${API_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });

      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }

      // Development मा OTP देखाउने
      if (data.devOtp) {
        console.log('🔐 Your OTP:', data.devOtp);
        toast(`OTP: ${data.devOtp}`, { icon: '🔐' });
      }

      return data;
    } catch (error: any) {
      toast.error(error.message || 'OTP पठाउन सकिएन');
      throw error;
    }
  };

  const verifyOtp = async (phone: string, otp: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });

      const data = await res.json();

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        
        localStorage.setItem('stn_token', data.token);
        localStorage.setItem('stn_user', JSON.stringify(data.user));
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userName', data.user.name || data.user.phone);

        toast.success('लगइन सफल!');
        return true;
      } else {
        toast.error(data.message || 'OTP गलत छ');
        return false;
      }
    } catch (error) {
      toast.error('सर्भरमा समस्या');
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('stn_token');
    localStorage.removeItem('stn_user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    toast.success('लगआउट भयो');
    router.push('/login');
  };

  const updateProfile = async (profileData: any) => {
    if (!token || !user) {
      toast.error('लगइन आवश्यक छ');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          ...profileData
        })
      });

      const data = await res.json();
      
      if (data.success) {
        const updatedUser = { ...user, ...data.user };
        setUser(updatedUser);
        localStorage.setItem('stn_user', JSON.stringify(updatedUser));
        toast.success('प्रोफाइल अपडेट भयो');
      } else {
        toast.error(data.message || 'अपडेट हुन सकेन');
      }
    } catch (error) {
      toast.error('सर्भरमा समस्या');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      login,
      verifyOtp,
      logout,
      updateProfile,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};