import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import {
    DollarSign, BarChart3, PieChart, TrendingUp, TrendingDown,
    ArrowUpRight, ArrowDownRight, Wallet, Receipt,
    Briefcase, FileText, Download, Filter, Plus, ChevronRight
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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
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
    };

    return (
        <div style={{ padding: '30px 20px', animation: 'fadeIn 0.5s ease-out' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '2px' }}>EXECUTIVE COMMAND</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>Finance Console</h1>
                    <p style={{ color: '#94a3b8' }}>Real-time fiscal monitoring & automated ledgering</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                        className="glass-card"
                        onClick={() => navigate('/finance/reports')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', color: '#fff', cursor: 'pointer', border: '1px solid rgba(176,141,87,0.3)' }}
                    >
                        <FileText size={18} color="#b08d57" /> Financial Reports
                    </button>
                    <button
                        className="glass-card"
                        onClick={() => navigate('/finance/coa')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', color: '#fff', cursor: 'pointer' }}
                    >
                        <PieChart size={18} /> Chart of Accounts
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/finance/transaction')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Plus size={20} /> New Transaction
                    </button>
                </div>
            </header>

            {loading ? (
                <div style={{ padding: '50px', textAlign: 'center', color: '#fff' }}>Syncing Ledger...</div>
            ) : (
                <>
                    {/* Top Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                        <StatCard label="Total Assets" value={`AED ${stats.total_assets}`} icon={<Wallet color="#3b82f6" />} />
                        <StatCard label="Monthly Revenue" value={`AED ${stats.monthly_revenue}`} icon={<TrendingUp color="#10b981" />} trend={true} trendValue={stats.trends?.revenue_growth} />
                        <StatCard label="Monthly Expense" value={`AED ${stats.monthly_expense}`} icon={<Receipt color="#f43f5e" />} trend={true} trendValue={stats.trends?.expense_growth} inverse />
                        <StatCard label="Monthly Net" value={`AED ${stats.net_profit}`} icon={<ArrowUpRight color="#b08d57" />} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                        {/* Active Ledger Preview */}
                        <GlassCard style={{ padding: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Live Ledger Preview</h3>
                                <Link to="/finance/coa" style={{ color: '#b08d57', fontSize: '13px', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    Explore COA <ChevronRight size={14} />
                                </Link>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                                            <th style={{ padding: '15px', textAlign: 'left' }}>Code</th>
                                            <th style={{ padding: '15px', textAlign: 'left' }}>Account Name</th>
                                            <th style={{ padding: '15px', textAlign: 'left' }}>Category</th>
                                            <th style={{ padding: '15px', textAlign: 'right' }}>Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {accounts.slice(0, 8).map(acc => (
                                            <tr key={acc.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                                <td style={{ padding: '15px', fontWeight: '700', color: '#b08d57' }}>{acc.code}</td>
                                                <td style={{ padding: '15px', fontWeight: '600' }}>{acc.name}</td>
                                                <td style={{ padding: '15px', fontSize: '13px', color: '#64748b' }}>{acc.category}</td>
                                                <td style={{ padding: '15px', textAlign: 'right', fontWeight: '800' }}>AED {parseFloat(acc.balance).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </GlassCard>

                        {/* Budget Status */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <GlassCard style={{ padding: '30px' }}>
                                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '800' }}>Budget Compliance</h3>
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
                                        <div style={{ color: '#64748b', fontSize: '13px', padding: '20px', textAlign: 'center' }}>No budgets defined for the current period.</div>
                                    )}
                                </div>
                            </GlassCard>

                            <GlassCard style={{ padding: '30px', background: 'linear-gradient(135deg, rgba(176,141,87,0.1), transparent)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                    <div style={{ background: '#b08d5733', padding: '10px', borderRadius: '12px' }}>
                                        <TrendingUp color="#b08d57" size={24} />
                                    </div>
                                    <h4 style={{ margin: 0, fontWeight: '800' }}>Financial Health</h4>
                                </div>
                                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
                                    Your net profit margin is healthy. Automated revenue logging is capturing 100% of paid invoices.
                                </p>
                                <button className="btn-primary" onClick={() => navigate('/finance/reports')} style={{ width: '100%', marginTop: '10px' }}>View P&L Statement</button>
                            </GlassCard>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const StatCard = ({ label, value, icon, trend, trendValue, inverse }) => (
    <GlassCard style={{ padding: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '12px' }}>{icon}</div>
            {trend && trendValue !== undefined && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: '800',
                    color: (trendValue >= 0) ? (inverse ? '#f43f5e' : '#10b981') : (inverse ? '#10b981' : '#f43f5e'),
                    background: (trendValue >= 0) ? (inverse ? '#f43f5e11' : '#10b98111') : (inverse ? '#10b98111' : '#f43f5e11'),
                    padding: '4px 8px',
                    borderRadius: '6px'
                }}>
                    {trendValue >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(trendValue).toFixed(1)}%
                </div>
            )}
        </div>
        <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>{label}</div>
        <div style={{ fontSize: '24px', fontWeight: '900', color: '#fff' }}>{value}</div>
    </GlassCard>
);

const BudgetProgress = ({ label, used, total, percent, color, warning }) => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ fontWeight: '600', color: '#f1f5f9' }}>{label}</span>
                <span style={{ color: warning ? '#f43f5e' : '#64748b' }}>
                    AED {used.toLocaleString()} <span style={{ color: '#64748b', fontSize: '11px' }}>/ {total.toLocaleString()}</span>
                </span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(percent, 100)}%`, height: '100%', background: color, borderRadius: '3px' }}></div>
            </div>
        </div>
    );
};

export default FinanceOverview;
