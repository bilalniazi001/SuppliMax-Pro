// app/products/[productId]/page.tsx
import ProductDetailClient from './ProductDetailClient';

// Complete Product Interface
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

// ✅ Environment Variable se URL uthayen, warna local use karein
const API_BASE_URL = 'https://supplimax-back-production.up.railway.app';
//const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function getProduct(productId: string): Promise<Product | null> {
  try {
    console.log('🔍 [PRODUCT DETAIL] Fetching product with ID:', productId);
    
    // ✅ URL ko theek tarah se join kiya hy
    const fullUrl = `${API_BASE_URL}/products/${productId}`;
    console.log('📡 [PRODUCT DETAIL] API URL:', fullUrl);
    
    const res = await fetch(fullUrl, {
      cache: 'no-store', // Taaky updated data milay
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📊 [PRODUCT DETAIL] Response status:', res.status);
    
    if (!res.ok) {
      console.error(`❌ [PRODUCT DETAIL] Error fetching product: ${res.status}`);
      return null;
    }

    const productData = await res.json();
    
    // ✅ Mapping logic with MongoDB ID support
    const mappedProduct: Product = {
      id: productData.id || productData._id?.toString() || productId,
      name: productData.name || 'Unknown Product',
      category: productData.category || 'Uncategorized',
      price: typeof productData.price === 'number' ? productData.price : 0,
      rating: typeof productData.rating === 'number' ? productData.rating : 0,
      imageUrl: productData.imageUrl || '',
      description: productData.description || 'No description available',
      cost: typeof productData.cost === 'number' ? productData.cost : 0,
      quantityInStock: typeof productData.quantityInStock === 'number' ? productData.quantityInStock : 0,
      size: productData.size || 'One Size',
      color: productData.color || '',
      onSale: Boolean(productData.onSale),
      discountPercentage: typeof productData.discountPercentage === 'number' ? productData.discountPercentage : 0,
      isNewArrival: Boolean(productData.isNewArrival),
      isInStock: productData.isInStock !== undefined ? Boolean(productData.isInStock) : true,
      isFeatured: Boolean(productData.isFeatured),
      isExclusive: Boolean(productData.isExclusive),
    };

    return mappedProduct;
  } catch (error) {
    console.error('❌ [PRODUCT DETAIL] Network error:', error);
    return null;
  }
}

interface ProductDetailPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  let productId: string;
  
  try {
    // Next.js 15+ mein params ko await karna zaroori hy
    const resolvedParams = await params;
    productId = resolvedParams.productId;
  } catch (error) {
    console.error('❌ [PRODUCT DETAIL] Error resolving params:', error);
    return renderErrorUI("Error Loading Page Parameters");
  }
  
  if (!productId || productId === 'undefined') {
    return renderErrorUI(`Invalid Product ID: ${productId}`);
  }

  const product = await getProduct(productId);

  if (!product) {
    return renderErrorUI(`Product with ID "${productId}" Not Found`);
  }

  return <ProductDetailClient product={product} />;
}

// Reusable Error UI component to keep the code clean
function renderErrorUI(message: string) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-red-600 mb-4">{message}</h1>
        <a 
          href="/product" 
          className="bg-[#629D23] hover:bg-[#2D3B29] text-white font-semibold py-3 px-6 rounded-lg transition duration-300 inline-block"
        >
          ← Back to Products
        </a>
      </div>
    </div>
  );
}