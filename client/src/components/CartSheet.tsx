import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Minus, X, Trash2, ShoppingBag, ClipboardCheck, ChefHat } from 'lucide-react';
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
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
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
        className="fixed inset-0 bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 pointer-events-none backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sliding cart panel */}
      <div 
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl max-h-[85vh] overflow-y-auto transform translate-y-full transition-transform duration-300"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5">
          <div className="h-1.5 w-16 bg-border rounded-full mx-auto mt-2"></div>
        </div>
        
        {/* Cart header */}
        <div className="sticky top-0 bg-white z-10 border-b border-border">
          <div className="flex justify-between items-center p-5 pt-8">
            <div className="flex items-center">
              <div className="p-2 mr-2 rounded-full bg-primary/10">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-poppins font-semibold text-lg">Your Order</h2>
                <p className="text-xs text-muted-foreground">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button 
              className="p-2 rounded-full hover:bg-accent transition-colors"
              onClick={onClose}
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Cart items */}
        <div className="px-5 py-3">
          {cartItems.length === 0 ? (
            <div className="py-10 px-4 text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground text-sm mb-4">Add some delicious items to get started!</p>
              <Button
                className="bg-primary text-white rounded-full px-5 py-2"
                onClick={onClose}
              >
                Browse Menu
              </Button>
            </div>
          ) : (
            <>
              <h3 className="font-medium text-sm uppercase text-muted-foreground mb-3">Order Items</h3>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b border-border">
                  <div className="flex items-start">
                    <div className="bg-primary/10 w-8 h-8 rounded-lg flex items-center justify-center text-sm mr-3 text-primary font-medium">
                      {item.quantity}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatPrice(item.price)} each</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <p className="font-semibold mr-3 price-badge">{formatPrice(item.price * item.quantity)}</p>
                    <div className="flex">
                      <button 
                        className="qty-btn w-8 h-8 flex items-center justify-center rounded-full border border-border bg-white"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <button 
                        className="qty-btn w-8 h-8 ml-2 flex items-center justify-center rounded-full border border-border bg-white"
                        onClick={() => removeFromCart(item.id, true)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        
        {/* Special instructions */}
        {cartItems.length > 0 && (
          <div className="px-5 py-4">
            <label htmlFor="notes" className="block text-sm font-medium mb-2 flex items-center">
              <ClipboardCheck className="h-4 w-4 mr-2 text-muted-foreground" />
              Special Instructions
            </label>
            <Textarea
              id="notes"
              placeholder="Allergies, dietary restrictions, preparation preferences..."
              className="w-full p-3 border border-border rounded-xl text-sm resize-none focus:ring-1 focus:ring-primary focus:outline-none"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        )}
        
        {/* Order summary */}
        {cartItems.length > 0 && (
          <div className="px-5 py-4 bg-accent/50 rounded-xl mx-5 mb-4">
            <h3 className="font-medium text-sm uppercase text-muted-foreground mb-3 flex items-center">
              <ChefHat className="h-4 w-4 mr-2" />
              Order Summary
            </h3>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground text-sm">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground text-sm">Tax (5%)</span>
              <span className="font-medium">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between py-2 mt-1 border-t border-border font-semibold">
              <span>Total</span>
              <span className="text-lg">{formatPrice(total)}</span>
            </div>
          </div>
        )}
        
        {/* Checkout button */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-border bg-white sticky bottom-0">
            <Button 
              className="w-full bg-primary text-white py-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
              onClick={handlePlaceOrder}
              disabled={isSubmitting || cartItems.length === 0}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Processing...
                </div>
              ) : (
                <>Place Order • {formatPrice(total)}</>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSheet;
