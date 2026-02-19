import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioButton,
    PortfolioGrid,
    PortfolioStats,
    PortfolioSectionTitle
} from '../../components/PortfolioComponents';
import {
    Plus, Search, User, Mail, Phone, Printer, Target,
    ArrowRightCircle, Flame, Clock, Calendar, TrendingUp,
    MessageSquare
} from 'lucide-react';

const LeadList = () => {
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [transferModal, setTransferModal] = useState({ open: false, lead: null });
    const [selectedUser, setSelectedUser] = useState('');

    useEffect(() => {
        fetchLeads();
        fetchUsers();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await api.get('/forms/leads/api/list/');
            const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
            setLeads(data);
        } catch (err) {
            console.error('Error fetching leads', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/api/auth/users/');
            const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
            setUsers(data);
        } catch (err) {
            console.error('Error fetching users', err);
        }
    };

    const handleTransfer = async () => {
        if (!selectedUser) return;
        try {
            await api.patch(`/forms/leads/api/list/${transferModal.lead.id}/`, {
                assigned_to: selectedUser
            });
            alert('Lead transferred successfully');
            setTransferModal({ open: false, lead: null });
            setSelectedUser('');
            fetchLeads();
        } catch (err) {
            console.error('Error transferring lead', err);
            const msg = err.response?.data?.detail || 'Failed to transfer lead.';
            alert(msg);
        }
    };

    const filteredLeads = leads.filter(l =>
        l.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.interested_service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = [
        { label: 'Active Opportunities', value: leads.length, subvalue: 'PIPELINE VOLUME', icon: Target, color: 'var(--gold)' },
        { label: 'Pipeline Value', value: `AED ${leads.reduce((sum, l) => sum + parseFloat(l.estimated_value || 0), 0).toLocaleString()}`, subvalue: 'CUMULATIVE ESTIMATE', icon: TrendingUp, color: '#10b981' },
        { label: 'Hot Leads', value: leads.filter(l => l.priority === 'HOT').length, subvalue: 'IMMEDIATE FOCUS', icon: Flame, color: '#f43f5e' },
        { label: 'Ghost Inbox', value: '4 NEW', subvalue: 'LIVE TRAFFIC', icon: MessageSquare, color: '#3b82f6' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'CONVERTED': return '#10b981';
            case 'LOST': return '#ef4444';
            case 'QUOTED':
            case 'NEGOTIATION': return '#f59e0b';
            default: return '#3b82f6';
        }
    };

    return (
        <PortfolioPage breadcrumb="CRM / Growth / Lead Registry">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="A strategic overview of incoming opportunities and sales trajectory.">
                    Opportunities Board
                </PortfolioTitle>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton onClick={() => navigate('/leads/inbox')} variant="secondary">
                        <Mail size={18} style={{ marginRight: '10px' }} /> GHOST INBOX
                    </PortfolioButton>
                    <PortfolioButton onClick={() => navigate('/leads/create')} variant="primary">
                        <Plus size={18} style={{ marginRight: '10px' }} /> NEW PROSPECT
                    </PortfolioButton>
                </div>
            </div>

            <PortfolioStats stats={stats} />

            <div style={{ marginBottom: '60px', position: 'relative', width: '100%' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '10px 25px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Search color="var(--gold)" size={20} opacity={0.5} />
                    <input
                        type="text"
                        placeholder="Search pipeline vectors (Client, Service, Status)..."
                        style={{
                            padding: '15px 0',
                            fontSize: '15px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--cream)',
                            width: '100%',
                            outline: 'none',
                            letterSpacing: '0.5px',
                            fontWeight: '300'
                        }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px', opacity: 0.4 }}>SEARCH.engine</div>
                </div>
            </div>

            <PortfolioSectionTitle>Live Opportunities</PortfolioSectionTitle>

            <PortfolioGrid columns="repeat(auto-fill, minmax(420px, 1fr))">
                {loading ? (
                    <div style={{ gridColumn: '1/-1', padding: '150px', textAlign: 'center' }}>
                        <div className="portfolio-spinner" style={{ margin: '0 auto 25px' }} />
                        <div style={{ color: 'var(--gold)', letterSpacing: '3px', fontWeight: '900', fontSize: '11px' }}>SYNCHRONIZING REPOSITORY...</div>
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', padding: '150px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.15)', fontFamily: 'var(--font-serif)', fontSize: '28px' }}>
                        No opportunities detected in current filter.
                    </div>
                ) : filteredLeads.map((lead) => (
                    <PortfolioCard key={lead.id} style={{ padding: '40px', position: 'relative', background: 'rgba(0,0,0,0.3)' }}>
                        <div className="telemetry-grid" style={{ zIndex: 0, opacity: 0.05 }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                                <div style={{
                                    padding: '6px 16px', borderRadius: '30px',
                                    background: 'rgba(176, 141, 87, 0.08)', border: '1px solid rgba(176, 141, 87, 0.15)',
                                    color: 'var(--gold)', fontSize: '9px', fontWeight: '900', letterSpacing: '2px'
                                }}>
                                    {lead.source?.toUpperCase() || 'UNKNOWN'}
                                </div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    {lead.priority === 'HOT' && <Flame size={16} color="#f43f5e" className="pulse" />}
                                    <span style={{
                                        fontSize: '9px', fontWeight: '900', padding: '5px 15px', borderRadius: '30px',
                                        background: `${getStatusColor(lead.status)}15`,
                                        color: getStatusColor(lead.status),
                                        border: `1px solid ${getStatusColor(lead.status)}30`,
                                        letterSpacing: '1px'
                                    }}>
                                        {lead.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            <div style={{ marginBottom: '35px' }}>
                                <h3 style={{ fontSize: '28px', fontWeight: '300', color: 'var(--cream)', margin: '0 0 8px 0', fontFamily: 'var(--font-serif)' }}>
                                    {lead.customer_name}
                                </h3>
                                <div style={{ fontSize: '15px', color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontWeight: '300', opacity: 0.7 }}>
                                    {lead.interested_service}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px', padding: '25px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div>
                                    <div style={{ fontSize: '8px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '8px', opacity: 0.5 }}>OPERATIVE</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--cream)', fontSize: '14px', fontWeight: '300' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(176,141,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={12} color="var(--gold)" />
                                        </div>
                                        {lead.assigned_to?.toUpperCase() || 'UNASSIGNED'}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '8px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '8px', opacity: 0.5 }}>VALUATION</div>
                                    <div style={{ fontSize: '20px', fontWeight: '300', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>
                                        <span style={{ fontSize: '12px', verticalAlign: 'middle', marginRight: '5px', opacity: 0.5 }}>AED</span>
                                        {parseFloat(lead.estimated_value || 0).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '20px' }}>
                                <PortfolioButton
                                    variant="glass"
                                    style={{ flex: 1, fontSize: '10px' }}
                                    onClick={() => setTransferModal({ open: true, lead: lead })}
                                >
                                    REASSIGN
                                </PortfolioButton>
                                <PortfolioButton
                                    variant="gold"
                                    style={{ flex: 1, fontSize: '10px' }}
                                    onClick={() => navigate(`/leads/${lead.id}`)}
                                >
                                    PIPELINE.details <ArrowRightCircle size={14} style={{ marginLeft: '10px' }} />
                                </PortfolioButton>
                            </div>
                        </div>
                    </PortfolioCard>
                ))}
            </PortfolioGrid>

            {/* Transfer Modal */}
            {transferModal.open && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <PortfolioCard style={{ width: '450px', padding: '40px', border: '1px solid var(--gold)' }}>
                        <PortfolioSectionTitle style={{ marginBottom: '15px' }}>Transfer Opportunity</PortfolioSectionTitle>
                        <p style={{ color: 'rgba(232, 230, 227, 0.5)', fontSize: '14px', marginBottom: '30px', lineHeight: '1.6' }}>
                            Reassigning <strong>{transferModal.lead.customer_name}</strong> to a new representative will synchronize all CRM notifications.
                        </p>

                        <div style={{ marginBottom: '40px' }}>
                            <label style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', display: 'block', marginBottom: '12px' }}>SELECT NEW OPERATIVE</label>
                            <select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'rgba(232, 230, 227, 0.02)',
                                    border: '1px solid rgba(232, 230, 227, 0.1)',
                                    borderRadius: '12px',
                                    padding: '15px',
                                    color: 'var(--cream)',
                                    outline: 'none',
                                    fontSize: '14px'
                                }}
                            >
                                <option value="">Select individual...</option>
                                {users.map(u => <option key={u.id} value={u.username}>{u.username}</option>)}
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <PortfolioButton onClick={() => setTransferModal({ open: false, lead: null })} variant="secondary" style={{ flex: 1 }}>CANCEL</PortfolioButton>
                            <PortfolioButton onClick={handleTransfer} variant="primary" style={{ flex: 1 }}>CONFIRM TRANSFER</PortfolioButton>
                        </div>
                    </PortfolioCard>
                </div>
            )}
        </PortfolioPage>
    );
};

export default LeadList;
