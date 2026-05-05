'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, Phone, MapPin, Calendar, Hash, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

function AuthPageContent() {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'admin'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    nationality: '',
    cnic: ''
  });

  const { login, adminLogin, signup, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (isAdmin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  // Handle mode from query params
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') setAuthMode('signup');
    if (mode === 'admin') setAuthMode('admin');
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let success = false;
      if (authMode === 'admin') {
        success = await adminLogin(email, password);
      } else {
        success = await login(email, password);
      }

      if (success) {
        if (authMode === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      } else {
        setError(authMode === 'admin' 
          ? 'Invalid admin credentials or access denied.' 
          : 'Invalid email or password. Please try again.');
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const age = parseInt(signupData.age);
    if (isNaN(age) || age < 18) {
      setError('You must be at least 18 years old');
      return;
    }

    setLoading(true);

    try {
      const success = await signup({
        ...signupData,
        age: age
      });
      if (success) {
        router.push('/');
      } else {
        setError('Failed to create account. Email might already exist.');
      }
    } catch (err) {
      setError('An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#629D23]"></div>
      </div>
    );
  }

  const inputClassNames = "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#629D23] focus:border-transparent transition-all duration-200 text-[#2D3B29] placeholder:text-[#2D3B29]/70";
  const iconClassNames = "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        {/* Header & Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-sm text-[#629D23] hover:text-[#2D3B29] mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-black text-[#629D23] mb-2">SuppliMax</h1>
          <h2 className="text-xl font-bold text-gray-900">
            {authMode === 'login' && 'Welcome Back'}
            {authMode === 'signup' && 'Create Account'}
            {authMode === 'admin' && 'Staff Portal'}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {authMode === 'login' && 'Please enter your details to sign in'}
            {authMode === 'signup' && 'Join the SuppliMax community today'}
            {authMode === 'admin' && 'Authorized personnel only'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authMode === 'login' ? 'bg-white text-[#629D23] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Login
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authMode === 'signup' ? 'bg-white text-[#629D23] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setAuthMode('admin')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authMode === 'admin' ? 'bg-[#2D3B29] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Admin
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md animate-shake">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Forms */}
        {authMode === 'signup' ? (
          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="grid grid-cols-1 gap-4">
              <div className="relative">
                <User className={iconClassNames} />
                <input name="name" type="text" required value={signupData.name} onChange={handleSignupInputChange} className={inputClassNames} placeholder="Full Name" />
              </div>
              <div className="relative">
                <Mail className={iconClassNames} />
                <input name="email" type="email" required value={signupData.email} onChange={handleSignupInputChange} className={inputClassNames} placeholder="Email Address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Phone className={iconClassNames} />
                  <input name="phone" type="tel" required value={signupData.phone} onChange={handleSignupInputChange} className={inputClassNames} placeholder="Phone" />
                </div>
                <div className="relative">
                  <Calendar className={iconClassNames} />
                  <input name="age" type="number" required min="18" value={signupData.age} onChange={handleSignupInputChange} className={inputClassNames} placeholder="Age" />
                </div>
              </div>
              <div className="relative">
                <Lock className={iconClassNames} />
                <input name="password" type="password" required value={signupData.password} onChange={handleSignupInputChange} className={inputClassNames} placeholder="Create Password" />
              </div>
              <div className="relative">
                <MapPin className={iconClassNames} />
                <input name="address" type="text" required value={signupData.address} onChange={handleSignupInputChange} className={inputClassNames} placeholder="Complete Address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input name="city" type="text" required value={signupData.city} onChange={handleSignupInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#629D23] text-[#2D3B29] placeholder:text-[#2D3B29]/70" placeholder="City" />
                <input name="country" type="text" required value={signupData.country} onChange={handleSignupInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#629D23] text-[#2D3B29] placeholder:text-[#2D3B29]/70" placeholder="Country" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input name="nationality" type="text" required value={signupData.nationality} onChange={handleSignupInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#629D23] text-[#2D3B29] placeholder:text-[#2D3B29]/70" placeholder="Nationality" />
                <input name="postalCode" type="text" required value={signupData.postalCode} onChange={handleSignupInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#629D23] text-[#2D3B29] placeholder:text-[#2D3B29]/70" placeholder="Postal Code" />
              </div>
              <div className="relative">
                <Hash className={iconClassNames} />
                <input name="cnic" type="text" required value={signupData.cnic} onChange={handleSignupInputChange} className={inputClassNames} placeholder="CNIC Number" />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#629D23] text-white py-3 px-4 rounded-xl font-bold hover:bg-[#2D3B29] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Create Account'}
            </button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="relative">
                <Mail className={iconClassNames} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClassNames}
                  placeholder={authMode === 'admin' ? "Admin Email" : "Email Address"}
                />
              </div>
              <div className="relative">
                <Lock className={iconClassNames} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClassNames}
                  placeholder="Password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${authMode === 'admin' ? 'bg-[#2D3B29] hover:bg-black' : 'bg-[#629D23] hover:bg-[#2D3B29]'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Authenticating...
                </span>
              ) : (
                authMode === 'admin' ? 'Admin Secure Login' : 'Sign In'
              )}
            </button>

            {authMode === 'admin' && (
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <ShieldCheck size={14} className="text-gray-400" />
                <span>Encrypted connection. Access is monitored.</span>
              </div>
            )}
          </form>
        )}

        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
              className="text-[#629D23] font-bold hover:underline"
            >
              {authMode === 'signup' ? 'Sign In' : 'Create one now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#629D23]"></div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}