import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
            const res = await axios.get('/forms/invoices/api/list/');
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
            PAID: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'rgba(16,185,129,0.2)', label: 'Paid' },
            PENDING: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)', label: 'Pending' },
            PARTIAL: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'rgba(59,130,246,0.2)', label: 'Partial' },
            OVERDUE: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.2)', label: 'Overdue' },
        };
        const s = map[status] || map.PENDING;
        return (
            <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                {s.label}
            </span>
        );
    };

    if (loading) return <div style={{ color: '#fff', padding: '40px' }}>Loading Billing Console...</div>;

    return (
        <div style={{ padding: '30px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <div style={{ fontSize: '10px', color: '#8b5cf6', fontWeight: '800', letterSpacing: '2px' }}>CASHIER OPERATIONS</div>
                    <h1 style={{ margin: '5px 0 0 0', fontSize: '2.5rem', fontWeight: '900', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>Billing & Cashier</h1>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => navigate('/invoices')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.08)', color: '#fff' }}>
                        <FileText size={16} /> All Invoices
                    </button>
                    <button onClick={() => navigate('/finance/transaction')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                                width: '100%', padding: '10px 10px 10px 36px', background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none'
                            }}
                        />
                    </div>
                    {['ALL', 'PAID', 'PENDING', 'OVERDUE'].map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            style={{
                                padding: '10px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '12px',
                                background: tab === t ? '#8b5cf6' : 'rgba(255,255,255,0.05)',
                                color: tab === t ? '#fff' : '#94a3b8'
                            }}
                        >{t}</button>
                    ))}
                </div>
            </GlassCard>

            {/* Invoice Table */}
            <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', textAlign: 'left' }}>
                            <th style={{ padding: '18px' }}>Invoice #</th>
                            <th style={{ padding: '18px' }}>Customer</th>
                            <th style={{ padding: '18px' }}>Date</th>
                            <th style={{ padding: '18px', textAlign: 'right' }}>Amount (AED)</th>
                            <th style={{ padding: '18px' }}>Status</th>
                            <th style={{ padding: '18px' }}>Method</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.length > 0 ? filteredInvoices.map((inv, i) => (
                            <tr key={inv.id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
                                onClick={() => navigate(`/invoices/${inv.id}`)}>
                                <td style={{ padding: '16px', fontWeight: '700', color: '#b08d57' }}>{inv.invoice_number || `INV-${inv.id}`}</td>
                                <td style={{ padding: '16px' }}>{inv.customer_name || '-'}</td>
                                <td style={{ padding: '16px', color: '#94a3b8' }}>{inv.date || inv.created_at?.split('T')[0] || '-'}</td>
                                <td style={{ padding: '16px', textAlign: 'right', fontWeight: '800' }}>{parseFloat(inv.grand_total || 0).toLocaleString()}</td>
                                <td style={{ padding: '16px' }}>{getStatusBadge(inv.payment_status)}</td>
                                <td style={{ padding: '16px', color: '#94a3b8', fontSize: '13px' }}>{inv.payment_method || 'Cash'}</td>
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
    <GlassCard style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={24} color={color} />
        </div>
        <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#fff' }}>{value}</div>
        </div>
    </GlassCard>
);

export default BillingPage;
