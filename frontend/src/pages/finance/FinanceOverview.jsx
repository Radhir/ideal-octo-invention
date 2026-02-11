import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import {
    TrendingUp, TrendingDown,
    ArrowUpRight, Wallet, Receipt,
    FileText, Plus, ChevronRight,
    ClipboardList, Award
} from 'lucide-react';

const FinanceOverview = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total_assets: '0',
        monthly_revenue: '0',
        monthly_expense: '0',
        net_profit: '0'
    });
    const [liveBudgets, setLiveBudgets] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const [accRes, summaryRes] = await Promise.all([
                api.get('/finance/api/accounts/'),
                api.get('/finance/api/transactions/financial_summary/')
            ]);

            const { summary, budgets } = summaryRes.data;

            setAccounts(accRes.data);
            setStats({
                total_assets: summary.total_assets >= 1000000 ? (summary.total_assets / 1000000).toFixed(1) + 'M' : (summary.total_assets / 1000).toFixed(1) + 'K',
                monthly_revenue: summary.monthly_revenue >= 1000 ? (summary.monthly_revenue / 1000).toFixed(1) + 'K' : summary.monthly_revenue,
                monthly_expense: summary.monthly_expense >= 1000 ? (summary.monthly_expense / 1000).toFixed(1) + 'K' : summary.monthly_expense,
                net_profit: summary.monthly_net >= 1000 ? (summary.monthly_net / 1000).toFixed(1) + 'K' : summary.monthly_net,
                trends: summary.trends
            });
            setLiveBudgets(budgets);
        } catch (err) {
            console.error('Error fetching finance data', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div style={{ padding: '30px 20px', animation: 'fadeIn 0.5s ease-out' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px' }}>EXECUTIVE COMMAND</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>Finance Console</h1>
                    <p style={{ color: 'var(--gold)', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Real-time fiscal monitoring & automated ledgering</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                        className="glass-card"
                        onClick={() => navigate('/finance/reports')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', color: 'var(--text-primary)', cursor: 'pointer', border: '1.5px solid var(--gold-border)', background: 'var(--input-bg)' }}
                    >
                        <FileText size={18} color="var(--gold)" /> Financial Reports
                    </button>
                    <button
                        className="glass-card"
                        onClick={() => navigate('/finance/invoice-book')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', color: 'var(--text-primary)', cursor: 'pointer', border: '1.5px solid var(--gold-border)' }}
                    >
                        <Receipt size={18} color="var(--gold)" /> Invoice Book
                    </button>
                    <button
                        className="glass-card"
                        onClick={() => navigate('/workshop-diary')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', color: 'var(--text-primary)', cursor: 'pointer', border: '1.5px solid var(--gold-border)', background: 'var(--input-bg)' }}
                    >
                        <ClipboardList size={18} color="var(--gold)" /> Workshop Diary
                    </button>
                    <button
                        className="glass-card"
                        onClick={() => navigate('/finance/commissions')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', color: 'var(--text-primary)', cursor: 'pointer', border: '1.5px solid var(--gold-border)' }}
                    >
                        <Award size={18} color="var(--gold)" /> Commission Hub
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/finance/transaction')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1.5px solid var(--gold-border)', height: '50px', padding: '0 25px', borderRadius: '25px', fontSize: '12px', fontWeight: '900', background: 'var(--gold)', color: '#000' }}
                    >
                        <Plus size={20} /> NEW TRANSACTION
                    </button>
                </div>
            </header>

            {loading ? (
                <div style={{ padding: '50px', textAlign: 'center', color: '#fff' }}>Syncing Ledger...</div>
            ) : (
                <>
                    {/* Top Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                        <StatCard label="Total Assets" value={`AED ${stats.total_assets}`} icon={<Wallet color="var(--gold)" />} />
                        <StatCard label="Monthly Revenue" value={`AED ${stats.monthly_revenue}`} icon={<TrendingUp color="#10b981" />} trend={true} trendValue={stats.trends?.revenue_growth} />
                        <StatCard label="Monthly Expense" value={`AED ${stats.monthly_expense}`} icon={<Receipt color="#f43f5e" />} trend={true} trendValue={stats.trends?.expense_growth} inverse />
                        <StatCard label="Monthly Net" value={`AED ${stats.net_profit}`} icon={<ArrowUpRight color="var(--gold)" />} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                        {/* Active Ledger Preview */}
                        <GlassCard style={{ padding: '30px', border: '1.5px solid var(--gold-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)' }}>Live Ledger Preview</h3>
                                <Link to="/finance/coa" style={{ color: 'var(--gold)', fontSize: '13px', fontWeight: '900', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', textTransform: 'uppercase' }}>
                                    Explore COA <ChevronRight size={14} />
                                </Link>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2.5px solid var(--gold-border)', color: 'var(--gold)', fontSize: '11px', textTransform: 'uppercase', background: 'var(--input-bg)', letterSpacing: '2px' }}>
                                            <th style={{ padding: '18px 15px', textAlign: 'left', fontWeight: '900' }}>Ledger Node</th>
                                            <th style={{ padding: '18px 15px', textAlign: 'left', fontWeight: '900' }}>Account Name</th>
                                            <th style={{ padding: '18px 15px', textAlign: 'left', fontWeight: '900' }}>Classification</th>
                                            <th style={{ padding: '18px 15px', textAlign: 'right', fontWeight: '900' }}>Master Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {accounts.slice(0, 8).map(acc => (
                                            <tr key={acc.id} style={{ borderBottom: '1.5px solid rgba(176,141,87,0.1)' }}>
                                                <td style={{ padding: '18px 15px', fontWeight: '900', color: 'var(--gold)', fontSize: '13px' }}>#{acc.code}</td>
                                                <td style={{ padding: '18px 15px', fontWeight: '900', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{acc.name}</td>
                                                <td style={{ padding: '18px 15px', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '900', textTransform: 'uppercase' }}>{acc.category}</td>
                                                <td style={{ padding: '18px 15px', textAlign: 'right', fontWeight: '900', color: 'var(--text-primary)', fontSize: '18px', fontFamily: 'Outfit, sans-serif' }}>AED {parseFloat(acc.balance).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </GlassCard>

                        {/* Budget Status */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <GlassCard style={{ padding: '30px', border: '1.5px solid var(--gold-border)' }}>
                                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)' }}>Budget Compliance</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {liveBudgets.length > 0 ? liveBudgets.map((b, idx) => (
                                        <BudgetProgress
                                            key={idx}
                                            label={b.label}
                                            used={b.used}
                                            total={b.total}
                                            percent={b.percent}
                                            color={['#3b82f6', '#10b981', '#f59e0b', '#f43f5e'][idx % 4]}
                                            warning={b.percent > 90}
                                        />
                                    )) : (
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '13px', padding: '20px', textAlign: 'center', fontWeight: '800' }}>No budgets defined for the current period.</div>
                                    )}
                                </div>
                            </GlassCard>

                            <GlassCard style={{ padding: '30px', background: 'var(--gold-glow)', border: '1.5px solid var(--gold-border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                    <div style={{ background: 'var(--input-bg)', padding: '10px', borderRadius: '12px', border: '1px solid var(--gold-border)' }}>
                                        <TrendingUp color="var(--gold)" size={24} />
                                    </div>
                                    <h4 style={{ margin: 0, fontWeight: '900', color: 'var(--text-primary)' }}>Financial Health</h4>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', fontWeight: '800' }}>
                                    Your net profit margin is healthy. Automated revenue logging is capturing 100% of paid invoices.
                                </p>
                                <button className="btn-primary" onClick={() => navigate('/finance/reports')} style={{ width: '100%', marginTop: '10px', border: '1.5px solid var(--gold-border)' }}>View P&L Statement</button>
                            </GlassCard>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const StatCard = ({ label, value, icon, trend, trendValue, inverse }) => (
    <GlassCard style={{ padding: '25px', border: '1.5px solid var(--gold-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
            <div style={{ background: 'var(--gold-glow)', padding: '10px', borderRadius: '12px', border: '1px solid var(--gold-border)' }}>{icon}</div>
            {trend && trendValue !== undefined && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: '900',
                    color: (trendValue >= 0) ? (inverse ? '#f43f5e' : '#10b981') : (inverse ? '#10b981' : '#f43f5e'),
                    background: (trendValue >= 0) ? (inverse ? '#f43f5e11' : '#10b98111') : (inverse ? '#10b98111' : '#f43f5e11'),
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: `1px solid ${(trendValue >= 0) ? (inverse ? '#f43f5e40' : '#10b98140') : (inverse ? '#10b98140' : '#f43f5e40')}`
                }}>
                    {trendValue >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(trendValue).toFixed(1)}% GROWTH
                </div>
            )}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontWeight: '900' }}>{label}</div>
        <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{value}</div>
    </GlassCard>
);

const BudgetProgress = ({ label, used, total, percent, color, warning }) => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ fontWeight: '900', color: 'var(--text-primary)' }}>{label}</span>
                <span style={{ color: warning ? '#f43f5e' : 'var(--text-secondary)', fontWeight: '900' }}>
                    AED {used.toLocaleString()} <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>/ {total.toLocaleString()}</span>
                </span>
            </div>
            <div style={{ width: '100%', height: '10px', background: 'var(--input-bg)', borderRadius: '5px', overflow: 'hidden', border: '1.5px solid var(--gold-border)' }}>
                <div style={{ width: `${Math.min(percent, 100)}%`, height: '100%', background: color, borderRadius: '5px', boxShadow: `0 0 10px ${color}44` }}></div>
            </div>
        </div>
    );
};

export default FinanceOverview;
