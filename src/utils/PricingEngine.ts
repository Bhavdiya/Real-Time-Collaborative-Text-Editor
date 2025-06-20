
import { Product, PricingFactors } from "@/types";

class PricingEngineClass {
  private products: Product[] = [];

  initializeProducts(): Product[] {
    const sampleProducts: Omit<Product, 'currentPrice' | 'priceHistory'>[] = [
      {
        id: "1",
        name: "Smart Wireless Headphones",
        description: "Premium noise-canceling headphones with 30-hour battery life",
        basePrice: 299.99,
        originalPrice: 349.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
        category: "electronics",
        stock: 15,
        demand: 0.7,
        tags: ["bluetooth", "noise-canceling", "premium"]
      },
      {
        id: "2",
        name: "Organic Cotton T-Shirt",
        description: "Soft, sustainable cotton tee in classic fit",
        basePrice: 29.99,
        originalPrice: 39.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
        category: "clothing",
        stock: 50,
        demand: 0.4,
        tags: ["organic", "cotton", "casual"]
      },
      {
        id: "3",
        name: "Modern Table Lamp",
        description: "Minimalist LED desk lamp with adjustable brightness",
        basePrice: 89.99,
        originalPrice: 89.99,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
        category: "home",
        stock: 8,
        demand: 0.6,
        tags: ["LED", "adjustable", "modern"]
      },
      {
        id: "4",
        name: "JavaScript Programming Guide",
        description: "Comprehensive guide to modern JavaScript development",
        basePrice: 49.99,
        originalPrice: 59.99,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop",
        category: "books",
        stock: 25,
        demand: 0.3,
        tags: ["programming", "javascript", "education"]
      },
      {
        id: "5",
        name: "Yoga Mat Pro",
        description: "Non-slip exercise mat perfect for yoga and fitness",
        basePrice: 39.99,
        originalPrice: 49.99,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop",
        category: "sports",
        stock: 30,
        demand: 0.5,
        tags: ["yoga", "fitness", "non-slip"]
      },
      {
        id: "6",
        name: "Bluetooth Speaker",
        description: "Portable waterproof speaker with rich bass",
        basePrice: 79.99,
        originalPrice: 99.99,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
        category: "electronics",
        stock: 12,
        demand: 0.8,
        tags: ["bluetooth", "waterproof", "portable"]
      }
    ];

    this.products = sampleProducts.map(product => ({
      ...product,
      currentPrice: this.calculatePrice(product as any),
      priceHistory: this.generateInitialPriceHistory(product.basePrice)
    }));

    return this.products;
  }

  updatePrices(products: Product[]): Product[] {
    return products.map(product => {
      const newPrice = this.calculatePrice(product);
      const updatedProduct = {
        ...product,
        currentPrice: newPrice
      };

      // Add to price history if price changed significantly
      if (Math.abs(newPrice - product.currentPrice) > 0.01) {
        updatedProduct.priceHistory = [
          ...product.priceHistory,
          { timestamp: Date.now(), price: newPrice }
        ].slice(-20); // Keep last 20 price points
      }

      return updatedProduct;
    });
  }

  updateDemand(products: Product[], productId: string): Product[] {
    return products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          demand: Math.min(1, product.demand + 0.1), // Increase demand
          stock: Math.max(0, product.stock - 1) // Decrease stock
        };
      }
      return product;
    });
  }

  private calculatePrice(product: Product): number {
    const factors = this.getPricingFactors(product);
    let priceMultiplier = 1;

    // Stock level impact (low stock = higher price)
    if (factors.stockLevel < 0.2) {
      priceMultiplier *= 1.15; // 15% increase for very low stock
    } else if (factors.stockLevel < 0.5) {
      priceMultiplier *= 1.08; // 8% increase for low stock
    }

    // Demand impact (high demand = higher price)
    priceMultiplier *= (1 + factors.demandScore * 0.2); // Up to 20% increase

    // Time-based pricing (peak hours)
    const hour = new Date().getHours();
    if (hour >= 18 && hour <= 22) { // Evening peak
      priceMultiplier *= 1.05; // 5% increase during peak hours
    }

    // Add some randomness to simulate market fluctuations
    const randomFactor = 0.95 + Math.random() * 0.1; // ±5% random variation
    priceMultiplier *= randomFactor;

    const newPrice = product.basePrice * priceMultiplier;
    
    // Ensure price doesn't go below 70% or above 150% of base price
    const minPrice = product.basePrice * 0.7;
    const maxPrice = product.basePrice * 1.5;
    
    return Math.max(minPrice, Math.min(maxPrice, newPrice));
  }

  private getPricingFactors(product: Product): PricingFactors {
    const maxStock = 100; // Assumed max stock for normalization
    
    return {
      stockLevel: product.stock / maxStock,
      demandScore: product.demand,
      timeOfDay: new Date().getHours() / 24
    };
  }

  private generateInitialPriceHistory(basePrice: number): { timestamp: number; price: number }[] {
    const history = [];
    const now = Date.now();
    
    for (let i = 30; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000); // i days ago
      const variation = 0.9 + Math.random() * 0.2; // ±10% variation
      const price = basePrice * variation;
      history.push({ timestamp, price });
    }
    
    return history;
  }
}

const PricingEngine = new PricingEngineClass();
export default PricingEngine;
