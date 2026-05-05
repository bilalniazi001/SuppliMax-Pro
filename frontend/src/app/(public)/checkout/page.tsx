'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/config';
import { ShoppingBag, CreditCard, Truck, CheckCircle, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    city: 'Lahore',
    paymentMethod: 'Cash on Delivery',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
    if (cart.length === 0 && !isSuccess) {
      router.push('/product');
    }
  }, [isAuthenticated, cart, router, isSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError(null);

    const shipping = 10;
    const totalAmount = cartTotal + shipping;

    const orderData = {
      userId: user.id,
      totalAmount: totalAmount,
      address: `${formData.address}, ${formData.city}`,
      phone: formData.phone,
      paymentMethod: formData.paymentMethod,
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    console.log('📤 [FRONTEND] Sending Order Data:', orderData);

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      const result = await response.json();
      setOrderDetails(result);
      setIsSuccess(true);
      clearCart();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-2xl w-full border border-green-100 animate-in fade-in zoom-in duration-500">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-[#2D3B29] mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8 text-lg">
            Thank you for your purchase. Your order <span className="font-bold text-[#629D23]">#{orderDetails?.id?.substring(0, 8)}</span> has been placed successfully.
          </p>
          
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100">
            <h3 className="font-bold text-[#2D3B29] mb-4 border-b pb-2">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#2D3B29]/70 font-medium">Amount Paid:</span>
                <span className="font-bold text-[#2D3B29]">{orderDetails?.totalAmount?.toFixed(2)} Rs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#2D3B29]/70 font-medium">Shipping Address:</span>
                <span className="font-bold text-[#2D3B29]">{orderDetails?.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#2D3B29]/70 font-medium">Status:</span>
                <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-bold">
                  {orderDetails?.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/orders" 
              className="flex-1 bg-[#629D23] hover:bg-[#2D3B29] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              Track Order
            </Link>
            <Link 
              href="/product" 
              className="flex-1 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-bold py-4 px-8 rounded-xl transition-all duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shipping = 10;
  const total = cartTotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[#2D3B29] mb-10 tracking-tight">Checkout</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Info */}
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <div className="flex items-center mb-6">
                  <Truck className="w-6 h-6 text-[#629D23] mr-3" />
                  <h2 className="text-2xl font-bold text-[#2D3B29]">Shipping Information</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House #, Street name, Area"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#629D23] focus:border-transparent outline-none transition-all text-[#2D3B29] placeholder:text-[#2D3B29]/70"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                      <select 
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#629D23] outline-none text-[#2D3B29]"
                      >
                        <option>Lahore</option>
                        <option>Karachi</option>
                        <option>Islamabad</option>
                        <option>Faisalabad</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="03xx-xxxxxxx"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#629D23] outline-none text-[#2D3B29] placeholder:text-[#2D3B29]/70"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <div className="flex items-center mb-6">
                  <CreditCard className="w-6 h-6 text-[#629D23] mr-3" />
                  <h2 className="text-2xl font-bold text-[#2D3B29]">Payment Method</h2>
                </div>
                
                <div className="space-y-4">
                  <label className="flex items-center p-4 border-2 border-[#629D23] bg-green-50 rounded-2xl cursor-pointer transition-all">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={formData.paymentMethod === 'Cash on Delivery'}
                      onChange={handleChange}
                      className="w-5 h-5 text-[#629D23] focus:ring-[#629D23]"
                    />
                    <div className="ml-4">
                      <span className="block font-bold text-[#2D3B29]">Cash on Delivery</span>
                      <span className="text-sm text-gray-500">Pay when you receive your order</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border-2 border-gray-100 opacity-50 cursor-not-allowed rounded-2xl grayscale transition-all">
                    <input
                      type="radio"
                      name="paymentMethod"
                      disabled
                      className="w-5 h-5"
                    />
                    <div className="ml-4">
                      <span className="block font-bold text-[#2D3B29]">Credit / Debit Card</span>
                      <span className="text-sm text-gray-500">Online payment coming soon</span>
                    </div>
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center">
                  <AlertCircle className="text-red-500 mr-3" />
                  <p className="text-red-700 text-sm font-bold">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#629D23] hover:bg-[#2D3B29] text-white font-bold py-5 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center disabled:opacity-50 text-xl"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mr-3" />
                ) : (
                  <>Complete Order <ArrowRight className="ml-3" /></>
                )}
              </button>
            </form>
          </div>

          <div className="mt-16 lg:mt-0 lg:col-span-5">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-[#2D3B29] mb-6 border-b pb-4">Order Summary</h2>
              
              <div className="max-h-96 overflow-y-auto mb-6 pr-2 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl flex-shrink-0 p-1">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#2D3B29] truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-[#2D3B29]">{(item.price * item.quantity).toFixed(2)} Rs</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#2D3B29]">{cartTotal.toFixed(2)} Rs</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-bold text-[#2D3B29]">{shipping.toFixed(2)} Rs</span>
                </div>
                <div className="flex justify-between text-2xl font-extrabold text-[#2D3B29] pt-4 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-[#629D23]">{total.toFixed(2)} Rs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
