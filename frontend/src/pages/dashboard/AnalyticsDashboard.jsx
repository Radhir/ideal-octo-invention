import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    TrendingUp, Package, Users, Activity,
    Calendar, ArrowUpRight
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioStats,
    PortfolioGrid,
    PortfolioCard
} from '../../components/PortfolioComponents';

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

    if (loading) return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div style={{ color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>Loading Intelligence...</div>
            </div>
        </PortfolioPage>
    );

    const statusData = [
        { name: 'Reception', value: stats?.reception_count || 0 },
        { name: 'WIP', value: stats?.wip_count || 0 },
        { name: 'Active', value: stats?.active_jobs || 0 },
    ];

    const portfolioStats = [
        { label: "MONTHLY REVENUE", value: `AED ${(stats?.monthly_revenue || 0).toLocaleString()}`, color: "#10b981" },
        { label: "ACTIVE JOBS", value: stats?.active_jobs || 0, color: "#3b82f6" },
        { label: "TODAY'S BOOKINGS", value: stats?.todays_bookings || 0, color: "#f59e0b" },
        { label: "NEW LEADS", value: stats?.new_leads || 0, color: "#8b5cf6" },
    ];

    return (
        <PortfolioPage>
            <PortfolioTitle subtitle="Executive insights and business intelligence">
                Business Intelligence
            </PortfolioTitle>

            <PortfolioStats stats={portfolioStats} />

            <PortfolioGrid columns="2fr 1fr">
                {/* Revenue Trend */}
                <PortfolioCard>
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, color: 'var(--cream)', fontSize: '16px', fontWeight: '500' }}>Revenue Performance</h3>
                        <div style={{ fontSize: '12px', color: 'rgba(232,230,227,0.5)' }}>Last 30 Days</div>
                    </div>
                    <div style={{ height: '350px', width: '100%' }}>
                        <ResponsiveContainer>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#b08d57" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#b08d57" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="date" stroke="rgba(232,230,227,0.3)" fontSize={10} tickFormatter={(str) => str.split('-').slice(1).join('/')} tickLine={false} axisLine={false} />
                                <YAxis stroke="rgba(232,230,227,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                                    itemStyle={{ color: '#b08d57' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#b08d57" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </PortfolioCard>

                {/* Status Distribution */}
                <PortfolioCard>
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, color: 'var(--cream)', fontSize: '16px', fontWeight: '500' }}>Workshop Throughput</h3>
                    </div>
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
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </PortfolioCard>
            </PortfolioGrid>

            <PortfolioGrid columns="1fr 1fr" style={{ marginTop: '20px' }}>
                {/* Volume Stats */}
                <PortfolioCard>
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, color: 'var(--cream)', fontSize: '16px', fontWeight: '500' }}>Job Volume Analysis</h3>
                    </div>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="date" stroke="rgba(232,230,227,0.3)" fontSize={10} tickFormatter={(str) => str.split('-').slice(1).join('/')} tickLine={false} axisLine={false} />
                                <YAxis stroke="rgba(232,230,227,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                                />
                                <Bar dataKey="new_jobs_count" name="New Jobs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="closed_jobs_count" name="Closed Jobs" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </PortfolioCard>

                {/* Recent Activity Mini-Feed */}
                <PortfolioCard>
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, color: 'var(--cream)', fontSize: '16px', fontWeight: '500' }}>Recent Activity</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {stats?.recent_activity?.map((activity, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '15px',
                                background: 'rgba(232, 230, 227, 0.03)',
                                borderRadius: '12px',
                                border: '1px solid rgba(232, 230, 227, 0.05)'
                            }}>
                                <div style={{
                                    padding: '10px',
                                    borderRadius: '50%',
                                    background: 'rgba(176,141,87,0.1)',
                                    color: '#b08d57'
                                }}>
                                    <Activity size={16} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--cream)' }}>
                                        {activity.customer_name} <span style={{ opacity: 0.5 }}>- {activity.job_card_number}</span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'rgba(232, 230, 227, 0.5)', marginTop: '2px' }}>
                                        Status updated to <span style={{ color: 'var(--gold)' }}>{activity.status}</span>
                                    </div>
                                </div>
                                <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.4)' }}>
                                    {new Date(activity.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}
                    </div>
                </PortfolioCard>
            </PortfolioGrid>
        </PortfolioPage>
    );
};

export default AnalyticsDashboard;
