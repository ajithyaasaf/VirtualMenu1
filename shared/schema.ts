import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Menu item categories
export const CATEGORIES = [
  "Starters", 
  "Main Course", 
  "Soups", 
  "Beverages", 
  "Desserts"
] as const;

export type Category = typeof CATEGORIES[number];

// Menu items table
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Stored in cents
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertMenuItemSchema = createInsertSchema(menuItems).pick({
  name: true,
  description: true,
  price: true,
  category: true,
  imageUrl: true,
});

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

// Order status enum
export const ORDER_STATUS = {
  NEW: "new",
  COOKING: "cooking",
  READY: "ready",
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

// Order items (line items in an order)
export type OrderItem = {
  menuItemId: number;
  name: string;
  price: number; // Price in cents
  quantity: number;
};

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  tableId: text("table_id").notNull(),
  status: text("status").notNull().default(ORDER_STATUS.NEW),
  notes: text("notes"),
  items: jsonb("items").notNull().$type<OrderItem[]>(),
  totalAmount: integer("total_amount").notNull(), // In cents
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  tableId: true,
  notes: true,
  items: true,
  totalAmount: true,
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

// User table (for kitchen staff)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
