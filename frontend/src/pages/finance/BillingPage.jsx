import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioStats,
    PortfolioButton,
    PortfolioCard,
    PortfolioInput
} from '../../components/PortfolioComponents';
import {
    FileText, Plus, CheckCircle, Clock,
    AlertTriangle, Receipt, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BillingPage = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBilling = useCallback(async () => {
        try {
            const res = await api.get('/forms/invoices/api/list/');
            const data = Array.isArray(res.data) ? res.data : res.data.results || [];
            setInvoices(data);
        } catch (err) {
            console.error('Billing data fetch failed', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBilling();
    }, [fetchBilling]);

    const totalBilled = invoices.reduce((s, i) => s + (parseFloat(i.grand_total) || 0), 0);
    const paidInvoices = invoices.filter(i => i.payment_status === 'PAID');
    const pendingInvoices = invoices.filter(i => i.payment_status === 'PENDING' || i.payment_status === 'PARTIAL');
    const overdueInvoices = invoices.filter(i => i.payment_status === 'OVERDUE');
    const totalCollected = paidInvoices.reduce((s, i) => s + (parseFloat(i.grand_total) || 0), 0);
    const totalPending = pendingInvoices.reduce((s, i) => s + (parseFloat(i.grand_total) || 0), 0);

    const filteredInvoices = invoices.filter(inv => {
        const matchTab = tab === 'ALL'
            || (tab === 'PAID' && inv.payment_status === 'PAID')
            || (tab === 'PENDING' && (inv.payment_status === 'PENDING' || inv.payment_status === 'PARTIAL'))
            || (tab === 'OVERDUE' && inv.payment_status === 'OVERDUE');
        const matchSearch = !searchTerm
            || (inv.invoice_number || '').toLowerCase().includes(searchTerm.toLowerCase())
            || (inv.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchTab && matchSearch;
    });

    const getStatusBadge = (status) => {
        const map = {
            PAID: { color: '#10b981', border: '#10b981', label: 'Settled' },
            PENDING: { color: '#f59e0b', border: '#f59e0b', label: 'Pending' },
            PARTIAL: { color: '#3b82f6', border: '#3b82f6', label: 'Partial' },
            OVERDUE: { color: '#ef4444', border: '#ef4444', label: 'Overdue' },
        };
        const s = map[status] || map.PENDING;
        return (
            <span style={{
                padding: '8px 16px',
                borderRadius: '30px',
                fontSize: '10px',
                fontWeight: '700',
                color: s.color,
                border: `1px solid ${s.border}`,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                background: `${s.color}10`
            }}>
                {s.label}
            </span>
        );
    };

    if (loading) return <div style={{ color: 'var(--cream)', padding: '80px', textAlign: 'center', opacity: 0.5 }}>Loading Cashier Console...</div>;

    const stats = [
        { label: 'Total Billed', value: `AED ${totalBilled.toLocaleString()}`, color: '#8b5cf6' },
        { label: 'Collected Revenue', value: `AED ${totalCollected.toLocaleString()}`, color: '#10b981' },
        { label: 'Outstanding', value: `AED ${totalPending.toLocaleString()}`, color: '#f59e0b' },
        { label: 'Overdue Folios', value: overdueInvoices.length, color: '#ef4444' }
    ];

    return (
        <PortfolioPage breadcrumb="Finance / Cashier / Billing">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <PortfolioTitle subtitle="Invoicing operations, revenue collection, and fiscal settlement management.">
                    Billing & Cashier
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton variant="secondary" onClick={() => navigate('/invoices')}>
                        <FileText size={18} /> All Invoices
                    </PortfolioButton>
                    <PortfolioButton variant="gold" onClick={() => navigate('/finance/transaction')}>
                        <Plus size={18} /> Record Payment
                    </PortfolioButton>
                </div>
            </div>

            <PortfolioStats stats={stats} />

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 3fr', gap: '40px', marginTop: '40px' }}>
                {/* Filters Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <PortfolioCard background="rgba(10, 10, 12, 0.4)" borderColor="var(--gold)">
                        <h3 style={{ margin: '0 0 25px 0', fontSize: '12px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>Cashier Controls</h3>

                        <PortfolioInput
                            label="SEARCH RECORD"
                            placeholder="Invoice ID . . ."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ background: 'rgba(250, 249, 246, 0.05)', border: '1px solid rgba(250, 249, 246, 0.1)', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '30px' }}>
                            <label style={{ color: 'rgba(176, 141, 87, 0.6)', fontSize: '10px', letterSpacing: '2px', fontWeight: '700', textTransform: 'uppercase' }}>STATUS FILTER</label>
                            {['ALL', 'PAID', 'PENDING', 'OVERDUE'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    style={{
                                        padding: '16px 20px',
                                        background: tab === t ? 'linear-gradient(90deg, rgba(176, 141, 87, 0.2) 0%, rgba(176, 141, 87, 0.0) 100%)' : 'transparent',
                                        borderLeft: tab === t ? '2px solid var(--gold)' : '2px solid transparent',
                                        borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                                        color: tab === t ? 'var(--gold)' : 'rgba(250, 249, 246, 0.4)',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        fontSize: '11px',
                                        fontWeight: '800',
                                        letterSpacing: '2px',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <span>{t === 'ALL' ? 'GLOBAL REGISTRY' : t}</span>
                                    {tab === t && <CheckCircle size={14} color="var(--gold)" />}
                                </button>
                            ))}
                        </div>
                    </PortfolioCard>
                </div>

                {/* Invoices Table */}
                <div style={{
                    background: 'rgba(10, 10, 12, 0.4)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(250, 249, 246, 0.05)',
                    overflow: 'hidden',
                    paddingBottom: '20px'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
                        <thead>
                            <tr style={{ background: 'rgba(250, 249, 246, 0.03)' }}>
                                <th style={thStyle}>Identity</th>
                                <th style={thStyle}>Client Narrative</th>
                                <th style={thStyle}>Date Issued</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>Fiscal Value</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Status</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>Method</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.length > 0 ? filteredInvoices.map((inv, i) => (
                                <tr key={inv.id || i} style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => navigate(`/invoices/${inv.id}`)}
                                    className="invoice-row"
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(250, 249, 246, 0.02)';
                                        e.currentTarget.querySelector('.invoice-id').style.color = 'var(--cream)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.querySelector('.invoice-id').style.color = 'var(--gold)';
                                    }}
                                >
                                    <td style={{ ...tdStyle, color: 'var(--gold)', fontWeight: '800', letterSpacing: '1px' }} className="invoice-id">
                                        #{inv.invoice_number || inv.id}
                                    </td>
                                    <td style={{ ...tdStyle, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '12px' }}>{inv.customer_name || '-'}</td>
                                    <td style={{ ...tdStyle, opacity: 0.5, fontSize: '12px' }}>{inv.date || inv.created_at?.split('T')[0] || '-'}</td>
                                    <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--cream)' }}>
                                        {parseFloat(inv.grand_total || 0).toLocaleString()} <span style={{ fontSize: '10px', color: 'var(--gold)', verticalAlign: 'middle' }}>AED</span>
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>{getStatusBadge(inv.payment_status)}</td>
                                    <td style={{ ...tdStyle, textAlign: 'right', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '2px', opacity: 0.5, fontWeight: '700' }}>{inv.payment_method || 'CASH'}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" style={{ padding: '80px', textAlign: 'center', color: 'rgba(250, 249, 246, 0.2)', letterSpacing: '2px', fontSize: '10px', fontWeight: '800' }}>
                                        NO FISCAL RECORDS LOCATED
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </PortfolioPage>
    );
};

const thStyle = {
    padding: '25px 30px',
    textAlign: 'left',
    fontSize: '10px',
    fontWeight: '800',
    color: 'rgba(176, 141, 87, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    borderBottom: '1px solid rgba(250, 249, 246, 0.05)'
};

const tdStyle = {
    padding: '25px 30px',
    fontSize: '14px',
    color: 'rgba(250, 249, 246, 0.8)',
    fontWeight: '500',
    borderBottom: '1px solid rgba(250, 249, 246, 0.02)'
};

export default BillingPage;
