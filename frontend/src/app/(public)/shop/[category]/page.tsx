'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Star, Heart, Eye, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { API_BASE_URL } from '@/config';

// UPDATED: id and _id both supported
interface Product {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  rating: number;
  discountPercentage: number;
  onSale: boolean;
  isFeatured?: boolean;
  isExclusive?: boolean;
  isNewArrival?: boolean;
}

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const init = async () => {
      const resolvedParams = await params;
      const decodedCategory = decodeURIComponent(resolvedParams.category);
      setCategoryName(decodedCategory);
      
      try {
        const res = await fetch(`${API_BASE_URL}/products`, {
          cache: 'no-store'
        });

        if (!res.ok) throw new Error('Failed to fetch products');

        const result = await res.json();
        
        // ✅ Handle object with numeric keys or direct array
        let rawProducts: any[] = [];
        if (Array.isArray(result)) {
          rawProducts = result;
        } else if (result && typeof result === 'object') {
          rawProducts = Object.values(result).filter(p => p && typeof p === 'object');
        }

        const filteredProducts = rawProducts.filter((product: any) =>
          product.category?.toLowerCase().trim() === decodedCategory.toLowerCase().trim()
        );

        setProducts(filteredProducts.map((p, i) => ({
          ...p,
          id: p.id || p._id?.toString() || `cat-${i}`
        })));
      } catch (error) {
        console.error('❌ Error fetching category products:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [params]);

  const formattedCategory = categoryName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#629D23]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-[#629D23] hover:text-[#2D3B29] font-semibold mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 capitalize">
            {formattedCategory} Products
          </h1>
          <p className="text-gray-600 mt-2">
            {products.length}{' '}
            {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              No Products Found
            </h2>
            <p className="text-gray-500 mb-6">
              No products available in{' '}
              <span className="font-semibold">{formattedCategory}</span>{' '}
              category yet.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#629D23] hover:bg-[#2D3B29] text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const productId = product.id || product._id;

              const rating = product.rating || 4.6;

              return (
                <div
                  key={productId?.toString()}
                  className="bg-white rounded-[24px] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col p-3 relative"
                >
                  <div className="relative h-56 bg-[#F8F9FA] rounded-[20px] overflow-hidden flex items-center justify-center mb-4 group-hover:bg-gray-100 transition-colors">
                    <Link href={`/product/${productId}`} className="w-full h-full flex items-center justify-center">
                      <img
                        src={product.imageUrl || 'https://images.unsplash.com/photo-1583454110551-21f2fa2ec617?w=800&auto=format&fit=crop&q=60'}
                        alt={product.name}
                        className="max-w-full max-h-48 object-contain transition-transform duration-500 group-hover:scale-110 mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583454110551-21f2fa2ec617?w=800&auto=format&fit=crop&q=60';
                        }}
                      />
                    </Link>

                    {/* Top Left Badges */}
                    <div className="absolute top-3 left-3 flex flex-col space-y-2 z-10">
                      {product.isNewArrival && (
                        <span className="bg-[#629D23] text-white text-[11px] font-black px-3 py-1 rounded-full tracking-wide shadow-sm">
                          NEW
                        </span>
                      )}
                      {product.onSale && (
                        <span className="bg-red-600 text-white text-[11px] font-black px-3 py-1 rounded-full tracking-wide shadow-sm">
                          {product.discountPercentage}% OFF
                        </span>
                      )}
                    </div>

                    {/* Top Right Icons */}
                    <div className="absolute top-3 right-3 flex flex-col space-y-2 z-10">
                      <button className="w-9 h-9 bg-white rounded-full shadow-sm flex items-center justify-center text-[#0B1A28] hover:text-[#629D23] hover:shadow-md transition-all">
                        <Heart className="w-[18px] h-[18px]" />
                      </button>
                      <button className="w-9 h-9 bg-white rounded-full shadow-sm flex items-center justify-center text-[#0B1A28] hover:text-[#629D23] hover:shadow-md transition-all">
                        <Eye className="w-[18px] h-[18px]" />
                      </button>
                    </div>
                  </div>

                  <div className="px-2 pb-2 flex-grow flex flex-col">
                    <Link href={`/product/${productId}`}>
                      <h3 className="font-extrabold text-[#0B1A28] text-lg mb-1 line-clamp-2 hover:text-[#629D23] transition-colors leading-tight">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center mb-4 mt-1">
                      <div className="flex items-center text-[#FFB800]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-200 fill-transparent'}`} />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-gray-400 ml-2">({rating.toFixed(1)})</span>
                    </div>

                    <div className="flex items-end justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-[#629D23] leading-none tracking-tight">
                          {product.price} Rs
                        </span>
                        {product.onSale && (
                          <span className="text-sm font-bold text-gray-400 line-through mt-1">
                            {Math.round(product.price / (1 - product.discountPercentage / 100))} Rs
                          </span>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => addToCart(product as any)}
                        className="w-12 h-12 bg-[#0B1A28] text-white rounded-[14px] flex items-center justify-center hover:bg-[#629D23] transition-colors shadow-md hover:shadow-lg hover:-translate-y-1 transform duration-200 flex-shrink-0"
                      >
                        <ShoppingBag className="w-[22px] h-[22px]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}