'use client'; 

import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ✅ Updated Product Type to handle both id and _id
type Product = {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  cost: number;
  description: string;
  imageUrl: string;
  quantityInStock: number;
  category: string;
  onSale: boolean;
  discountPercentage: number;
  rating: number;
};

// ✅ Dynamic Base URL (Vercel ke liye zaroori hy)
const API_BASE_URL = 'https://supplimax-back-production.up.railway.app';
//const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'; 

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const router = useRouter();

  // ✅ Helper to get the correct ID
  const getProductId = (p: Product) => p.id || p._id;

  const handleDelete = async (product: Product) => { 
    const id = getProductId(product);
    if (!id) {
        alert('Error: Product ID is missing.');
        return; 
    }
    
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`, { 
          method: 'DELETE',
        });

        if (res.ok) {
          alert('Product deleted successfully!');
          router.refresh(); 
        } else {
          alert(`Failed to delete. Status: ${res.status}`);
        }
      } catch (error) {
        console.error('Delete Error:', error);
        alert('Check your internet or backend connection.');
      }
    }
  };

  if (!products || !Array.isArray(products)) {
    return <div className="p-6 text-center text-red-500">No valid product data found.</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-xl p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-3xl font-bold text-[#2D3B29]">Inventory Management</h2>
        <span className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-sm font-semibold">
          Total: {products.length} Items
        </span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Your inventory is empty.</p>
          <Link href="/products/add" className="bg-[#629D23] text-white px-6 py-2 rounded-lg hover:bg-[#4c781d] transition">
            + Add Product
          </Link>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Product</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Price</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Stock</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => {
              const pid = getProductId(product);
              
              return (
                <tr key={pid} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={product.imageUrl || '/placeholder.png'} alt="" className="w-12 h-12 rounded object-cover mr-3 border" />
                      <div>
                        <div className="text-sm font-bold text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-mono font-semibold">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-2 py-1 text-xs rounded-full font-bold ${product.quantityInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.quantityInStock} in stock
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {product.onSale ? (
                      <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-1 rounded-md font-black">SALE {product.discountPercentage}%</span>
                    ) : (
                      <span className="text-gray-400 text-xs">Standard</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <Link 
                      href={`/products/edit/${pid}`}
                      className="inline-block text-indigo-600 hover:bg-indigo-600 hover:text-white border border-indigo-600 px-3 py-1 rounded transition text-sm font-bold"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product)}
                      className="text-red-600 hover:bg-red-600 hover:text-white border border-red-600 px-3 py-1 rounded transition text-sm font-bold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}