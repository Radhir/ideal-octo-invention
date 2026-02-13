import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import BentoCard from '../../components/BentoCard';
import {
    Shield, CheckCircle, AlertTriangle, Clock,
    ArrowUpRight, BarChart3, Users, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

    if (loading) return <div style={{ padding: '40px', color: '#fff' }}>Synthesizing Compliance Data...</div>;

    return (
        <div style={{ padding: '40px', minHeight: '100vh', background: 'var(--bg-primary)', maxWidth: '1400px', margin: '0 auto' }}>
            <header style={{ marginBottom: '60px' }}>
                <div className="editorial-label">CORE STRATEGY</div>
                <h1 className="serif-display" style={{ margin: '10px 0' }}>SLA Command Center</h1>
                <p className="editorial-text" style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>
                    Commercial compliance and real-time service level orchestration.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <StatCard
                    label="Compliance Score"
                    value={`${stats.overall_compliance}%`}
                    icon={Shield}
                    color="#10b981"
                    trend="+1.2%"
                />
                <StatCard
                    label="Active Contracts"
                    value={stats.active_agreements}
                    icon={FileText}
                    color="var(--gold)"
                />
                <StatCard
                    label="Pending Violations"
                    value={stats.pending_violations}
                    icon={AlertTriangle}
                    color="#f43f5e"
                    pulse={stats.pending_violations > 0}
                />
                <StatCard
                    label="Service Credits"
                    value={`AED ${stats.total_credits.toLocaleString()}`}
                    icon={Clock}
                    color="#3b82f6"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                        <BentoCard
                            title="Compliance Trends"
                            label="METRICS"
                            icon={BarChart3}
                        >
                            <div style={{ marginTop: '20px', height: '150px', display: 'flex', alignItems: 'flex-end', gap: '15px' }}>
                                {trends.length > 0 ? trends.map((t, i) => (
                                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            width: '100%',
                                            background: 'var(--gold)',
                                            height: `${t.compliance}%`,
                                            borderRadius: '4px',
                                            opacity: 0.3 + (t.compliance / 150),
                                            minHeight: '4px'
                                        }} />
                                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{t.month}</span>
                                    </div>
                                )) : (
                                    <div style={{ color: 'var(--text-muted)', fontSize: '12px', width: '100%', textAlign: 'center' }}>No trend data available</div>
                                )}
                            </div>
                        </BentoCard>
                        <BentoCard
                            title="Corporate Partners"
                            label="FLEET"
                            icon={Users}
                        >
                            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={partnerRow}><span>Al Futtaim Motors</span><span style={{ color: '#10b981' }}>PLATINUM</span></div>
                                <div style={partnerRow}><span>Emirates Transport</span><span style={{ color: '#b08d57' }}>GOLD</span></div>
                                <div style={partnerRow}><span>Dubai Police</span><span style={{ color: '#10b981' }}>PLATINUM</span></div>
                            </div>
                        </BentoCard>
                    </div>

                    <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>Active Agreements</h3>
                            <button onClick={() => navigate('/sla/list')} style={actionBtn}>View All Agreements <ArrowUpRight size={14} /></button>
                        </div>
                        <div style={{ padding: '20px' }}>
                            {/* Table Placeholder / Summary */}
                            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center', padding: '40px' }}>
                                Access the full registry for detailed contract analysis.
                            </div>
                        </div>
                    </GlassCard>
                </div>

                <GlassCard style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AlertTriangle size={20} color="#f43f5e" />
                        <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>Recent Violations</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {violations.length > 0 ? violations.map(v => (
                            <div key={v.id} style={violationItem}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <span style={{ color: '#fff', fontWeight: '700', fontSize: '13px' }}>{v.violation_type_display || v.violation_type}</span>
                                    <span style={{ color: '#f43f5e', fontWeight: '800', fontSize: '11px' }}>-{v.service_credit_amount} AED</span>
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{new Date(v.violation_date).toLocaleDateString()}</div>
                            </div>
                        )) : (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                                No recent violations detected.
                            </div>
                        )}
                    </div>

                    <button style={reportBtn} onClick={() => navigate('/construction')}>
                        Generate Compliance Report
                    </button>
                </GlassCard>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color, trend, pulse }) => (
    <div className="editorial-card" style={{ padding: '30px', border: pulse ? `1px solid ${color}` : '1px solid var(--border-color)', animation: pulse ? 'pulseGlow 2s infinite' : 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div className="editorial-label" style={{ color: 'var(--text-muted)' }}>{label}</div>
            <Icon size={18} color={color} />
        </div>
        <div className="value-serif" style={{ fontSize: '3rem', color: pulse ? color : 'inherit' }}>{value}</div>
        {trend && <div className="editorial-label" style={{ color: '#10b981', marginTop: '10px' }}>{trend}</div>}
    </div>
);

const partnerRow = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    fontSize: '13px',
    color: '#fff',
    fontWeight: '600'
};

const violationItem = {
    padding: '12px',
    background: 'rgba(244, 63, 94, 0.05)',
    border: '1px solid rgba(244, 63, 94, 0.2)',
    borderRadius: '12px',
};

const actionBtn = {
    background: 'transparent',
    border: 'none',
    color: 'var(--gold)',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
};

const reportBtn = {
    marginTop: 'auto',
    background: 'var(--gold)',
    color: '#000',
    border: 'none',
    padding: '12px',
    borderRadius: '12px',
    fontWeight: '800',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s'
};

export default SLAOverview;
