'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Home } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md w-full border border-gray-100">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#2D3B29] mb-4">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added anything to your cart yet.</p>
          <Link 
            href="/product" 
            className="w-full bg-[#629D23] hover:bg-[#2D3B29] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 inline-block shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const shipping = 10;
  const total = cartTotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-[#2D3B29] tracking-tight">Shopping Cart</h1>
            <p className="text-[#629D23] font-medium mt-1">You have {cartCount} items in your cart</p>
          </div>
          <Link href="/product" className="text-[#629D23] hover:text-[#2D3B29] font-bold flex items-center transition-colors">
            <Home className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <div className="lg:col-span-8">
            <ul className="space-y-6">
              {cart.map((product) => (
                <li key={product.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-2">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex-1 w-full flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start text-center sm:text-left gap-2 sm:gap-0">
                      <div>
                        <h3 className="text-lg font-bold text-[#2D3B29] hover:text-[#629D23] transition-colors">
                          <Link href={`/product/${product.id}`}>{product.name}</Link>
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 capitalize">{product.category}</p>
                      </div>
                      <p className="text-lg font-extrabold text-[#2D3B29]">{product.price.toFixed(2)} Rs</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 mt-4 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-50">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(product.id, product.quantity - 1)}
                          className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-1 font-bold text-[#2D3B29]">{product.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(product.id, product.quantity + 1)}
                          className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(product.id)}
                        className="text-red-500 hover:text-red-700 transition-colors flex items-center text-sm font-semibold"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-16 lg:mt-0 lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-[#2D3B29] mb-6 border-b pb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#2D3B29]">{cartTotal.toFixed(2)} Rs</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-bold text-[#2D3B29]">{shipping.toFixed(2)} Rs</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                  <span className="text-xl font-bold text-[#2D3B29]">Total</span>
                  <span className="text-2xl font-extrabold text-[#629D23]">{total.toFixed(2)} Rs</span>
                </div>
              </div>

              <Link 
                href="/checkout"
                className="w-full mt-8 bg-[#629D23] hover:bg-[#2D3B29] text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center space-x-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="mt-6 flex items-center justify-center space-x-4 grayscale opacity-50">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
