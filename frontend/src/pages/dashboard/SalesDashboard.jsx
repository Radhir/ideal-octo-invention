import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import {
    TrendingUp, Users, Target, Award,
    BarChart2, ArrowUpRight, DollarSign, Calendar
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const SalesDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        pipeline: { total_leads: 0, active_leads: 0, new_this_month: 0, value: 0 },
        kpi: { conversion_rate: 0, target_revenue: 0 },
        leaderboard: [],
        chart_data: []
    });

    useEffect(() => {
        fetchSalesData();
    }, []);

    const fetchSalesData = async () => {
        try {
            const res = await api.get('/api/dashboard/api/sales/');
            setData(res.data);
        } catch (err) {
            console.error("Failed to fetch sales analytics", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '40px', color: '#fff' }}>Loading Intelligence Engine...</div>;

    return (
        <div style={{ padding: '30px', maxWidth: '1600px', margin: '0 auto' }}>
            <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <div style={{ fontSize: '10px', color: '#ec4899', fontWeight: '800', letterSpacing: '2px' }}>PERFORMANCE INTELLIGENCE</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>Sales Command</h1>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>CURRENT TARGET</div>
                    <div style={{ color: '#10b981', fontSize: '24px', fontWeight: '800' }}>AED {data.kpi.target_revenue.toLocaleString()}</div>
                </div>
            </header>

            {/* KPI GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <StatCard
                    icon={TrendingUp}
                    label="Conversion Rate"
                    value={`${data.kpi.conversion_rate}%`}
                    sub="Lead to Job Card"
                    color="#10b981"
                />
                <StatCard
                    icon={Users}
                    label="Active Pipeline"
                    value={data.pipeline.active_leads}
                    sub={`${data.pipeline.new_this_month} new this month`}
                    color="#3b82f6"
                />
                <StatCard
                    icon={Target}
                    label="Pipeline Value"
                    value={`AED ${data.pipeline.value.toLocaleString()}`}
                    sub="Estimated Potential"
                    color="#f59e0b"
                />
                <StatCard
                    icon={Award}
                    label="Top Performer"
                    value={data.leaderboard[0]?.name || 'N/A'}
                    sub={data.leaderboard[0]?.revenue ? `AED ${data.leaderboard[0].revenue.toLocaleString()}` : 'No Data'}
                    color="#ec4899"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' }}>

                {/* REVENUE TREND CHART */}
                <GlassCard style={{ padding: '30px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, fontWeight: '800', fontSize: '18px' }}>Revenue & Volume Trend</h3>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#94a3b8' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }} /> Revenue
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#94a3b8' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899' }} /> Leads
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1, minHeight: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.chart_data}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis yAxisId="left" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={val => `AED ${val / 1000}k`} />
                                <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                <Area yAxisId="right" type="monotone" dataKey="leads" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* LEADERBOARD */}
                <GlassCard style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '25px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ margin: 0, fontWeight: '800', fontSize: '18px' }}>Advisor Performance</h3>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)', textAlign: 'left', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '15px 25px', fontWeight: '700' }}>Advisor</th>
                                    <th style={{ padding: '15px', fontWeight: '700' }}>Conv. %</th>
                                    <th style={{ padding: '15px 25px', fontWeight: '700', textAlign: 'right' }}>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.leaderboard.map((advisor, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: '13px' }}>
                                        <td style={{ padding: '15px 25px', fontWeight: '600', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '24px', height: '24px', borderRadius: '50%',
                                                background: idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : 'rgba(255,255,255,0.1)',
                                                color: idx < 3 ? '#000' : '#fff',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '10px', fontWeight: '900'
                                            }}>
                                                {idx + 1}
                                            </div>
                                            {advisor.name}
                                        </td>
                                        <td style={{ padding: '15px', color: advisor.conversion_rate > 50 ? '#10b981' : '#f59e0b' }}>
                                            {advisor.conversion_rate}%
                                        </td>
                                        <td style={{ padding: '15px 25px', textAlign: 'right', fontWeight: '700', color: '#fff' }}>
                                            {(advisor.revenue || 0).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {data.leaderboard.length === 0 && (
                                    <tr>
                                        <td colSpan="3" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                                            No performance data available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
    <GlassCard style={{ padding: '25px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.1 }}>
            <Icon size={80} color={color} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
            <div style={{ padding: '12px', background: `${color}15`, borderRadius: '12px', color: color }}>
                <Icon size={22} />
            </div>
        </div>
        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
        <div style={{ fontSize: '28px', fontWeight: '900', color: '#fff', marginTop: '5px', fontFamily: 'Outfit, sans-serif' }}>{value}</div>
        <div style={{ fontSize: '11px', color: color, marginTop: '8px', fontWeight: '500' }}>{sub}</div>
    </GlassCard>
);

export default SalesDashboard;
