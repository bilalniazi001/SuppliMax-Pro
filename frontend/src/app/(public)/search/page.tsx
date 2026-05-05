'use client';
import { API_BASE_URL } from '@/config';
import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, AlertTriangle, Star, Search } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import AuthModal from '@/components/AuthModal';
import { useSearchParams } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  imageUrl: string;
}

const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`API can't fetch data. Status: ${response.status}`);
    }
    const result = await response.json();
    let data: any[] = [];
    if (Array.isArray(result)) {
      data = result;
    } else if (result && typeof result === 'object') {
      data = Object.values(result).filter(p => p && typeof p === 'object');
    }

    const mappedProducts = data.map((item, index) => {
      const productId = item.id || item._id?.toString() || `temp-${index + 1}`;
      return {
        id: productId,
        name: item.name || 'Unnamed Product',
        category: item.category || 'Uncategorized',
        price: item.price || 0,
        rating: item.rating || 0,
        imageUrl: item.imageUrl || '',
      };
    }).filter(product => product.id && product.id !== 'undefined');

    return mappedProducts;
  } catch (error) {
    console.error("Data fetch error:", error);
    return [];
  }
};

const ProductCard: React.FC<{
  product: Product;
  onAddToCart: (product: Product) => void;
  showAuthModal: () => void;
}> = ({ product, onAddToCart, showAuthModal }) => {
  const { isAuthenticated } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isFavorited = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      showAuthModal();
      return;
    }

    if (isFavorited) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const isValidProduct = product.id && product.id !== 'undefined' && !product.id.includes('temp-');
  const productUrl = isValidProduct ? `/product/${product.id}` : '#';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      showAuthModal();
      return;
    }
    onAddToCart(product);
  };

  return (
    <Link
      href={productUrl}
      className={`block ${!isValidProduct ? 'cursor-not-allowed opacity-70' : ''}`}
    >
      <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100 cursor-pointer">
        <div className="relative w-full h-40 mb-4 overflow-hidden bg-white rounded-lg flex items-center justify-center p-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-w-full max-h-32 object-contain transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/400x300/4f46e5/ffffff?text=${product.name.substring(0, 15)}`;
            }}
          />
          <span className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold text-white bg-[#629D23] rounded-full shadow-md">
            {product.category}
          </span>
          <button
            onClick={toggleWishlist}
            className={`absolute top-2 right-2 p-1.5 rounded-full shadow-md transition-all duration-300 ${isFavorited ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 hover:text-red-400'}`}
          >
            <Star size={16} fill={isFavorited ? "currentColor" : "none"} />
          </button>
        </div>

        <h3 className="text-lg font-bold text-[#2D3B29] mb-1 truncate">{product.name}</h3>

        <div className="flex items-center justify-between mb-3">
          <p className="text-xl font-extrabold text-lime-600">
            {product.price.toFixed(2)} Rs
          </p>
          <div className="flex items-center text-yellow-500">
            <Star size={14} fill="currentColor" className="mr-1" />
            <span className="text-sm font-medium text-[#2D3B29]">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <button
          className="w-full bg-[#629D23] text-white py-2 rounded-lg font-semibold text-sm hover:bg-lime-700 transition-colors duration-300"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>

        {!isValidProduct && (
          <div className="absolute inset-0 bg-red-50 bg-opacity-80 flex items-center justify-center rounded-xl">
            <div className="text-center p-4">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-red-600 font-semibold text-sm">Product Not Available</p>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default function SearchResultsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiError, setIsApiError] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const { addToCart } = useCart();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProducts();
        if (data.length === 0) {
          setIsApiError(true);
        } else {
          setIsApiError(false);
          setProducts(data);
        }
      } catch (error) {
        setIsApiError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const searchResults = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.category.toLowerCase().includes(lowerQuery)
    );
  }, [products, query]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
        <Loader2 className="animate-spin text-[#629D23] w-12 h-12" />
        <p className="ml-3 text-lg text-[#2D3B29] font-semibold">Searching products...</p>
      </div>
    );
  }

  if (isApiError) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center bg-gray-50 p-12">
        <div className="text-center p-10 bg-red-100 rounded-xl shadow-xl border-2 border-red-500">
          <AlertTriangle className="text-red-500 w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-red-700 mb-2">API Connection Error!</h2>
          <p className="text-lg text-gray-700">Failed to load products for search.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <div className="min-h-[70vh] bg-gray-50 p-4 sm:p-8 lg:p-12 font-sans">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-[#629D23]/10 rounded-full mb-4">
            <Search className="w-8 h-8 text-[#629D23]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#2D3B29] mb-4 tracking-tight">
            Search Results
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            {searchResults.length} results found for <span className="text-[#629D23] font-bold">"{query}"</span>
          </p>
        </header>

        <div className="max-w-7xl mx-auto">
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  showAuthModal={() => setShowAuthModal(true)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-white rounded-xl shadow-md max-w-2xl mx-auto">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#2D3B29] mb-2">No products found</h2>
              <p className="text-gray-500 mb-6">
                We couldn't find anything matching "{query}". Try adjusting your search term.
              </p>
              <Link 
                href="/product"
                className="inline-block px-8 py-3 bg-[#629D23] text-white font-bold rounded-lg hover:bg-[#4a7a1b] transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
