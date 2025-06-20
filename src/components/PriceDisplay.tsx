
import { useState } from "react";
import { Clock } from "lucide-react";
import { PricePoint } from "@/types";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface PriceDisplayProps {
  currentPrice: number;
  originalPrice: number;
  priceHistory: PricePoint[];
}

const PriceDisplay = ({ currentPrice, originalPrice, priceHistory }: PriceDisplayProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const hasDiscount = originalPrice > currentPrice;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-gray-900">
          ${currentPrice.toFixed(2)}
        </span>
        {hasDiscount && (
          <span className="text-lg text-gray-500 line-through">
            ${originalPrice.toFixed(2)}
          </span>
        )}
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 h-auto"
          >
            <Clock className="h-3 w-3 mr-1" />
            Price History
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-white border border-gray-200 shadow-lg">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Recent Price Changes</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {priceHistory.slice(-5).reverse().map((point, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    {new Date(point.timestamp).toLocaleDateString()}
                  </span>
                  <span className="font-medium">
                    ${point.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500 pt-2 border-t">
              Prices update based on demand and stock levels
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PriceDisplay;
