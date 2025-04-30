import React from 'react';
import { type Category, CATEGORIES } from '@shared/schema';

interface CategoryNavProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="bg-white shadow-sm mb-2">
      <div className="category-nav flex overflow-x-auto py-3 px-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            className={`whitespace-nowrap px-4 py-2 mx-1 rounded-full font-medium text-sm transition-colors ${
              activeCategory === category 
                ? 'bg-primary text-white' 
                : 'hover:bg-accent'
            }`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;
