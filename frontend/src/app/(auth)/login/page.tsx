// app/admin/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { adminLogin, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated as admin only
  useEffect(() => {
    if (!authLoading && isAuthenticated && isAdmin) {
      console.log('✅ Already authenticated as admin, redirecting...');
      router.push('/dashboard');
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔄 Starting admin login process...');

    try {
      const success = await adminLogin(email, password);
      console.log('📊 Login result:', success);
      
      if (success) {
        console.log('✅ Login successful, redirecting...');
        router.push('/dashboard');
      } else {
        setError('Invalid admin credentials or access denied. Please check email and password.');
      }
    } catch (err: any) {
      console.error('🚨 Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#629D23]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-sm text-[#629D23] hover:text-[#2D3B29] mb-8">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Login Form */}
        <div>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Admin Login
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Staff access only
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <div className="text-sm">{error}</div>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[#629D23] focus:border-[#629D23] focus:z-10 sm:text-sm"
                    placeholder="admin@supplimax.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[#629D23] focus:border-[#629D23] focus:z-10 sm:text-sm"
                    placeholder="Enter admin password"
                  />
                </div>
              </div>
            </div>
                               
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#629D23] hover:bg-[#2D3B29] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#629D23] disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Admin Login'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                This portal is for authorized staff only. Unauthorized access is prohibited.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}