import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import GlassCard from '../GlassCard';
import { Send, User } from 'lucide-react';

const TripChat = ({ tripId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Polling every 5s
        return () => clearInterval(interval);
    }, [tripId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await api.get('/api/dashboard/chat/', { params: { trip: tripId } });
            // Filter locally for now if the backend doesn't support the 'trip' query param yet
            // (I added 'trip' to fields but DRF ModelViewSet might need overt filtering)
            const tripMessages = res.data.filter(m => m.trip === tripId || m.trip === parseInt(tripId));
            setMessages(tripMessages);
        } catch (err) {
            console.error('Error fetching trip chat', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const res = await api.post('/api/dashboard/chat/', {
                text: newMessage,
                trip: tripId
            });
            setMessages([...messages, res.data]);
            setNewMessage('');
        } catch (err) {
            console.error('Error sending message', err);
        }
    };

    return (
        <GlassCard style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '20px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#b08d57', fontWeight: '900', textTransform: 'uppercase' }}>Trip Comms</h3>

            <div
                ref={scrollRef}
                style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '5px' }}
            >
                {loading && messages.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Connecting to channel...</p>
                ) : messages.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No messages yet on this trip.</p>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} style={{ alignSelf: msg.sender_name === 'You' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                            <div style={{ fontSize: '10px', color: '#b08d57', marginBottom: '4px', textAlign: msg.sender_name === 'You' ? 'right' : 'left' }}>
                                {msg.sender_name}
                            </div>
                            <div style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '10px 15px',
                                borderRadius: '12px',
                                fontSize: '14px',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                {msg.text}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
                <input
                    className="form-control"
                    placeholder="Type message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '10px 15px', borderRadius: '10px' }}>
                    <Send size={18} />
                </button>
            </form>
        </GlassCard>
    );
};

export default TripChat;
