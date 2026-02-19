import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioStats,
    PortfolioButton,
    PortfolioCard,
    PortfolioGrid,
    PortfolioSectionTitle,
    PortfolioDetailBox
} from '../../components/PortfolioComponents';
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
                monthly_revenue: summary.period_revenue >= 1000 ? (summary.period_revenue / 1000).toFixed(1) + 'K' : summary.period_revenue,
                monthly_expense: summary.period_expense >= 1000 ? (summary.period_expense / 1000).toFixed(1) + 'K' : summary.period_expense,
                net_profit: summary.period_net >= 1000 ? (summary.period_net / 1000).toFixed(1) + 'K' : summary.period_net,
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
        <PortfolioPage breadcrumb="FINANCE // EXECUTIVE DASHBOARD">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '80px' }}>
                <PortfolioTitle subtitle="Real-time fiscal monitoring, automated ledgering, and strategic financial control.">
                    EXECUTIVE CONSOLE
                </PortfolioTitle>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '100px' }}>
                    <PortfolioButton variant="secondary" onClick={() => navigate('/finance/budget')}>
                        BUDGETS
                    </PortfolioButton>
                    <PortfolioButton variant="secondary" onClick={() => navigate('/finance/invoice-book')}>
                        INVOICES
                    </PortfolioButton>
                    <PortfolioButton variant="gold" onClick={() => navigate('/finance/transaction')}>
                        <Plus size={16} /> NEW ENTRY
                    </PortfolioButton>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '80px', textAlign: 'center', color: 'var(--cream)', opacity: 0.5 }}>Syncing Ledger...</div>
            ) : (
                <>
                    <PortfolioStats stats={[
                        { label: 'TOTAL ASSETS', value: `AED ${stats.total_assets}` },
                        { label: 'MONTHLY REVENUE', value: `AED ${stats.monthly_revenue}`, color: '#10b981' },
                        { label: 'MONTHLY EXPENSE', value: `AED ${stats.monthly_expense}`, color: '#f43f5e' },
                        { label: 'NET PROFIT', value: `AED ${stats.net_profit}`, color: 'var(--gold)' }
                    ]} />

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '60px', marginTop: '40px' }}>
                        {/* Live Ledger */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                                <PortfolioSectionTitle>EXECUTIVE LEDGER</PortfolioSectionTitle>
                                <PortfolioButton variant="secondary" onClick={() => navigate('/finance/coa')} style={{ padding: '8px 20px', fontSize: '10px', letterSpacing: '2px' }}>
                                    EXPLORE ARCHITECTURE
                                </PortfolioButton>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {accounts.slice(0, 7).map(acc => (
                                    <div key={acc.id} style={{
                                        padding: '25px 35px',
                                        background: 'rgba(250, 249, 246, 0.02)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(250, 249, 246, 0.05)',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                    }} className="ledger-row-hover">
                                        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                                            <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', width: '60px', letterSpacing: '2px' }}>ID-{acc.code}</div>
                                            <div>
                                                <div style={{ fontSize: '17px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', fontWeight: '300', letterSpacing: '0.5px' }}>{acc.name}</div>
                                                <div style={{ fontSize: '9px', fontWeight: '800', color: 'rgba(176, 141, 87, 0.5)', textTransform: 'uppercase', marginTop: '6px', letterSpacing: '2px' }}>{acc.category}</div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '22px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'var(--font-serif)' }}>
                                                AED {parseFloat(acc.balance).toLocaleString()}
                                            </div>
                                            <div style={{ fontSize: '9px', fontWeight: '800', color: '#10b981', letterSpacing: '2px', marginTop: '4px' }}>SYNCED // LIVE</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Lateral Sidebar */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
                            <PortfolioCard borderColor="rgba(250, 249, 246, 0.1)" background="rgba(10, 10, 12, 0.4)">
                                <PortfolioSectionTitle style={{ marginBottom: '30px', fontSize: '11px' }}>FISCAL COMPLIANCE</PortfolioSectionTitle>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                    {liveBudgets.map((b, idx) => (
                                        <div key={idx}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '14px', letterSpacing: '2px', fontWeight: '800' }}>
                                                <span style={{ color: 'var(--cream)' }}>{b.label}</span>
                                                <span style={{ color: b.percent > 90 ? '#f43f5e' : 'var(--gold)' }}>{b.percent}%</span>
                                            </div>
                                            <div style={{ width: '100%', height: '2px', background: 'rgba(250, 249, 246, 0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                                <div style={{
                                                    width: `${Math.min(b.percent, 100)}%`,
                                                    height: '100%',
                                                    background: b.percent > 90 ? '#f43f5e' : 'var(--gold)',
                                                    boxShadow: b.percent > 90 ? '0 0 15px rgba(244, 63, 94, 0.4)' : '0 0 10px rgba(176, 141, 87, 0.2)'
                                                }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </PortfolioCard>

                            <PortfolioCard borderColor="var(--gold)" background="linear-gradient(135deg, rgba(176, 141, 87, 0.05) 0%, rgba(10, 10, 12, 0.4) 100%)">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(176, 141, 87, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(176, 141, 87, 0.2)' }}>
                                        <TrendingUp color="var(--gold)" size={20} />
                                    </div>
                                    <h4 style={{ margin: 0, fontWeight: '800', fontSize: '12px', letterSpacing: '2px', color: 'var(--cream)', textTransform: 'uppercase' }}>Strategic Health</h4>
                                </div>
                                <p style={{ fontSize: '14px', color: 'rgba(250, 249, 246, 0.6)', lineHeight: '1.7', marginBottom: '30px', fontWeight: '400' }}>
                                    Executive margins are stable. Real-time liquidity remains optimized for Phase 5 expansion protocols.
                                </p>
                                <PortfolioButton variant="gold" onClick={() => navigate('/finance/reports')} style={{ width: '100%', padding: '15px', letterSpacing: '2px' }}>
                                    GENERATE FISCAL P&L
                                </PortfolioButton>
                            </PortfolioCard>
                        </div>
                    </div>
                </>
            )}
        </PortfolioPage>
    );
};

export default FinanceOverview;
