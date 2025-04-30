import React, { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
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
      className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 transform scale-0 opacity-0 transition-all duration-300"
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      <div className="bg-primary bg-opacity-10 rounded-full p-6 mb-6">
        <Check className="h-16 w-16 text-primary" />
      </div>
      
      <h2 className="font-poppins font-bold text-2xl mb-2">Order Placed!</h2>
      <p className="text-center text-muted-foreground mb-6">
        Your order #{orderId} has been received and is being prepared.
      </p>
      
      <div className="w-full max-w-sm">
        <div className="bg-accent rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-2">Order Status</h3>
          <div className="flex items-center justify-between">
            {/* New status */}
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${status === 'new' ? 'bg-[#484848]' : status === 'cooking' || status === 'ready' ? 'bg-[#484848]' : 'bg-muted-foreground bg-opacity-20'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="ml-2">New</span>
            </div>
            
            {/* Progress bar 1 */}
            <div className="h-1 flex-1 bg-muted-foreground bg-opacity-20 mx-2 relative">
              <div 
                className="absolute left-0 top-0 bottom-0 bg-[#484848]" 
                style={{ width: `${status === 'new' ? 100 : status === 'cooking' || status === 'ready' ? 100 : 0}%` }}
              ></div>
            </div>
            
            {/* Cooking status */}
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status === 'cooking' ? 'bg-[#FF9500] text-white' : status === 'ready' ? 'bg-[#FF9500] text-white' : 'bg-muted-foreground bg-opacity-20 text-muted-foreground'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <span className="ml-2">Cooking</span>
            </div>
            
            {/* Progress bar 2 */}
            <div className="h-1 flex-1 bg-muted-foreground bg-opacity-20 mx-2 relative">
              <div 
                className="absolute left-0 top-0 bottom-0 bg-[#FF9500]" 
                style={{ width: `${status === 'cooking' ? 100 : status === 'ready' ? 100 : 0}%` }}
              ></div>
            </div>
            
            {/* Ready status */}
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status === 'ready' ? 'bg-[#4CD964] text-white' : 'bg-muted-foreground bg-opacity-20 text-muted-foreground'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="ml-2">Ready</span>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full bg-primary text-white py-6 rounded-lg font-medium shadow-sm hover:bg-primary/90"
          onClick={onClose}
        >
          Continue Browsing
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
