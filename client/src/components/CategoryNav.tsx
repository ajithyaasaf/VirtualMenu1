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
    <div className="bg-white md:grid-area-categories md:border-r md:border-gray-200 md:h-full md:overflow-y-auto">
      {/* Heading for larger screens */}
      <div className="py-5 px-6 border-b border-gray-200 mb-4 hidden md:block">
        <h2 className="text-xl font-semibold text-gray-900">
          Today's Menu
        </h2>
        <p className="text-sm text-gray-500 mt-1">Freshly prepared with premium ingredients</p>
      </div>
      
      {/* Horizontal scrollable categories for mobile */}
      <div className="flex overflow-x-auto py-4 px-4 gap-3 md:hidden">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
              activeCategory === category 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-gray-50 text-gray-700 border border-gray-200'
            }`}
            onClick={() => onCategoryChange(category)}
          >
            <span>
              {categoryIcons[category] || <Wine className="h-4 w-4" />}
            </span>
            <span>{category}</span>
          </button>
        ))}
      </div>
      
      {/* Vertical categories for tablet and desktop */}
      <div className="hidden md:block px-4">
        <h3 className="text-xs font-medium uppercase text-gray-500 tracking-wider px-2 mb-3">Categories</h3>
        <div className="space-y-1">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className={`w-full px-4 py-3 rounded-lg font-medium text-sm flex items-center gap-3 transition-all ${
                activeCategory === category 
                  ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => onCategoryChange(category)}
            >
              <span className={activeCategory === category ? 'text-blue-600' : 'text-gray-500'}>
                {categoryIcons[category] || <Wine className="h-5 w-5" />}
              </span>
              <span>{category}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Today's menu heading for mobile */}
      <div className="px-4 py-3 border-b border-gray-200 md:hidden">
        <h2 className="text-xl font-semibold text-gray-900">
          Today's Menu
        </h2>
        <p className="text-sm text-gray-500 mt-1">Freshly prepared with premium ingredients</p>
      </div>
      
      {/* Additional info for desktop */}
      <div className="hidden md:block px-5 py-5 mt-8 mx-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-2">Need assistance?</h3>
        <p className="text-sm text-gray-500 mb-4">Our staff is always ready to help with your order.</p>
        <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          Call Server
        </button>
      </div>
    </div>
  );
};

export default CategoryNav;
