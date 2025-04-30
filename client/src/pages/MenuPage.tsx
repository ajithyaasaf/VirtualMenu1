import React, { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import MenuList from '@/components/MenuList';
import CartSheet from '@/components/CartSheet';
import OrderConfirmation from '@/components/OrderConfirmation';
import { Category, CATEGORIES, ORDER_STATUS } from '@shared/schema';
import { useWebSocket } from '@/hooks/useWebSocket';

const MenuPage: React.FC = () => {
  // Get tableId from URL
  const [, params] = useRoute('/t/:tableId');
  const tableId = params?.tableId || '1';
  
  // State
  const [activeCategory, setActiveCategory] = useState<Category>(CATEGORIES[0]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState({
    isVisible: false,
    orderId: null as number | null,
    status: ORDER_STATUS.NEW
  });
  
  // Fetch menu items
  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ['/api/menu'],
  });
  
  // WebSocket for real-time order updates
  const { messages } = useWebSocket();
  
  // Handle order updates from WebSocket
  useEffect(() => {
    if (!messages.length) return;
    
    const latestMessage = messages[messages.length - 1];
    try {
      const data = JSON.parse(latestMessage);
      
      // Check if this is a status update for our order
      if (data.type === 'UPDATE_ORDER' && 
          data.order.tableId === tableId && 
          orderConfirmation.orderId === data.order.id) {
        setOrderConfirmation(prev => ({
          ...prev,
          status: data.order.status
        }));
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }, [messages, tableId, orderConfirmation.orderId]);
  
  // Handle cart open/close
  const handleCartOpen = () => setIsCartOpen(true);
  const handleCartClose = () => setIsCartOpen(false);
  
  // Handle category change
  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
  };
  
  // Handle confirmation close
  const handleDismissConfirmation = () => {
    setOrderConfirmation({
      isVisible: false,
      orderId: null,
      status: ORDER_STATUS.NEW
    });
  };
  
  // Listen for order placement and show confirmation
  const handleOrderPlaced = (orderId: number) => {
    setOrderConfirmation({
      isVisible: true,
      orderId,
      status: ORDER_STATUS.NEW
    });
  };
  
  return (
    <div className="bg-[#F7F7F7] min-h-screen">
      <div className="restaurant-app relative flex flex-col">
        {/* Header */}
        <Header 
          restaurantName="Spice Garden" 
          tableId={tableId}
          onCartOpen={handleCartOpen}
        />
        
        {/* Category Navigation */}
        <CategoryNav 
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
        
        {/* Menu List */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading delicious menu...</p>
            </div>
          </div>
        ) : (
          <MenuList 
            menuItems={menuItems} 
            activeCategory={activeCategory}
          />
        )}
        
        {/* Cart Sheet */}
        <CartSheet 
          isOpen={isCartOpen}
          tableId={tableId}
          onClose={handleCartClose}
        />
        
        {/* Order Confirmation */}
        <OrderConfirmation 
          isVisible={orderConfirmation.isVisible}
          orderId={orderConfirmation.orderId}
          status={orderConfirmation.status}
          onClose={handleDismissConfirmation}
        />
      </div>
    </div>
  );
};

export default MenuPage;
