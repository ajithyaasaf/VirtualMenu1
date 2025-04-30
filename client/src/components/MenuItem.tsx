import React from 'react';
import { type MenuItem } from '@shared/schema';
import { formatPrice } from '@/lib/utils';
import { Plus, Minus } from 'lucide-react';

interface MenuItemProps {
  item: MenuItem;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, quantity, onIncrease, onDecrease }) => {
  return (
    <div className="menu-item bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex">
        <div className="flex-1 p-3">
          <h3 className="font-medium text-base">{item.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-1">{item.description}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="font-semibold">{formatPrice(item.price)}</p>
            {quantity > 0 ? (
              <div className="flex items-center">
                <button 
                  className="qty-btn w-8 h-8 flex items-center justify-center rounded-full bg-accent"
                  onClick={onDecrease}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="mx-2 w-6 text-center">{quantity}</span>
                <button 
                  className="qty-btn w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white"
                  onClick={onIncrease}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button 
                className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium"
                onClick={onIncrease}
                aria-label="Add to cart"
              >
                Add
              </button>
            )}
          </div>
        </div>
        <div className="w-32 h-32">
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
