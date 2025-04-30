import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useWebSocket } from '@/hooks/useWebSocket';
import { queryClient } from '@/lib/queryClient';
import { Order, ORDER_STATUS } from '@shared/schema';
import { formatPrice, formatDate, getStatusColor } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, ChefHat, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const KitchenDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const { toast } = useToast();
  const { messages } = useWebSocket();

  // Fetch all orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['/api/orders'],
  });

  // Mutations for updating order status
  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number, status: string }) => {
      await apiRequest('PATCH', `/api/orders/${orderId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: 'Status updated',
        description: 'Order status has been updated successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update order status.',
        variant: 'destructive',
      });
    }
  });

  // Handle WebSocket messages for real-time updates
  useEffect(() => {
    if (!messages.length) return;
    
    const latestMessage = messages[messages.length - 1];
    try {
      const data = JSON.parse(latestMessage);
      
      if ((data.type === 'NEW_ORDER' || data.type === 'UPDATE_ORDER') && orders) {
        // Refresh orders data when a new order comes in or status updates
        queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
        
        // Show toast notification for new orders
        if (data.type === 'NEW_ORDER') {
          toast({
            title: 'New Order!',
            description: `Table ${data.order.tableId} has placed a new order (#${data.order.id})`,
          });
          
          // Play notification sound
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play().catch(e => console.error('Error playing notification sound:', e));
        }
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }, [messages, orders, toast]);

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order: Order) => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  // Get next status based on current status
  const getNextStatus = (currentStatus: string): string | null => {
    switch (currentStatus) {
      case ORDER_STATUS.NEW:
        return ORDER_STATUS.COOKING;
      case ORDER_STATUS.COOKING:
        return ORDER_STATUS.READY;
      default:
        return null;
    }
  };

  // Update order status
  const handleUpdateStatus = (orderId: number, currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus);
    if (nextStatus) {
      updateOrderMutation.mutate({ orderId, status: nextStatus });
    }
  };

  return (
    <div className="min-h-screen bg-accent">
      <header className="bg-white sticky top-0 z-10 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-poppins font-bold text-xl text-foreground">Spice Garden</h1>
            <p className="text-sm text-muted-foreground">Kitchen Dashboard</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => window.location.href = '/'}>
            <LogOut className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-4 max-w-4xl">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              All Orders
            </TabsTrigger>
            <TabsTrigger value={ORDER_STATUS.NEW} className="data-[state=active]:bg-[#484848] data-[state=active]:text-white">
              New
            </TabsTrigger>
            <TabsTrigger value={ORDER_STATUS.COOKING} className="data-[state=active]:bg-[#FF9500] data-[state=active]:text-white">
              Cooking
            </TabsTrigger>
            <TabsTrigger value={ORDER_STATUS.READY} className="data-[state=active]:bg-[#4CD964] data-[state=active]:text-white">
              Ready
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-muted-foreground mb-2">No orders found</p>
                <p className="text-sm text-muted-foreground">
                  {activeTab === 'all' 
                    ? "There are no orders in the system yet." 
                    : `There are no orders with "${activeTab}" status.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order: Order) => (
                  <div 
                    key={order.id} 
                    className={`bg-white rounded-lg shadow-sm overflow-hidden border-l-4 ${
                      order.status === ORDER_STATUS.NEW 
                        ? 'border-[#484848]' 
                        : order.status === ORDER_STATUS.COOKING 
                          ? 'border-[#FF9500]' 
                          : 'border-[#4CD964]'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">Order #{order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            Table {order.tableId} • {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className={`${getStatusColor(order.status)} text-white px-3 py-1 rounded-full text-sm`}>
                          {order.status === ORDER_STATUS.NEW && 'New'}
                          {order.status === ORDER_STATUS.COOKING && 'Cooking'}
                          {order.status === ORDER_STATUS.READY && 'Ready'}
                        </div>
                      </div>
                      
                      <div className="border-t border-border pt-3">
                        <ul className="space-y-2">
                          {order.items.map((item, index) => (
                            <li key={index} className="flex justify-between">
                              <span>{item.quantity} × {item.name}</span>
                              <span>{formatPrice(item.price * item.quantity)}</span>
                            </li>
                          ))}
                        </ul>
                        
                        {order.notes && (
                          <div className="border-t border-border mt-3 pt-3">
                            <p className="text-sm text-muted-foreground mb-2">Special Instructions:</p>
                            <p className="text-sm">{order.notes}</p>
                          </div>
                        )}
                        
                        <div className="flex space-x-2 mt-4">
                          {order.status === ORDER_STATUS.NEW && (
                            <Button
                              className="bg-[#FF9500] text-white hover:bg-[#FF9500]/90 flex items-center gap-2"
                              onClick={() => handleUpdateStatus(order.id, order.status)}
                              disabled={updateOrderMutation.isPending}
                            >
                              <ChefHat className="h-4 w-4" />
                              Mark Cooking
                            </Button>
                          )}
                          
                          {order.status === ORDER_STATUS.COOKING && (
                            <Button
                              className="bg-[#4CD964] text-white hover:bg-[#4CD964]/90 flex items-center gap-2"
                              onClick={() => handleUpdateStatus(order.id, order.status)}
                              disabled={updateOrderMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Mark Ready
                            </Button>
                          )}
                          
                          {order.status === ORDER_STATUS.READY && (
                            <Button
                              variant="outline"
                              className="text-muted-foreground flex items-center gap-2"
                              onClick={() => {
                                // Archive functionality would be implemented in a real app
                                toast({
                                  title: "Order Archived",
                                  description: `Order #${order.id} has been archived.`
                                });
                              }}
                            >
                              <Clock className="h-4 w-4" />
                              Archive
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KitchenDashboard;
