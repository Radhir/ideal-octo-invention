import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    DollarSign, TrendingUp, TrendingDown,
    Wallet, Receipt, FileText, Plus,
    ArrowUpRight, PieChart, Shield,
    Download, Calendar, Filter, ChevronRight,
    AlertCircle
} from 'lucide-react';
import api from '../../api/axios';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioGrid,
    PortfolioTitle,
    PortfolioButton,
    PortfolioStats,
    PortfolioInput
} from '../../components/PortfolioComponents';

// --- Sub-components for Tabs ---

const ConsoleTab = ({ summary, budgets, navigate }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PortfolioGrid columns="2fr 1fr">
                {/* Visual Performance */}
                {/* Visual Performance */}
                <PortfolioCard style={{ padding: '40px', background: 'rgba(0,0,0,0.3)' }}>
                    <div className="telemetry-grid" style={{ zIndex: 0, opacity: 0.05 }} />
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                        <div>
                            <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '5px' }}>MOVEMENT VECTOR</div>
                            <h3 style={{ color: 'var(--cream)', fontSize: '18px', fontWeight: '300', fontFamily: 'var(--font-serif)', margin: 0 }}>Strategic Cash-Flow</h3>
                        </div>
                        <PortfolioButton variant="gold" onClick={() => navigate('/reports/financial')} style={{ fontSize: '10px' }}>AUDIT.engine</PortfolioButton>
                    </div>
                    <div style={{ height: '320px', display: 'flex', alignItems: 'flex-end', gap: '35px', padding: '0 10px', position: 'relative', zIndex: 1 }}>
                        {[40, 60, 55, 85, 65, 95, 75].map((val, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', height: '260px', justifyContent: 'flex-end' }}>
                                    <motion.div
                                        initial={{ height: 0 }} animate={{ height: `${val}%` }}
                                        style={{ width: '100%', background: 'linear-gradient(to top, var(--gold), rgba(176,141,87,0.4))', borderRadius: '4px', opacity: 0.9, boxShadow: '0 0 15px rgba(176,141,87,0.2)' }}
                                    />
                                    <motion.div
                                        initial={{ height: 0 }} animate={{ height: `${val * 0.4}%` }}
                                        style={{ width: '100%', background: 'rgba(232, 230, 227, 0.05)', borderRadius: '4px' }}
                                    />
                                </div>
                                <span style={{ fontSize: '9px', color: 'var(--gold)', textAlign: 'center', fontWeight: '900', opacity: 0.5 }}>FEB 0{i + 1}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '50px', display: 'flex', gap: '40px', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold)', boxShadow: '0 0 8px var(--gold)' }}></div> REVENUE
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '10px', color: 'rgba(232, 230, 227, 0.3)', fontWeight: '900', letterSpacing: '1px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(232, 230, 227, 0.2)' }}></div> OVERHEADS
                        </div>
                    </div>
                </PortfolioCard>

                {/* Side Metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <PortfolioCard style={{ padding: '30px', background: 'rgba(176, 141, 87, 0.03)', border: '1px dashed rgba(176, 141, 87, 0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <Shield size={16} color="var(--gold)" />
                            <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--gold)', letterSpacing: '1px' }}>COMPLIANCE PULSE</span>
                        </div>
                        <div style={{ fontSize: '24px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', marginBottom: '5px' }}>98.4%</div>
                        <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '800' }}>VAT AUDIT READY</div>
                    </PortfolioCard>

                    <PortfolioCard style={{ padding: '30px' }}>
                        <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.4)', fontWeight: '900', letterSpacing: '1px', marginBottom: '20px' }}>BUDGET UTILIZATION</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {budgets.slice(0, 3).map((b, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: '800', marginBottom: '8px', color: 'rgba(232, 230, 227, 0.6)' }}>
                                        <span>{b.label}</span>
                                        <span style={{ color: b.percent > 90 ? '#f43f5e' : 'var(--gold)' }}>{b.percent}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                                        <div style={{ width: `${Math.min(b.percent, 100)}%`, height: '100%', background: b.percent > 90 ? '#f43f5e' : 'var(--gold)' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </PortfolioCard>
                </div>
            </PortfolioGrid>
        </motion.div>
    );
};

const LedgerTab = ({ accounts, navigate }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: 'var(--gold)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Global Chart of Accounts</h3>
                <PortfolioButton variant="glass" onClick={() => navigate('/finance/coa')} style={{ padding: '8px 20px', fontSize: '11px' }}>
                    LEDGER ARCHITECTURE
                </PortfolioButton>
            </div>
            <PortfolioGrid columns="repeat(auto-fill, minmax(400px, 1fr))" gap="25px">
                {accounts.map(acc => (
                    <PortfolioCard key={acc.id} style={{ padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '10px' }}>{acc.code}</div>
                            <div style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', fontWeight: '300' }}>{acc.name}</div>
                            <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.3)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>{acc.category}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '24px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'var(--font-serif)' }}>AED {parseFloat(acc.balance).toLocaleString()}</div>
                            <div style={{ fontSize: '8px', color: '#10b981', fontWeight: '900', letterSpacing: '1px', marginTop: '8px', opacity: 0.6 }}>ACTIVE // VERIFIED</div>
                        </div>
                    </PortfolioCard>
                ))}
            </PortfolioGrid>
        </motion.div>
    );
};

const InvoiceTab = ({ entries, navigate }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: 'var(--gold)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Fiscal Registry</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <PortfolioButton variant="glass" onClick={() => window.open('/forms/utils/generate-pdf/InvoiceBook/', '_blank')} style={{ padding: '8px 20px', fontSize: '11px' }}>
                        <Download size={14} /> EXPORT
                    </PortfolioButton>
                </div>
            </div>
            <PortfolioCard style={{ padding: 0, overflow: 'hidden', background: 'rgba(0,0,0,0.3)' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                    <thead>
                        <tr style={{ background: 'rgba(176,141,87,0.05)' }}>
                            <th style={thStyle}>POST DATE</th>
                            <th style={thStyle}>IDENTITY #</th>
                            <th style={thStyle}>CLIENT / NARRATIVE</th>
                            <th style={thStyle}>LEVEL</th>
                            <th style={{ ...thStyle, textAlign: 'right' }}>GRAND TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.slice(0, 15).map(entry => (
                            <tr key={entry.id} style={{ borderBottom: '1px solid rgba(232, 230, 227, 0.03)' }} className="table-row-hover">
                                <td style={tdStyle}>{new Date(entry.date).toLocaleDateString()}</td>
                                <td style={{ ...tdStyle, color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px' }}>{entry.number}</td>
                                <td style={{ ...tdStyle, color: 'var(--cream)', fontWeight: '300' }}>{entry.customer}</td>
                                <td style={tdStyle}>
                                    <span style={{
                                        fontSize: '8px', fontWeight: '900', letterSpacing: '1px',
                                        padding: '4px 12px', borderRadius: '30px',
                                        background: entry.status === 'PAID' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                        color: entry.status === 'PAID' ? '#10b981' : '#f43f5e',
                                        border: entry.status === 'PAID' ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(244,63,94,0.2)'
                                    }}>
                                        {entry.status}
                                    </span>
                                </td>
                                <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--gold)' }}>
                                    AED {parseFloat(entry.grand_total).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </PortfolioCard>
        </motion.div>
    );
};

const FinancePortal = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('CONSOLE');
    const [stats, setStats] = useState({});
    const [accounts, setAccounts] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [accRes, summaryRes, invRes] = await Promise.all([
                    api.get('/finance/api/accounts/'),
                    api.get('/finance/api/transactions/financial_summary/'),
                    api.get(`/reports/api/invoice-book/`)
                ]);

                setAccounts(accRes.data);
                const { summary, budgets } = summaryRes.data;
                setStats({
                    summary,
                    budgets: budgets || []
                });
                setInvoices(invRes.data.entries || []);
            } catch (err) {
                console.error("Failed to fetch finance portal data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const kpis = [
        { label: 'Total Assets', value: `AED ${(stats.summary?.total_assets / 1000000 || 0).toFixed(1)}M`, subvalue: 'Aggregated Balance', icon: Wallet, color: '#3b82f6' },
        { label: 'MTD Revenue', value: `AED ${(stats.summary?.monthly_revenue / 1000 || 0).toFixed(0)}k`, subvalue: 'Fiscal Inflow', icon: TrendingUp, color: '#10b981' },
        { label: 'MTD Expense', value: `AED ${(stats.summary?.monthly_expense / 1000 || 0).toFixed(0)}k`, subvalue: 'Operational Outflow', icon: TrendingDown, color: '#f43f5e' },
        { label: 'Net Profit', value: `AED ${(stats.summary?.monthly_net / 1000 || 0).toFixed(0)}k`, subvalue: 'Margin Realization', icon: DollarSign, color: 'var(--gold)' }
    ];

    if (loading) return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '20px' }}>
                <div className="portfolio-spinner"></div>
                <p style={{ color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>Compiling Fiscal Records...</p>
            </div>

        </PortfolioPage>
    );

    return (
        <PortfolioPage breadcrumb="EXECUTIVE / FINANCIAL VAULT">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Strategic Fiscal Oversight & Multi-Division Ledgering">
                    FINANCE<br />PORTAL
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton variant="glass" onClick={() => navigate('/finance/transaction')}>
                        <Plus size={16} /> NEW ENTRY
                    </PortfolioButton>
                </div>
            </div>

            <PortfolioStats stats={kpis} />

            <div style={{ display: 'flex', gap: '40px', marginBottom: '50px', borderBottom: '1px solid rgba(232, 230, 227, 0.1)' }}>
                {['CONSOLE', 'LEDGER', 'INVOICES', 'BUDGETS'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '15px 0',
                            background: 'transparent',
                            border: 'none',
                            color: activeTab === tab ? 'var(--gold)' : 'rgba(232, 230, 227, 0.4)',
                            fontSize: '11px',
                            fontWeight: '900',
                            letterSpacing: '2px',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'all 0.3s'
                        }}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTabFinance"
                                style={{
                                    position: 'absolute',
                                    bottom: '-1px',
                                    left: 0,
                                    right: 0,
                                    height: '2px',
                                    background: 'var(--gold)'
                                }}
                            />
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'CONSOLE' && <ConsoleTab key="console" summary={stats.summary} budgets={stats.budgets} navigate={navigate} />}
                {activeTab === 'LEDGER' && <LedgerTab key="ledger" accounts={accounts} navigate={navigate} />}
                {activeTab === 'INVOICES' && <InvoiceTab key="invoices" entries={invoices} navigate={navigate} />}
                {activeTab === 'BUDGETS' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ color: 'var(--gold)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Capital Allocations</h3>
                            <PortfolioButton variant="glass" onClick={() => navigate('/finance/budget')} style={{ padding: '8px 20px', fontSize: '11px' }}>
                                MANAGE ALLOCATIONS
                            </PortfolioButton>
                        </div>
                        <PortfolioGrid columns="repeat(auto-fill, minmax(350px, 1fr))" gap="25px">
                            {stats.budgets.map((b, i) => (
                                <PortfolioCard key={i} style={{ padding: '35px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                                        <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'rgba(176, 141, 87, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <PieChart size={24} color="var(--gold)" />
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '10px', color: 'rgba(232, 230, 227, 0.4)', fontWeight: '900', letterSpacing: '1px' }}>UTILIZATION</div>
                                            <div style={{ fontSize: '18px', color: b.percent > 90 ? '#f43f5e' : 'var(--gold)', fontWeight: '800' }}>{b.percent}%</div>
                                        </div>
                                    </div>
                                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: 'var(--cream)', fontWeight: '600' }}>{b.label}</h3>
                                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginTop: '20px' }}>
                                        <div style={{ width: `${Math.min(b.percent, 100)}%`, height: '100%', background: b.percent > 90 ? '#f43f5e' : 'var(--gold)' }}></div>
                                    </div>
                                </PortfolioCard>
                            ))}
                        </PortfolioGrid>
                    </motion.div>
                )}
            </AnimatePresence>
        </PortfolioPage>
    );
};

const thStyle = {
    padding: '20px 25px',
    textAlign: 'left',
    fontSize: '9px',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    fontWeight: '900',
    letterSpacing: '2px',
    opacity: 0.8
};

const tdStyle = {
    padding: '20px 25px',
    fontSize: '13px',
    color: 'var(--cream)',
    opacity: 0.9
};

export default FinancePortal;
