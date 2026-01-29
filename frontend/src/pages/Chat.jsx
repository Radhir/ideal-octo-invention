import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, Users, User, RefreshCw, Search } from 'lucide-react';

const Chat = () => {
    const { user } = useAuth();
    const [colleagues, setColleagues] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [search, setSearch] = useState('');
    const messagesEndRef = useRef(null);
    const pollRef = useRef(null);

    useEffect(() => {
        fetchColleagues();
        return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (pollRef.current) clearInterval(pollRef.current);
        if (selectedUser) {
            fetchConversation(selectedUser.id);
            pollRef.current = setInterval(() => fetchConversation(selectedUser.id), 5000);
        } else {
            setMessages([]);
        }
        return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }, [selectedUser]);

    const fetchColleagues = async () => {
        try {
            const res = await axios.get('/api/dashboard/chat/colleagues/');
            setColleagues(res.data);
        } catch (err) {
            console.error('Error fetching colleagues', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchConversation = async (userId) => {
        try {
            const res = await axios.get(`/api/dashboard/chat/conversation/?user_id=${userId}`);
            setMessages(res.data);
        } catch (err) {
            console.error('Error fetching conversation', err);
        }
    };

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || !selectedUser || sending) return;
        setSending(true);
        try {
            await axios.post('/api/dashboard/chat/', { text, receiver: selectedUser.id });
            setInput('');
            fetchConversation(selectedUser.id);
        } catch (err) {
            console.error('Error sending message', err);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const currentUserId = user?.user_id;

    return (
        <div style={{ padding: '30px', height: 'calc(100vh - 120px)', display: 'flex', gap: '20px' }}>
            {/* Colleagues Sidebar */}
            <GlassCard style={{ width: '280px', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', color: '#b08d57', letterSpacing: '1px' }}>
                        <Users size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Colleagues
                    </h3>
                    <div style={{ position: 'relative', marginTop: '12px' }}>
                        <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                            placeholder="Search colleagues..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px 10px 8px 32px',
                                borderRadius: '10px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                background: 'rgba(255,255,255,0.04)',
                                color: '#e2e8f0',
                                fontSize: '12px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                    {loading ? (
                        <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>Loading...</p>
                    ) : colleagues.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.username.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
                        <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>No colleagues found.</p>
                    ) : colleagues.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.username.toLowerCase().includes(search.toLowerCase())).map(c => (
                        <button
                            key={c.id}
                            onClick={() => setSelectedUser(c)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px',
                                borderRadius: '12px',
                                border: 'none',
                                cursor: 'pointer',
                                marginBottom: '4px',
                                background: selectedUser?.id === c.id ? 'rgba(176,141,87,0.15)' : 'transparent',
                                borderLeft: selectedUser?.id === c.id ? '3px solid #b08d57' : '3px solid transparent',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                background: selectedUser?.id === c.id ? '#b08d57' : 'rgba(255,255,255,0.06)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                <User size={16} color={selectedUser?.id === c.id ? '#000' : '#94a3b8'} />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '13px', fontWeight: '700', color: selectedUser?.id === c.id ? '#b08d57' : '#e2e8f0' }}>
                                    {c.name}
                                </div>
                                <div style={{ fontSize: '10px', color: '#64748b' }}>@{c.username}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </GlassCard>

            {/* Chat Area */}
            <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#b08d57', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MessageSquare size={20} color="#fff" />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>
                            {selectedUser ? selectedUser.name : 'Elite Shine Chat'}
                        </h3>
                        <span style={{ fontSize: '11px', color: selectedUser ? '#10b981' : '#64748b', fontWeight: '800' }}>
                            {selectedUser ? '● ONLINE' : 'Select a colleague to start'}
                        </span>
                    </div>
                    {selectedUser && (
                        <button
                            onClick={() => fetchConversation(selectedUser.id)}
                            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '6px' }}
                            title="Refresh"
                        >
                            <RefreshCw size={16} />
                        </button>
                    )}
                    <div style={{ marginLeft: selectedUser ? '0' : 'auto', fontSize: '11px', color: '#64748b' }}>
                        {messages.length} messages
                    </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {!selectedUser ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                            <MessageSquare size={48} color="#64748b" />
                            <p style={{ color: '#64748b', fontSize: '14px' }}>Select a colleague to start chatting</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                            <MessageSquare size={36} color="#64748b" />
                            <p style={{ color: '#64748b', fontSize: '13px' }}>No messages yet. Say hello!</p>
                        </div>
                    ) : messages.map(msg => (
                        <ChatBubble
                            key={msg.id}
                            sender={msg.sender_name}
                            text={msg.text}
                            time={new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                            isMe={msg.sender === currentUserId}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                {selectedUser && (
                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', display: 'flex', gap: '15px' }}>
                        <input
                            className="form-control"
                            placeholder={`Message ${selectedUser.name}...`}
                            style={{ borderRadius: '15px', flex: 1 }}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            className="btn-primary"
                            style={{ padding: '10px 20px', borderRadius: '12px', opacity: (input.trim() && !sending) ? 1 : 0.5 }}
                            onClick={sendMessage}
                            disabled={!input.trim() || sending}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};

const ChatBubble = ({ sender, text, time, isMe }) => (
    <div style={{
        alignSelf: isMe ? 'flex-end' : 'flex-start',
        maxWidth: '70%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isMe ? 'flex-end' : 'flex-start'
    }}>
        {!isMe && <span style={{ fontSize: '10px', color: '#b08d57', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>{sender}</span>}
        <div style={{
            padding: '12px 18px',
            borderRadius: isMe ? '20px 20px 0 20px' : '20px 20px 20px 0',
            background: isMe ? 'rgba(176, 141, 87, 1)' : 'rgba(255,255,255,0.05)',
            border: isMe ? 'none' : '1px solid rgba(255,255,255,0.1)',
            color: isMe ? '#000' : '#fff',
            fontSize: '14px',
            fontWeight: isMe ? '600' : '400',
            boxShadow: isMe ? '0 4px 15px rgba(176,141,87,0.3)' : 'none'
        }}>
            {text}
        </div>
        <span style={{ fontSize: '10px', color: '#64748b', marginTop: '5px', textTransform: 'uppercase' }}>{time}</span>
    </div>
);

export default Chat;
