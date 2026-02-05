import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import {
    TrendingUp, Package, Users, Activity,
    ArrowUpRight, ArrowDownRight, Calendar,
    Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, AreaChart, Area,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AnalyticsDashboard = () => {
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, chartRes] = await Promise.all([
                api.get('/api/dashboard/api/stats/'),
                api.get('/api/dashboard/workshop-diary/chart_data/')
            ]);
            setStats(statsRes.data);
            setChartData(chartRes.data);
        } catch (err) {
            console.error('Error fetching dashboard data', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: '#fff' }}>Loading Intelligence...</div>;

    const statusData = [
        { name: 'Reception', value: stats?.reception_count || 0 },
        { name: 'WIP', value: stats?.wip_count || 0 },
        { name: 'Active', value: stats?.active_jobs || 0 },
    ];

    return (
        <div style={{ padding: '30px' }}>
            <header style={{ marginBottom: '40px' }}>
                <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '2px' }}>EXECUTIVE INSIGHTS</div>
                <h1 style={{ margin: '5px 0 0 0', fontSize: '2.2rem', fontWeight: '900', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>Business Intelligence</h1>
            </header>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '30px' }}>
                <KPICard
                    label="Monthly Revenue"
                    value={`AED ${(stats?.monthly_revenue || 0).toLocaleString()}`}
                    trend="+12.5%"
                    icon={TrendingUp}
                    color="#10b981"
                />
                <KPICard
                    label="Active Jobs"
                    value={stats?.active_jobs || 0}
                    trend="+3"
                    icon={Package}
                    color="#3b82f6"
                />
                <KPICard
                    label="Today's Bookings"
                    value={stats?.todays_bookings || 0}
                    trend="New"
                    icon={Calendar}
                    color="#f59e0b"
                />
                <KPICard
                    label="New Leads"
                    value={stats?.new_leads || 0}
                    trend="+5"
                    icon={Users}
                    color="#8b5cf6"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '30px' }}>
                {/* Revenue Trend */}
                <GlassCard style={{ padding: '30px' }}>
                    <h3 style={cardTitleStyle}>Revenue Performance (Last 30 Days)</h3>
                    <div style={{ height: '350px', width: '100%' }}>
                        <ResponsiveContainer>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#b08d57" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#b08d57" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickFormatter={(str) => str.split('-').slice(1).join('/')} />
                                <YAxis stroke="#64748b" fontSize={10} />
                                <Tooltip
                                    contentStyle={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                                    itemStyle={{ color: '#b08d57' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#b08d57" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* Status Distribution */}
                <GlassCard style={{ padding: '30px' }}>
                    <h3 style={cardTitleStyle}>Workshop Throughput</h3>
                    <div style={{ height: '350px', width: '100%' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {/* Volume Stats */}
                <GlassCard style={{ padding: '30px' }}>
                    <h3 style={cardTitleStyle}>Job Volume Analysis</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickFormatter={(str) => str.split('-').slice(1).join('/')} />
                                <YAxis stroke="#64748b" fontSize={10} />
                                <Tooltip
                                    contentStyle={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                                />
                                <Bar dataKey="new_jobs_count" name="New Jobs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="closed_jobs_count" name="Closed Jobs" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* Recent Activity Mini-Feed */}
                <GlassCard style={{ padding: '30px' }}>
                    <h3 style={cardTitleStyle}>Recent Activity</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {stats?.recent_activity?.map((activity, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                <div style={{
                                    padding: '8px',
                                    borderRadius: '50%',
                                    background: 'rgba(176,141,87,0.1)',
                                    color: '#b08d57'
                                }}>
                                    <Activity size={16} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
                                        {activity.customer_name} - {activity.job_card_number}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                                        Status updated to {activity.status}
                                    </div>
                                </div>
                                <div style={{ fontSize: '10px', color: '#64748b' }}>
                                    {new Date(activity.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

const KPICard = ({ label, value, trend, icon: Icon, color }) => (
    <GlassCard style={{ padding: '25px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', background: `${color}15`, color: color }}>
                <Icon size={20} />
            </div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: '800',
                color: trend.startsWith('+') ? '#10b981' : '#f59e0b',
                background: trend.startsWith('+') ? '#10b98115' : '#f59e0b15',
                padding: '2px 8px',
                borderRadius: '20px'
            }}>
                {trend.startsWith('+') ? <ArrowUpRight size={12} /> : null} {trend}
            </div>
        </div>
        <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', marginTop: '5px' }}>{value}</div>
        </div>
        {/* Subtle background glow */}
        <div style={{
            position: 'absolute',
            bottom: '-20px',
            right: '-20px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: color,
            filter: 'blur(50px)',
            opacity: 0.1,
            zIndex: 0
        }} />
    </GlassCard>
);

const cardTitleStyle = {
    fontSize: '11px',
    textTransform: 'uppercase',
    color: '#b08d57',
    marginBottom: '25px',
    fontWeight: '800',
    letterSpacing: '1px'
};

export default AnalyticsDashboard;
