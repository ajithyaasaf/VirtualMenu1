import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Minus, X, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface CartSheetProps {
  isOpen: boolean;
  tableId: string;
  onClose: () => void;
}

const CartSheet: React.FC<CartSheetProps> = ({ isOpen, tableId, onClose }) => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  
  // Animation control
  useEffect(() => {
    if (!sheetRef.current || !backdropRef.current) return;
    
    if (isOpen) {
      sheetRef.current.style.transform = 'translateY(0)';
      backdropRef.current.classList.add('opacity-100');
      backdropRef.current.classList.remove('opacity-0', 'pointer-events-none');
      document.body.style.overflow = 'hidden';
    } else {
      sheetRef.current.style.transform = 'translateY(100%)';
      backdropRef.current.classList.remove('opacity-100');
      backdropRef.current.classList.add('opacity-0', 'pointer-events-none');
      document.body.style.overflow = '';
    }
  }, [isOpen]);
  
  // Calculate total
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + tax;
  
  // Handle place order
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const orderData = {
        tableId,
        notes: notes.trim(),
        items: cartItems.map(item => ({
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: total
      };
      
      const response = await apiRequest('POST', '/api/orders', orderData);
      const order = await response.json();
      
      // Clear cart and notes after successful order
      clearCart();
      setNotes('');
      
      // Close cart sheet
      onClose();
      
      // Show success toast and return the order
      toast({
        title: "Order Placed",
        description: `Your order #${order.id} has been received.`,
        variant: "default"
      });
      
      return order;
    } catch (error) {
      toast({
        title: "Error placing order",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50" style={{ visibility: isOpen ? 'visible' : 'hidden' }}>
      {/* Backdrop */}
      <div 
        ref={backdropRef}
        className="fixed inset-0 bg-black bg-opacity-30 opacity-0 transition-opacity duration-300 pointer-events-none"
        onClick={onClose}
      />
      
      {/* Sliding cart panel */}
      <div 
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg max-h-[80vh] overflow-y-auto transform translate-y-full transition-transform duration-300"
      >
        {/* Cart header */}
        <div className="sticky top-0 bg-white z-10 border-b border-border">
          <div className="flex justify-between items-center p-4">
            <h2 className="font-poppins font-semibold text-lg">Your Order</h2>
            <button 
              className="p-1 rounded-full hover:bg-accent"
              onClick={onClose}
              aria-label="Close cart"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Cart items */}
        <div className="px-4 py-2">
          {cartItems.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b border-border">
                  <div className="flex items-center">
                    <span className="bg-accent w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">
                      {item.quantity}
                    </span>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button 
                      className="qty-btn w-8 h-8 flex items-center justify-center rounded-full bg-accent"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <button 
                      className="qty-btn w-8 h-8 ml-2 flex items-center justify-center rounded-full bg-accent"
                      onClick={() => removeFromCart(item.id, true)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        
        {/* Special instructions */}
        <div className="px-4 py-3">
          <label htmlFor="notes" className="block text-sm font-medium mb-1">Special Instructions</label>
          <Textarea
            id="notes"
            placeholder="Allergies, preferences, etc."
            className="w-full p-2 border border-border rounded-md text-sm resize-none"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        
        {/* Order summary */}
        <div className="px-4 py-3 bg-accent">
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Tax (5%)</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between py-1 font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
        
        {/* Checkout button */}
        <div className="p-4 border-t border-border">
          <Button 
            className="w-full bg-primary text-white py-6 rounded-lg font-medium shadow-sm hover:bg-primary/90"
            onClick={handlePlaceOrder}
            disabled={isSubmitting || cartItems.length === 0}
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartSheet;
