import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { queryClient } from "./lib/queryClient";
import MenuPage from "./pages/MenuPage";
import KitchenDashboard from "./pages/KitchenDashboard";
import { CartProvider } from "./context/CartContext";

function Router() {
  return (
    <Switch>
      {/* Customer menu page with table ID */}
      <Route path="/t/:tableId" component={MenuPage} />
      
      {/* Kitchen dashboard */}
      <Route path="/kitchen" component={KitchenDashboard} />
      
      {/* Redirect to table 1 for demo purposes */}
      <Route path="/">
        {() => {
          window.location.href = "/t/1";
          return null;
        }}
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Router />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
