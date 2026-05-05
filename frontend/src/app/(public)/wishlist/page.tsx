'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Heart, ShoppingCart, Trash2, Home, ArrowLeft, Star } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md w-full border border-gray-100">
          <div className="bg-pink-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-pink-300" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#2D3B29] mb-4">Your Wishlist is Empty</h1>
          <p className="text-gray-500 mb-8 text-lg">Save your favorite supplements here to buy them later!</p>
          <Link 
            href="/product" 
            className="w-full bg-[#629D23] hover:bg-[#2D3B29] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 inline-block shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  const handleMoveToCart = (product: any) => {
    addToCart(product);
    // Option to remove from wishlist when adding to cart
    removeFromWishlist(product.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-[#2D3B29] tracking-tight">My Wishlist</h1>
            <p className="text-[#629D23] font-medium mt-1">You have {wishlist.length} items saved</p>
          </div>
          <Link href="/product" className="text-[#629D23] hover:text-[#2D3B29] font-bold flex items-center transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group border border-gray-50 flex flex-col h-full overflow-hidden">
              <div className="relative h-64 bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#629D23] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    {product.category}
                  </span>
                </div>
                
                <button 
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-4 right-4 p-2 bg-white text-red-500 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center text-yellow-400">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs font-bold text-gray-500 ml-1">{product.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-2xl font-extrabold text-[#629D23]">{product.price.toFixed(2)} Rs</p>
                </div>
                
                <h3 className="text-xl font-bold text-[#2D3B29] mb-4 group-hover:text-[#629D23] transition-colors line-clamp-2">
                  {product.name}
                </h3>
                
                <div className="mt-auto flex space-x-3">
                   <Link 
                    href={`/product/${product.id}`}
                    className="flex-1 border-2 border-gray-100 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all text-center text-sm"
                  >
                    View Details
                  </Link>
                  <button 
                    onClick={() => handleMoveToCart(product)}
                    className="bg-[#2D3B29] hover:bg-[#629D23] text-white p-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center group/btn"
                  >
                    <ShoppingCart size={20} className="transform group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
