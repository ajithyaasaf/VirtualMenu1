import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem } from '@shared/schema';

// Cart item extends MenuItem with quantity
interface CartItem extends MenuItem {
  quantity: number;
}

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: number, removeAll?: boolean) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

// Create context with default values
const CartContext = createContext<CartContextProps>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
});

// Cart provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize cart from localStorage if available
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Add item to cart (or increase quantity if already exists)
  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex !== -1) {
        // Item already exists, increase quantity
        const updatedItems = [...prev];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        return updatedItems;
      } else {
        // Add new item with quantity 1
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };
  
  // Remove item from cart (decrease quantity or remove completely)
  const removeFromCart = (itemId: number, removeAll: boolean = false) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => item.id === itemId);
      
      if (existingItemIndex === -1) return prev;
      
      const item = prev[existingItemIndex];
      
      // If quantity is 1 or removeAll is true, remove item completely
      if (item.quantity === 1 || removeAll) {
        return prev.filter(item => item.id !== itemId);
      }
      
      // Otherwise decrease quantity
      const updatedItems = [...prev];
      updatedItems[existingItemIndex] = {
        ...item,
        quantity: item.quantity - 1,
      };
      return updatedItems;
    });
  };
  
  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };
  
  // Calculate total price of items in cart
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);
