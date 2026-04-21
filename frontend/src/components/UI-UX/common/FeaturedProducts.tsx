'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import Link from 'next/link';

// --- TYPE DEFINITIONS & API CONFIG ---
interface ProductItem {
  id: string; 
  name: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number; 
  imageUrl: string;
  isNewArrival?: boolean; 
  _id?: string;
}

// ✅ Client-side environment variable support
const API_BASE_URL = 'https://supplimax-back-production.up.railway.app';
//const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
// Featured products fetch karne ka mukammal URL
const FETCH_URL = `${API_BASE_URL}/products?isFeatured=true`;

// --- FRAMER MOTION VARIANTS --- (Wahi rahay ga jo aapka tha)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// --- PRODUCT CARD COMPONENT ---
const ProductCard: React.FC<{ product: ProductItem; variants: any }> = ({ product, variants }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const getProductId = () => product.id || product._id || `temp-${Math.random().toString(36).substr(2, 9)}`;

  const getProductUrl = () => {
    const productId = getProductId();
    // ✅ Yahan check karein ke route plural hy ya singular (products vs product)
    return productId && !productId.toString().includes('temp-') ? `/products/${productId}` : '#';
  };

  const oldPrice = product.discountPercentage > 0 
    ? product.price / (1 - product.discountPercentage / 100)
    : undefined;

  const stars = Array(5).fill(0).map((_, i) => (
    <Star 
      key={`star-${getProductId()}-${i}`} 
      size={16} 
      fill={i < Math.floor(product.rating) ? '#FBBF24' : 'none'} 
      stroke="#FBBF24" 
    />
  ));

  const productUrl = getProductUrl();

  return (
    <motion.div 
      variants={variants}
      initial="hidden"
      animate="visible"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden bg-white group shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative h-64 w-full overflow-hidden bg-white flex items-center justify-center p-4">
        <img
          src={product.imageUrl || '/placeholder-image.jpg'}
          alt={product.name}
          className={`max-w-full max-h-48 object-contain transition-all duration-500 ease-in-out ${
            imageLoaded ? 'group-hover:opacity-70' : 'opacity-0'
          } ${imageError ? 'hidden' : ''}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
        
        {/* Hover Icons */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={isHovered ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
            className="flex space-x-3"
          >
            <button className="p-3 bg-white rounded-full shadow-lg hover:bg-red-50 transform hover:scale-110">
              <Heart size={20} className="text-gray-700 hover:text-red-500 transition-colors" />
            </button>
            
            {productUrl !== '#' ? (
              <Link href={productUrl}>
                <div className="p-3 bg-green-700 rounded-full shadow-lg hover:bg-[#629D23] transform hover:scale-110 cursor-pointer">
                  <Eye size={20} className="text-white" />
                </div>
              </Link>
            ) : (
              <button className="p-3 bg-gray-500 rounded-full cursor-not-allowed"><Eye size={20} className="text-white" /></button>
            )}
          </motion.div>
        </div>

        {product.isNewArrival && <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">NEW</span>}
        {product.discountPercentage > 0 && <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">-{product.discountPercentage}%</span>}
      </div>

      {/* Product Info */}
      <div className="p-4 text-center">
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{product.category}</p>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{product.name}</h3>
        <div className="flex justify-center items-center mb-2">
          {stars} <span className="text-sm text-gray-500 ml-1">({product.rating})</span>
        </div>
        <div className="flex justify-center items-center space-x-2">
          <span className={`text-xl font-bold ${oldPrice ? 'text-red-600' : 'text-gray-900'}`}>${product.price.toFixed(2)}</span>
          {oldPrice && <span className="text-sm text-gray-500 line-through">${oldPrice.toFixed(2)}</span>}
        </div>
      </div>
      
      <AnimatePresence>
        {isHovered && (
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="w-full bg-[#2D3B29] text-white py-3 flex items-center justify-center font-semibold text-sm hover:bg-[#4c781d]"
            onClick={(e) => { e.preventDefault(); alert(`Added ${product.name} to cart!`); }}
          >
            <ShoppingBag size={18} className="mr-2" /> Add to Cart
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductItem[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // ✅ FETCH_URL istemal ho raha hy
        const res = await fetch(FETCH_URL);
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data.map((item: any, index: number) => ({
            id: item.id || item._id?.toString() || `temp-${index + 1}`,
            _id: item._id,
            name: item.name || 'Unnamed Product',
            category: item.category || 'Uncategorized',
            price: item.price || 0,
            discountPercentage: item.discountPercentage || 0,
            rating: item.rating || 0,
            imageUrl: item.imageUrl || '',
            isNewArrival: item.isNewArrival || false,
          })));
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) return <div className="text-center py-20 bg-gray-200">Loading Featured...</div>;

  return (
    <section className="bg-gray-200 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-sm text-gray-600 uppercase tracking-widest mb-2">Shop Our New Releases</p>
          <h2 className="text-4xl font-extrabold text-gray-900">Featured Products</h2>
        </div>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          variants={containerVariants} initial="hidden" animate="visible"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} variants={itemVariants} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}