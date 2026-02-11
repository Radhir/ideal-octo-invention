import { useState, useEffect, useRef, useCallback } from 'react';
import useAuthStore from '../store/useAuthStore';

export const useWebSocket = (room = 'global') => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef(null);
    const { token } = useAuthStore();

    const sendMessage = useCallback((text) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ message: text }));
        }
    }, []);

    useEffect(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        let url;
        if (room === 'global') {
            url = `${protocol}//${window.location.host}/ws/chat/global/`;
        } else {
            url = `${protocol}//${window.location.host}/ws/chat/trip/${room}/`;
        }
        
        // Append token to query string if needed for AuthMiddlewareStack, 
        // usually standard Session auth works if cookie is present, 
        // but for JWT we might need a custom middleware or query param.
        // For now relying on Session/Cookie auth or standard AuthMiddlewareStack.
        
        ws.current = new WebSocket(url);

        ws.current.onopen = () => setIsConnected(true);
        ws.current.onclose = () => setIsConnected(false);
        ws.current.onerror = (error) => console.error('WebSocket error:', error);
        ws.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setMessages(prev => [...prev, data]);
        };

        return () => {
            if (ws.current) ws.current.close();
        };
    }, [room]);

    return { messages, sendMessage, isConnected };
};
