import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import {
    ChevronRight, ChevronDown, Folder, FileText,
    Plus, DollarSign, PieChart, Activity, Printer, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PrintHeader from '../../components/PrintHeader';

const ChartOfAccounts = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({ total_assets: 0, liabilities: 0, equity: 0 });
    const [expandedGroups, setExpandedGroups] = useState(new Set(['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE']));

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [accRes, summaryRes] = await Promise.all([
                api.get('/finance/api/accounts/'),
                api.get('/finance/api/transactions/financial_summary/')
            ]);
            setAccounts(accRes.data);
            setSummary({
                total_assets: summaryRes.data.total_assets || 0,
                liabilities: accRes.data.filter(a => a.category === 'LIABILITY').reduce((s, a) => s + parseFloat(a.balance), 0),
                equity: accRes.data.filter(a => a.category === 'EQUITY').reduce((s, a) => s + parseFloat(a.balance), 0),
            });
        } catch (err) {
            console.error('Error fetching COA', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleGroup = (group) => {
        const next = new Set(expandedGroups);
        if (next.has(group)) next.delete(group);
        else next.add(group);
        setExpandedGroups(next);
    };

    const groupedAccounts = accounts.reduce((acc, curr) => {
        if (!acc[curr.category]) acc[curr.category] = [];
        acc[curr.category].push(curr);
        return acc;
    }, {});

    const CATEGORY_LABELS = {
        'ASSET': 'Assets (1000-1999)',
        'LIABILITY': 'Liabilities (2000-2999)',
        'EQUITY': 'Equity (3000-3999)',
        'REVENUE': 'Revenue (4000-4999)',
        'EXPENSE': 'Operating Expenses (5000-6999)',
    };

    const COLORS = {
        'ASSET': '#3b82f6',
        'LIABILITY': '#f59e0b',
        'EQUITY': '#ec4899',
        'REVENUE': '#10b981',
        'EXPENSE': '#f43f5e',
    };

    if (loading) return <div style={{ color: '#fff', padding: '50px', textAlign: 'center' }}>Syncing Chart of Accounts...</div>;

    return (
        <div style={{ padding: '30px', animation: 'fadeIn 0.5s ease-out' }}>
            <PrintHeader title="Chart of Accounts Ledger" />

            <header className="no-print" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        onClick={() => navigate('/finance')}
                        style={{ background: 'var(--input-bg)', border: '1.5px solid var(--gold-border)', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-primary)' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px' }}>EXECUTIVE OVERSIGHT</div>
                        <h1 style={{ margin: '5px 0 0 0', fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>Financial Ledger</h1>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => window.print()} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', color: 'var(--text-primary)', cursor: 'pointer', border: '1.5px solid var(--gold-border)' }}>
                        <Printer size={18} /> Print COA
                    </button>
                    <button onClick={() => navigate('/finance/transaction')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Plus size={18} /> New Transaction
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {Object.keys(CATEGORY_LABELS).map(cat => (
                        <div key={cat} style={{ marginBottom: '10px' }}>
                            <div
                                onClick={() => toggleGroup(cat)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '15px 20px',
                                    background: expandedGroups.has(cat) ? 'var(--gold-glow)' : 'var(--input-bg)',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    border: `1.5px solid ${expandedGroups.has(cat) ? 'var(--gold-border)' : 'var(--border-color)'}`,
                                    transition: 'all 0.3s'
                                }}
                            >
                                {expandedGroups.has(cat) ? <ChevronDown size={18} color="var(--gold)" /> : <ChevronRight size={18} color="var(--text-secondary)" />}
                                <Folder size={20} color={COLORS[cat] || 'var(--text-secondary)'} fill={expandedGroups.has(cat) ? (COLORS[cat] || 'var(--text-secondary)') : 'transparent'} style={{ opacity: 0.8 }} />
                                <span style={{ color: 'var(--text-primary)', fontWeight: '900', fontSize: '15px' }}>{CATEGORY_LABELS[cat]}</span>
                                <span style={{ marginLeft: 'auto', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '800' }}>{groupedAccounts[cat]?.length || 0} Accounts</span>
                            </div>

                            {expandedGroups.has(cat) && (
                                <div style={{ paddingLeft: '40px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {groupedAccounts[cat]?.map(acc => (
                                        <div key={acc.id} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '15px',
                                            padding: '12px 20px',
                                            borderRadius: '12px',
                                            border: '1.5px solid var(--border-color)',
                                            background: 'var(--input-bg)',
                                            transition: 'transform 0.2s'
                                        }}
                                            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateX(5px)'; e.currentTarget.style.borderColor = 'var(--gold-border)'; }}
                                            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                                        >
                                            <div style={{ width: '45px', color: 'var(--gold)', fontSize: '13px', fontWeight: '900' }}>#{acc.code}</div>
                                            <div style={{ flex: 1, color: 'var(--text-primary)', fontWeight: '900', fontSize: '14px' }}>{acc.name}</div>
                                            <div style={{ color: 'var(--text-primary)', fontWeight: '900', fontSize: '16px' }}>AED {parseFloat(acc.balance).toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <GlassCard style={{ padding: '25px', border: '1.5px solid var(--gold-border)' }}>
                        <h3 style={{ margin: '0 0 25px 0', fontSize: '18px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
                            <PieChart size={20} color="var(--gold)" /> Financial Status
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <SummaryRow label="Total Assets" value={summary.total_assets.toLocaleString()} color="#3b82f6" />
                            <SummaryRow label="Liabilities" value={summary.liabilities.toLocaleString()} color="#f59e0b" />
                            <SummaryRow label="Net Equity" value={summary.equity.toLocaleString()} color="#ec4899" />
                        </div>
                    </GlassCard>

                    <GlassCard style={{ padding: '25px', background: 'var(--gold-glow)', border: '1.5px solid var(--gold-border)' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Activity size={20} color="var(--gold)" /> Auditor Log
                        </h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', fontWeight: '800' }}>
                            Ledger is synchronized with live transactions. Automatic double-entry balancing is active.
                        </p>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

const SummaryRow = ({ label, value, color }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }}></div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '800' }}>{label}</span>
        </div>
        <span style={{ color: 'var(--text-primary)', fontWeight: '900', fontSize: '16px' }}>AED {value}</span>
    </div>
);

export default ChartOfAccounts;
