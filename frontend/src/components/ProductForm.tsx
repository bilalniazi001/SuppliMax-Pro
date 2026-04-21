'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../config';

// --- TYPE DEFINITIONS ---
export interface Product { 
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
}

export interface ExtendedProduct extends Product {
    id: string; 
    _id?: string; // MongoDB support
}

interface ProductFormProps {
    initialData?: ExtendedProduct;
}

type FormDataType = Omit<Product, 'isInStock'>; 

const CATEGORIES = ['Protein', 'Pre Workout', 'Weight Gainer', 'Creatine', 'BCAA', 'Fat Burner', 'Performance'];

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  
  // ✅ Safe ID handling for MongoDB (_id) or standard id
  const productId = initialData?.id || initialData?._id;
  const isEditMode = !!productId;
  
  const pageTitle = isEditMode ? 'Edit Product' : 'Add New Product';
  const submitButtonText = isEditMode ? 'Update Product' : 'Create Product';

  const [formData, setFormData] = useState<FormDataType>({
      name: initialData?.name || '',
      price: initialData?.price || 0,
      cost: initialData?.cost || 0,
      description: initialData?.description || '',
      imageUrl: initialData?.imageUrl || '', 
      quantityInStock: initialData?.quantityInStock || 0, 
      size: initialData?.size || 'One Size',
      rating: initialData?.rating || 0,
      color: initialData?.color || '', 
      onSale: initialData?.onSale || false,
      discountPercentage: initialData?.discountPercentage || 0,
      isNewArrival: initialData?.isNewArrival || false,
      category: initialData?.category || CATEGORIES[0],
      isFeatured: initialData?.isFeatured || false,
      isExclusive: initialData?.isExclusive || false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;

    if (type === 'checkbox') {
        finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
        finalValue = value === '' ? 0 : parseFloat(value);
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
        const productDataToSend = {
            ...formData,
            isInStock: formData.quantityInStock > 0, 
        };
        
        // ✅ API URL Logic
        const method = isEditMode ? 'PUT' : 'POST';
        const url = isEditMode 
            ? `${API_BASE_URL}/products/${productId}` 
            : `${API_BASE_URL}/products`;

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productDataToSend),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        alert(`Product successfully ${isEditMode ? 'updated' : 'created'}!`);
        
        // ✅ Redirect after success
        router.push('/products'); 
        router.refresh();

    } catch (err: any) {
        setError(err.message || 'Something went wrong.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-200 my-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">{pageTitle}</h1>
        {isEditMode && <p className="text-sm text-gray-600 mt-2 italic">Updating: {initialData?.name}</p>}
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm flex justify-between">
            <span><strong>Error:</strong> {error}</span>
            <button onClick={() => setError(null)} className="font-bold">&times;</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Name & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Product Name *</label>
            <input name="name" type="text" value={formData.name} onChange={handleChange} required className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        {/* Row 2: Price, Cost, Stock */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Price ($) *</label>
            <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Cost ($) *</label>
            <input name="cost" type="number" step="0.01" value={formData.cost} onChange={handleChange} required className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Stock Qty *</label>
            <input name="quantityInStock" type="number" value={formData.quantityInStock} onChange={handleChange} required className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
        </div>

        {/* Image Preview Row */}
        <div className="grid grid-cols-1 gap-4">
            <label className="text-sm font-semibold text-gray-700">Image URL</label>
            <div className="flex items-center gap-4">
                <input name="imageUrl" type="text" value={formData.imageUrl} onChange={handleChange} className="flex-1 p-2.5 border border-gray-300 rounded-lg outline-none" placeholder="Paste image link here..." />
                {formData.imageUrl && <img src={formData.imageUrl} alt="preview" className="w-12 h-12 object-cover rounded border" />}
            </div>
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Description *</label>
          <textarea name="description" rows={3} value={formData.description} onChange={handleChange} required className="p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        {/* Checkboxes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
          {['onSale', 'isNewArrival', 'isFeatured', 'isExclusive'].map((field) => (
            <label key={field} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                name={field} 
                checked={(formData as any)[field]} 
                onChange={handleChange}
                className="w-4 h-4 accent-green-600"
              />
              <span className="text-xs font-bold text-gray-600 uppercase">{field.replace('is', '')}</span>
            </label>
          ))}
        </div>

        {/* Discount Preview (Conditional) */}
        {formData.onSale && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
            <div>
                <label className="text-xs font-bold text-green-800">DISCOUNT %</label>
                <input name="discountPercentage" type="number" value={formData.discountPercentage} onChange={handleChange} className="block w-20 p-1 mt-1 border rounded" />
            </div>
            <div className="text-right">
                <p className="text-xs text-gray-500 line-through">${formData.price.toFixed(2)}</p>
                <p className="text-lg font-bold text-green-700">${(formData.price * (1 - formData.discountPercentage / 100)).toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button type="button" onClick={() => router.back()} className="flex-1 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition">Cancel</button>
          <button type="submit" disabled={isLoading} className="flex-[2] py-3 bg-[#629D23] text-white font-bold rounded-lg hover:bg-[#4c781d] transition disabled:opacity-50">
            {isLoading ? 'Processing...' : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}