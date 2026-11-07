'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { authAPI } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (
    name: string,
    email: string,
    pass: string,
    photoURL?: string,
    phone?: string,
    location?: string,
    bio?: string
  ) => Promise<{ success: boolean; message?: string }>;
  googleLogin: (email: string, name?: string, photoURL?: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  handleAuthSuccess: (userData: User, authToken: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Restore session from localStorage immediately on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('civicpulse_token');
      const storedUser = localStorage.getItem('civicpulse_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));

        // Background verification to keep session sync
        authAPI.getMe()
          .then((res) => {
            if (res.success && res.user) {
              setUser(res.user);
              localStorage.setItem('civicpulse_user', JSON.stringify(res.user));
            }
          })
          .catch(() => {
            // If token expired, clear
            logout();
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error('Error hydrating auth state:', e);
      setLoading(false);
    }
  }, []);

  const handleAuthSuccess = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('civicpulse_token', authToken);
    localStorage.setItem('civicpulse_user', JSON.stringify(userData));
    document.cookie = `civicpulse_token=${authToken}; path=/; max-age=604800; SameSite=Lax`;
  };

  const login = async (email: string, pass: string) => {
    try {
      const res = await authAPI.login({ email, password: pass });
      if (res.success && res.token && res.user) {
        handleAuthSuccess(res.user, res.token);
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const register = async (
    name: string,
    email: string,
    pass: string,
    photoURL?: string,
    phone?: string,
    location?: string,
    bio?: string
  ) => {
    try {
      const res = await authAPI.register({
        name,
        email,
        password: pass,
        photoURL,
        phone,
        location,
        bio,
      });
      if (res.success && res.token && res.user) {
        handleAuthSuccess(res.user, res.token);
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  const googleLogin = async (email: string, name?: string, photoURL?: string) => {
    try {
      const res = await authAPI.googleAuth({ email, name, photoURL });
      if (res.success && res.token && res.user) {
        handleAuthSuccess(res.user, res.token);
        return { success: true, message: res.message, user: res.user };
      }
      return { success: false, message: res.message || 'Google login failed' };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Google login failed',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('civicpulse_token');
    localStorage.removeItem('civicpulse_user');
    document.cookie = 'civicpulse_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('civicpulse_user', JSON.stringify(updated));
      return updated;
    });
  };

  const refreshUser = async () => {
    try {
      const res = await authAPI.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('civicpulse_user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        googleLogin,
        logout,
        updateUser,
        refreshUser,
        handleAuthSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
