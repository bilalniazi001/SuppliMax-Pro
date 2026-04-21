'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { API_BASE_URL } from '../config';
export interface User {
  id: string;
  name: string;
  age?: number;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  nationality?: string;
  cnic?: string;
  createdAt?: string;
}

interface SignupData {
  name: string;
  age: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  nationality: string;
  cnic: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Role checking
  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('❌ Auth restoration failed:', error);
        logout(); // Clear bad data
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ Login Helper Function
  const handleAuthSuccess = (data: { token: string; user: User }) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user_data', JSON.stringify(data.user));
    setUser(data.user);
    setIsAuthenticated(true);
  };

  // ✅ Public User Login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        handleAuthSuccess(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('🚨 Login Error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Admin Login
  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        handleAuthSuccess(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('🚨 Admin Login Error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Signup Function
  const signup = async (userData: SignupData): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        handleAuthSuccess(data);
        return true;
      }
      const errorData = await response.json();
      alert(errorData.message || 'Signup failed');
      return false;
    } catch (error) {
      console.error('🚨 Signup Error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    login,
    adminLogin,
    signup,
    logout,
    loading,
    isAuthenticated,
    isAdmin,
    isUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}