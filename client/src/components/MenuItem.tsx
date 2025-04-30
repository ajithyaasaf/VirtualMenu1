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
    <div className={`menu-item bg-white rounded-2xl shadow-sm overflow-hidden mb-4 ${isPopular ? 'promo-item' : ''} h-full flex flex-col`}>
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
            <div className="absolute top-2 left-2 bg-primary/90 text-white text-xs px-2 py-1 rounded-lg font-medium flex items-center">
              <Flame className="h-3 w-3 mr-1" />
              Popular
            </div>
          )}
          
          {/* Rating badge - desktop only */}
          <div className="absolute bottom-2 right-2 bg-white/90 text-primary text-xs px-2 py-1 rounded-lg font-medium flex items-center shadow-sm hidden lg:flex">
            <Star className="h-3 w-3 mr-1 fill-primary" />
            <span>4.9</span>
          </div>
        </div>
        
        {/* Content container */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-base md:text-lg">{item.name}</h3>
              <div className="price-badge">{formatPrice(item.price)}</div>
            </div>
            <p className="text-muted-foreground text-sm line-clamp-2 mt-1 mb-3">{item.description}</p>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center justify-end mt-2">
            {quantity > 0 ? (
              <div className="flex items-center bg-accent/50 p-1 rounded-full">
                <button 
                  className="qty-btn w-8 h-8 flex items-center justify-center rounded-full bg-white md:w-9 md:h-9"
                  onClick={onDecrease}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="mx-3 w-6 text-center font-medium">{quantity}</span>
                <button 
                  className="qty-btn w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white md:w-9 md:h-9"
                  onClick={onIncrease}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button 
                className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all flex items-center md:py-2.5"
                onClick={onIncrease}
                aria-label="Add to cart"
              >
                <Plus className="h-4 w-4 mr-1" />
                <span className="md:text-base">Add to cart</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
