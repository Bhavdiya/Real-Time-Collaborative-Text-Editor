
export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  currentPrice: number;
  originalPrice: number;
  image: string;
  category: string;
  stock: number;
  demand: number;
  priceHistory: PricePoint[];
  tags: string[];
}

export interface PricePoint {
  timestamp: number;
  price: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface PricingFactors {
  stockLevel: number;
  demandScore: number;
  timeOfDay: number;
  competitorPrice?: number;
}
