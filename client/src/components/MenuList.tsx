import React from 'react';
import { type Category, type MenuItem as MenuItemType } from '@shared/schema';
import MenuItem from './MenuItem'; 
import { useCart } from '@/context/CartContext';
import { CupSoda, Info, Search, SlidersHorizontal } from 'lucide-react';

interface MenuListProps {
  menuItems: MenuItemType[];
  activeCategory: Category;
}

const MenuList: React.FC<MenuListProps> = ({ menuItems, activeCategory }) => {
  const { addToCart, removeFromCart, cartItems } = useCart();
  
  // Get filtered menu items for the active category
  const filteredItems = menuItems.filter(item => item.category === activeCategory);
  
  // Get item quantity from cart
  const getItemQuantity = (id: number): number => {
    const cartItem = cartItems.find(item => item.id === id);
    return cartItem ? cartItem.quantity : 0;
  };
  
  return (
    <main className="flex-1 overflow-y-auto pb-20 menu-list md:grid-area-menu">
      {/* Search bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 flex items-center md:px-6 lg:px-8">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search className="h-4 w-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search menu items..." 
            className="w-full bg-gray-50 py-2.5 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
          />
        </div>
        <div className="flex gap-2 ml-3">
          <button className="p-2 rounded-lg bg-gray-50 border border-gray-200 md:flex md:items-center md:px-4">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            <span className="hidden md:inline-block ml-2 text-sm font-medium text-gray-700">Filters</span>
          </button>
        </div>
      </div>
      
      <div className="px-4 py-5 md:px-6 lg:px-8 lg:py-6">
        {/* Category header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {activeCategory === 'Beverages' ? (
              <CupSoda className="h-5 w-5 text-blue-600 md:h-6 md:w-6" />
            ) : (
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full md:w-3 md:h-3"></span>
            )}
            <h2 className="font-semibold text-xl text-gray-900 md:text-2xl">{activeCategory}</h2>
          </div>
          
          <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            {filteredItems.length} items
          </div>
        </div>
        
        {/* Menu items */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center md:p-8 md:max-w-md md:mx-auto">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-3 md:w-20 md:h-20 md:mb-4">
              <Info className="h-6 w-6 text-muted-foreground md:h-8 md:w-8" />
            </div>
            <h3 className="font-medium mb-1 md:text-lg">No items available</h3>
            <p className="text-muted-foreground text-sm md:text-base">This category is currently empty.</p>
          </div>
        ) : (
          <div className="md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <MenuItem 
                key={item.id}
                item={item} 
                quantity={getItemQuantity(item.id)}
                onIncrease={() => addToCart(item)}
                onDecrease={() => removeFromCart(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MenuList;
