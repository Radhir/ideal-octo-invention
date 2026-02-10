import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { Plus, Search, User, Zap, Mail, Phone, Printer, Target, Calendar, Award, AlertCircle } from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';

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

        // Handle direct print request from Reports Dashboard
        const params = new URLSearchParams(window.location.search);
        if (params.get('print_confirm') === 'true') {
            setTimeout(() => {
                if (window.confirm("Perform bulk print of current CRMOpportunities?")) {
                    window.print();
                }
            }, 1500);
        }
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await api.get('/forms/leads/api/list/');
            // Handle both array and paginated response
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
            // Handle both array and paginated response
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
            const msg = err.response?.data?.detail || 'Failed to transfer lead. Check permissions.';
            alert(msg);
        }
    };

    const filteredLeads = leads.filter(l =>
        l.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.interested_service.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'HOT': return { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)', label: 'Hot Opportunity', pulse: true };
            case 'HIGH': return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', label: 'High Priority' };
            case 'MEDIUM': return { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', label: 'Standard' };
            default: return { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', label: 'Low' };
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'CONVERTED': return { color: '#10b981', label: 'Converted' };
            case 'QUOTED': return { color: '#8400ff', label: 'Quote Sent' };
            case 'NEGOTIATION': return { color: '#b08d57', label: 'In Negotiation' };
            default: return { color: '#3b82f6', label: 'New Lead' };
        }
    };

    return (
        <div style={{ padding: '30px 20px', animation: 'fadeIn 0.5s ease-out' }}>
            <PrintHeader title="CRM Leads Registry" />
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Sales Pipeline</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>Opportunities</h1>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <Link to="/leads/inbox" className="glass-card" style={{ ...actionButtonStyle, textDecoration: 'none', border: '1px solid #b08d57' }}>
                        <Mail size={18} color="#b08d57" /> Ghost Inbox
                    </Link>
                    <button onClick={() => window.print()} className="glass-card" style={actionButtonStyle}>
                        <Printer size={18} /> Print
                    </button>
                    <Link to="/leads/create" className="btn-primary" style={{ ...actionButtonStyle, textDecoration: 'none', background: '#b08d57' }}>
                        <Plus size={18} /> New Lead
                    </Link>
                </div>
            </header>

            <div style={{ marginBottom: '30px', position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#b08d57' }} size={20} />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search leads, services, or representatives..."
                    style={{ padding: '18px 20px 18px 55px', fontSize: '16px', borderRadius: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '100%' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <GlassCard style={{ padding: '0', overflow: 'hidden', borderRadius: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(176, 141, 87, 0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={thStyle}>Opportunity / Contact</th>
                            <th style={thStyle}>Sales Interest</th>
                            <th style={thStyle}>Priority</th>
                            <th style={thStyle}>Est. Value</th>
                            <th style={thStyle}>Assigned To</th>
                            <th style={thStyle}>Status</th>
                            <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ padding: '100px', textAlign: 'center', color: '#94a3b8' }}>Synthesizing Sales Data...</td></tr>
                        ) : filteredLeads.length === 0 ? (
                            <tr><td colSpan="7" style={{ padding: '100px', textAlign: 'center', color: '#94a3b8' }}>No leads found.</td></tr>
                        ) : filteredLeads.map((l) => {
                            const pStyle = getPriorityStyle(l.priority);
                            const sStyle = getStatusStyle(l.status);
                            return (
                                <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.3s' }}>
                                    <td style={{ padding: '25px 20px' }}>
                                        <div style={{ fontWeight: '900', fontSize: '16px', color: '#fff', marginBottom: '4px' }}>{l.customer_name}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#94a3b8' }}>
                                            <Phone size={12} /> {l.phone}
                                        </div>
                                    </td>
                                    <td style={{ padding: '25px 20px' }}>
                                        <div style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>{l.interested_service}</div>
                                        <div style={{ fontSize: '11px', color: '#b08d57', textTransform: 'uppercase', fontWeight: '800' }}>{l.source}</div>
                                    </td>
                                    <td style={{ padding: '25px 20px' }}>
                                        <span style={{
                                            background: pStyle.bg, color: pStyle.color,
                                            padding: '6px 12px', borderRadius: '8px',
                                            fontSize: '10px', fontWeight: '900', textTransform: 'uppercase',
                                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                                            animation: pStyle.pulse ? 'pulseGlow 2s infinite' : 'none'
                                        }}>
                                            {pStyle.pulse && <Zap size={10} fill={pStyle.color} />} {pStyle.label}
                                        </span>
                                    </td>
                                    <td style={{ padding: '25px 20px', fontWeight: '900', color: '#fff', fontSize: '15px' }}>
                                        AED {parseFloat(l.estimated_value).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '25px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={14} color="#b08d57" />
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#fff' }}>{l.assigned_to_name || 'Unassigned'}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '25px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: sStyle.color }}></div>
                                            <span style={{ fontSize: '13px', color: '#fff', fontWeight: '600' }}>{sStyle.label}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '25px 20px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                            <button
                                                onClick={() => setTransferModal({ open: true, lead: l })}
                                                style={{
                                                    background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6',
                                                    border: '1px solid rgba(59, 130, 246, 0.3)', padding: '10px',
                                                    borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center'
                                                }}
                                                title="Transfer Lead"
                                            >
                                                <User size={16} />
                                            </button>
                                            <button
                                                onClick={() => navigate('/bookings/create', { state: { lead: l } })}
                                                style={{
                                                    background: 'rgba(176, 141, 87, 0.1)', color: '#b08d57',
                                                    border: '1px solid rgba(176, 141, 87, 0.3)', padding: '10px 18px',
                                                    borderRadius: '10px', fontSize: '11px', fontWeight: '900',
                                                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px'
                                                }}
                                            >
                                                <Target size={14} /> BOOK
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </GlassCard>

            {/* Transfer Modal */}
            {transferModal.open && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
                }}>
                    <GlassCard style={{ padding: '30px', width: '400px', border: '1px solid #b08d57' }}>
                        <h3 style={{ color: '#fff', margin: '0 0 20px 0' }}>Transfer Lead</h3>
                        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
                            Assign <strong>{transferModal.lead.customer_name}</strong> to a new sales representative.
                        </p>
                        <select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            style={{
                                width: '100%', padding: '12px', borderRadius: '10px',
                                background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
                                color: '#fff', marginBottom: '20px', outline: 'none'
                            }}
                        >
                            <option value="">Select Representative...</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.username}</option>
                            ))}
                        </select>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                onClick={() => setTransferModal({ open: false, lead: null })}
                                style={{
                                    padding: '10px 20px', borderRadius: '8px',
                                    background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                                    color: '#fff', cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleTransfer}
                                style={{
                                    padding: '10px 20px', borderRadius: '8px',
                                    background: '#b08d57', border: 'none',
                                    color: '#fff', fontWeight: 'bold', cursor: 'pointer'
                                }}
                            >
                                Transfer
                            </button>
                        </div>
                    </GlassCard>
                </div>
            )}

            <style>{`
                @keyframes pulseGlow {
                    0% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(244, 63, 94, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
                }
            `}</style>
        </div>
    );
};

const thStyle = {
    padding: '20px',
    textAlign: 'left',
    fontSize: '11px',
    textTransform: 'uppercase',
    color: '#b08d57',
    fontWeight: '900',
    letterSpacing: '1px'
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
    color: '#fff'
};

export default LeadList;
