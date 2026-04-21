'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Mail, Lock, User, Phone, MapPin, Calendar, Hash } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
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

  const { login, signup } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);

  // Body overflow hidden when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Reset forms when switching between login/signup
  useEffect(() => {
    setError('');
    if (isLogin) {
      setLoginEmail('');
      setLoginPassword('');
    }
  }, [isLogin]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(loginEmail, loginPassword);
      if (success) {
        onClose();
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // Signup Handler
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
      const success = await signup(signupData);
      if (success) {
        onClose();
        setSignupData({
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
      } else {
        setError('Failed to create account. Email might already exist.');
      }
    } catch (err) {
      setError('An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  // Input Change Handlers
  const handleLoginEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginEmail(e.target.value);
  };

  const handleLoginPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginPassword(e.target.value);
  };

  const handleSignupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Backdrop Click Handler
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  //  Input Common Classes (with new color fixes)
  const inputClassNames = `w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#629D23] focus:border-transparent text-[#2D3B29] placeholder:text-[#2D3B29]/70`;
  const plainInputClassNames = `w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#629D23] focus:border-transparent text-[#2D3B29] placeholder:text-[#2D3B29]/70`;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-[#629D23] to-[#2D3B29]">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Join Supplimax'}
            </h2>
            <p className="text-green-100 text-sm mt-1">
              {isLogin ? 'Sign in to your account' : 'Create your account in seconds'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-green-200 transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Toggle Buttons */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 font-semibold transition-all duration-300 ${
              isLogin 
                ? 'bg-white text-[#629D23] border-t-2 border-[#629D23]' 
                : 'bg-transparent text-gray-600 hover:text-[#629D23]'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 font-semibold transition-all duration-300 ${
              !isLogin 
                ? 'bg-white text-[#629D23] border-t-2 border-[#629D23]' 
                : 'bg-transparent text-gray-600 hover:text-[#629D23]'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="text-sm font-medium">{error}</div>
          </div>
        )}

        {/* Forms */}
        <div className="p-6">
          {isLogin ? (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="login-email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={handleLoginEmailChange}
                    className={inputClassNames} // ✨ Applied new classes
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={loginPassword}
                    onChange={handleLoginPasswordChange}
                    className={inputClassNames} // ✨ Applied new classes
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#629D23] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#2D3B29] transition duration-300 disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In to Your Account'}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className="text-[#629D23] font-semibold hover:text-[#2D3B29]"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </form>
          ) : (
            // Signup Form
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="signup-name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="signup-name"
                      type="text"
                      name="name"
                      required
                      value={signupData.name}
                      onChange={handleSignupInputChange}
                      className={inputClassNames} // ✨ Applied new classes
                      placeholder="Enter your full name"
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-age" className="block text-sm font-semibold text-gray-700 mb-2">
                    Age
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="signup-age"
                      type="number"
                      name="age"
                      required
                      min="18"
                      value={signupData.age}
                      onChange={handleSignupInputChange}
                      className={inputClassNames} // ✨ Applied new classes
                      placeholder="Your age"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="signup-email"
                      type="email"
                      name="email"
                      required
                      value={signupData.email}
                      onChange={handleSignupInputChange}
                      className={inputClassNames} // ✨ Applied new classes
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="signup-phone"
                      type="tel"
                      name="phone"
                      required
                      value={signupData.phone}
                      onChange={handleSignupInputChange}
                      className={inputClassNames} // ✨ Applied new classes
                      placeholder="Your phone number"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="signup-password"
                      type="password"
                      name="password"
                      required
                      minLength={6}
                      value={signupData.password}
                      onChange={handleSignupInputChange}
                      className={inputClassNames} // ✨ Applied new classes
                      placeholder="Create password (min. 6 chars)"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-cnic" className="block text-sm font-semibold text-gray-700 mb-2">
                    CNIC Number
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="signup-cnic"
                      type="text"
                      name="cnic"
                      required
                      value={signupData.cnic}
                      onChange={handleSignupInputChange}
                      className={inputClassNames} // ✨ Applied new classes
                      placeholder="Your CNIC number"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="signup-address" className="block text-sm font-semibold text-gray-700 mb-2">
                  Complete Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-4 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="signup-address"
                    type="text"
                    name="address"
                    required
                    value={signupData.address}
                    onChange={handleSignupInputChange}
                    className={inputClassNames} // ✨ Applied new classes
                    placeholder="Enter your complete address"
                    autoComplete="street-address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="signup-city" className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    id="signup-city"
                    type="text"
                    name="city"
                    required
                    value={signupData.city}
                    onChange={handleSignupInputChange} 
                    className={plainInputClassNames} // ✨ Applied new classes (without pl-12)
                    placeholder="Your city"
                    autoComplete="address-level2"
                  />
                </div>

                <div>
                  <label htmlFor="signup-country" className="block text-sm font-semibold text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    id="signup-country"
                    type="text"
                    name="country"
                    required
                    value={signupData.country}
                    onChange={handleSignupInputChange} 
                    className={plainInputClassNames} // ✨ Applied new classes (without pl-12)
                    placeholder="Your country"
                    autoComplete="country"
                  />
                </div>

                <div>
                  <label htmlFor="signup-postalCode" className="block text-sm font-semibold text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    id="signup-postalCode"
                    type="text"
                    name="postalCode"
                    required
                    value={signupData.postalCode}
                    onChange={handleSignupInputChange} 
                    className={plainInputClassNames} //  Applied new classes (without pl-12)
                    placeholder="Postal code"
                    autoComplete="postal-code"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-nationality" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nationality
                </label>
                <input
                  id="signup-nationality"
                  type="text"
                  name="nationality"
                  required
                  value={signupData.nationality}
                  onChange={handleSignupInputChange} 
                  className={plainInputClassNames} // ✨ Applied new classes (without pl-12)
                  placeholder="Your nationality"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#629D23] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#2D3B29] transition duration-300 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Your Account'}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className="text-[#629D23] font-semibold hover:text-[#2D3B29]"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}