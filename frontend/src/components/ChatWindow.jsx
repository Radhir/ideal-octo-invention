import React, { useState, useRef, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import GlassCard from './GlassCard';
import { Send } from 'lucide-react';

const ChatWindow = ({ room = 'global', title = 'Global Chat' }) => {
    const [input, setInput] = useState('');
    const { messages, sendMessage, isConnected } = useWebSocket(room);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage(input.trim());
            setInput('');
        }
    };

    return (
        <GlassCard style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ margin: 0, color: '#b08d57' }}>{title}</h3>
                <span style={{ fontSize: '12px', color: isConnected ? '#10b981' : '#ef4444' }}>
                    {isConnected ? '● Connected' : '○ Disconnected'}
                </span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {messages.map((msg, idx) => (
                    <ChatBubble key={idx} message={msg} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{
                        flex: 1,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '8px'
                    }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Send size={18} />
                </button>
            </form>
        </GlassCard>
    );
};

const ChatBubble = ({ message }) => (
    <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '12px', color: '#b08d57', marginBottom: '4px' }}>{message.sender_name}</div>
        <div style={{ background: 'rgba(176,141,87,0.1)', padding: '10px 15px', borderRadius: '12px', maxWidth: '80%', color: 'white' }}>
            {message.message}
        </div>
        <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
            {new Date(message.timestamp).toLocaleTimeString()}
        </div>
    </div>
);

export default ChatWindow;
