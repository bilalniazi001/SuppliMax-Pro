// app/shop/[category]/page.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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

// ✅ Dynamic URL setup
const API_BASE_URL = 'https://supplimax-back-production.up.railway.app';
//const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function getCategoryProducts(category: string): Promise<Product[]> {
  try {
    // ✅ URL ko dynamic variable sy replace kar dia
    const res = await fetch(`${API_BASE_URL}/products`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      console.error('❌ Failed to fetch products:', res.status);
      return [];
    }

    const allProducts = await res.json();

    const filteredProducts = allProducts.filter((product: Product) =>
      product.category?.toLowerCase() === category.toLowerCase()
    );

    console.log(
      `✅ Category: ${category}, Products Found: ${filteredProducts.length}`
    );

    return filteredProducts;
  } catch (error) {
    console.error('❌ Error fetching category products:', error);
    return [];
  }
}

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  const products = await getCategoryProducts(decodedCategory);

  const formattedCategory = decodedCategory
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

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
              // ✅ MongoDB _id handling
              const productId = product.id || product._id;

              return (
                <Link
                  href={`/products/${productId}`} // Yahan products (plural) kar dain agar detail page ka path yehi hy
                  key={productId?.toString()}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 group"
                >
                  <div className="relative h-56 bg-white overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={product.imageUrl || '/placeholder-image.jpg'}
                      alt={product.name}
                      className="max-w-full max-h-40 object-contain transition duration-300 group-hover:opacity-90"
                    />

                    <div className="absolute top-2 left-2 flex flex-col space-y-1">
                      {product.onSale && (
                        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                          {product.discountPercentage}% OFF
                        </span>
                      )}
                      {product.isNewArrival && (
                        <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                          NEW
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-[#629D23]">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-[#2D3B29]">
                        ${product.price.toFixed(2)}
                      </span>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm text-gray-600 ml-1">
                          {product.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <button className="w-full bg-[#2D3B29] text-white py-2 rounded-lg hover:bg-[#629D23] transition duration-300">
                      Add to Cart
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}