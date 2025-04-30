import { MenuItem } from '@shared/schema';

// This is used as a fallback if the API fails to load
export const defaultMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Vegetable Spring Rolls",
    description: "Crispy rolls filled with fresh vegetables and served with sweet chili sauce.",
    price: 899, // $8.99
    category: "Starters",
    imageUrl: "https://images.unsplash.com/photo-1625398407796-82280d6c06ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
  },
  {
    id: 2,
    name: "Paneer Tikka",
    description: "Chunks of cottage cheese marinated in spices and grilled to perfection.",
    price: 1099, // $10.99
    category: "Starters",
    imageUrl: "https://images.unsplash.com/photo-1626132647523-66d522ed6d99?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
  },
  {
    id: 3,
    name: "Samosa Platter",
    description: "Crispy pastry filled with spiced potatoes and peas, served with mint and tamarind chutneys.",
    price: 799, // $7.99
    category: "Starters",
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
  },
  {
    id: 4,
    name: "Chili Garlic Mushrooms",
    description: "Button mushrooms tossed in spicy garlic sauce.",
    price: 949, // $9.49
    category: "Starters",
    imageUrl: "https://images.unsplash.com/photo-1559948271-7d5c98d2e951?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
  },
  {
    id: 5,
    name: "Butter Chicken",
    description: "Tender chicken pieces in a rich and creamy tomato sauce.",
    price: 1599, // $15.99
    category: "Main Course",
    imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
  },
  {
    id: 6,
    name: "Vegetable Biryani",
    description: "Fragrant basmati rice cooked with mixed vegetables and aromatic spices.",
    price: 1299, // $12.99
    category: "Main Course",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
  },
  {
    id: 7,
    name: "Masala Chai",
    description: "Traditional Indian spiced tea with milk.",
    price: 299, // $2.99
    category: "Beverages",
    imageUrl: "https://images.unsplash.com/photo-1565799511172-5a218de5fd7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
  },
  {
    id: 8,
    name: "Mango Lassi",
    description: "Sweet yogurt-based drink blended with mango pulp.",
    price: 399, // $3.99
    category: "Beverages",
    imageUrl: "https://images.unsplash.com/photo-1570696516188-ade861b84a49?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
  },
  {
    id: 9,
    name: "Tomato Soup",
    description: "Creamy tomato soup with herbs and spices.",
    price: 599, // $5.99
    category: "Soups",
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
  },
  {
    id: 10,
    name: "Gulab Jamun",
    description: "Soft, spongy milk-solid balls soaked in rose-flavored sugar syrup.",
    price: 699, // $6.99
    category: "Desserts",
    imageUrl: "https://images.unsplash.com/photo-1605197189472-5c47c6092eed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
  }
];
