import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import {
    PortfolioCard,
    PortfolioInput,
    PortfolioButton
} from '../PortfolioComponents';
import { Send, User, MessageSquare } from 'lucide-react';

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
        <PortfolioCard style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '30px', background: 'rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                <MessageSquare size={18} color="var(--gold)" opacity={0.5} />
                <h3 style={{ margin: 0, fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>Secure Channel</h3>
            </div>

            <div
                ref={scrollRef}
                style={{ flex: 1, overflowY: 'auto', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '15px', paddingRight: '10px' }}
            >
                {loading && messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'rgba(232, 230, 227, 0.4)', fontSize: '11px', letterSpacing: '1px' }}>INITIALIZING COMMS...</div>
                ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'rgba(232, 230, 227, 0.4)', fontSize: '11px', letterSpacing: '1px' }}>CHANNEL STANDBY // NO DATA</div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_name === 'You';
                        return (
                            <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                                <div style={{ fontSize: '9px', color: 'var(--gold)', marginBottom: '6px', textAlign: isMe ? 'right' : 'left', opacity: 0.6, fontWeight: '900', letterSpacing: '1px' }}>
                                    {msg.sender_name.toUpperCase()}
                                </div>
                                <div style={{
                                    background: isMe ? 'rgba(176,141,87,0.1)' : 'rgba(255,255,255,0.03)',
                                    padding: '12px 18px',
                                    borderRadius: isMe ? '15px 15px 2px 15px' : '15px 15px 15px 2px',
                                    fontSize: '14px',
                                    color: 'var(--cream)',
                                    border: isMe ? '1px solid rgba(176,141,87,0.2)' : '1px solid rgba(255,255,255,0.05)',
                                    lineHeight: '1.5',
                                    fontWeight: '300'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
                <PortfolioInput
                    placeholder="Enter directive..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.02)', margin: 0 }}
                />
                <PortfolioButton type="submit" variant="gold" style={{ width: '60px', height: '56px', padding: 0 }}>
                    <Send size={20} />
                </PortfolioButton>
            </form>
        </PortfolioCard>
    );
};

export default TripChat;
