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
  'Starters': <UtensilsCrossed className="h-4 w-4" />,
  'Main Course': <Salad className="h-4 w-4" />,
  'Soups': <Soup className="h-4 w-4" />,
  'Beverages': <Coffee className="h-4 w-4" />,
  'Desserts': <IceCream2 className="h-4 w-4" />,
};

const CategoryNav: React.FC<CategoryNavProps> = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="bg-white shadow-sm mb-2">
      <div className="category-nav flex overflow-x-auto py-4 px-3">
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
      
      <div className="px-4 py-2 border-b border-border">
        <h2 className="text-xl font-bold font-poppins">
          <span className="text-primary">Today's</span> Menu
        </h2>
        <p className="text-sm text-muted-foreground">Freshly prepared with premium ingredients</p>
      </div>
    </div>
  );
};

export default CategoryNav;
