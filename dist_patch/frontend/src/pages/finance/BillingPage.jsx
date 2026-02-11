import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import {
    CreditCard, DollarSign, Receipt, CheckCircle,
    Clock, AlertTriangle, Search, Download,
    ArrowUpRight, ArrowDownRight, FileText, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BillingPage = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBilling();
    }, []);

    const fetchBilling = async () => {
        try {
            const res = await api.get('/forms/invoices/api/list/');
            const data = Array.isArray(res.data) ? res.data : res.data.results || [];
            setInvoices(data);
        } catch (err) {
            console.error('Billing data fetch failed', err);
        } finally {
            setLoading(false);
        }
    };

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
            PAID: { bg: '#10b98115', color: '#10b981', border: '#10b98160', label: 'Paid' },
            PENDING: { bg: '#f59e0b15', color: '#f59e0b', border: '#f59e0b60', label: 'Pending' },
            PARTIAL: { bg: '#3b82f615', color: '#3b82f6', border: '#3b82f660', label: 'Partial' },
            OVERDUE: { bg: '#ef444415', color: '#ef4444', border: '#ef444460', label: 'Overdue' },
        };
        const s = map[status] || map.PENDING;
        return (
            <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '900', background: s.bg, color: s.color, border: `1.5px solid ${s.border}`, textTransform: 'uppercase' }}>
                {s.label}
            </span>
        );
    };

    if (loading) return <div style={{ color: '#fff', padding: '40px' }}>Loading Billing Console...</div>;

    return (
        <div style={{ padding: '30px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px' }}>CASHIER OPERATIONS</div>
                    <h1 style={{ margin: '5px 0 0 0', fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>Billing & Cashier</h1>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => navigate('/invoices')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1.5px solid var(--gold-border)' }}>
                        <FileText size={16} /> All Invoices
                    </button>
                    <button onClick={() => navigate('/finance/transaction')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1.5px solid var(--gold-border)' }}>
                        <Plus size={16} /> Record Payment
                    </button>
                </div>
            </header>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <BillingStat label="Total Billed" value={`AED ${totalBilled.toLocaleString()}`} icon={Receipt} color="#8b5cf6" />
                <BillingStat label="Collected" value={`AED ${totalCollected.toLocaleString()}`} icon={CheckCircle} color="#10b981" />
                <BillingStat label="Outstanding" value={`AED ${totalPending.toLocaleString()}`} icon={Clock} color="#f59e0b" />
                <BillingStat label="Overdue" value={overdueInvoices.length} icon={AlertTriangle} color="#ef4444" />
            </div>

            {/* Tabs + Search */}
            <GlassCard style={{ padding: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                        <input
                            type="text"
                            placeholder="Search invoice or customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 12px 12px 40px', background: 'var(--input-bg)',
                                border: '1.5px solid var(--gold-border)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px'
                            }}
                        />
                    </div>
                    {['ALL', 'PAID', 'PENDING', 'OVERDUE'].map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            style={{
                                padding: '12px 24px', borderRadius: '12px', border: tab === t ? '1.5px solid var(--gold-border)' : '1.5px solid rgba(176,141,87,0.2)', cursor: 'pointer', fontWeight: '900', fontSize: '12px',
                                background: tab === t ? 'var(--gold)' : 'var(--input-bg)',
                                color: tab === t ? '#000' : 'var(--text-primary)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}
                        >{t}</button>
                    ))}
                </div>
            </GlassCard>

            {/* Invoice Table */}
            <GlassCard style={{ padding: 0, overflow: 'hidden', border: '1.5px solid var(--gold-border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-primary)', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ background: 'var(--input-bg)', textAlign: 'left', borderBottom: '2.5px solid var(--gold-border)' }}>
                            <th style={{ padding: '20px 18px', color: 'var(--gold)', fontWeight: '900', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '2px' }}>Invoice ID</th>
                            <th style={{ padding: '20px 18px', color: 'var(--gold)', fontWeight: '900', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '2px' }}>Client Narrative</th>
                            <th style={{ padding: '20px 18px', color: 'var(--gold)', fontWeight: '900', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '2px' }}>Post Date</th>
                            <th style={{ padding: '20px 18px', color: 'var(--gold)', fontWeight: '900', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '2px', textAlign: 'right' }}>Grand Total</th>
                            <th style={{ padding: '20px 18px', color: 'var(--gold)', fontWeight: '900', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '2px' }}>Fiscal Status</th>
                            <th style={{ padding: '20px 18px', color: 'var(--gold)', fontWeight: '900', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '2px' }}>Method</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.length > 0 ? filteredInvoices.map((inv, i) => (
                            <tr key={inv.id || i} style={{ borderBottom: '1.5px solid rgba(176,141,87,0.1)', cursor: 'pointer' }}
                                onClick={() => navigate(`/invoices/${inv.id}`)}>
                                <td style={{ padding: '18px', fontWeight: '900', color: 'var(--gold)', fontSize: '14px' }}>{inv.invoice_number || `INV-${inv.id}`}</td>
                                <td style={{ padding: '18px', fontWeight: '900', color: 'var(--text-primary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{inv.customer_name || '-'}</td>
                                <td style={{ padding: '18px', color: 'var(--text-secondary)', fontWeight: '900', fontSize: '12px' }}>{inv.date || inv.created_at?.split('T')[0] || '-'}</td>
                                <td style={{ padding: '18px', textAlign: 'right', fontWeight: '900', color: 'var(--text-primary)', fontSize: '18px', fontFamily: 'Outfit, sans-serif' }}>{parseFloat(inv.grand_total || 0).toLocaleString()}</td>
                                <td style={{ padding: '18px' }}>{getStatusBadge(inv.payment_status)}</td>
                                <td style={{ padding: '18px', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '900', textTransform: 'uppercase' }}>{inv.payment_method || 'CASH'}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                                    No billing records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </GlassCard>
        </div>
    );
};

const BillingStat = ({ label, value, icon: Icon, color }) => (
    <GlassCard style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '20px', border: '1.5px solid var(--gold-border)' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'var(--gold-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--gold-border)' }}>
            <Icon size={28} color="var(--gold)" />
        </div>
        <div>
            <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '5px' }}>{label}</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{value}</div>
        </div>
    </GlassCard>
);

export default BillingPage;
