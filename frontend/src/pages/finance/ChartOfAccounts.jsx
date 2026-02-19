import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import {
    ChevronRight, ChevronDown, Folder, FileText,
    PieChart, Printer, Activity, Plus, TrendingUp, CreditCard, Shield, Globe, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioStats,
    PortfolioButton,
    PortfolioCard,
    PortfolioGrid,
    PortfolioSectionTitle,
    PortfolioInput
} from '../../components/PortfolioComponents';

const ChartOfAccounts = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({ total_assets: 0, liabilities: 0, equity: 0 });
    const [expandedGroups, setExpandedGroups] = useState(new Set(['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE']));

    const fetchData = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
        'ASSET': 'var(--blue)',
        'LIABILITY': 'var(--gold)',
        'EQUITY': 'var(--purple)',
        'REVENUE': '#10b981',
        'EXPENSE': '#f43f5e',
    };

    return (
        <PortfolioPage breadcrumb="FINANCE / CHART OF ACCOUNTS">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
                <PortfolioTitle subtitle="The constitutional hierarchy of the industrial ledger. Manage fiscal classification with high-fidelity precision.">
                    Financial Matrix
                </PortfolioTitle>

                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                    <PortfolioButton variant="secondary" onClick={() => window.print()}>
                        <Printer size={16} /> EXPORT
                    </PortfolioButton>
                    <PortfolioButton variant="gold" onClick={() => navigate('/finance/transaction')}>
                        <Plus size={16} /> NEW ENTRY
                    </PortfolioButton>
                </div>
            </div>

            <PortfolioStats stats={[
                { label: 'TOTAL ASSETS', value: `AED ${summary.total_assets.toLocaleString()}`, color: COLORS.ASSET },
                { label: 'LIABILITIES', value: `AED ${summary.liabilities.toLocaleString()}`, color: COLORS.LIABILITY },
                { label: 'NET EQUITY', value: `AED ${summary.equity.toLocaleString()}`, color: COLORS.EQUITY }
            ]} />

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '60px', marginTop: '60px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {Object.keys(CATEGORY_LABELS).map((cat, idx) => (
                        <div key={cat} style={{ width: '100%' }}>
                            <button
                                onClick={() => toggleGroup(cat)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '25px 35px',
                                    background: 'rgba(232, 230, 227, 0.03)',
                                    border: '1px solid rgba(232, 230, 227, 0.1)',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(232, 230, 227, 0.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(232, 230, 227, 0.03)'}
                            >
                                <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '45px',
                                        height: '45px',
                                        borderRadius: '12px',
                                        background: 'rgba(232, 230, 227, 0.05)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid rgba(232, 230, 227, 0.1)'
                                    }}>
                                        <Folder size={20} color={COLORS[cat]} strokeWidth={1.5} />
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'rgba(232, 230, 227, 0.4)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>
                                            {CATEGORY_LABELS[cat]}
                                        </div>
                                        <div style={{ fontSize: '10px', color: COLORS[cat], fontWeight: '700', letterSpacing: '1px' }}>
                                            {groupedAccounts[cat]?.length || 0} ACTIVE NODES
                                        </div>
                                    </div>
                                </div>
                                {expandedGroups.has(cat) ? <ChevronDown size={20} color="var(--cream)" opacity={0.3} /> : <ChevronRight size={20} color="var(--cream)" opacity={0.3} />}
                            </button>

                            <AnimatePresence>
                                {expandedGroups.has(cat) && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={{ overflow: 'hidden', paddingLeft: '20px', marginTop: '10px' }}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px 0' }}>
                                            {groupedAccounts[cat]?.map(acc => (
                                                <div key={acc.id} style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '20px 30px',
                                                    background: 'transparent',
                                                    border: '1px solid rgba(232, 230, 227, 0.05)',
                                                    borderRadius: '15px',
                                                    transition: 'all 0.3s'
                                                }} onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(232, 230, 227, 0.02)';
                                                    e.currentTarget.style.borderColor = 'rgba(232, 230, 227, 0.2)';
                                                }} onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                    e.currentTarget.style.borderColor = 'rgba(232, 230, 227, 0.05)';
                                                }}>
                                                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                                        <span style={{ fontSize: '10px', fontWeight: '800', color: COLORS[cat], fontFamily: 'monospace' }}>#{acc.code}</span>
                                                        <span style={{ fontSize: '15px', color: 'var(--cream)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{acc.name}</span>
                                                    </div>
                                                    <div style={{ fontSize: '18px', fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}>
                                                        AED {parseFloat(acc.balance).toLocaleString()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
                        border: '1px solid rgba(232, 230, 227, 0.1)',
                        borderRadius: '30px',
                        padding: '40px'
                    }}>
                        <PieChart style={{ color: 'var(--purple)', marginBottom: '30px', opacity: 0.5 }} size={32} />
                        <PortfolioSectionTitle>Fiscal Integrity</PortfolioSectionTitle>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            {[
                                { label: 'Assets', val: summary.total_assets, col: COLORS.ASSET },
                                { label: 'Liabilities', val: summary.liabilities, col: COLORS.LIABILITY },
                                { label: 'Equity', val: summary.equity, col: COLORS.EQUITY }
                            ].map(row => (
                                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid rgba(232, 230, 227, 0.05)', paddingBottom: '15px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(232, 230, 227, 0.4)', textTransform: 'uppercase', letterSpacing: '2px' }}>{row.label}</span>
                                    <span style={{ fontSize: '20px', color: row.col, fontWeight: '300', fontFamily: 'var(--font-serif)' }}>AED {row.val.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <PortfolioCard borderColor="rgba(232, 230, 227, 0.1)">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                            <Activity color="var(--gold)" size={24} strokeWidth={1.5} />
                            <h4 style={{ margin: 0, fontWeight: '800', fontSize: '12px', letterSpacing: '2px', color: 'var(--cream)', textTransform: 'uppercase' }}>System Health</h4>
                        </div>
                        <p style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', lineHeight: '1.7', marginBottom: '20px' }}>
                            Database integrity has been verified. All ledger nodes are synchronized with the central production cluster.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '10px', fontWeight: '800', color: '#10b981', letterSpacing: '1px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
                            REAL-TIME SYNC ACTIVE
                        </div>
                    </PortfolioCard>
                </div>
            </div>

            <footer style={{ marginTop: '100px', paddingBottom: '40px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(232, 230, 227, 0.05)', paddingTop: '40px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.3)', letterSpacing: '2px' }}>
                    ELITE SHINE FISCAL ENGINE v6.2
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <Shield size={16} color="rgba(232, 230, 227, 0.2)" />
                    <Activity size={16} color="rgba(232, 230, 227, 0.2)" />
                    <CreditCard size={16} color="rgba(232, 230, 227, 0.2)" />
                </div>
            </footer>
        </PortfolioPage>
    );
};

export default ChartOfAccounts;
