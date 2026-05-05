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
  age: number | string;
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
  googleLogin: (googleToken: string) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  changePassword: (cnic: string, phone: string, newPassword: string) => Promise<{success: boolean, message: string}>;
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
        console.log('✅ User login successful');
        handleAuthSuccess(data);
        return true;
      }
      
      const errorData = await response.json();
      console.error('❌ Login failed:', errorData.message || response.statusText);
      alert(errorData.message || 'Login failed. Please check your credentials.');
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
        console.log('✅ Admin login successful');
        handleAuthSuccess(data);
        return true;
      }

      const errorData = await response.json();
      console.error('❌ Admin login failed:', errorData.message || response.statusText);
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
        console.log('✅ User registration successful');
        handleAuthSuccess(data);
        return true;
      }
      
      const errorData = await response.json();
      console.error('❌ Registration failed:', errorData.message || response.statusText);
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

  // ✅ Google Login
  const googleLogin = async (googleToken: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Google login successful');
        handleAuthSuccess(data);
        return true;
      }
      const errorData = await response.json();
      console.error('❌ Google login failed:', errorData.message);
      return false;
    } catch (error) {
      console.error('🚨 Google Login Error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update Profile
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        console.log('✅ Profile updated successful');
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('🚨 Update Profile Error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Account
  const deleteAccount = async (): Promise<boolean> => {
    if (!user) return false;
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('✅ Account deleted');
        logout();
        return true;
      }
      return false;
    } catch (error) {
      console.error('🚨 Delete Account Error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Change Password
  const changePassword = async (cnic: string, phone: string, newPassword: string): Promise<{success: boolean, message: string}> => {
    if (!user) return { success: false, message: 'User not logged in' };
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/change-password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnic, phone, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('✅ Password changed');
        return { success: true, message: 'Password changed successfully' };
      }
      return { success: false, message: data.message || 'Failed to change password' };
    } catch (error: any) {
      console.error('🚨 Change Password Error:', error);
      return { success: false, message: 'An error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    login,
    adminLogin,
    signup,
    googleLogin,
    updateProfile,
    deleteAccount,
    changePassword,
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