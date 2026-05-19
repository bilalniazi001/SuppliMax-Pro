'use client';
import { API_BASE_URL } from '@/config';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { Heart, Eye, ShoppingBag, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const ProductCard: React.FC<{ product: ProductItem }> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorited) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product as any);
    }
  };
  
  const getProductUrl = () => {
    const productId = product.id;
    return productId && !productId.toString().includes('temp-') ? `/product/${productId}` : '#';
  };

  const oldPrice = product.discountPercentage > 0 
    ? product.price / (1 - product.discountPercentage / 100)
    : undefined;

  const stars = Array(5).fill(0).map((_, i) => (
    <Star 
      key={`star-${product.id}-${i}`} 
      size={10} 
      className="sm:w-3.5 sm:h-3.5"
      fill={i < Math.floor(product.rating) ? '#FBBF24' : 'none'} 
      stroke="#FBBF24" 
    />
  ));

  const productUrl = getProductUrl();

  return (
    <motion.div 
      variants={itemVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden bg-white group shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl border border-gray-100 h-full flex flex-col justify-between"
    >
      <div className="relative h-28 sm:h-48 w-full overflow-hidden bg-white flex items-center justify-center p-2 sm:p-4">
        <img
          src={imageError || !product.imageUrl ? 'https://images.unsplash.com/photo-1583454110551-21f2fa2ec617?w=800&auto=format&fit=crop&q=60' : product.imageUrl}
          alt={product.name}
          className={`max-w-full max-h-24 sm:max-h-40 object-contain transition-all duration-500 ease-in-out ${
            imageLoaded ? 'group-hover:scale-105' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
        
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col space-y-1.5">
          <button 
            onClick={toggleWishlist}
            className={`p-1.5 sm:p-2 rounded-full shadow-lg transition-all ${isFavorited ? 'bg-red-50 text-red-500' : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-red-50 hover:text-red-500'}`}
          >
            <Heart size={12} className="sm:w-4 sm:h-4" fill={isFavorited ? "currentColor" : "none"} />
          </button>
          <Link href={productUrl}>
            <div className="p-1.5 sm:p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-[#629D23] hover:text-white transition-all cursor-pointer text-gray-700">
              <Eye size={12} className="sm:w-4 sm:h-4" />
            </div>
          </Link>
        </div>

        {product.isNewArrival && <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#629D23] text-white text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full z-10 uppercase tracking-widest">New</span>}
      </div>

      <div className="p-2 sm:p-4">
        <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {stars}
          </div>
          <span className="text-[9px] sm:text-[10px] text-gray-400 ml-1 font-bold">({product.rating.toFixed(1)})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs sm:text-lg font-black text-[#629D23]">{product.price.toFixed(0)} Rs</span>
            {oldPrice && <span className="text-[9px] sm:text-xs text-gray-400 line-through ml-1 sm:ml-2">{oldPrice.toFixed(0)} Rs</span>}
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); addToCart(product as any); }}
            className="p-1.5 sm:p-2 bg-gray-900 text-white rounded-lg hover:bg-[#629D23] transition-colors"
          >
            <ShoppingBag size={12} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function CategoryProductsSection() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        const productsArray = Array.isArray(data) ? data : Object.values(data).filter(p => p && typeof p === 'object');
        
        // Group and take 2 per category
        const grouped: Record<string, ProductItem[]> = {};
        productsArray.forEach((product: any) => {
          const category = product.category || 'Uncategorized';
          if (!grouped[category]) grouped[category] = [];
          if (grouped[category].length < 2) {
            grouped[category].push({
              id: product.id || product._id?.toString(),
              name: product.name,
              category: product.category,
              price: product.price,
              discountPercentage: product.discountPercentage || 0,
              rating: product.rating || 0,
              imageUrl: product.imageUrl,
              isNewArrival: product.isNewArrival
            });
          }
        });
        
        // Flatten the grouped products into a single list
        const flattenedProducts = Object.values(grouped).flat();
        setProducts(flattenedProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) return <div className="text-center py-20 bg-gray-50">Loading Featured...</div>;

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-[#629D23] font-bold uppercase tracking-widest mb-2 text-sm">Top Products</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 uppercase">Best Seller</h2>
          <div className="w-16 h-1 bg-[#629D23] mx-auto mt-4"></div>
        </div>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8"
          variants={containerVariants} 
          initial="hidden" 
          whileInView="visible"
          viewport={{ once: true }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
