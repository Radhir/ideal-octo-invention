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
    Download, Plus, ChevronLeft, ChevronRight,
    ArrowUpRight, ArrowDownRight, DollarSign, BookOpen
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

    const fetchData = useCallback(async () => {
        try {
            const [txRes, accRes] = await Promise.all([
                api.get('/finance/api/transactions/').catch(() => ({ data: [] })),
                api.get('/finance/api/accounts/').catch(() => ({ data: [] }))
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
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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

    if (loading) return <div style={{ color: 'var(--cream)', padding: '80px', textAlign: 'center', opacity: 0.5 }}>Syncing Financial Command Center...</div>;

    const stats = [
        { label: 'Total Debits', value: `AED ${totalDebit.toLocaleString()}`, color: '#ef4444' },
        { label: 'Total Credits', value: `AED ${totalCredit.toLocaleString()}`, color: '#10b981' },
        { label: 'Net Balance', value: `AED ${netBalance.toLocaleString()}`, color: 'var(--gold)' },
        { label: 'Active Accounts', value: accountCount, color: '#8b5cf6' }
    ];

    return (
        <PortfolioPage breadcrumb="Finance / General Ledger">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <PortfolioTitle subtitle="Comprehensive audit trail of all fiscal movements and capital allocations.">
                    General Ledger
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton variant="secondary" onClick={exportCSV}>
                        <Download size={18} /> Export CSV
                    </PortfolioButton>
                    <PortfolioButton variant="gold" onClick={() => navigate('/finance/transaction')}>
                        <Plus size={18} /> New Entry
                    </PortfolioButton>
                </div>
            </div>

            <PortfolioStats stats={stats} />

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px' }}>
                {/* Filters Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <PortfolioCard style={{ padding: '35px', background: 'rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                            <Filter size={18} color="var(--gold)" opacity={0.5} />
                            <h3 style={{ margin: 0, fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>Protocol Filters</h3>
                        </div>

                        <PortfolioInput
                            label="SEARCH ARCHIVE"
                            placeholder="Description or Ref..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            style={{ marginBottom: '40px' }}
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <label style={{ color: 'var(--gold)', fontSize: '9px', fontWeight: '900', letterSpacing: '1px', marginBottom: '5px' }}>CLASSIFICATION</label>
                            {['ALL', 'DEBIT', 'CREDIT'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => { setFilterType(f); setPage(1); }}
                                    style={{
                                        padding: '18px 25px',
                                        background: filterType === f ? 'var(--gold)' : 'rgba(255,255,255,0.02)',
                                        border: filterType === f ? 'none' : '1px solid rgba(232, 230, 227, 0.05)',
                                        borderRadius: '12px',
                                        color: filterType === f ? '#0a0a0a' : 'var(--cream)',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        fontSize: '11px',
                                        fontWeight: '900',
                                        letterSpacing: '1px',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: filterType === f ? '0 10px 20px rgba(176,141,87,0.2)' : 'none'
                                    }}
                                >
                                    {f === 'ALL' ? 'UNIVERSAL VIEW' : f === 'DEBIT' ? 'DEBIT FLOWS' : 'CREDIT FLOWS'}
                                </button>
                            ))}
                        </div>
                    </PortfolioCard>
                </div>

                {/* Ledger Table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <PortfolioCard style={{ padding: 0, overflow: 'hidden', background: 'rgba(0,0,0,0.3)' }}>
                        <div className="telemetry-grid" style={{ zIndex: 0, opacity: 0.03 }} />
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, position: 'relative', zIndex: 1 }}>
                            <thead>
                                <tr style={{ background: 'rgba(176,141,87,0.05)' }}>
                                    <th style={thStyle}>POST DATE</th>
                                    <th style={thStyle}>REF TOKEN</th>
                                    <th style={thStyle}>NARRATIVE</th>
                                    <th style={thStyle}>ACCOUNT</th>
                                    <th style={{ ...thStyle, textAlign: 'right' }}>DEBIT</th>
                                    <th style={{ ...thStyle, textAlign: 'right' }}>CREDIT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length > 0 ? paginated.map((t, i) => (
                                    <tr key={t.id || i} style={{ borderBottom: '1px solid rgba(232, 230, 227, 0.03)' }} className="table-row-hover">
                                        <td style={tdStyle}>{t.date || '-'}</td>
                                        <td style={{ ...tdStyle, color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px' }}>{t.reference || '-'}</td>
                                        <td style={{ ...tdStyle, color: 'var(--cream)', fontWeight: '300', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>{t.description || '-'}</td>
                                        <td style={{ ...tdStyle, opacity: 0.5, fontSize: '11px' }}>{t.account_name || t.account || '-'}</td>
                                        <td style={{ ...tdStyle, textAlign: 'right', color: parseFloat(t.debit_amount) > 0 ? '#ef4444' : 'rgba(232, 230, 227, 0.05)', fontFamily: 'var(--font-serif)', fontSize: '16px' }}>
                                            {parseFloat(t.debit_amount) > 0 ? `-${parseFloat(t.debit_amount).toLocaleString()}` : '0.00'}
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right', color: parseFloat(t.credit_amount) > 0 ? '#10b981' : 'rgba(232, 230, 227, 0.05)', fontFamily: 'var(--font-serif)', fontSize: '16px' }}>
                                            {parseFloat(t.credit_amount) > 0 ? `+${parseFloat(t.credit_amount).toLocaleString()}` : '0.00'}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '100px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.3)', letterSpacing: '2px', fontSize: '11px', fontWeight: '900' }}>
                                            NO LEDGER ENTRIES DETECTED
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </PortfolioCard>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={pageBtnStyle}>
                                <ChevronLeft size={16} />
                            </button>
                            <span style={{ display: 'flex', alignItems: 'center', color: 'var(--cream)', fontSize: '13px', letterSpacing: '1px' }}>PAGE {page} OF {totalPages}</span>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={pageBtnStyle}>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
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
    color: 'var(--gold)',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    opacity: 0.9
};

const tdStyle = {
    padding: '25px 30px',
    fontSize: '13px',
    color: 'var(--cream)',
    fontWeight: '500'
};

const pageBtnStyle = {
    background: 'transparent',
    border: '1px solid rgba(232, 230, 227, 0.2)',
    color: 'var(--cream)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s'
};

export default AccountingPage;
