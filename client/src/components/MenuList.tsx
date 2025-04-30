import React from 'react';
import { type Category } from '@shared/schema';
import MenuItem from './MenuItem';
import { type MenuItem as MenuItemType } from '@shared/schema';
import { useCart } from '@/context/CartContext';

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
    <main className="flex-1 overflow-y-auto pb-20">
      <div className="px-4 py-2">
        <h2 className="font-poppins font-semibold text-lg mb-3">{activeCategory}</h2>
        
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <p className="text-muted-foreground">No items available in this category.</p>
          </div>
        ) : (
          <div className="space-y-4">
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
