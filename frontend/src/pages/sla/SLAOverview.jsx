import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    Shield, ArrowUpRight, BarChart3, Users, FileText,
    AlertTriangle, Clock, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioStats,
    PortfolioGrid,
    PortfolioCard,
    PortfolioSectionTitle
} from '../../components/PortfolioComponents';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';

const SLAOverview = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        overall_compliance: 0,
        active_agreements: 0,
        pending_violations: 0,
        total_credits: 0
    });
    const [violations, setViolations] = useState([]);
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [summaryRes, violationsRes] = await Promise.all([
                api.get('/api/contracts/sla/agreements/summary/'),
                api.get('/api/contracts/sla/violations/')
            ]);

            const summary = summaryRes.data;
            const viols = Array.isArray(violationsRes.data) ? violationsRes.data : violationsRes.data.results || [];

            setStats({
                overall_compliance: summary.overall_compliance || 0,
                active_agreements: summary.active_agreements || 0,
                pending_violations: summary.pending_violations || 0,
                total_credits: viols.reduce((sum, v) => sum + (parseFloat(v.service_credit_amount) || 0), 0)
            });

            setViolations(viols.slice(0, 5));
            setTrends(summary.monthly_trends || []);
        } catch (err) {
            console.error('Error fetching SLA data', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div style={{ color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>Loading Compliance Data...</div>
            </div>
        </PortfolioPage>
    );

    const portfolioStatsData = [
        { label: "COMPLIANCE SCORE", value: `${stats.overall_compliance}%`, color: "#10b981" },
        { label: "ACTIVE AGREEMENTS", value: stats.active_agreements, color: "var(--gold)" },
        { label: "PENDING VIOLATIONS", value: stats.pending_violations, color: stats.pending_violations > 0 ? "#ef4444" : "#10b981" },
        { label: "SERVICE CREDITS", value: `AED ${stats.total_credits.toLocaleString()}`, color: "#3b82f6" },
    ];

    return (
        <PortfolioPage>
            <PortfolioTitle subtitle="Commercial compliance and real-time service level orchestration">
                SLA Command Center
            </PortfolioTitle>

            <PortfolioStats stats={portfolioStatsData} />

            <PortfolioGrid columns="2fr 1fr">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {/* Compliance Trends */}
                        <PortfolioCard>
                            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <BarChart3 size={18} color="var(--gold)" />
                                    <h3 style={{ margin: 0, color: 'var(--cream)', fontSize: '16px', fontWeight: '500' }}>Compliance Trend</h3>
                                </div>
                            </div>
                            <div style={{ height: '200px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={trends}>
                                        <XAxis dataKey="month" stroke="rgba(232,230,227,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                                            cursor={{ fill: 'rgba(176,141,87,0.1)' }}
                                        />
                                        <Bar dataKey="compliance" radius={[4, 4, 0, 0]}>
                                            {trends.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.compliance >= 95 ? '#10b981' : entry.compliance >= 90 ? '#f59e0b' : '#ef4444'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </PortfolioCard>

                        {/* Top Partners */}
                        <PortfolioCard>
                            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Users size={18} color="var(--gold)" />
                                <h3 style={{ margin: 0, color: 'var(--cream)', fontSize: '16px', fontWeight: '500' }}>Strategic Partners</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={partnerRow}>
                                    <span>Al Futtaim Motors</span>
                                    <span style={{ color: '#10b981', fontSize: '10px', background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: '4px' }}>PLATINUM</span>
                                </div>
                                <div style={partnerRow}>
                                    <span>Emirates Transport</span>
                                    <span style={{ color: '#f59e0b', fontSize: '10px', background: 'rgba(245,158,11,0.1)', padding: '4px 8px', borderRadius: '4px' }}>GOLD</span>
                                </div>
                                <div style={partnerRow}>
                                    <span>Dubai Police</span>
                                    <span style={{ color: '#10b981', fontSize: '10px', background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: '4px' }}>PLATINUM</span>
                                </div>
                            </div>
                        </PortfolioCard>
                    </div>

                    {/* Active Agreements Link */}
                    <PortfolioCard onClick={() => navigate('/sla/list')}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(176,141,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FileText size={20} color="var(--gold)" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, color: 'var(--cream)', fontSize: '16px', fontWeight: '500' }}>Active Agreements Registry</h3>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'rgba(232, 230, 227, 0.5)' }}>View full contract details and service thresholds</p>
                                </div>
                            </div>
                            <ArrowUpRight size={20} color="var(--gold)" />
                        </div>
                    </PortfolioCard>
                </div>

                {/* Violations & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <PortfolioCard>
                        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <AlertTriangle size={18} color="#ef4444" />
                            <h3 style={{ margin: 0, color: 'var(--cream)', fontSize: '16px', fontWeight: '500' }}>Recent Violations</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                            {violations.length > 0 ? violations.map(v => (
                                <div key={v.id} style={violationItem}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ color: 'var(--cream)', fontWeight: '500', fontSize: '13px' }}>{v.violation_type_display || v.violation_type}</span>
                                        <span style={{ color: '#ef4444', fontWeight: '600', fontSize: '12px' }}>-{v.service_credit_amount} AED</span>
                                    </div>
                                    <div style={{ color: 'rgba(232, 230, 227, 0.5)', fontSize: '11px' }}>{new Date(v.violation_date).toLocaleDateString()}</div>
                                </div>
                            )) : (
                                <div style={{ padding: '30px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.4)', fontSize: '13px', border: '1px dashed rgba(232, 230, 227, 0.1)', borderRadius: '10px' }}>
                                    No recent violations detected.
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => navigate('/construction')}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'transparent',
                                border: '1px solid var(--gold)',
                                borderRadius: '8px',
                                color: 'var(--gold)',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            GENERATE REPORT
                        </button>
                    </PortfolioCard>
                </div>
            </PortfolioGrid>
        </PortfolioPage>
    );
};

const partnerRow = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid rgba(232,230,227,0.05)',
    fontSize: '14px',
    color: 'var(--cream)',
    fontWeight: '400'
};

const violationItem = {
    padding: '12px',
    background: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.1)',
    borderRadius: '8px',
};

export default SLAOverview;
