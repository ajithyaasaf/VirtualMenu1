import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format price from cents to dollars with 2 decimal places
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// Get order status color based on status
export function getStatusColor(status: string): string {
  switch (status) {
    case 'new':
      return 'bg-[#484848]';
    case 'cooking':
      return 'bg-[#FF9500]';
    case 'ready':
      return 'bg-[#4CD964]';
    default:
      return 'bg-gray-500';
  }
}

// Format date to show in a readable format
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// Generate a WebSocket URL based on the current environment
export function getWebSocketUrl(): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws`;
}
