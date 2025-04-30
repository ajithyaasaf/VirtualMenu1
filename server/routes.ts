import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { 
  insertOrderSchema, 
  ORDER_STATUS, 
  type OrderStatus
} from "@shared/schema";
import { log } from "./vite";
import { z } from "zod";

// WebSocket clients
const clients = new Set<WebSocket>();

// Broadcast to all connected WebSocket clients
function broadcast(message: any) {
  const data = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    clients.add(ws);
    log('WebSocket client connected');

    ws.on('close', () => {
      clients.delete(ws);
      log('WebSocket client disconnected');
    });

    ws.on('message', (message) => {
      log(`Received message: ${message}`);
      // We don't expect any messages from clients in this application
    });

    // Send all current orders to new client for initialization
    storage.getOrders().then(orders => {
      ws.send(JSON.stringify({ type: 'INIT_ORDERS', orders }));
    });
  });

  // API Routes
  // Get all menu items
  app.get('/api/menu', async (_req: Request, res: Response) => {
    try {
      const menuItems = await storage.getMenuItems();
      return res.json(menuItems);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching menu' });
    }
  });

  // Submit new order
  app.post('/api/orders', async (req: Request, res: Response) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      
      // Broadcast new order to all connected clients
      broadcast({ type: 'NEW_ORDER', order });
      
      return res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid order data', errors: error.errors });
      }
      return res.status(500).json({ message: 'Error creating order' });
    }
  });

  // Get all orders (for kitchen dashboard)
  app.get('/api/orders', async (_req: Request, res: Response) => {
    try {
      const orders = await storage.getOrders();
      return res.json(orders);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching orders' });
    }
  });

  // Filter orders by status
  app.get('/api/orders/status/:status', async (req: Request, res: Response) => {
    try {
      const { status } = req.params;
      
      // Validate status
      if (!Object.values(ORDER_STATUS).includes(status as OrderStatus)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      
      const orders = await storage.getOrdersByStatus(status as OrderStatus);
      return res.json(orders);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching orders' });
    }
  });

  // Update order status
  app.patch('/api/orders/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      // Validate status
      if (!Object.values(ORDER_STATUS).includes(status as OrderStatus)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      
      const order = await storage.updateOrderStatus(id, status as OrderStatus);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Broadcast status update to all connected clients
      broadcast({ type: 'UPDATE_ORDER', order });
      
      return res.json(order);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating order' });
    }
  });

  return httpServer;
}
