// app/(admin)/products/add/page.tsx

import ProductForm from '@/components/ProductForm';

export default function AddProductPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* ✅ Back Button */}
        <div className="mb-6">
          <a 
            href="/products" 
            className="inline-flex items-center text-[#629D23] hover:text-[#2D3B29] font-semibold transition duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </a>
        </div>
        
        <ProductForm />
      </div>
    </div>
  );
}