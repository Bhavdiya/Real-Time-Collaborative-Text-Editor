
import { useState } from "react";
import { ShoppingCart, Clock, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import PriceDisplay from "./PriceDisplay";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const stockLevel = product.stock;
  const isLowStock = stockLevel < 10;
  
  const discountPercentage = product.originalPrice > product.currentPrice 
    ? Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-gray-200 overflow-hidden">
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        )}
        
        {discountPercentage > 0 && (
          <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white font-medium">
            -{discountPercentage}%
          </Badge>
        )}
        
        {isLowStock && (
          <Badge variant="outline" className="absolute top-3 right-3 bg-orange-50 text-orange-600 border-orange-200">
            <Package className="h-3 w-3 mr-1" />
            Low Stock
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
          <div className="flex items-center text-xs text-gray-500">
            <Package className="h-3 w-3 mr-1" />
            {stockLevel} left
          </div>
        </div>

        <PriceDisplay
          currentPrice={product.currentPrice}
          originalPrice={product.originalPrice}
          priceHistory={product.priceHistory}
        />
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={onAddToCart}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg"
          disabled={stockLevel === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {stockLevel === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
