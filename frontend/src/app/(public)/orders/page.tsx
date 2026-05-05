'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/config';
import { Package, Truck, MapPin, CheckCircle, Star, MessageSquare, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingFeedback, setSubmittingFeedback] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_BASE_URL}/orders/user/${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const result = await response.json();
      // Handle both direct array and {value: []} structure
      const ordersArray = Array.isArray(result) ? result : (result.value || []);
      setOrders(ordersArray);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/orders');
      return;
    }
    fetchOrders();
  }, [user, isAuthenticated, router]);

  const handleSimulateProgress = async (orderId: string, currentStatus: string) => {
    let nextStatus = '';
    switch (currentStatus) {
      case 'Not Shipped': nextStatus = 'Shipped'; break;
      case 'Shipped': nextStatus = 'On the way'; break;
      case 'On the way': nextStatus = 'Delivered'; break;
      default: return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (response.ok) fetchOrders();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleFeedbackSubmit = async (orderId: string) => {
    setSubmittingFeedback(orderId);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/feedback`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: feedbackText }),
      });
      if (response.ok) {
        setFeedbackText('');
        setSubmittingFeedback(null);
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to submit feedback', err);
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'Not Shipped': return 0;
      case 'Shipped': return 1;
      case 'On the way': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-[#629D23] w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-[#2D3B29] tracking-tight">My Orders</h1>
            <p className="text-[#629D23] font-medium mt-1">Manage and track your supplement orders</p>
          </div>
          <Link href="/product" className="text-gray-500 hover:text-[#629D23] font-bold flex items-center transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-xl text-center border border-gray-100">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#2D3B29]">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start your fitness journey today!</p>
            <Link href="/product" className="bg-[#629D23] text-white px-8 py-3 rounded-xl font-bold transition-all hover:bg-[#2D3B29]">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const currentStep = getStatusStep(order.status);
              const steps = [
                { name: 'Not Shipped', icon: Package },
                { name: 'Shipped', icon: Truck },
                { name: 'On the way', icon: MapPin },
                { name: 'Delivered', icon: CheckCircle },
              ];

              return (
                <div key={order.id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transition-all hover:shadow-2xl">
                  {/* Order Header */}
                  <div className="bg-gray-50 p-6 flex flex-wrap justify-between items-center border-b border-gray-100 gap-4">
                    <div>
                      <span className="text-xs font-bold text-[#2D3B29]/70 uppercase tracking-wider">Order ID</span>
                      <p className="font-bold text-[#2D3B29]">#{order.id.substring(0, 8)}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#2D3B29]/70 uppercase tracking-wider">Date</span>
                      <p className="font-bold text-[#2D3B29]">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#2D3B29]/70 uppercase tracking-wider">Total</span>
                      <p className="text-xl font-black text-[#2D3B29]">Rs. {order.totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                       {order.status !== 'Delivered' && (
                        <button 
                          onClick={() => handleSimulateProgress(order.id, order.status)}
                          className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold hover:bg-blue-100 transition-colors"
                        >
                          Simulate Progress
                        </button>
                      )}
                      <span className={`px-4 py-1 rounded-full text-xs font-black uppercase ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Tracking Progress */}
                  <div className="p-8">
                    <div className="relative">
                      {/* Line */}
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                      <div 
                        className="absolute top-1/2 left-0 h-1 bg-[#629D23] -translate-y-1/2 z-0 transition-all duration-1000"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                      ></div>

                      {/* Steps */}
                      <div className="relative flex justify-between z-10">
                        {steps.map((step, idx) => {
                          const Icon = step.icon;
                          const isActive = idx <= currentStep;
                          const isCurrent = idx === currentStep;
                          
                          return (
                            <div key={idx} className="flex flex-col items-center">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                                isActive ? 'bg-[#629D23] text-white shadow-lg' : 'bg-white text-gray-300 border-2 border-gray-100'
                              } ${isCurrent ? 'scale-125 ring-4 ring-green-100' : ''}`}>
                                <Icon size={20} />
                              </div>
                              <span className={`mt-3 text-[10px] font-bold uppercase tracking-tight ${
                                isActive ? 'text-[#629D23]' : 'text-gray-400'
                              }`}>
                                {step.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-8 pb-8">
                    <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">Items</h4>
                    <div className="space-y-4">
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white rounded-xl p-2 shadow-sm border border-gray-50">
                              <img src={item.product?.imageUrl} alt="" className="w-full h-full object-contain" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#2D3B29]">{item.product?.name}</p>
                              <p className="text-xs font-medium text-gray-500">
                                Qty: <span className="font-bold text-[#2D3B29]">{item.quantity}</span> × <span className="font-bold text-[#629D23]">Rs. {item.price.toLocaleString()}</span>
                              </p>
                            </div>
                          </div>
                          <p className="text-lg font-black text-[#2D3B29]">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Section */}
                  {order.status === 'Delivered' && (
                    <div className="p-8 bg-green-50 border-t border-green-100">
                      {!order.feedback ? (
                        <div>
                          <div className="flex items-center mb-4">
                            <MessageSquare className="w-5 h-5 text-green-600 mr-2" />
                            <h4 className="font-bold text-[#2D3B29]">How was your delivery?</h4>
                          </div>
                          <div className="flex gap-3">
                            <input 
                              type="text" 
                              placeholder="Write your feedback..."
                              value={submittingFeedback === order.id ? feedbackText : ''}
                              onChange={(e) => {
                                setSubmittingFeedback(order.id);
                                setFeedbackText(e.target.value);
                              }}
                              className="flex-1 px-4 py-2 rounded-xl border border-green-200 focus:ring-2 focus:ring-[#629D23] outline-none"
                            />
                            <button 
                              onClick={() => handleFeedbackSubmit(order.id)}
                              className="bg-[#629D23] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#2D3B29] transition-all"
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1" />
                          <div>
                            <h4 className="font-bold text-[#2D3B29]">Feedback Provided</h4>
                            <p className="text-sm text-green-700 italic mt-1">"{order.feedback}"</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
