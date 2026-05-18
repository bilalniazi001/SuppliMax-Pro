'use client';
import { API_BASE_URL } from '@/config';
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Loader2, Star, Filter, SlidersHorizontal, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import AuthModal from '@/components/AuthModal';

// UPDATED: id string type ki hai
interface Product {
  id: string; //  CHANGED: number -> string
  name: string;
  category: string;
  price: number;
  rating: number;
  imageUrl: string;
}

interface Filters {
  category: string;
  minPrice: number;
  maxPrice: number;
}

const fetchProducts = async (): Promise<Product[]> => {



  try {
    const response = await fetch(`${API_BASE_URL}/products`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API can't fetch data. Status: ${response.status}`);
    }

    const result = await response.json();

    // DEBUG: Raw API response check karein
    console.log(' [PRODUCT LIST] Raw API response:', result);

    // ✅ Handle object with numeric keys or direct array
    let data: any[] = [];
    if (Array.isArray(result)) {
      data = result;
    } else if (result && typeof result === 'object') {
      data = Object.values(result).filter(p => p && typeof p === 'object');
    }

    // PROPERLY MAP DATA with ID validation
    const mappedProducts = data.map((item, index) => {
      // Pehle item.id check karein, phir item._id, phir temporary ID
      const productId = item.id || item._id?.toString() || `temp-${index + 1}`;

      console.log(` [PRODUCT LIST] Mapping product ${index}:`, {
        name: item.name,
        originalId: item.id,
        mongoId: item._id,
        finalId: productId
      });

      //  ID validation - agar ID invalid hai toh skip karein
      if (!productId || productId === 'undefined' || productId.includes('temp-')) {
        console.warn(` [PRODUCT LIST] Invalid ID for product: ${item.name}`, productId);
      }

      return {
        id: productId, //  Ensure ID is string
        name: item.name || 'Unnamed Product',
        category: item.category || 'Uncategorized',
        price: item.price || 0,
        rating: item.rating || 0,
        imageUrl: item.imageUrl || '',
      };
    }).filter(product => product.id && product.id !== 'undefined'); //  Filter out invalid products

    console.log(' [PRODUCT LIST] Mapped products:', mappedProducts);
    return mappedProducts;
  } catch (error) {
    console.error("Data fetch error:", error);
    return [];
  }
};

//  UPDATED: ProductCard component with ID validation
const ProductCard: React.FC<{
  product: Product;
  onAddToCart: (product: Product) => void;
  showAuthModal: () => void;
}> = ({ product, onAddToCart, showAuthModal }) => {
  const { isAuthenticated } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

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

  //  ID validation check
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

  const handleProductClick = (e: React.MouseEvent) => {
    if (!isValidProduct) {
      e.preventDefault();
      console.error(' [PRODUCT CARD] Invalid product ID:', product.id);
      alert('This product cannot be opened right now. Please try again later.');
    } else {
      console.log(' [PRODUCT CARD] Navigating to product:', product.id);
    }
  };

  return (
    <div className={`block ${!isValidProduct ? 'cursor-not-allowed opacity-70' : ''}`}>
      <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100 relative">
        {/*  Image container - Size adjusted */}
        <Link href={productUrl} onClick={handleProductClick} className="relative w-full h-40 mb-4 overflow-hidden bg-white rounded-lg flex items-center justify-center p-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-w-full max-h-32 object-contain transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/400x300/4f46e5/ffffff?text=${product.name.substring(0, 15)}`;
            }}
          />
        </Link>
        
        <Link href={`/shop/${product.category}`}>
          <span className="absolute top-6 left-6 px-2 py-1 text-[10px] font-bold text-white bg-[#629D23] rounded-full shadow-md z-10 hover:bg-lime-700 transition-colors cursor-pointer">
            {product.category}
          </span>
        </Link>

        {/* Wishlist Toggle */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-6 right-6 p-1.5 rounded-full shadow-md transition-all duration-300 z-10 ${isFavorited ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 hover:text-red-400'}`}
        >
          <Star size={16} fill={isFavorited ? "currentColor" : "none"} />
        </button>

        <Link href={productUrl} onClick={handleProductClick}>
          <h3 className="text-lg font-bold text-[#2D3B29] mb-1 truncate hover:text-[#629D23] transition-colors">{product.name}</h3>
        </Link>

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

        {/* Invalid product overlay */}
        {!isValidProduct && (
          <div className="absolute inset-0 bg-red-50 bg-opacity-80 flex items-center justify-center rounded-xl z-20">
            <div className="text-center p-4">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-red-600 font-semibold text-sm">Product Not Available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Client Component
const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiError, setIsApiError] = useState(false);
  const [sortOption, setSortOption] = useState<'price_asc' | 'price_desc' | 'rating_desc' | 'default'>('default');
  const [showAuthModal, setShowAuthModal] = useState(false);

  //  Filters mein category add kiya
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    minPrice: 0,
    maxPrice: 500,
  });

  const [maxAvailablePrice, setMaxAvailablePrice] = useState(500);

  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  // --- Data Fetching Effect ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProducts();
        console.log(' [PRODUCT LIST] API Response:', data);

        if (data.length === 0) {
          setIsApiError(true);
        } else {
          setIsApiError(false);
          setProducts(data);

          const maxPrice = Math.max(...data.map(p => p.price), 100);
          const roundedMaxPrice = Math.ceil(maxPrice / 100) * 100;
          setMaxAvailablePrice(roundedMaxPrice);
          setFilters(prev => ({ ...prev, maxPrice: roundedMaxPrice }));
        }
      } catch (error) {
        console.error('Error in loadData:', error);
        setIsApiError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  //  Dynamically available categories calculate karein
  const availableCategories = useMemo(() => {
    const categories = [...new Set(products.map(product => product.category))];
    return ['all', ...categories]; // 'all' option add karein
  }, [products]);

  //  Filtering aur Sorting Logic - Category filter add kiya
  const filteredAndSortedProducts = useMemo(() => {
    let currentProducts = products.filter(product => {
      const priceMatch = product.price >= filters.minPrice && product.price <= filters.maxPrice;
      const categoryMatch = filters.category === 'all' || product.category === filters.category;
      return priceMatch && categoryMatch;
    });

    switch (sortOption) {
      case 'price_asc':
        currentProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        currentProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        currentProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'default':
      default:
        break;
    }

    return currentProducts;
  }, [products, filters, sortOption]);

  //  Handler Functions
  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const name = e.target.name;

    setFilters(prev => {
      if (name === 'minPrice' && value > prev.maxPrice) {
        return { ...prev, minPrice: value, maxPrice: value };
      }
      if (name === 'maxPrice' && value < prev.minPrice) {
        return { ...prev, minPrice: value, maxPrice: value };
      }
      return { ...prev, [name]: value };
    });
  };

  //  Category filter change handler
  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as typeof sortOption);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  //  Show Auth Modal Handler
  const handleShowAuthModal = () => {
    setShowAuthModal(true);
  };

  //  Debug: Count valid vs invalid products
  const validProductsCount = filteredAndSortedProducts.filter(p =>
    p.id && p.id !== 'undefined' && !p.id.includes('temp-')
  ).length;

  const invalidProductsCount = filteredAndSortedProducts.length - validProductsCount;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin text-[#629D23] w-12 h-12" />
        <p className="ml-3 text-lg text-[#2D3B29] font-semibold">Products are loading...</p>
      </div>
    );
  }

  if (isApiError) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 p-12">
        <div className="text-center p-10 bg-red-100 rounded-xl shadow-xl border-2 border-red-500">
          <AlertTriangle className="text-red-500 w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-red-700 mb-2">API Connection Error!</h2>
          <p className="text-lg text-gray-700">
            Failed to load products. Please check your connection or try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <div className="min-h-screen bg-gray-50 p-4 sm:p-8 lg:p-12 font-sans">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-[#2D3B29] mb-2 tracking-tight">
            Products
          </h1>
          <p className="text-xl text-[#629D23] font-medium">
            Supplements For Everyone
          </p>
        </header>

        <div className="lg:flex gap-10">

          {/* --- Filters Sidebar (Left Column) --- */}
          <aside className="lg:w-1/4 mb-8 lg:mb-0 p-6 bg-white rounded-2xl shadow-xl sticky top-8 h-fit transition-all duration-300">
            <h2 className="text-2xl font-bold text-[#2D3B29] mb-6 flex items-center border-b pb-3">
              <Filter size={20} className="mr-2 text-[#629D23]" />
              Filters
            </h2>

            {/* Category Filter - Dynamically */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#2D3B29] mb-3">Category</h3>
              {availableCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`w-full text-left py-2 px-4 rounded-lg mb-2 transition-all duration-200 ${filters.category === cat
                      ? 'bg-[#629D23] text-white font-bold shadow-md transform scale-[1.01]'
                      : 'bg-gray-100 text-[#2D3B29] hover:bg-lime-100 hover:text-lime-700'
                    }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>

            {/* Price Range Filter */}
            <div className="mb-6 border-t pt-4">
              <h3 className="text-lg font-semibold text-[#2D3B29] mb-4 flex items-center">
                <SlidersHorizontal size={18} className="mr-2 text-lime-500" />
                Price Range
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#2D3B29] mb-1">
                  Minimum Price: {filters.minPrice.toFixed(2)} Rs
                </label>
                <input
                  type="range"
                  name="minPrice"
                  min="0"
                  max={maxAvailablePrice}
                  step="5"
                  value={filters.minPrice}
                  onChange={handlePriceRangeChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg accent-lime-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2D3B29] mb-1">
                  Maximum Price: {filters.maxPrice.toFixed(2)} Rs
                </label>
                <input
                  type="range"
                  name="maxPrice"
                  min="0"
                  max={maxAvailablePrice}
                  step="5"
                  value={filters.maxPrice}
                  onChange={handlePriceRangeChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg accent-lime-600"
                />
              </div>
            </div>
          </aside>

          {/* --- Product Grid (Right Column) --- */}
          <main className="lg:flex-1">
            {/* Top Bar: Sort Dropdown and Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-100">
              <div>
                <p className="text-lg font-medium text-[#2D3B29]">
                  Showing <span className="font-bold text-lime-600">{validProductsCount}</span> products
                  {filters.category !== 'all' && (
                    <span className="ml-2 text-lime-500">in {filters.category}</span>
                  )}
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="relative inline-block">
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="block appearance-none bg-white border border-gray-300 text-[#2D3B29] py-3 px-4 pr-8 rounded-full leading-tight focus:outline-none focus:border-lime-500 hover:shadow-lg cursor-pointer"
                >
                  <option value="default">Default Sorting</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating_desc">Rating: High to Low</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#2D3B29]">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {validProductsCount > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedProducts
                  .filter(product => product.id && product.id !== 'undefined' && !product.id.includes('temp-'))
                  .map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      showAuthModal={handleShowAuthModal}
                    />
                  ))}
              </div>
            ) : (
              <div className="text-center p-12 bg-white rounded-xl shadow-xl mt-10">
                <p className="text-2xl font-semibold text-[#2D3B29]">
                  No valid products found.
                </p>
                <p className="text-md text-[#2D3B29] mt-2">
                  {invalidProductsCount > 0 ?
                    `${invalidProductsCount} products have invalid IDs. Check backend data.` :
                    'Adjust your filters and try again.'
                  }
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default function ProductsPage() {
  return <ProductList />;
}
