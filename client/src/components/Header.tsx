import React from 'react';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  restaurantName: string;
  tableId: string;
  onCartOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ restaurantName, tableId, onCartOpen }) => {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  return (
    <header className="bg-white sticky top-0 z-10 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-poppins font-bold text-xl text-foreground">{restaurantName}</h1>
          <p className="text-sm text-muted-foreground">Table {tableId}</p>
        </div>
        <div className="relative">
          <button 
            className={`p-2 relative ${cartCount > 0 ? 'cart-badge' : ''}`} 
            data-count={cartCount > 0 ? cartCount : ''}
            onClick={onCartOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
