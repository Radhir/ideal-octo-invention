import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
                axios.get('/finance/api/accounts/'),
                axios.get('/finance/api/transactions/financial_summary/')
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
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: '#fff' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '2px' }}>EXECUTIVE OVERSIGHT</div>
                        <h1 style={{ margin: '5px 0 0 0', fontSize: '2.5rem', fontWeight: '900', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>Financial Ledger</h1>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => window.print()} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', color: '#fff', cursor: 'pointer' }}>
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
                                    background: expandedGroups.has(cat) ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    border: `1px solid ${expandedGroups.has(cat) ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
                                    transition: 'all 0.3s'
                                }}
                            >
                                {expandedGroups.has(cat) ? <ChevronDown size={18} color="#94a3b8" /> : <ChevronRight size={18} color="#94a3b8" />}
                                <Folder size={20} color={COLORS[cat] || '#94a3b8'} fill={expandedGroups.has(cat) ? (COLORS[cat] || '#94a3b8') : 'transparent'} style={{ opacity: 0.8 }} />
                                <span style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>{CATEGORY_LABELS[cat]}</span>
                                <span style={{ marginLeft: 'auto', color: '#64748b', fontSize: '13px' }}>{groupedAccounts[cat]?.length || 0} Accounts</span>
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
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            background: 'rgba(0,0,0,0.2)',
                                            transition: 'transform 0.2s'
                                        }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                                        >
                                            <div style={{ width: '45px', color: '#b08d57', fontSize: '13px', fontWeight: '800' }}>#{acc.code}</div>
                                            <div style={{ flex: 1, color: '#f1f5f9', fontWeight: '600', fontSize: '14px' }}>{acc.name}</div>
                                            <div style={{ color: '#fff', fontWeight: '800', fontSize: '14px' }}>AED {parseFloat(acc.balance).toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <GlassCard style={{ padding: '25px' }}>
                        <h3 style={{ margin: '0 0 25px 0', fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <PieChart size={20} color="#b08d57" /> Financial Status
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <SummaryRow label="Total Assets" value={summary.total_assets.toLocaleString()} color="#3b82f6" />
                            <SummaryRow label="Liabilities" value={summary.liabilities.toLocaleString()} color="#f59e0b" />
                            <SummaryRow label="Net Equity" value={summary.equity.toLocaleString()} color="#ec4899" />
                        </div>
                    </GlassCard>

                    <GlassCard style={{ padding: '25px', background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Activity size={20} color="#10b981" /> Auditor Log
                        </h3>
                        <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
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
            <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>{label}</span>
        </div>
        <span style={{ color: '#fff', fontWeight: '900', fontSize: '16px' }}>AED {value}</span>
    </div>
);

export default ChartOfAccounts;
