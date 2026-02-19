import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    BarChart3, TrendingUp, Users, Globe, Building2,
    DollarSign, Activity, AlertCircle
} from 'lucide-react';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioGrid,
    PortfolioTitle,
    PortfolioButton
} from '../../components/PortfolioComponents';

const ManagementDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalRevenue: 0,
        branches: [],
        csat: 4.8,
        activeEmployeeCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await api.get('/dashboard/api/management/stats/');
            setStats(res.data);
        } catch (err) {
            console.error("Failed to fetch management stats", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '20px' }}>
                <div className="spinner"></div>
                <p style={{ color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>Loading Management Data...</p>
            </div>

        </PortfolioPage>
    );

    return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <PortfolioTitle subtitle="Global Operations Overview">
                    Management Console
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton
                        variant="glass"
                        onClick={() => navigate('/reports/financial')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <BarChart3 size={18} /> Financial Reports
                    </PortfolioButton>
                </div>
            </div>

            {/* GLOBAL METRICS */}
            <PortfolioGrid columns={4} gap="20px" style={{ marginBottom: '30px' }}>
                <MetricCard icon={Globe} label="Group Revenue" value="AED 2.45M" subvalue="Consolidated MTD" color="#10b981" />
                <MetricCard icon={Building2} label="Active Branches" value="3" subvalue="All Systems Operational" color="#3b82f6" />
                <MetricCard icon={Users} label="Total Staff" value={stats.activeEmployeeCount} subvalue="Across all divisions" color="#f59e0b" />
                <MetricCard icon={Activity} label="Group CSAT" value={stats.csat} subvalue="Customer Satisfaction" color="#8b5cf6" />
            </PortfolioGrid>

            {/* BRANCH PERFORMANCE */}
            <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: 'var(--gold)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Division Performance</h3>
                <PortfolioGrid columns={3} gap="25px">
                    {stats.branches.map((branch, i) => (
                        <PortfolioCard key={i} style={{ padding: '25px', position: 'relative', overflow: 'hidden' }}>
                            {branch.status === 'Exceeding' && <div style={{ position: 'absolute', top: 0, right: 0, padding: '5px 10px', background: '#10b981', color: '#000', fontSize: '9px', fontWeight: '900', borderBottomLeftRadius: '10px' }}>TOP PERFORMER</div>}

                            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--cream)', marginBottom: '5px' }}>{branch.name}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px' }}>
                                <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--gold)' }}>AED {(branch.revenue / 1000).toFixed(0)}k</div>
                                <div style={{ color: branch.growth.startsWith('+') ? '#10b981' : '#f43f5e', fontWeight: '700', fontSize: '12px' }}>{branch.growth}</div>
                            </div>

                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '10px' }}>
                                <div style={{
                                    width: branch.status === 'Exceeding' ? '100%' : branch.status === 'On Target' ? '85%' : '60%',
                                    height: '100%',
                                    background: branch.status === 'Behind' ? '#f43f5e' : 'var(--gold)',
                                    borderRadius: '3px'
                                }}></div>
                            </div>
                            <div style={{ fontSize: '10px', color: 'rgba(232,230,227,0.5)', textAlign: 'right' }}>
                                {branch.status.toUpperCase()}
                            </div>
                        </PortfolioCard>
                    ))}
                </PortfolioGrid>
            </div>

            {/* ALERTS & NOTIFICATIONS */}
            <PortfolioCard style={{ padding: '25px', borderLeft: '4px solid #f43f5e' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                    <AlertCircle size={24} color="#f43f5e" />
                    <div>
                        <h3 style={{ margin: 0, color: 'var(--cream)', fontSize: '16px' }}>Operational Alerts</h3>
                        <p style={{ color: 'rgba(232,230,227,0.6)', fontSize: '13px', margin: '5px 0 15px' }}>
                            AMD Center is currently trending 5% below revenue targets due to staff shortages.
                        </p>
                        <PortfolioButton variant="glass" style={{ fontSize: '11px', padding: '6px 15px' }}>View Details</PortfolioButton>
                    </div>
                </div>
            </PortfolioCard>
        </PortfolioPage>
    );
};

const MetricCard = ({ icon: Icon, label, value, subvalue, color }) => (
    <PortfolioCard style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', borderLeft: `4px solid ${color}` }}>
        <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
            <Icon size={22} />
        </div>
        <div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--cream)', fontFamily: 'var(--font-serif)', lineHeight: 1, marginBottom: '4px' }}>{value}</div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(232,230,227,0.6)', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontSize: '10px', color: color, marginTop: '2px' }}>{subvalue}</div>
        </div>
    </PortfolioCard>
);

export default ManagementDashboard;
