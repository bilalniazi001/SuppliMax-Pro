export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  // --- Nayi Fields ---
  quantityInStock: number;
  imageUrl: string;
  size: string;
  rating: number;
  color: string;
  onSale: boolean;
  discountPercentage: number;
  isNewArrival: boolean;
  category: string;
};

// Mock Data (Farzi Data)
let products: Product[] = [
  { 
    id: 1, 
    name: "Laptop X Pro", 
    price: 1200, 
    description: "Powerful laptop for professionals.",
    imageUrl: "/images/laptop-x-pro.jpg",
    quantityInStock: 25,
    size: "N/A", rating: 4.5, color: "Space Gray", 
    onSale: true, discountPercentage: 10, isNewArrival: true, 
    category: "Electronics"
  },
  { 
    id: 2, 
    name: "Smart T-Shirt", 
    price: 50, 
    description: "Comfortable cotton T-Shirt.",
    imageUrl: "/images/laptop-x-pro.jpg",
    quantityInStock: 25,
    size: "L", rating: 4.0, color: "Navy Blue", 
    onSale: true, discountPercentage: 15, isNewArrival: false, 
    category: "Clothing"
  },
];
let nextId = 3;

// ----------------------
// CRUD Functions
// ----------------------

export const getAllProducts = (): Product[] => {
  return products;
};

export const getProductById = (id: number): Product | undefined => {
  return products.find(p => p.id === id);
};

export const createProduct = (productData: Omit<Product, 'id'>): Product => {
  const newProduct: Product = {
    id: nextId++,
    ...productData,
  };
  products.push(newProduct);
  return newProduct;
};

export const updateProduct = (id: number, updatedData: Partial<Product>): Product | undefined => {
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedData } as Product;
    return products[index];
  }
  return undefined;
};

export const deleteProduct = (id: number): boolean => {
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);
  return products.length < initialLength;
};