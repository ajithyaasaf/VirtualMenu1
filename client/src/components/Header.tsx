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
    <header className="bg-white sticky top-0 z-10 w-full border-b border-gray-200 md:grid-area-header">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 mr-1 rounded-full bg-primary/10 hidden md:flex lg:p-3">
              <Utensils className="h-5 w-5 text-primary lg:h-6 lg:w-6" />
            </div>
            <div>
              <h1 className="font-poppins font-bold text-xl text-gray-900 lg:text-2xl">{restaurantName}</h1>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="inline-flex items-center px-2.5 py-0.5 bg-blue-50 text-xs font-medium rounded-full text-blue-700">
                  Table {tableId}
                </span>
                <div className="hidden md:flex text-xs text-gray-500 items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  9:00 AM - 10:00 PM
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <button 
                className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-4 w-4 mr-2" />
                Menu
              </button>
            </div>
            <div className="relative">
              <button 
                className={`p-2 relative rounded-full hover:bg-gray-100 transition-colors ${cartCount > 0 ? 'bg-blue-50' : 'bg-gray-50'} lg:p-3`} 
                data-count={cartCount > 0 ? cartCount : ''}
                onClick={onCartOpen}
                aria-label="Open cart"
              >
                <ShoppingBag className={`h-5 w-5 lg:h-6 lg:w-6 ${cartCount > 0 ? 'text-blue-700' : 'text-gray-700'}`} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="pb-2 flex items-center md:hidden">
          <div className="text-xs text-gray-500 rounded-full py-1 flex items-center">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
            Open • 9:00 AM - 10:00 PM
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
