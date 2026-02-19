import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../api/axios';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioButton,
    PortfolioGrid,
    PortfolioSectionTitle
} from '../../components/PortfolioComponents';
import {
    Mail, MessageSquare, Instagram, Facebook,
    Trash2, UserPlus, Search,
    Zap, Sparkles, RefreshCw, X, Bell
} from 'lucide-react';

const MockInbox = () => {
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
        { id: 'SENT', label: 'Automated Alerts', icon: Bell, color: 'var(--gold)' }
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

    const fetchData = useCallback(async () => {
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

            setAlertCount(sentLogs.filter(l => l.unread).length);

            setMessages(prev => {
                const existingMocks = prev.filter(m => !m.isLead && !m.isLog);
                return [...mappedLeads, ...sentLogs, ...existingMocks];
            });
        } catch (err) {
            console.error("Failed to fetch inbox data", err);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (filter === 'SENT' || filter === 'ALL') {
            fetchData();
            pollRef.current = setInterval(fetchData, 15000);
        }
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [filter, fetchData]);

    const convertToLead = async (msg) => {
        try {
            if (msg.isLead) {
                await api.patch(`/forms/leads/api/list/${msg.id}/`, { status: 'NEW' });
                alert(`Lead "${msg.sender}" moved to Sales Pipeline!`);
            } else {
                const leadData = {
                    customer_name: msg.sender,
                    phone: msg.phone,
                    source: msg.channel === 'GMAIL' ? 'WEBSITE' : msg.channel,
                    interested_service: msg.text.substring(0, 50),
                    notes: `Converted from Ghost Inbox. ${msg.text}`,
                    status: 'NEW',
                    priority: 'MEDIUM'
                };
                await api.post('/forms/leads/api/list/', leadData);
                alert(`Succesfully captured ${msg.sender} as a CRM Lead!`);
            }
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
        <PortfolioPage breadcrumb="CRM / Simulation / Ghost Inbox">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
                <PortfolioTitle subtitle="Synthetic traffic stream for testing lead capture and automation routings.">
                    Ghost Inbox
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton onClick={() => setMessages([])} variant="secondary">
                        <Trash2 size={18} style={{ marginRight: '10px' }} /> PURGE INBOX
                    </PortfolioButton>
                    <PortfolioButton onClick={generateMockLead} variant="primary" disabled={isGenerating}>
                        {isGenerating ? <RefreshCw className="spin" size={18} /> : <Zap size={18} style={{ marginRight: '10px' }} />}
                        {isGenerating ? 'INTERCEPTING...' : 'SIMULATE LEAD'}
                    </PortfolioButton>
                </div>
            </div>

            <PortfolioGrid columns="280px 1fr" gap="40px">
                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ position: 'relative', marginBottom: '10px' }}>
                        <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(232, 230, 227, 0.2)' }} size={16} />
                        <input
                            type="text"
                            placeholder="Filter stream..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'rgba(232, 230, 227, 0.02)',
                                border: '1px solid rgba(232, 230, 227, 0.05)',
                                borderRadius: '12px',
                                padding: '12px 15px 12px 45px',
                                color: 'var(--cream)',
                                fontSize: '13px'
                            }}
                        />
                    </div>

                    <PortfolioSectionTitle style={{ fontSize: '10px', marginTop: '20px' }}>CHANNELS</PortfolioSectionTitle>
                    {channels.map(ch => {
                        const Icon = ch.icon;
                        const active = filter === ch.id;
                        return (
                            <button
                                key={ch.id}
                                onClick={() => setFilter(ch.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 20px',
                                    borderRadius: '14px', border: active ? `1px solid ${ch.color}40` : '1px solid transparent',
                                    background: active ? `${ch.color}05` : 'transparent',
                                    color: active ? ch.color : 'rgba(232, 230, 227, 0.4)',
                                    cursor: 'pointer', transition: 'all 0.3s ease', textAlign: 'left', fontWeight: '800', fontSize: '12px',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                <Icon size={18} /> {ch.label.toUpperCase()}
                                {ch.id === 'SENT' && alertCount > 0 && (
                                    <span style={{
                                        marginLeft: 'auto', background: 'var(--gold)', color: '#000',
                                        fontSize: '10px', fontWeight: '900', borderRadius: '12px',
                                        padding: '2px 8px'
                                    }}>{alertCount}</span>
                                )}
                                {active && <Sparkles size={12} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
                            </button>
                        );
                    })}
                </div>

                {/* Main Content */}
                <PortfolioCard style={{ minHeight: '650px', padding: 0 }}>
                    <div style={{ padding: '30px', borderBottom: '1px solid rgba(232, 230, 227, 0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px' }}>
                            LIVE TELEMETRY // {filter}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ fontSize: '10px', color: 'rgba(232, 230, 227, 0.3)', fontWeight: '800' }}>OVERRIDE NUMBER:</div>
                            <input
                                type="text"
                                value={customNumber}
                                onChange={(e) => setCustomNumber(e.target.value)}
                                placeholder="+971..."
                                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(176,141,87,0.2)', color: 'var(--gold)', fontSize: '11px', width: '120px', fontWeight: '700', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {filteredMessages.length === 0 ? (
                            <div style={{ padding: '150px 0', textAlign: 'center', color: 'rgba(232, 230, 227, 0.1)' }}>
                                <MessageSquare size={80} strokeWidth={1} style={{ marginBottom: '30px', opacity: 0.3 }} />
                                <div style={{ fontSize: '24px', fontFamily: 'var(--font-serif)', marginBottom: '10px' }}>Zero-Traffic State</div>
                                <p style={{ fontSize: '14px', letterSpacing: '1px' }}>USE SIMULATION TRIGGER TO INJECT ARTIFICIAL LEADS</p>
                            </div>
                        ) : filteredMessages.map(msg => {
                            const chan = channels.find(c => c.id === msg.channel);
                            const Icon = chan.icon;
                            const isSent = msg.channel === 'SENT';
                            return (
                                <div key={msg.id} style={{
                                    display: 'flex', gap: '25px', padding: '35px',
                                    borderBottom: '1px solid rgba(232, 230, 227, 0.03)',
                                    alignItems: 'start', transition: 'background 0.3s ease'
                                }} className="message-row">
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '50%',
                                        background: `${chan.color}08`, color: chan.color,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0, border: `1px solid ${chan.color}15`
                                    }}>
                                        <Icon size={22} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{ fontWeight: '800', color: 'var(--cream)', fontSize: '15px' }}>{msg.sender}</span>
                                                {isSent && msg.notificationType && (
                                                    <span style={{
                                                        fontSize: '9px', fontWeight: '900', padding: '3px 10px',
                                                        borderRadius: '30px', textTransform: 'uppercase',
                                                        background: 'rgba(232, 230, 227, 0.05)',
                                                        color: 'var(--gold)', border: '1px solid rgba(176, 141, 87, 0.2)'
                                                    }}>
                                                        {msg.notificationType}
                                                    </span>
                                                )}
                                            </div>
                                            <span style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.3)', fontWeight: '700' }}>{msg.time}</span>
                                        </div>
                                        {isSent && msg.subject && (
                                            <div style={{ fontSize: '13px', color: 'var(--gold)', fontWeight: '700', marginBottom: '5px' }}>{msg.subject}</div>
                                        )}
                                        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(232, 230, 227, 0.6)', lineHeight: '1.6', fontFamily: 'var(--font-serif)' }}>{msg.text}</p>
                                        <div style={{ fontSize: '11px', color: 'var(--gold)', marginTop: '12px', fontWeight: '800', letterSpacing: '0.5px' }}>{msg.phone}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        {!isSent && (
                                            <button
                                                onClick={() => convertToLead(msg)}
                                                style={toolBtnStyle}
                                                className="btn-convert"
                                                title="Ingest as Lead"
                                            >
                                                <UserPlus size={18} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setMessages(prev => prev.filter(m => m.id !== msg.id))}
                                            style={toolBtnStyle}
                                            className="btn-dismiss"
                                            title="Purge Entry"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </PortfolioCard>
            </PortfolioGrid>


        </PortfolioPage>
    );
};

const toolBtnStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
};

export default MockInbox;
