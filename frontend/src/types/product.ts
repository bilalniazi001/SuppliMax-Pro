export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  imageUrl: string;
  description?: string;
  onSale?: boolean;
  discountPercentage?: number;
  isNewArrival?: boolean;
}
