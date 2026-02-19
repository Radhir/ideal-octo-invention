import React, { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, Users, User, RefreshCw, Search } from 'lucide-react';
import { PortfolioPage, PortfolioTitle, PortfolioCard, PortfolioGrid } from '../components/PortfolioComponents';

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
            const res = await api.get('/api/dashboard/chat/colleagues/');
            setColleagues(res.data);
        } catch (err) {
            console.error('Error fetching colleagues', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchConversation = async (userId) => {
        try {
            const res = await api.get(`/api/dashboard/chat/conversation/?user_id=${userId}`);
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
            await api.post('/api/dashboard/chat/', { text, receiver: selectedUser.id });
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
        <PortfolioPage>
            <PortfolioTitle subtitle="Internal Communication Channel">Team Chat</PortfolioTitle>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: '25px', height: 'calc(100vh - 250px)' }}>

                {/* Colleagues Sidebar */}
                <PortfolioCard style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0, height: '100%' }}>
                    <div style={{ padding: '25px 25px 15px 25px', borderBottom: '1px solid rgba(232, 230, 227, 0.1)' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(232, 230, 227, 0.4)' }} />
                            <input
                                placeholder="Search colleagues..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(232, 230, 227, 0.1)',
                                    background: 'rgba(0,0,0,0.2)',
                                    color: 'var(--cream)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
                        {loading ? (
                            <p style={{ color: 'rgba(232, 230, 227, 0.5)', fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>Loading contacts...</p>
                        ) : colleagues.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
                            <p style={{ color: 'rgba(232, 230, 227, 0.5)', fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>No colleagues found.</p>
                        ) : colleagues.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(c => (
                            <button
                                key={c.id}
                                onClick={() => setSelectedUser(c)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    marginBottom: '8px',
                                    background: selectedUser?.id === c.id ? 'rgba(176,141,87,0.1)' : 'transparent',
                                    borderLeft: selectedUser?.id === c.id ? '3px solid #b08d57' : '3px solid transparent',
                                    transition: 'all 0.2s',
                                    textAlign: 'left'
                                }}
                            >
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    background: selectedUser?.id === c.id ? '#b08d57' : 'rgba(255,255,255,0.05)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>
                                    <User size={18} color={selectedUser?.id === c.id ? '#000' : 'var(--cream)'} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '600', color: selectedUser?.id === c.id ? 'var(--gold)' : 'var(--cream)' }}>
                                        {c.name}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'rgba(232, 230, 227, 0.5)' }}>@{c.username}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </PortfolioCard>

                {/* Chat Area */}
                <PortfolioCard style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, overflow: 'hidden' }}>
                    {/* Chat Header */}
                    <div style={{
                        padding: '20px 25px',
                        borderBottom: '1px solid rgba(232, 230, 227, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MessageSquare size={20} color="#000" />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--cream)' }}>
                                    {selectedUser ? selectedUser.name : 'Select a conversation'}
                                </h3>
                                <span style={{ fontSize: '12px', color: selectedUser ? '#10b981' : 'rgba(232, 230, 227, 0.5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {selectedUser && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>}
                                    {selectedUser ? 'Online' : 'Encrypted End-to-End'}
                                </span>
                            </div>
                        </div>
                        {selectedUser && (
                            <button
                                onClick={() => fetchConversation(selectedUser.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(232, 230, 227, 0.4)', padding: '8px', transition: 'color 0.2s' }}
                                title="Refresh"
                            >
                                <RefreshCw size={18} />
                            </button>
                        )}
                    </div>

                    {/* Messages Body */}
                    <div style={{
                        flex: 1,
                        padding: '25px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        backgroundImage: 'radial-gradient(circle at center, rgba(176,141,87,0.03) 0%, transparent 70%)'
                    }}>
                        {!selectedUser ? (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
                                <MessageSquare size={64} color="var(--cream)" style={{ marginBottom: '20px' }} />
                                <p style={{ color: 'var(--cream)', fontSize: '16px', fontWeight: '300' }}>Select a colleague to start messaging</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                                <div style={{ fontSize: '14px', color: 'var(--gold)', letterSpacing: '1px' }}>START A CONVERSATION</div>
                            </div>
                        ) : messages.map(msg => (
                            <ChatBubble
                                key={msg.id}
                                sender={msg.sender_name}
                                text={msg.text}
                                time={new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                isMe={msg.sender === currentUserId}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    {selectedUser && (
                        <div style={{ padding: '25px', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(232, 230, 227, 0.1)' }}>
                            <div style={{ position: 'relative', display: 'flex', gap: '15px' }}>
                                <input
                                    placeholder={`Message ${selectedUser.name}...`}
                                    style={{
                                        flex: 1,
                                        padding: '15px 20px',
                                        borderRadius: '50px',
                                        border: '1px solid rgba(232, 230, 227, 0.1)',
                                        background: 'rgba(255,255,255,0.03)',
                                        color: 'var(--cream)',
                                        fontSize: '15px',
                                        outline: 'none',
                                        fontFamily: 'inherit'
                                    }}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <button
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        background: input.trim() ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: input.trim() ? 'pointer' : 'default',
                                        transition: 'all 0.2s',
                                        color: input.trim() ? '#000' : 'rgba(255,255,255,0.2)'
                                    }}
                                    onClick={sendMessage}
                                    disabled={!input.trim() || sending}
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </PortfolioCard>
            </div>
        </PortfolioPage>
    );
};

const ChatBubble = ({ sender, text, time, isMe }) => (
    <div style={{
        alignSelf: isMe ? 'flex-end' : 'flex-start',
        maxWidth: '65%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isMe ? 'flex-end' : 'flex-start'
    }}>
        {!isMe && <span style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '600', marginBottom: '6px', marginLeft: '12px' }}>{sender}</span>}
        <div style={{
            padding: '15px 20px',
            borderRadius: isMe ? '20px 20px 0 20px' : '20px 20px 20px 0',
            background: isMe ? 'var(--gold)' : 'rgba(255,255,255,0.05)',
            border: isMe ? 'none' : '1px solid rgba(232,230,227,0.1)',
            color: isMe ? '#000' : 'var(--cream)',
            fontSize: '15px',
            fontWeight: '400',
            lineHeight: '1.5',
            boxShadow: isMe ? '0 5px 15px rgba(176,141,87,0.2)' : 'none'
        }}>
            {text}
        </div>
        <span style={{
            fontSize: '10px',
            color: 'rgba(232, 230, 227, 0.4)',
            marginTop: '6px',
            marginRight: isMe ? '4px' : '0',
            marginLeft: isMe ? '0' : '4px'
        }}>
            {time}
        </span>
    </div>
);

export default Chat;
