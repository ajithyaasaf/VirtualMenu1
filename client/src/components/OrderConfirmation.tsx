import React, { useEffect, useRef } from 'react';
import { Check, CheckCircle, ChefHat, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderConfirmationProps {
  isVisible: boolean;
  orderId: number | null;
  status: string;
  onClose: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ 
  isVisible, 
  orderId, 
  status = 'new',
  onClose 
}) => {
  const confirmationRef = useRef<HTMLDivElement>(null);

  // Animation control
  useEffect(() => {
    if (!confirmationRef.current) return;
    
    if (isVisible) {
      confirmationRef.current.style.transform = 'scale(1)';
      confirmationRef.current.style.opacity = '1';
    } else {
      confirmationRef.current.style.transform = 'scale(0)';
      confirmationRef.current.style.opacity = '0';
    }
  }, [isVisible]);

  // Get progress percentage based on status
  const getStatusProgress = () => {
    switch (status) {
      case 'new': return 33;
      case 'cooking': return 66;
      case 'ready': return 100;
      default: return 0;
    }
  };

  return (
    <div 
      ref={confirmationRef}
      className="fixed inset-0 z-50 bg-gradient-to-b from-white to-accent/30 flex flex-col items-center justify-center p-6 transform scale-0 opacity-0 transition-all duration-300"
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      <div className="p-6 md:p-8 rounded-xl max-w-md w-full bg-white shadow-lg md:max-w-lg lg:max-w-xl">
        {/* Success icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-30"></div>
          <div className="bg-primary/10 rounded-full p-5 mx-auto w-24 h-24 flex items-center justify-center mb-6 relative z-10">
            <Check className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        {/* Title and description */}
        <div className="text-center mb-6">
          <h2 className="font-poppins font-bold text-2xl mb-2 gradient-text">Order Confirmed!</h2>
          <p className="text-center text-muted-foreground">
            Your order <span className="text-primary font-semibold">#{orderId}</span> has been received and will be prepared shortly.
          </p>
        </div>
        
        {/* Order status tracker */}
        <div className="bg-accent/50 rounded-xl p-5 mb-6">
          <h3 className="font-medium mb-4 flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Order Status</span>
          </h3>
          
          <div className="relative pb-2">
            {/* Status progress bar */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted-foreground/20"></div>
            
            {/* New status */}
            <div className="relative flex items-start mb-6">
              <div className={`z-10 w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center ${
                status === 'new' || status === 'cooking' || status === 'ready' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'border-2 border-muted-foreground/20 bg-white'
              }`}>
                <Plus className="h-4 w-4" />
              </div>
              <div className="ml-4">
                <h4 className="font-medium">Order Received</h4>
                <p className="text-sm text-muted-foreground">Your order has been confirmed</p>
              </div>
            </div>
            
            {/* Cooking status */}
            <div className="relative flex items-start mb-6">
              <div className={`z-10 w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center ${
                status === 'cooking' || status === 'ready' 
                  ? 'bg-[#FF9500] text-white shadow-md' 
                  : 'border-2 border-muted-foreground/20 bg-white'
              }`}>
                <ChefHat className="h-4 w-4" />
              </div>
              <div className="ml-4">
                <h4 className="font-medium">Preparation</h4>
                <p className="text-sm text-muted-foreground">Our chefs are preparing your food</p>
              </div>
            </div>
            
            {/* Ready status */}
            <div className="relative flex items-start">
              <div className={`z-10 w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center ${
                status === 'ready' 
                  ? 'bg-[#4CD964] text-white shadow-md' 
                  : 'border-2 border-muted-foreground/20 bg-white'
              }`}>
                <CheckCircle className="h-4 w-4" />
              </div>
              <div className="ml-4">
                <h4 className="font-medium">Ready to Serve</h4>
                <p className="text-sm text-muted-foreground">Your order is ready to be served</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA button */}
        <Button 
          className="w-full bg-primary text-white py-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
          onClick={onClose}
        >
          Continue Browsing
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
