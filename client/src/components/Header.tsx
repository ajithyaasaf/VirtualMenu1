import React from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Utensils, Clock, Menu } from 'lucide-react';

interface HeaderProps {
  restaurantName: string;
  tableId: string;
  onCartOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ restaurantName, tableId, onCartOpen }) => {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  return (
    <header className="bg-white sticky top-0 z-10 px-4 py-3 shadow-md w-full md:grid-area-header">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          <div className="p-2 mr-3 rounded-full bg-primary/10 hidden md:flex lg:p-3">
            <Utensils className="h-5 w-5 text-primary lg:h-6 lg:w-6" />
          </div>
          <div>
            <h1 className="font-poppins font-bold text-xl gradient-text lg:text-2xl">{restaurantName}</h1>
            <div className="flex items-center gap-2">
              <span className="inline-block px-2 py-0.5 bg-accent text-xs font-medium rounded-full text-primary-foreground">
                Table {tableId}
              </span>
              <div className="hidden md:flex text-xs bg-secondary/10 text-secondary rounded-full px-2 py-1 items-center">
                <Clock className="h-3 w-3 mr-1" />
                9:00 AM - 10:00 PM
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <button 
              className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors flex items-center"
            >
              <Menu className="h-4 w-4 mr-2" />
              Menu
            </button>
          </div>
          <div className="relative">
            <button 
              className={`p-2 relative bg-primary/10 rounded-full hover:bg-primary/20 transition-colors ${cartCount > 0 ? 'cart-badge' : ''} lg:p-3`} 
              data-count={cartCount > 0 ? cartCount : ''}
              onClick={onCartOpen}
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5 text-primary lg:h-6 lg:w-6" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-3 flex items-center md:hidden">
        <div className="text-xs bg-secondary/10 text-secondary rounded-full px-2 py-1 flex items-center">
          <span className="inline-block w-2 h-2 bg-secondary rounded-full mr-1"></span>
          Open • 9:00 AM - 10:00 PM
        </div>
      </div>
    </header>
  );
};

export default Header;
