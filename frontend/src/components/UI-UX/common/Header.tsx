// components/UI-UX/common/Header.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, Heart, User, Search, ChevronDown, Facebook, Instagram, Youtube, Twitter,
  Home, ShoppingBag, Tag, BookOpen, Layers, Menu
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';
import { API_BASE_URL } from '@/config';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRouter, usePathname } from 'next/navigation';

// --- TYPE DEFINITIONS (Interfaces) ---
interface TopLink {
  name: string;
  href: string;
}
interface DropdownItem {
  name: string;
  href: string;
}

interface MainNavLink extends TopLink {
  dropdown?: DropdownItem[];
}

interface DropdownMenuProps {
  items: DropdownItem[];
}

const topLinks: TopLink[] = [
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contacts' },
  { name: 'Orders', href: '/account/orders' },
  { name: 'FAQ', href: '/faq' },
];

// Static categories for header - these will match with ProductCategoryQueue
const staticCategories = [
  'Protein',
  'Pre Workout',
  'Weight Gainer',
  'Creatine',
  'BCAA',
  'Fat Burner',
  'Performance'
];

const mainNavLinks: MainNavLink[] = [
  { name: 'Home', href: '/' },
  {
    name: 'Shop',
    href: '/product',
    dropdown: [
      { name: 'Pre Workout', href: '/shop/Pre Workout' },
      { name: 'Protein', href: '/shop/Protein' },
      { name: 'Fat Burner', href: '/shop/Fat Burner' },
      { name: 'Creatine', href: '/shop/Creatine' }
    ]
  },
  { name: 'Offers', href: '/offers' },
  { name: 'Blog', href: '/blog' },
  {
    name: 'Pages',
    href: '#',
    dropdown: [
      { name: 'Wishlist', href: '/wishlist' },
      { name: 'Cart', href: '/cart' },
      { name: 'Orders', href: '/account/orders' },
      { name: 'Account', href: '/account' }
    ]
  },
];

const allCategories: DropdownItem[] = staticCategories.map(category => ({
  name: category,
  href: `/shop/${category}`
}));

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items }) => (
  <div className="absolute top-full left-0 mt-0.5 w-64 bg-white shadow-xl overflow-hidden border border-gray-100 z-[100] opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
    {items.map((item: DropdownItem, index: number) => (
      <Link
        key={index}
        href={item.href}
        className="block px-4 py-3 text-sm text-gray-700 hover:bg-[#629D23] hover:text-white transition-colors duration-150"
      >
        {item.name}
      </Link>
    ))}
  </div>
);

export default function SuppliMaxNavbar() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [categories, setCategories] = useState<DropdownItem[]>(allCategories);
  const mainNavbarRef = useRef<HTMLDivElement>(null);
  const [headerWrapperHeight, setHeaderWrapperHeight] = useState<number>(130);

  // Mobile navigation states & refs
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isMobilePagesOpen, setIsMobilePagesOpen] = useState<boolean>(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobilePagesRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Search state
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  // Close mobile menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
      if (mobilePagesRef.current && !mobilePagesRef.current.contains(e.target as Node)) {
        setIsMobilePagesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Fetch categories from API to ensure consistency with ProductCategoryQueue
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const result = await response.json();

        // ✅ Handle object with numeric keys or direct array
        let products: any[] = [];
        if (Array.isArray(result)) {
          products = result;
        } else if (result && typeof result === 'object') {
          products = Object.values(result).filter(p => p && typeof p === 'object');
        }
        setAllProducts(products); // Store all products for search

        // Extract unique categories from products
        const categorySet = new Set<string>();
        products.forEach((product: any) => {
          if (product.category) {
            categorySet.add(product.category.trim());
          }
        });

        // Convert Set to array and create dropdown items
        const dynamicCategories = Array.from(categorySet).map(category => ({
          name: category,
          href: `/shop/${category}`
        }));

        // Update categories state with dynamic data
        setCategories(dynamicCategories.length > 0 ? dynamicCategories : allCategories);
      } catch (error) {
        console.error('Error fetching categories for header:', error);
        // Fallback to static categories if API fails
        setCategories(allCategories);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const headerWrapperElement = document.getElementById('header-wrapper');
    if (headerWrapperElement) {
      setHeaderWrapperHeight(headerWrapperElement.offsetHeight);
    }

    const handleScroll = () => {
      const scrollThreshold = headerWrapperElement?.offsetHeight || headerWrapperHeight;

      if (window.scrollY > scrollThreshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerWrapperHeight]);

  // Search autocomplete logic
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = allProducts.filter((p: any) =>
        (p.name && p.name.toLowerCase().includes(lowercasedTerm)) ||
        (p.category && p.category.toLowerCase().includes(lowercasedTerm))
      ).slice(0, 5); // top 5 results
      setSearchResults(filtered);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchTerm, allProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const navHeight = 56;

  const stickyClass: string = isScrolled
    ? 'fixed top-0 left-0 right-0 shadow-lg animate-slide-down'
    : 'relative';

  const handleLogout = () => {
    logout();
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <div
        id="header-wrapper"
        className={`hidden lg:block relative z-40 transition-transform duration-300 ease-in-out ${isScrolled ? 'transform -translate-y-full' : 'transform translate-y-0'}`}
      >
        <div className={`bg-[#629D23] text-white py-2`}>
          <div className="container mx-auto px-4 flex justify-between items-center text-xs font-medium relative">
            <div className="flex-1 flex justify-start">
              <nav className="flex space-x-4">
                {topLinks.map((link: TopLink) => (
                  <Link key={link.name} href={link.href} className="hover:text-amber-300 transition-colors duration-150">{link.name}</Link>
                ))}
              </nav>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 hidden xl:block">
              <span className="font-semibold text-sm">Welcome to our Organic Suppliments Store</span>
            </div>
            <div className="flex-1 flex justify-end items-center space-x-3">
              <a href="#" aria-label="Follow us on Facebook" className="hover:text-amber-300 transition-colors duration-150"><Facebook className="w-4 h-4" /></a>
              <a href="#" aria-label="Follow us on Instagram" className="hover:text-amber-300 transition-colors duration-150"><Instagram className="w-4 h-4" /></a>
              <a href="#" aria-label="Follow us on YouTube" className="hover:text-amber-300 transition-colors duration-150"><Youtube className="w-4 h-4" /></a>
              <a href="#" aria-label="Follow us on Twitter" className="hover:text-amber-300 transition-colors duration-150"><Twitter className="w-4 h-4" /></a>
            </div>
          </div>
        </div>

        <header className={`bg-white py-4 shadow-sm`}>
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex-shrink-0 ml-12">
              <Link href="/">
                <img src="/Images/sm-logo.png" alt="SuppliMax" className="h-12 w-auto hover:opacity-80 transition-opacity cursor-pointer" />
              </Link>
            </div>
            <div className="flex-1 max-w-xl mx-8 relative">
              <form onSubmit={handleSearchSubmit} className="flex w-full shadow-sm rounded-md overflow-hidden">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => { if (searchTerm) setShowDropdown(true); }}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // delay to allow clicks
                  placeholder="Search for products..."
                  className="flex-1 pl-5 pr-4 py-3 border-y border-l border-gray-300 font-semibold text-[#629D23] placeholder:text-[#629D23]/70 focus:ring-1 focus:ring-[#629D23] outline-none transition-all duration-200"
                />
                <button
                  type="submit"
                  onClick={handleSearchSubmit}
                  className="px-6 py-3 text-white bg-[#629D23] hover:bg-[#2D3B29] transition-colors flex items-center justify-center font-bold cursor-pointer"
                >
                  Search <Search className="w-5 h-5 ml-2" />
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-xl z-50 rounded-b-md overflow-hidden">
                  {searchResults.map((product, index) => {
                    const productId = product.id || product._id || `search-res-${index}`;
                    return (
                      <Link
                        key={productId}
                        href={`/product/${productId}`}
                        className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setShowDropdown(false)}
                      >
                        <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded mr-4 overflow-hidden flex items-center justify-center">
                          <img
                            src={product.imageUrl || 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=50&h=50&fit=crop'}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain mix-blend-multiply"
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=50&h=50&fit=crop'; }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                          <p className="text-xs text-gray-500 truncate">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#629D23]">Rs {product.price}</p>
                        </div>
                      </Link>
                    )
                  })}
                  <div className="p-2 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer border-t border-gray-200">
                    <button
                      onClick={(e) => { e.preventDefault(); handleSearchSubmit(e as any); }}
                      className="text-sm text-[#629D23] font-bold w-full h-full"
                    >
                      View all results
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/wishlist" className="flex flex-col items-center justify-center text-gray-600 hover:text-[#629D23] transition-colors group relative">
                <Heart className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
                    {wishlistCount}
                  </span>
                )}
                <span className="text-xs font-medium mt-1">Wishlist</span>
              </Link>

              <Link href="/cart" className="flex flex-col items-center justify-center text-gray-600 hover:text-[#629D23] transition-colors group relative">
                <ShoppingCart className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#629D23] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
                    {cartCount}
                  </span>
                )}
                <span className="text-xs font-medium mt-1">Cart</span>
              </Link>

              {isAuthenticated ? (
                <div className="relative group">
                  <div className="flex flex-col items-center justify-center text-gray-600 hover:text-[#629D23] transition-colors group cursor-pointer">
                    <div className="w-6 h-6 bg-[#629D23] rounded-full flex items-center justify-center text-white text-xs font-bold transform group-hover:scale-110 transition-transform">
                      {user ? getUserInitials(user.name) : 'U'}
                    </div>
                    <span className="text-xs font-medium mt-1">Account</span>
                  </div>

                  <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl border border-gray-100 rounded-lg z-[100] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#629D23] hover:text-white transition-colors">
                      My Account
                    </Link>
                    <Link href="/account/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#629D23] hover:text-white transition-colors">
                      My Orders
                    </Link>
                    <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#629D23] hover:text-white transition-colors">
                      My Cart
                    </span>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex flex-col items-center justify-center text-gray-600 hover:text-[#629D23] transition-colors group"
                >
                  <User className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium mt-1">Login</span>
                </button>
              )}
            </div>
          </div>
        </header>
      </div>

      {isScrolled && <div style={{ height: navHeight }} className="hidden lg:block" />}

      <nav ref={mainNavbarRef} className={`hidden lg:block bg-[#4a7a1b] text-white z-60 w-full ${stickyClass}`}>
        <div className="container mx-auto px-4 flex items-center justify-center h-14">
          <div className="hidden lg:flex items-center space-x-8 h-full">
            {mainNavLinks.map((link: MainNavLink) => (
              <div key={link.name} className={`relative group h-full flex items-center transition-all ${link.dropdown ? 'cursor-pointer z-[70]' : ''}`}>
                <Link href={link.href} className="font-semibold text-sm h-full w-full px-4 uppercase hover:text-white hover:bg-[#2D3B29] transition-colors flex items-center">
                  {link.name}
                  {link.dropdown && <ChevronDown className="w-3 h-3 ml-1 transition-transform group-hover:rotate-180" />}
                </Link>
                {link.dropdown && <DropdownMenu items={link.dropdown} />}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Sticky Top Header */}
      <div className="lg:hidden bg-white shadow-md px-4 py-3 flex justify-between items-center sticky top-0 z-50 border-b border-gray-100">
        {/* Left Side: Dropdown Menu Icon */}
        <div className="relative" ref={mobileMenuRef}>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {/* Dropdown Items */}
          {isMobileMenuOpen && (
            <div className="absolute left-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden transform origin-top-left transition-all duration-300 animate-slide-down">
              <div className="py-1">
                {topLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#629D23] hover:text-white transition-colors duration-150"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center: Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/">
            <img src="/Images/sm-logo.png" alt="SuppliMax" className="h-10 w-auto object-contain cursor-pointer hover:opacity-90 transition-opacity" />
          </Link>
        </div>

        {/* Right Side: Wishlist, Cart & Login Icons */}
        <div className="flex items-center space-x-3">
          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            className="p-1.5 text-gray-600 hover:text-[#629D23] transition-colors relative"
            aria-label="Wishlist"
          >
            <Heart className={`w-6 h-6 ${pathname === '/wishlist' ? 'text-[#629D23] fill-[#629D23]' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full shadow-sm animate-bounce">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="p-1.5 text-gray-600 hover:text-[#629D23] transition-colors relative"
            aria-label="Cart"
          >
            <ShoppingCart className={`w-6 h-6 ${pathname === '/cart' ? 'text-[#629D23]' : ''}`} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#629D23] text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full shadow-sm animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Login / Account Icon */}
          {isAuthenticated ? (
            <div className="relative group">
              <Link href="/account">
                <div className="w-7 h-7 bg-[#629D23] rounded-full flex items-center justify-center text-white text-xs font-black shadow-sm transform hover:scale-105 transition-transform border border-white">
                  {user ? getUserInitials(user.name) : 'U'}
                </div>
              </Link>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="p-1.5 text-gray-600 hover:text-[#629D23] transition-colors focus:outline-none"
              aria-label="Login"
            >
              <User className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-50 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          {/* Home Tab */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-all ${
              pathname === '/' ? 'text-[#629D23]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-1 tracking-wide">Home</span>
          </Link>

          {/* Shop Tab */}
          <Link
            href="/product"
            className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-all ${
              pathname === '/product' || pathname.startsWith('/shop') ? 'text-[#629D23]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-1 tracking-wide">Shop</span>
          </Link>

          {/* Offers Tab */}
          <Link
            href="/offers"
            className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-all ${
              pathname === '/offers' ? 'text-[#629D23]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Tag className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-1 tracking-wide">Offers</span>
          </Link>

          {/* Blog Tab */}
          <Link
            href="/blog"
            className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-all ${
              pathname.startsWith('/blog') ? 'text-[#629D23]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-1 tracking-wide">Blog</span>
          </Link>

          {/* Pages Tab (Dropdown Popup) */}
          <div className="relative flex-1 h-full" ref={mobilePagesRef}>
            <button
              onClick={() => setIsMobilePagesOpen(!isMobilePagesOpen)}
              className={`flex flex-col items-center justify-center w-full h-full py-2 focus:outline-none transition-all ${
                isMobilePagesOpen ? 'text-[#629D23]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Layers className="w-6 h-6" />
              <span className="text-[10px] font-bold mt-1 tracking-wide">Pages</span>
            </button>

            {/* Bubble Popup Menu above the bottom bar */}
            {isMobilePagesOpen && (
              <div className="absolute bottom-16 right-1/2 translate-x-1/2 w-44 bg-white border border-gray-100 rounded-2xl shadow-[0_-8px_24px_rgba(0,0,0,0.12)] z-50 overflow-hidden transform origin-bottom transition-all duration-300 animate-slide-up">
                <div className="py-1">
                  <Link
                    href="/wishlist"
                    onClick={() => setIsMobilePagesOpen(false)}
                    className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#629D23] hover:text-white transition-colors"
                  >
                    Wishlist
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setIsMobilePagesOpen(false)}
                    className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#629D23] hover:text-white transition-colors"
                  >
                    Cart
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setIsMobilePagesOpen(false)}
                    className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#629D23] hover:text-white transition-colors"
                  >
                    Orders
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setIsMobilePagesOpen(false)}
                    className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#629D23] hover:text-white transition-colors"
                  >
                    Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}