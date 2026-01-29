import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Camera, Lock, Users, Activity, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const MeetingRoomWidget = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [activeCamera, setActiveCamera] = useState(1);
    const messagesEndRef = useRef(null);

    // Permission Logic
    const canWrite = (() => {
        if (!user || !user.role) return false;
        const role = user.role.toLowerCase();
        const allowed = ['owner', 'director', 'ceo', 'manager', 'gm', 'hod', 'admin', 'lead'];
        return allowed.some(r => role.includes(r));
    })();

    // Poll for messages (Global Chat)
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get('/api/dashboard/chat/');
                // Safety check for array vs pagination result
                const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
                const global = data.filter(m => !m.receiver);
                setMessages(global);
            } catch (err) {
                console.error("Chat poll failed", err.response?.status, err.response?.data || err.message);
                if (err.response?.status === 401) {
                    // Optional: Trigger logout or show session expired
                }
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !canWrite) return;

        try {
            await axios.post('/api/dashboard/chat/', {
                text: newMessage,
                receiver: null // Global message
            });
            setNewMessage('');
            // Optimistic update
            setMessages([...messages, {
                text: newMessage,
                sender_name: user.full_name || user.username,
                created_at: new Date().toISOString(),
                is_me: true
            }]);
        } catch (err) {
            console.error("Failed to send", err);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    return (
        <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(176, 141, 87, 0.2)',
            borderRadius: '15px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: '400px'
        }}>
            {/* Header */}
            <div style={{
                padding: '15px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(176, 141, 87, 0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Activity size={16} color="#b08d57" />
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '2px', color: '#b08d57' }}>
                        WAR ROOM // COMMS
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 5px #10b981' }} />
                        <span style={{ fontSize: '9px', color: '#fff', opacity: 0.5 }}>LIVE</span>
                    </div>
                </div>
            </div>

            {/* Split View: CCTV (Placeholder) & Chat */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* CCTV Section - Left Side (30%) */}
                <div style={{
                    width: '35%',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }}>
                    <div style={{
                        flex: 1,
                        background: '#000',
                        borderRadius: '8px',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        {/* Static / Placeholder Feed */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'column', gap: '10px',
                            opacity: 0.4
                        }}>
                            <Camera size={24} color="#64748b" />
                            <span style={{ fontSize: '8px', color: '#64748b', letterSpacing: '1px' }}>CAM-{activeCamera} FEED OFF-AIR</span>
                        </div>

                        {/* Overlay Info */}
                        <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '8px', color: '#10b981' }}>REC</div>
                        <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '8px', color: '#fff' }}>14:24:08 UTC</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                        {[1, 2, 3].map(cam => (
                            <div
                                key={cam}
                                onClick={() => setActiveCamera(cam)}
                                style={{
                                    height: '30px',
                                    background: activeCamera === cam ? 'rgba(176, 141, 87, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                    border: `1px solid ${activeCamera === cam ? '#b08d57' : 'rgba(255, 255, 255, 0.1)'}`,
                                    borderRadius: '4px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '9px', color: activeCamera === cam ? '#b08d57' : '#64748b',
                                    cursor: 'pointer'
                                }}
                            >
                                CAM {cam}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Log - Right Side (65%) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                        flex: 1,
                        padding: '20px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                    }}>
                        {messages.length === 0 && (
                            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '10px', marginTop: '50px' }}>
                                NO ACTIVE COMMUNICATIONS
                            </div>
                        )}
                        {messages.map((msg, idx) => {
                            const isMe = msg.sender_name === (user.full_name || user.username); // Simplified check
                            return (
                                <div key={idx} style={{
                                    alignSelf: 'flex-start',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '2px 10px 10px 10px',
                                    padding: '8px 12px',
                                    maxWidth: '85%'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', gap: '10px' }}>
                                        <span style={{ fontSize: '9px', fontWeight: '700', color: '#b08d57' }}>
                                            {msg.sender_name.toUpperCase()}
                                        </span>
                                        <span style={{ fontSize: '8px', color: '#64748b' }}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#e2e8f0', lineHeight: '1.4' }}>
                                        {msg.text}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{
                        padding: '15px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        background: 'rgba(0, 0, 0, 0.2)'
                    }}>
                        {canWrite ? (
                            <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="TRANSMIT MESSAGE..."
                                    style={{
                                        flex: 1,
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '10px 15px',
                                        color: '#fff',
                                        fontSize: '11px',
                                        outline: 'none',
                                        fontFamily: 'Outfit, sans-serif',
                                        letterSpacing: '1px'
                                    }}
                                />
                                <button
                                    type="submit"
                                    style={{
                                        background: '#b08d57',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '0 15px',
                                        cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    <Send size={14} color="#000" />
                                </button>
                            </form>
                        ) : (
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                padding: '10px',
                                border: '1px dashed rgba(255, 255, 255, 0.1)',
                                borderRadius: '4px'
                            }}>
                                <Lock size={12} color="#64748b" />
                                <span style={{ fontSize: '10px', color: '#64748b', letterSpacing: '2px' }}>READ ONLY CHANNEL</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeetingRoomWidget;
