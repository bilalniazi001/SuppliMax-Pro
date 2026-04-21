import Link from 'next/link';
import ProductList from '@/components/ProductList'; 

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

type Product = {
  id: string;
  name: string;
  price: number;
  cost: number;
  description: string;
  imageUrl: string;
  quantityInStock: number;
  size: string;
  rating: number;
  color: string;
  onSale: boolean;
  discountPercentage: number;
  isNewArrival: boolean;
  category: string;
  isInStock: boolean;
  isFeatured?: boolean;
  isExclusive?: boolean;
};

const API_BASE_URL = 'https://supplimax-back-production.up.railway.app';

async function getProducts(): Promise<Product[]> {
  try {
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const fetchUrl = `${baseUrl}/products`;
    
    console.log('📡 Fetching from:', fetchUrl);

    const res = await fetch(fetchUrl, { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      console.error(`❌ API Error: ${res.status}`);
      return [];
    }

    const response = await res.json();
    console.log('📊 Response type:', typeof response);
    console.log('🔑 First few keys:', Object.keys(response).slice(0, 5));
    
    // ✅ FIX: Handle object with numeric keys
    let productsArray: any[] = [];
    
    if (response && typeof response === 'object') {
      const keys = Object.keys(response);
      
      // Check if it's object with numeric keys (like {"0": {}, "1": {}, ...})
      const hasNumericKeys = keys.some(key => !isNaN(Number(key)));
      
      if (hasNumericKeys) {
        // Convert object to array and filter out non-product objects
        productsArray = Object.values(response).filter((item: any) => 
          item && typeof item === 'object' && item.name && item.price !== undefined
        );
        console.log(`✅ Converted object to ${productsArray.length} products`);
      } 
      else if (Array.isArray(response)) {
        productsArray = response;
        console.log(`✅ Direct array: ${productsArray.length} products`);
      }
      else if (response.data && Array.isArray(response.data)) {
        productsArray = response.data;
        console.log(`✅ From data property: ${productsArray.length} products`);
      }
    }
    
    console.log(`🎯 Total products to display: ${productsArray.length}`);
    
    // Map to Product type
    return productsArray.map((product: any, index: number) => ({
      id: product.id || product._id?.toString() || `prod-${index + 1}`,
      name: product.name || `Product ${index + 1}`,
      price: Number(product.price) || 0,
      cost: Number(product.cost) || 0,
      description: product.description || '',
      imageUrl: product.imageUrl || 'https://via.placeholder.com/150',
      quantityInStock: Number(product.quantityInStock) || 0,
      size: product.size || 'Standard',
      rating: Number(product.rating) || 4.0,
      color: product.color || '',
      onSale: Boolean(product.onSale),
      discountPercentage: Number(product.discountPercentage) || 0,
      isNewArrival: Boolean(product.isNewArrival),
      category: product.category || 'General',
      isInStock: product.isInStock !== undefined ? product.isInStock : (product.quantityInStock > 0),
      isFeatured: Boolean(product.isFeatured),
      isExclusive: Boolean(product.isExclusive),
    }));

  } catch (error) {
    console.error('❌ Fetch Error:', error);
    return []; 
  }
}

export default async function ProductsPage() {
  const products = await getProducts();
  
  console.log('🚀 Page received:', products.length, 'products');

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-4xl font-extrabold !text-[#2D3B29]">
          Our Products ({products.length})
        </h1>
        <Link 
          href="/products/add" 
          className="bg-[#629D23] hover:bg-[#2D3B29] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          + Add New Product
        </Link>
      </div>

      {/* Debug Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-blue-700 font-bold mr-2">✅ Data Structure Fixed</span>
          <span className="text-sm text-blue-600">
            Converted object with {products.length} products to array
          </span>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">No products found after conversion.</p>
          <p className="text-sm text-gray-400 mt-2">
            Check browser console for data structure details
          </p>
        </div>
      ) : (
        <ProductList products={products} />
      )}
    </div>
  );
}