import React from 'react';
import { type MenuItem } from '@shared/schema';
import { formatPrice } from '@/lib/utils';
import { Plus, Minus, Flame, Star } from 'lucide-react';

interface MenuItemProps {
  item: MenuItem;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, quantity, onIncrease, onDecrease }) => {
  // Choose a few popular items to mark as popular (you could base this on actual order data)
  const isPopular = [1, 5, 8].includes(item.id);
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-5 h-full flex flex-col hover:shadow-md transition-shadow">
      {/* Mobile layout (stacked) and tablet/desktop layout (side-by-side) */}
      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row h-full">
        {/* Image container */}
        <div className="relative w-full h-48 sm:w-1/3 sm:h-auto md:w-full md:h-48 lg:w-2/5 xl:w-1/2 lg:h-auto">
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {isPopular && (
            <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2.5 py-1 rounded-md font-medium flex items-center">
              <Flame className="h-3 w-3 mr-1" />
              Popular
            </div>
          )}
          
          {/* Rating badge - desktop only */}
          <div className="absolute bottom-3 right-3 bg-white text-gray-700 text-xs px-2 py-1 rounded-md font-medium flex items-center shadow-sm hidden lg:flex">
            <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" />
            <span>4.9</span>
          </div>
        </div>
        
        {/* Content container */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-900 text-base md:text-lg">{item.name}</h3>
              <div className="ml-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {formatPrice(item.price)}
              </div>
            </div>
            <p className="text-gray-500 text-sm line-clamp-2 mt-2 mb-4">{item.description}</p>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center justify-end">
            {quantity > 0 ? (
              <div className="flex items-center bg-gray-50 p-1 rounded-lg border border-gray-200">
                <button 
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-gray-200 md:w-9 md:h-9"
                  onClick={onDecrease}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4 text-gray-600" />
                </button>
                <span className="mx-3 w-6 text-center font-medium text-gray-900">{quantity}</span>
                <button 
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-600 text-white md:w-9 md:h-9"
                  onClick={onIncrease}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center md:py-2.5"
                onClick={onIncrease}
                aria-label="Add to cart"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                <span className="md:text-sm">Add to cart</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
