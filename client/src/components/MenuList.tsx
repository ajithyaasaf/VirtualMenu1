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
    <main className="flex-1 overflow-y-auto pb-20 menu-list md:grid-area-menu md:border-l md:border-border">
      {/* Search bar */}
      <div className="sticky top-0 z-10 bg-accent/50 backdrop-blur-sm px-4 py-3 flex items-center md:px-6 md:py-4 lg:px-8">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search menu items..." 
            className="w-full bg-white py-2 pl-10 pr-4 rounded-xl border border-border focus:outline-none focus:ring-1 focus:ring-primary text-sm md:py-2.5 md:text-base"
          />
        </div>
        <div className="flex gap-2">
          <button className="p-2 ml-2 rounded-full bg-white border border-border md:flex md:items-center md:px-4 md:rounded-xl">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="hidden md:inline-block ml-2 text-sm font-medium">Filters</span>
          </button>
        </div>
      </div>
      
      <div className="px-4 py-3 md:px-6 md:py-5 lg:px-8 lg:py-6">
        {/* Category header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            {activeCategory === 'Beverages' ? (
              <CupSoda className="h-5 w-5 text-primary md:h-6 md:w-6" />
            ) : (
              <span className="inline-block w-2 h-2 bg-primary rounded-full md:w-3 md:h-3"></span>
            )}
            <h2 className="font-poppins font-semibold text-lg md:text-xl lg:text-2xl">{activeCategory}</h2>
          </div>
          
          <div className="text-sm text-muted-foreground md:text-base">
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
