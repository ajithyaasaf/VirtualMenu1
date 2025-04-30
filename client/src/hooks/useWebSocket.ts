import { useState, useEffect, useRef } from 'react';
import { getWebSocketUrl } from '@/lib/utils';

export function useWebSocket() {
  const [messages, setMessages] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    const connectWebSocket = () => {
      const wsUrl = getWebSocketUrl();
      const socket = new WebSocket(wsUrl);
      
      socketRef.current = socket;
      
      socket.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
        
        // Clear any reconnect timeout
        if (reconnectTimeoutRef.current !== null) {
          window.clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };
      
      socket.onmessage = (event) => {
        setMessages(prev => [...prev, event.data]);
      };
      
      socket.onclose = () => {
        console.log('WebSocket disconnected');
        setConnected(false);
        
        // Attempt to reconnect after a delay
        reconnectTimeoutRef.current = window.setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...');
          connectWebSocket();
        }, 3000);
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };
    
    connectWebSocket();
    
    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      
      if (reconnectTimeoutRef.current !== null) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // Send message function
  const sendMessage = (message: string | object) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return false;
    }
    
    const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
    socketRef.current.send(messageStr);
    return true;
  };

  return { messages, connected, sendMessage };
}
