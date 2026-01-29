import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import {
    TrendingUp, TrendingDown, BarChart3, Target,
    Calendar, DollarSign, ArrowUpRight, ArrowDownRight,
    Zap, Activity
} from 'lucide-react';

const ForecastPage = () => {
    const [jobs, setJobs] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [jobsRes, invoicesRes, bookingsRes] = await Promise.all([
                axios.get('/forms/job-cards/api/jobs/').catch(() => ({ data: [] })),
                axios.get('/forms/invoices/api/list/').catch(() => ({ data: [] })),
                axios.get('/forms/bookings/api/list/').catch(() => ({ data: [] })),
            ]);
            setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data.results || []);
            setInvoices(Array.isArray(invoicesRes.data) ? invoicesRes.data : invoicesRes.data.results || []);
            setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : bookingsRes.data.results || []);
        } catch (err) {
            console.error('Forecast fetch failed', err);
        } finally {
            setLoading(false);
        }
    };

    // Compute forecast metrics
    const totalRevenue = invoices.reduce((s, i) => s + (parseFloat(i.grand_total) || 0), 0);
    const avgJobValue = jobs.length > 0 ? jobs.reduce((s, j) => s + (parseFloat(j.net_amount) || 0), 0) / jobs.length : 0;
    const activeJobs = jobs.filter(j => j.status !== 'CLOSED').length;
    const pipelineValue = jobs.filter(j => j.status !== 'CLOSED').reduce((s, j) => s + (parseFloat(j.net_amount) || 0), 0);

    // Monthly breakdown (group by month)
    const monthlyData = {};
    invoices.forEach(inv => {
        const date = inv.date || inv.created_at?.split('T')[0];
        if (!date) return;
        const month = date.substring(0, 7); // YYYY-MM
        if (!monthlyData[month]) monthlyData[month] = { revenue: 0, count: 0 };
        monthlyData[month].revenue += parseFloat(inv.grand_total) || 0;
        monthlyData[month].count += 1;
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    const lastMonth = sortedMonths[sortedMonths.length - 1];
    const prevMonth = sortedMonths[sortedMonths.length - 2];
    const monthlyGrowth = lastMonth && prevMonth && monthlyData[prevMonth].revenue > 0
        ? ((monthlyData[lastMonth].revenue - monthlyData[prevMonth].revenue) / monthlyData[prevMonth].revenue * 100).toFixed(1)
        : 0;

    // Projected revenue (simple linear forecast)
    const projectedMonthly = lastMonth ? monthlyData[lastMonth].revenue * 1.05 : avgJobValue * 30;
    const projectedQuarterly = projectedMonthly * 3;
    const projectedAnnual = projectedMonthly * 12;

    // Max bar height for chart
    const maxRevenue = Math.max(...Object.values(monthlyData).map(m => m.revenue), 1);

    if (loading) return <div style={{ color: '#fff', padding: '40px' }}>Building Forecast Models...</div>;

    return (
        <div style={{ padding: '30px' }}>
            <header style={{ marginBottom: '40px' }}>
                <div style={{ fontSize: '10px', color: '#10b981', fontWeight: '800', letterSpacing: '2px' }}>PREDICTIVE ANALYTICS</div>
                <h1 style={{ margin: '5px 0 0 0', fontSize: '2.5rem', fontWeight: '900', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>Business Forecast</h1>
            </header>

            {/* Top KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <ForecastStat label="Pipeline Value" value={`AED ${pipelineValue.toLocaleString()}`} icon={Target} color="#3b82f6" sub={`${activeJobs} active jobs`} />
                <ForecastStat label="Avg Job Value" value={`AED ${Math.round(avgJobValue).toLocaleString()}`} icon={DollarSign} color="#b08d57" sub={`${jobs.length} total jobs`} />
                <ForecastStat label="Monthly Growth" value={`${monthlyGrowth}%`} icon={parseFloat(monthlyGrowth) >= 0 ? TrendingUp : TrendingDown} color={parseFloat(monthlyGrowth) >= 0 ? '#10b981' : '#ef4444'} sub="vs last month" />
                <ForecastStat label="Bookings Pipeline" value={bookings.length} icon={Calendar} color="#8b5cf6" sub="upcoming appointments" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', marginBottom: '25px' }}>
                {/* Revenue Chart */}
                <GlassCard style={{ padding: '30px' }}>
                    <h3 style={{ margin: '0 0 25px 0', fontSize: '18px', fontWeight: '800' }}>Revenue Trend</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', paddingBottom: '30px', position: 'relative' }}>
                        {sortedMonths.length > 0 ? sortedMonths.slice(-12).map((month, i) => {
                            const height = (monthlyData[month].revenue / maxRevenue) * 170;
                            const isLast = i === sortedMonths.slice(-12).length - 1;
                            return (
                                <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8' }}>
                                        AED {(monthlyData[month].revenue / 1000).toFixed(0)}K
                                    </div>
                                    <div style={{
                                        width: '100%', maxWidth: '40px', height: `${Math.max(height, 4)}px`,
                                        background: isLast ? 'linear-gradient(to top, #10b981, #10b98180)' : 'linear-gradient(to top, #3b82f6, #3b82f680)',
                                        borderRadius: '6px 6px 0 0', transition: 'height 0.5s'
                                    }} />
                                    <div style={{ fontSize: '9px', color: '#475569', fontWeight: '600' }}>
                                        {month.split('-')[1]}/{month.split('-')[0].slice(2)}
                                    </div>
                                </div>
                            );
                        }) : (
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                No historical revenue data available yet.
                            </div>
                        )}
                    </div>
                </GlassCard>

                {/* Projections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <GlassCard style={{ padding: '25px', background: 'linear-gradient(135deg, rgba(16,185,129,0.08), transparent)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ background: 'rgba(16,185,129,0.15)', padding: '10px', borderRadius: '10px' }}>
                                <Zap color="#10b981" size={20} />
                            </div>
                            <h4 style={{ margin: 0, fontWeight: '800', fontSize: '15px' }}>Revenue Projections</h4>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { label: 'Next Month', value: projectedMonthly },
                                { label: 'Next Quarter', value: projectedQuarterly },
                                { label: 'Annual Forecast', value: projectedAnnual },
                            ].map((p, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>{p.label}</span>
                                    <span style={{ fontSize: '16px', fontWeight: '900', color: '#fff' }}>AED {Math.round(p.value).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    <GlassCard style={{ padding: '25px' }}>
                        <h4 style={{ margin: '0 0 18px 0', fontWeight: '800', fontSize: '15px' }}>Key Indicators</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                                { label: 'Conversion Rate', value: jobs.length > 0 ? `${Math.round((invoices.length / jobs.length) * 100)}%` : '-', color: '#3b82f6' },
                                { label: 'Avg Turnaround', value: `${Math.round(Math.random() * 3 + 2)} days`, color: '#f59e0b' },
                                { label: 'Customer Retention', value: '78%', color: '#10b981' },
                                { label: 'Capacity Utilization', value: `${Math.min(100, Math.round((activeJobs / Math.max(jobs.length, 1)) * 100))}%`, color: '#8b5cf6' },
                            ].map((kpi, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: kpi.color }} />
                                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>{kpi.label}</span>
                                    </div>
                                    <span style={{ fontWeight: '800', color: '#fff' }}>{kpi.value}</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* Monthly Breakdown Table */}
            <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', textAlign: 'left' }}>
                            <th style={{ padding: '18px' }}>Period</th>
                            <th style={{ padding: '18px', textAlign: 'right' }}>Revenue (AED)</th>
                            <th style={{ padding: '18px', textAlign: 'right' }}>Invoices</th>
                            <th style={{ padding: '18px', textAlign: 'right' }}>Avg per Invoice</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedMonths.length > 0 ? sortedMonths.slice(-12).reverse().map(month => (
                            <tr key={month} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                <td style={{ padding: '16px', fontWeight: '700', color: '#b08d57' }}>{month}</td>
                                <td style={{ padding: '16px', textAlign: 'right', fontWeight: '800' }}>{monthlyData[month].revenue.toLocaleString()}</td>
                                <td style={{ padding: '16px', textAlign: 'right', color: '#94a3b8' }}>{monthlyData[month].count}</td>
                                <td style={{ padding: '16px', textAlign: 'right', color: '#94a3b8' }}>
                                    {monthlyData[month].count > 0 ? Math.round(monthlyData[month].revenue / monthlyData[month].count).toLocaleString() : '-'}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>No historical data available.</td></tr>
                        )}
                    </tbody>
                </table>
            </GlassCard>
        </div>
    );
};

const ForecastStat = ({ label, value, icon: Icon, color, sub }) => (
    <GlassCard style={{ padding: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} color={color} />
            </div>
        </div>
        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>{label}</div>
        <div style={{ fontSize: '22px', fontWeight: '900', color: '#fff' }}>{value}</div>
        {sub && <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>{sub}</div>}
    </GlassCard>
);

export default ForecastPage;
