// app/products/[productId]/ProductDetailClient.tsx
'use client';
import React from 'react';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

//  Complete Product Interface with all optional fields
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  imageUrl: string;
  description: string;
  cost?: number;
  quantityInStock?: number;
  size?: string;
  color?: string;
  onSale?: boolean;
  discountPercentage?: number;
  isNewArrival?: boolean;
  isInStock?: boolean;
  isFeatured?: boolean;
  isExclusive?: boolean;
}

interface ProductDetailClientProps {
  product: Product | null;
}

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
  // ✅ Safe value getter functions to avoid undefined errors
  const getDiscountPercentage = () => {
    return product?.discountPercentage || 0;
  };

  const getIsOnSale = () => {
    return product?.onSale || false;
  };

  const getIsNewArrival = () => {
    return product?.isNewArrival || false;
  };

  const getIsFeatured = () => {
    return product?.isFeatured || false;
  };

  const getIsExclusive = () => {
    return product?.isExclusive || false;
  };

  const getIsInStock = () => {
    return product?.isInStock !== undefined ? product.isInStock : true;
  };

  const getOriginalPrice = () => {
    const discount = getDiscountPercentage();
    if (discount > 0 && product) {
      return product.price / (1 - discount / 100);
    }
    return product?.price || 0;
  };

  const handleWhatsAppShare = () => {
    if (!product) return;

    const whatsappNumber = '923045335175'; 
    
    const productUrl = `${window.location.origin}/product/${product.id}`;
    const message = ` *Product Inquiry*\n\n` +
                   `*Product Name:* ${product.name}\n` +
                   `*Price:* $${product.price.toFixed(2)}\n` +
                   `*Category:* ${product.category}\n` +
                   `*Rating:* ${product.rating}/5\n\n` +
                   `*Description:* ${product.description.substring(0, 150)}...\n\n` +
                   `*Product Link:* ${productUrl}\n\n` +
                   `Hello! I'm interested in this product. Please provide more details.`;

    const encodedMessage = encodeURIComponent(message);
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <h1 className="text-5xl font-extrabold text-red-600 mb-4">404</h1>
        <p className="text-xl text-[#2D3B29] mb-6">Sorry, There is no product.</p>
        <Link 
          href="/products"
          className="flex items-center text-[#629D23] hover:text-lime-700 transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-2"/> Go To Listing Page.
        </Link>
      </div>
    );
  }

  //  Pre-calculate values to avoid multiple function calls
  const discountPercentage = getDiscountPercentage();
  const isOnSale = getIsOnSale();
  const isNewArrival = getIsNewArrival();
  const isFeatured = getIsFeatured();
  const isExclusive = getIsExclusive();
  const isInStock = getIsInStock();
  const originalPrice = getOriginalPrice();

  //  Debug info
  console.log(' [PRODUCT CLIENT] Product data:', product);
  console.log(' [PRODUCT CLIENT] Discount Percentage:', discountPercentage);
  console.log(' [PRODUCT CLIENT] On Sale:', isOnSale);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-10 lg:p-16 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500">
        
        {/* Back Button */}
        <div className="p-6">
          <Link 
            href="/product"
            className="flex items-center text-[#629D23] hover:text-lime-700 transition-colors font-medium"
          >
            <ArrowLeft size={20} className="mr-2"/> Back to Products
          </Link>
        </div>

        {/* Product Detail Layout */}
        <div className="p-6 md:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Left Column: Product Image */}
          <div className="relative overflow-hidden rounded-xl shadow-xl border border-gray-100 bg-white flex items-center justify-center p-8">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="max-w-full max-h-96 object-contain transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/600x400/4f46e5/ffffff?text=${encodeURIComponent(product.name)}`;
              }}
            />
            
            {/*  SAFE: Product Badges with conditional checks */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              {isOnSale && discountPercentage > 0 && (
                <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                  {discountPercentage}% OFF
                </span>
              )}
              {isNewArrival && (
                <span className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                  NEW
                </span>
              )}
              {isFeatured && (
                <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                  FEATURED
                </span>
              )}
              {isExclusive && (
                <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                  EXCLUSIVE
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category */}
              <span className="inline-block bg-lime-100 text-[#629D23] text-sm font-semibold px-3 py-1 rounded-full mb-4">
                {product.category}
              </span>

              {/* Product Name */}
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2D3B29] mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center text-yellow-500 mb-6">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star 
                    key={i} 
                    size={24} 
                    fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                    className="mr-1" 
                    strokeWidth={i < Math.floor(product.rating) ? 0 : 2}
                  />
                ))}
                <span className="ml-3 text-xl font-bold text-[#2D3B29]">
                  {product.rating.toFixed(1)}/5
                </span>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-3">
                  <p className="text-4xl font-extrabold text-[#629D23] tracking-tight">
                    ${product.price.toFixed(2)}
                  </p>
                  {/*  SAFE: Discount price with conditional check */}
                  {isOnSale && discountPercentage > 0 && (
                    <span className="text-xl text-red-600 line-through font-semibold">
                      ${originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-400 font-medium">Inclusive of all taxes</span>
                
                {/*  Savings calculation */}
                {isOnSale && discountPercentage > 0 && (
                  <p className="text-green-600 font-semibold mt-1">
                    You save: ${(originalPrice - product.price).toFixed(2)} ({discountPercentage}% off)
                  </p>
                )}
              </div>

              {/* Additional Product Info */}
              {(product.size || product.color || product.quantityInStock !== undefined) && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Product Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {product.size && (
                      <div>
                        <span className="font-medium">Size:</span> {product.size}
                      </div>
                    )}
                    {product.color && (
                      <div>
                        <span className="font-medium">Flavor:</span> {product.color}
                      </div>
                    )}
                    {product.quantityInStock !== undefined && (
                      <div>
                        <span className="font-medium">Stock:</span> {product.quantityInStock} units
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-1 ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
                        {isInStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#2D3B29] mb-3 border-b pb-2">
                  Product Description
                </h2>
                <p className="text-[#2D3B29] leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="flex space-x-4 mt-6 pt-4 border-t border-gray-100">
              {/* Add to Cart Button */}
              <button 
                className="flex-1 flex items-center justify-center bg-[#629D23] text-white py-4 rounded-full font-bold text-lg hover:bg-lime-700 transition-colors duration-300 shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!isInStock}
              >
                <ShoppingCart size={24} className="mr-3"/>
                {isInStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              <button 
                onClick={handleWhatsAppShare}
                className="p-4 bg-green-100 text-green-600 rounded-full hover:bg-green-200 hover:text-green-700 transition-colors duration-300 shadow-md flex items-center justify-center"
                title="Share on WhatsApp"
              >
                {/* WhatsApp Icon SVG */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.189-1.248-6.189-3.515-8.452"/>
                </svg>
              </button>
            </div>

            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 text-center">
                <strong>Quick Inquiry:</strong> Click WhatsApp button to contact manager directly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;