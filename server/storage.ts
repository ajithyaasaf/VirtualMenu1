import { 
  users, type User, type InsertUser,
  menuItems, type MenuItem, type InsertMenuItem,
  orders, type Order, type InsertOrder, type OrderStatus, ORDER_STATUS
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Menu operations
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemById(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  
  // Order operations
  getOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrdersByTableId(tableId: string): Promise<Order[]>;
  getOrdersByStatus(status: OrderStatus): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: OrderStatus): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private menuItemsMap: Map<number, MenuItem>;
  private ordersMap: Map<number, Order>;
  private userCurrentId: number;
  private menuItemCurrentId: number;
  private orderCurrentId: number;

  constructor() {
    this.users = new Map();
    this.menuItemsMap = new Map();
    this.ordersMap = new Map();
    
    this.userCurrentId = 1;
    this.menuItemCurrentId = 1;
    this.orderCurrentId = 1;
    
    // Initialize with default admin user
    this.createUser({
      username: "admin",
      password: "password",
      isAdmin: true
    });
    
    // Initialize with sample menu items
    this.seedMenuItems();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Menu operations
  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItemsMap.values());
  }
  
  async getMenuItemById(id: number): Promise<MenuItem | undefined> {
    return this.menuItemsMap.get(id);
  }
  
  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.menuItemCurrentId++;
    const menuItem: MenuItem = { ...insertMenuItem, id };
    this.menuItemsMap.set(id, menuItem);
    return menuItem;
  }
  
  // Order operations
  async getOrders(): Promise<Order[]> {
    return Array.from(this.ordersMap.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getOrderById(id: number): Promise<Order | undefined> {
    return this.ordersMap.get(id);
  }
  
  async getOrdersByTableId(tableId: string): Promise<Order[]> {
    return Array.from(this.ordersMap.values())
      .filter(order => order.tableId === tableId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    return Array.from(this.ordersMap.values())
      .filter(order => order.status === status)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderCurrentId++;
    const timestamp = new Date();
    const order: Order = { 
      ...insertOrder, 
      id, 
      status: ORDER_STATUS.NEW,
      createdAt: timestamp
    };
    
    this.ordersMap.set(id, order);
    return order;
  }
  
  async updateOrderStatus(id: number, status: OrderStatus): Promise<Order | undefined> {
    const order = this.ordersMap.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = { ...order, status };
    this.ordersMap.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Private helper method to seed menu items
  private seedMenuItems() {
    const menuItemsData: InsertMenuItem[] = [
      {
        name: "Vegetable Spring Rolls",
        description: "Crispy rolls filled with fresh vegetables and served with sweet chili sauce.",
        price: 899, // $8.99
        category: "Starters",
        imageUrl: "https://images.unsplash.com/photo-1625398407796-82280d6c06ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Paneer Tikka",
        description: "Chunks of cottage cheese marinated in spices and grilled to perfection.",
        price: 1099, // $10.99
        category: "Starters",
        imageUrl: "https://images.unsplash.com/photo-1626132647523-66d522ed6d99?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Samosa Platter",
        description: "Crispy pastry filled with spiced potatoes and peas, served with mint and tamarind chutneys.",
        price: 799, // $7.99
        category: "Starters",
        imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Chili Garlic Mushrooms",
        description: "Button mushrooms tossed in spicy garlic sauce.",
        price: 949, // $9.49
        category: "Starters",
        imageUrl: "https://images.unsplash.com/photo-1559948271-7d5c98d2e951?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Butter Chicken",
        description: "Tender chicken pieces in a rich and creamy tomato sauce.",
        price: 1599, // $15.99
        category: "Main Course",
        imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Vegetable Biryani",
        description: "Fragrant basmati rice cooked with mixed vegetables and aromatic spices.",
        price: 1299, // $12.99
        category: "Main Course",
        imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Masala Chai",
        description: "Traditional Indian spiced tea with milk.",
        price: 299, // $2.99
        category: "Beverages",
        imageUrl: "https://images.unsplash.com/photo-1565799511172-5a218de5fd7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Mango Lassi",
        description: "Sweet yogurt-based drink blended with mango pulp.",
        price: 399, // $3.99
        category: "Beverages",
        imageUrl: "https://images.unsplash.com/photo-1570696516188-ade861b84a49?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Tomato Soup",
        description: "Creamy tomato soup with herbs and spices.",
        price: 599, // $5.99
        category: "Soups",
        imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
      },
      {
        name: "Gulab Jamun",
        description: "Soft, spongy milk-solid balls soaked in rose-flavored sugar syrup.",
        price: 699, // $6.99
        category: "Desserts",
        imageUrl: "https://images.unsplash.com/photo-1605197189472-5c47c6092eed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
      }
    ];
    
    menuItemsData.forEach(item => this.createMenuItem(item));
  }
}

export const storage = new MemStorage();
