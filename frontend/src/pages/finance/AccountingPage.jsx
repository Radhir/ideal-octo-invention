import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../../components/GlassCard';
import {
    BookOpen, ArrowUpRight, ArrowDownRight, Search,
    Filter, Download, Plus, ChevronLeft, ChevronRight,
    DollarSign, TrendingUp, TrendingDown, BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountingPage = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [page, setPage] = useState(1);
    const perPage = 15;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [txRes, accRes, summaryRes] = await Promise.all([
                axios.get('/finance/api/transactions/').catch(() => ({ data: [] })),
                axios.get('/finance/api/accounts/').catch(() => ({ data: [] })),
                axios.get('/finance/api/transactions/financial_summary/').catch(() => ({ data: {} }))
            ]);
            const txData = Array.isArray(txRes.data) ? txRes.data : txRes.data.results || [];
            const accData = Array.isArray(accRes.data) ? accRes.data : accRes.data.results || [];
            setTransactions(txData);
            setAccounts(accData);
        } catch (err) {
            console.error('Accounting data fetch failed', err);
        } finally {
            setLoading(false);
        }
    };

    const totalDebit = transactions.reduce((s, t) => s + (parseFloat(t.debit_amount) || 0), 0);
    const totalCredit = transactions.reduce((s, t) => s + (parseFloat(t.credit_amount) || 0), 0);
    const netBalance = totalDebit - totalCredit;
    const accountCount = accounts.length;

    const filtered = transactions.filter(t => {
        const matchSearch = !searchTerm || (t.description || '').toLowerCase().includes(searchTerm.toLowerCase())
            || (t.reference || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = filterType === 'ALL'
            || (filterType === 'DEBIT' && parseFloat(t.debit_amount) > 0)
            || (filterType === 'CREDIT' && parseFloat(t.credit_amount) > 0);
        return matchSearch && matchType;
    });

    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    const exportCSV = () => {
        const header = 'Date,Reference,Description,Debit,Credit,Account\n';
        const rows = transactions.map(t =>
            `${t.date || ''},${t.reference || ''},${(t.description || '').replace(/,/g, ';')},${t.debit_amount || 0},${t.credit_amount || 0},${t.account_name || ''}`
        ).join('\n');
        const blob = new Blob([header + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'general_ledger.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) return <div style={{ color: '#fff', padding: '40px' }}>Loading General Ledger...</div>;

    return (
        <div style={{ padding: '30px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <div style={{ fontSize: '10px', color: '#8b5cf6', fontWeight: '800', letterSpacing: '2px' }}>FINANCE & ACCOUNTS</div>
                    <h1 style={{ margin: '5px 0 0 0', fontSize: '2.5rem', fontWeight: '900', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>General Ledger</h1>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={exportCSV} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.08)', color: '#fff' }}>
                        <Download size={16} /> Export CSV
                    </button>
                    <button onClick={() => navigate('/finance/transaction')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={16} /> New Entry
                    </button>
                </div>
            </header>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <LedgerStat label="Total Debits" value={`AED ${totalDebit.toLocaleString()}`} icon={ArrowUpRight} color="#3b82f6" />
                <LedgerStat label="Total Credits" value={`AED ${totalCredit.toLocaleString()}`} icon={ArrowDownRight} color="#10b981" />
                <LedgerStat label="Net Balance" value={`AED ${netBalance.toLocaleString()}`} icon={DollarSign} color="#b08d57" />
                <LedgerStat label="Active Accounts" value={accountCount} icon={BookOpen} color="#8b5cf6" />
            </div>

            {/* Filters */}
            <GlassCard style={{ padding: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                        <input
                            type="text"
                            placeholder="Search by description or reference..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            style={{
                                width: '100%', padding: '10px 10px 10px 36px', background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none'
                            }}
                        />
                    </div>
                    {['ALL', 'DEBIT', 'CREDIT'].map(f => (
                        <button
                            key={f}
                            onClick={() => { setFilterType(f); setPage(1); }}
                            style={{
                                padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '12px',
                                background: filterType === f ? '#8b5cf6' : 'rgba(255,255,255,0.05)',
                                color: filterType === f ? '#fff' : '#94a3b8'
                            }}
                        >{f}</button>
                    ))}
                </div>
            </GlassCard>

            {/* Ledger Table */}
            <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', textAlign: 'left' }}>
                            <th style={{ padding: '18px' }}>Date</th>
                            <th style={{ padding: '18px' }}>Reference</th>
                            <th style={{ padding: '18px' }}>Description</th>
                            <th style={{ padding: '18px' }}>Account</th>
                            <th style={{ padding: '18px', textAlign: 'right' }}>Debit (AED)</th>
                            <th style={{ padding: '18px', textAlign: 'right' }}>Credit (AED)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length > 0 ? paginated.map((t, i) => (
                            <tr key={t.id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                <td style={{ padding: '16px', color: '#b08d57', fontWeight: '600' }}>{t.date || '-'}</td>
                                <td style={{ padding: '16px', fontWeight: '700' }}>{t.reference || '-'}</td>
                                <td style={{ padding: '16px', color: '#94a3b8' }}>{t.description || '-'}</td>
                                <td style={{ padding: '16px' }}>{t.account_name || t.account || '-'}</td>
                                <td style={{ padding: '16px', textAlign: 'right', fontWeight: '800', color: parseFloat(t.debit_amount) > 0 ? '#3b82f6' : '#333' }}>
                                    {parseFloat(t.debit_amount) > 0 ? parseFloat(t.debit_amount).toLocaleString() : '-'}
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right', fontWeight: '800', color: parseFloat(t.credit_amount) > 0 ? '#10b981' : '#333' }}>
                                    {parseFloat(t.credit_amount) > 0 ? parseFloat(t.credit_amount).toLocaleString() : '-'}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                                    No ledger entries found. Create your first transaction to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </GlassCard>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' }}>
                        <ChevronLeft size={16} />
                    </button>
                    <span style={{ color: '#94a3b8', padding: '8px 14px', fontSize: '14px' }}>Page {page} of {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' }}>
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

const LedgerStat = ({ label, value, icon: Icon, color }) => (
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

export default AccountingPage;
