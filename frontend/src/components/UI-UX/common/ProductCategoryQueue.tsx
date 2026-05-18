"use client";
import { API_BASE_URL } from '@/config';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';





interface CategoryItem {
  id: string;
  name: string;
  productCount: number;
  imageSrc: string;
  href: string;
}

export default function ProductCategoryQueue() {
  const [categoriesData, setCategoriesData] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Categories ke liye background images (Using sup-X series as requested)
  const categoryImages = {
    'Protein': '/Images/sup-1.jpg',
    'Pre Workout': '/Images/sup-2.jpg',
    'Weight Gainer': '/Images/sup-3.jpg',
    'Creatine': '/Images/sup-4.jpg',
    'BCAA': '/Images/sup-5.jpg',
    'Fat Burner': '/Images/sup-6.jpg',
    'Performance': '/Images/sup-7.jpg',
    'Recovery': '/Images/sup-8.jpg'
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products/categories/all`);

        if (!response.ok) throw new Error('Failed to fetch categories');
        const result = await response.json();

        let categories: any[] = [];
        if (Array.isArray(result)) {
          categories = result;
        } else if (result && typeof result === 'object') {
          categories = Object.values(result).filter(c => c && typeof c === 'object');
        }

        const mappedCategories = categories.map((cat: any) => {
          const normalizedCategory = cat.name?.trim() || cat.id?.trim();
          const imageSrc = cat.imageSrc ||
            categoryImages[normalizedCategory as keyof typeof categoryImages] ||
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80';

          return {
            id: normalizedCategory,
            name: normalizedCategory,
            productCount: parseInt(cat.productCount) || 0,
            imageSrc: imageSrc,
            href: `/shop/${normalizedCategory}`
          };
        });

        setCategoriesData(mappedCategories);
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
        setCategoriesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse text-xl font-semibold text-gray-400">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 border-b border-gray-100">
      {categoriesData.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-400 mb-2">
            <ShoppingBag className="w-12 h-12 mx-auto opacity-20" />
          </div>
          <p className="text-gray-500 font-medium">No categories found at the moment.</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
          {categoriesData.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="flex flex-col items-center group w-24 md:w-32"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-[#629D23] transition-colors duration-300 shadow-sm group-hover:shadow-md">
                <img
                  src={category.imageSrc}
                  alt={category.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
              <h3 className="text-sm md:text-base font-bold text-gray-800 text-center group-hover:text-[#629D23] transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


