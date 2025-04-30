import React from 'react';
import { type Category, CATEGORIES } from '@shared/schema';
import {
  Coffee,
  Salad,
  UtensilsCrossed,
  Wine,
  Soup,
  IceCream2
} from 'lucide-react';

interface CategoryNavProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

// Map of category icons
const categoryIcons: Record<string, React.ReactNode> = {
  'Starters': <UtensilsCrossed className="h-4 w-4 md:h-5 md:w-5" />,
  'Main Course': <Salad className="h-4 w-4 md:h-5 md:w-5" />,
  'Soups': <Soup className="h-4 w-4 md:h-5 md:w-5" />,
  'Beverages': <Coffee className="h-4 w-4 md:h-5 md:w-5" />,
  'Desserts': <IceCream2 className="h-4 w-4 md:h-5 md:w-5" />,
};

const CategoryNav: React.FC<CategoryNavProps> = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="bg-white shadow-sm mb-2 md:grid-area-categories md:shadow-none md:mb-0 md:border-r md:border-border md:min-h-screen md:overflow-y-auto">
      {/* Heading for larger screens */}
      <div className="px-4 py-4 border-b border-border mb-4">
        <h2 className="text-xl font-bold font-poppins hidden md:block">
          <span className="text-primary">Today's</span> Menu
        </h2>
        <p className="text-sm text-muted-foreground hidden md:block">Freshly prepared with premium ingredients</p>
      </div>
      
      {/* Horizontal scrollable categories for mobile */}
      <div className="category-nav flex overflow-x-auto py-4 px-3 md:hidden">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            className={`category-button whitespace-nowrap px-5 py-2.5 mx-1.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
              activeCategory === category 
                ? 'active' 
                : ''
            }`}
            onClick={() => onCategoryChange(category)}
          >
            <span className="opacity-85">
              {categoryIcons[category] || <Wine className="h-4 w-4" />}
            </span>
            <span>{category}</span>
          </button>
        ))}
      </div>
      
      {/* Vertical categories for tablet and desktop */}
      <div className="hidden md:block px-3">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider px-4 mb-2">Categories</h3>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className={`category-button w-full px-4 py-3 rounded-xl font-medium text-base flex items-center gap-3 transition-all ${
                activeCategory === category 
                  ? 'active' 
                  : ''
              }`}
              onClick={() => onCategoryChange(category)}
            >
              <span className="opacity-85">
                {categoryIcons[category] || <Wine className="h-5 w-5" />}
              </span>
              <span>{category}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Today's menu heading for mobile */}
      <div className="px-4 py-2 border-b border-border md:hidden">
        <h2 className="text-xl font-bold font-poppins">
          <span className="text-primary">Today's</span> Menu
        </h2>
        <p className="text-sm text-muted-foreground">Freshly prepared with premium ingredients</p>
      </div>
      
      {/* Additional info for desktop */}
      <div className="hidden md:block px-4 py-6 mt-8 bg-accent/30 mx-3 rounded-xl">
        <h3 className="font-medium mb-2">Need assistance?</h3>
        <p className="text-sm text-muted-foreground mb-4">Our staff is always ready to help with your order.</p>
        <button className="w-full bg-primary/10 text-primary py-2 rounded-lg text-sm font-medium">
          Call Server
        </button>
      </div>
    </div>
  );
};

export default CategoryNav;
