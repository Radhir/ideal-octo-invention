import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import {
    Mail, MessageSquare, Instagram, Facebook,
    Trash2, UserPlus, Search, Filter,
    Zap, Sparkles, RefreshCw, X, Bell
} from 'lucide-react';

const MockInbox = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [customNumber, setCustomNumber] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [alertCount, setAlertCount] = useState(0);
    const pollRef = useRef(null);

    const channels = [
        { id: 'ALL', label: 'All Feeds', icon: MessageSquare, color: '#fff' },
        { id: 'WHATSAPP', label: 'WhatsApp', icon: MessageSquare, color: '#25D366' },
        { id: 'INSTAGRAM', label: 'Instagram', icon: Instagram, color: '#E1306C' },
        { id: 'FACEBOOK', label: 'Facebook', icon: Facebook, color: '#1877F2' },
        { id: 'GMAIL', label: 'Gmail', icon: Mail, color: '#EA4335' },
        { id: 'SENT', label: 'Automated Alerts', icon: Bell, color: '#F59E0B' }
    ];

    const mockContent = {
        WHATSAPP: [
            "Hi, what's the price for full body PPF on a Tesla Model 3?",
            "Can I book a ceramic coating for tomorrow?",
            "Is the window tinting legal in Dubai?",
            "Checking my car status"
        ],
        INSTAGRAM: [
            "Saw your reel! Stunning work on that G63. How much for the same setup?",
            "Do you guys do interior restoration?",
            "Sending a DM for price list",
            "Wow! Best shop in town."
        ],
        FACEBOOK: [
            "Interesting offer on the ceramic coating. Is it valid for SUVs?",
            "Where is your shop located exactly?",
            "Do you have any referral discounts?",
            "Interested in the detailing package."
        ],
        GMAIL: [
            "Inquiry regarding Fleet Detailing Services",
            "Quotation Request: Ceramic Coating for Porsche 911",
            "Partnership opportunity - Car Club DXB",
            "Resume for Detailing Specialist position"
        ]
    };

    const generateMockLead = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const channel = ['WHATSAPP', 'INSTAGRAM', 'FACEBOOK', 'GMAIL'][Math.floor(Math.random() * 4)];
            const names = ['Khalid', 'Sarah', 'Zayed', 'Elena', 'Michael', 'Noora'];
            const name = names[Math.floor(Math.random() * names.length)];
            const text = mockContent[channel][Math.floor(Math.random() * mockContent[channel].length)];

            const newMessage = {
                id: Date.now(),
                channel,
                sender: name,
                text,
                time: 'Just now',
                unread: true,
                phone: customNumber || `+971 5${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`
            };

            setMessages(prev => [newMessage, ...prev]);
            setIsGenerating(false);
        }, 800);
    };

    // Fetch Automated Notifications + Inbox Leads
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (filter === 'SENT' || filter === 'ALL') {
            fetchData();
            // Auto-poll every 15 seconds
            pollRef.current = setInterval(fetchData, 15000);
        }
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [filter]);

    const fetchData = async () => {
        try {
            const [notifRes, leadRes] = await Promise.all([
                api.get('/forms/notifications/api/logs/'),
                api.get('/forms/leads/api/list/inbox/') // Real Inbox Leads
            ]);

            const sentLogs = notifRes.data.map(log => ({
                id: `sent-${log.id}`,
                channel: 'SENT',
                sender: 'System Automation',
                text: log.message,
                subject: log.subject || '',
                notificationType: log.notification_type,
                time: new Date(log.sent_at).toLocaleTimeString(),
                unread: true,
                phone: `To: ${log.recipient}`,
                isLog: true
            }));

            const inboxLeads = leadRes.data.results ? leadRes.data.results : (Array.isArray(leadRes.data) ? leadRes.data : []);
            const mappedLeads = inboxLeads.map(l => ({
                id: l.id,
                channel: l.source,
                sender: l.customer_name,
                text: l.interested_service + (l.notes ? ` - ${l.notes}` : ''),
                time: new Date(l.created_at).toLocaleTimeString().substring(0, 5),
                unread: true,
                phone: l.phone,
                isLead: true
            }));

            // setAlertCount(sentLogs.length);

            // Merge: Real Inbox Leads + Sent Logs + (Existing mocks if you want, but better to clear mocks for real test)
            // For now, we prepend real leads to messages
            setMessages(prev => {
                // Keep mocks that are not real leads or logs
                const existingMocks = prev.filter(m => !m.isLead && !m.isLog);
                return [...mappedLeads, ...sentLogs, ...existingMocks];
            });
        } catch (err) {
            console.error("Failed to fetch inbox data", err);
        }
    };

    const convertToLead = async (msg) => {
        try {
            if (msg.isLead) {
                // It's a real lead in INBOX, just update status to NEW
                await api.patch(`/forms/leads/api/list/${msg.id}/`, { status: 'NEW' });
                alert(`Lead "${msg.sender}" moved to Sales Pipeline!`);
            } else {
                // It's a mock lead, create it
                const leadData = {
                    customer_name: msg.sender,
                    phone: msg.phone,
                    source: msg.channel === 'GMAIL' ? 'WEBSITE' : msg.channel,
                    interested_service: msg.text.substring(0, 50),
                    notes: `Converted from Mock Inbox. ${msg.text}`,
                    status: 'NEW',
                    priority: 'MEDIUM'
                };
                await api.post('/forms/leads/api/list/', leadData);
                alert(`Succesfully captured ${msg.sender} as a CRM Lead!`);
            }
            // Remove from inbox view locally
            setMessages(prev => prev.filter(m => m.id !== msg.id));
        } catch (err) {
            console.error(err);
            alert("Conversion failed.");
        }
    };

    const filteredMessages = messages.filter(m => {
        const matchesFilter = filter === 'ALL' || m.channel === filter;
        const matchesSearch = m.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.text.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.5s ease-out' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Lead Generation Testing</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>Ghost Inbox</h1>
                    <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '5px' }}>Simulate incoming customer traffic from social channels.</p>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800' }}>TEST NUMBER OVERRIDE</div>
                        <input
                            type="text"
                            placeholder="e.g. +971 50..."
                            value={customNumber}
                            onChange={(e) => setCustomNumber(e.target.value)}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(176, 141, 87, 0.3)',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                color: '#fff',
                                fontSize: '12px',
                                width: '180px'
                            }}
                        />
                    </div>
                    <button
                        onClick={generateMockLead}
                        style={{ ...actionButtonStyle, background: '#b08d57', color: '#000', border: 'none' }}
                        disabled={isGenerating}
                    >
                        {isGenerating ? <RefreshCw className="spin" size={18} /> : <Zap size={18} />}
                        {isGenerating ? 'Intercepting...' : 'Simulate Incoming Lead'}
                    </button>
                    <button
                        onClick={fetchNotifications}
                        style={{ ...actionButtonStyle, background: '#F59E0B', color: '#000', border: 'none' }}
                        title="Refresh Sent Logs"
                    >
                        <RefreshCw size={18} /> Sync Alerts
                    </button>
                    <button
                        onClick={() => setMessages([])}
                        style={actionButtonStyle}
                    >
                        <Trash2 size={18} /> Clear Inbox
                    </button>
                </div>
            </header >

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px', alignItems: 'start' }}>

                {/* SIDEBAR FILTERS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ marginBottom: '15px', position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={16} />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 10px 10px 35px', color: '#fff', fontSize: '13px' }}
                        />
                    </div>
                    {channels.map(ch => {
                        const Icon = ch.icon;
                        const active = filter === ch.id;
                        return (
                            <button
                                key={ch.id}
                                onClick={() => setFilter(ch.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px',
                                    borderRadius: '12px', border: active ? `1px solid ${ch.color}` : '1px solid transparent',
                                    background: active ? `${ch.color}15` : 'transparent',
                                    color: active ? ch.color : '#94a3b8',
                                    cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'left', fontWeight: '700', fontSize: '14px'
                                }}
                            >
                                <Icon size={18} /> {ch.label}
                                {ch.id === 'SENT' && alertCount > 0 && (
                                    <span style={{
                                        marginLeft: 'auto', background: '#F59E0B', color: '#000',
                                        fontSize: '11px', fontWeight: '900', borderRadius: '12px',
                                        padding: '2px 8px', minWidth: '20px', textAlign: 'center'
                                    }}>{alertCount}</span>
                                )}
                                {ch.id !== 'SENT' && active && <Sparkles size={12} style={{ marginLeft: 'auto' }} />}
                            </button>
                        );
                    })}
                </div>

                {/* MESSAGES LIST */}
                <GlassCard style={{ minHeight: '600px', padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>Live Stream - {filter}</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {filteredMessages.length === 0 ? (
                            <div style={{ padding: '100px', textAlign: 'center', color: '#64748b' }}>
                                <MessageSquare size={48} style={{ marginBottom: '20px', opacity: 0.2 }} />
                                <div style={{ fontSize: '18px', fontWeight: '700' }}>No incoming traffic</div>
                                <p style={{ fontSize: '13px' }}>Click "Simulate Incoming Lead" to test the system.</p>
                            </div>
                        ) : filteredMessages.map(msg => {
                            const chan = channels.find(c => c.id === msg.channel);
                            const Icon = chan.icon;
                            const isSent = msg.channel === 'SENT';
                            return (
                                <div key={msg.id} style={messageRowStyle}>
                                    <div style={{ ...iconWrapperStyle, background: `${chan.color}15`, color: chan.color }}>
                                        <Icon size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontWeight: '900', color: '#fff' }}>{msg.sender}</span>
                                                {isSent && msg.notificationType && (
                                                    <span style={{
                                                        fontSize: '9px', fontWeight: '800', padding: '2px 8px',
                                                        borderRadius: '6px', textTransform: 'uppercase',
                                                        background: msg.notificationType === 'WHATSAPP' ? 'rgba(37, 211, 102, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                                                        color: msg.notificationType === 'WHATSAPP' ? '#25D366' : '#3b82f6'
                                                    }}>
                                                        {msg.notificationType}
                                                    </span>
                                                )}
                                            </div>
                                            <span style={{ fontSize: '10px', color: '#64748b' }}>{msg.time}</span>
                                        </div>
                                        {isSent && msg.subject && (
                                            <div style={{ fontSize: '12px', color: '#b08d57', fontWeight: '700', marginBottom: '4px' }}>{msg.subject}</div>
                                        )}
                                        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.4' }}>{msg.text}</p>
                                        <div style={{ fontSize: '11px', color: '#b08d57', marginTop: '5px', fontWeight: '700' }}>{msg.phone}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {!isSent && (
                                            <button
                                                onClick={() => convertToLead(msg)}
                                                style={{ ...toolBtnStyle, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}
                                                title="Convert to CRM Lead"
                                            >
                                                <UserPlus size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setMessages(prev => prev.filter(m => m.id !== msg.id))}
                                            style={{ ...toolBtnStyle, background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }}
                                            title="Dismiss"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </GlassCard>
            </div>

            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div >
    );
};

const actionButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 25px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '900',
    cursor: 'pointer',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    transition: 'all 0.2s ease'
};

const messageRowStyle = {
    display: 'flex',
    gap: '20px',
    padding: '25px',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    alignItems: 'start',
    transition: 'background 0.2s ease',
    cursor: 'default',
    '&:hover': {
        background: 'rgba(255,255,255,0.02)'
    }
};

const iconWrapperStyle = {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
};

const toolBtnStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.1s ease',
    '&:active': { transform: 'scale(0.95)' }
};

export default MockInbox;
