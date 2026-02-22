import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    TrendingUp, TrendingDown, DollarSign, Users,
    Briefcase, Package, Activity, Target, ArrowUpRight,
    BarChart3, PieChart, Wallet
} from 'lucide-react';
import {
    PortfolioPage, PortfolioTitle, PortfolioStats,
    PortfolioCard, GlassCard
} from '../../components/PortfolioComponents';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

const CEOConsole = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/dashboard/api/ceo/analytics/');
            setData(res.data);
        } catch (err) {
            console.error('Error fetching CEO analytics', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !data) return (
        <PortfolioPage><div style={{ color: 'var(--cream)', opacity: 0.5 }}>Analyzing Enterprise Data...</div></PortfolioPage>
    );

    return (
        <PortfolioPage breadcrumb="STRATEGIC // COMMAND">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Executive overview of enterprise growth, fiscal health, and operational ROI.">
                    COMMAND CENTER
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{
                        padding: '10px 20px', background: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981', borderRadius: '50px', fontSize: '12px',
                        fontWeight: '800', border: '1px solid rgba(16, 185, 129, 0.2)',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        <Activity size={14} /> SYSTEM NOMINAL
                    </div>
                </div>
            </div>

            <PortfolioStats stats={[
                { value: `AED ${data.revenue_trends[data.revenue_trends.length - 1].amount.toLocaleString()}`, label: 'NET REVENUE (MTD)', color: 'var(--gold)', trend: '+14%' },
                { value: `AED ${data.burn_rate.toLocaleString()}`, label: 'BURN RATE (30D)', color: '#ef4444', trend: '-2%' },
                { value: `AED ${data.inventory_valuation.toLocaleString()}`, label: 'ASSET VALUATION', color: '#10b981' }
            ]} />

            <div style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '30px'
            }}>
                {/* Revenue Growth Chart (stays same) */}
                <GlassCard style={{ padding: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--cream)', margin: 0 }}>Revenue Growth Curve</h3>
                        <BarChart3 size={20} style={{ color: 'var(--gold)' }} />
                    </div>
                    {/* ... (ResponsiveContainer ommitted for brevity) ... */}
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.revenue_trends}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--gold)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(232,230,227,0.1)" vertical={false} />
                                <XAxis dataKey="month" stroke="rgba(232,230,227,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="rgba(232,230,227,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ background: '#0a0a0a', border: '1px solid var(--gold)', borderRadius: '10px' }}
                                    itemStyle={{ color: 'var(--cream)' }}
                                />
                                <Area type="monotone" dataKey="amount" stroke="var(--gold)" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* Conversion Funnel */}
                <GlassCard style={{ padding: '40px' }}>
                    <div style={{ color: 'var(--gold)', fontSize: '10px', letterSpacing: '3px', fontWeight: '800', marginBottom: '10px' }}>CRM INTELLIGENCE</div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--cream)', marginBottom: '30px' }}>Sales Funnel (MTD)</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {[
                            { label: 'Total Leads', value: data.crm_funnel.leads, color: 'var(--cream)' },
                            { label: 'Bookings', value: data.crm_funnel.bookings, color: 'var(--gold)' },
                            { label: 'Sales/Jobs', value: data.crm_funnel.sales, color: '#10b981' }
                        ].map((stage, i) => (
                            <div key={i} style={{ padding: '15px', background: 'rgba(232,230,227,0.03)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ opacity: 0.6, fontSize: '12px' }}>{stage.label}</span>
                                <span style={{ fontWeight: '800', color: stage.color }}>{stage.value}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(176,141,87,0.05)', borderRadius: '15px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--gold)' }}>{data.crm_funnel.lead_to_booking_rate}%</div>
                        <div style={{ fontSize: '10px', opacity: 0.5, letterSpacing: '1px' }}>LEAD CONVERSION RATE</div>
                    </div>
                </GlassCard>
            </div>

            <div style={{
                display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', marginBottom: '30px'
            }}>
                {/* Payroll Burden (moved to smaller card) */}
                <GlassCard style={{ padding: '30px' }}>
                    <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--cream)', marginBottom: '20px' }}>Human Capital</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.6, fontSize: '12px', marginBottom: '10px' }}>
                        <span>STAFF</span>
                        <span>{data.employee_count}</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(232,230,227,0.1)', borderRadius: '2px', marginBottom: '20px' }}>
                        <div style={{ height: '100%', width: '75%', background: 'var(--gold)', borderRadius: '2px' }}></div>
                    </div>
                    <div style={{ color: 'var(--gold)', fontWeight: '800', fontSize: '18px' }}>AED {data.payroll_burden.toLocaleString()}</div>
                    <div style={{ fontSize: '10px', opacity: 0.4 }}>TOTAL MONTHLY PAYROLL</div>
                </GlassCard>

                {/* Retention Alert Hub */}
                <GlassCard style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                        <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--cream)', margin: 0 }}>Retention Intelligence</h4>
                        <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: '800' }}>PRIORITY FOLLOW-UPS</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        {data.retention_candidates.slice(0, 4).map((c, i) => (
                            <div key={i} style={{ padding: '15px', background: 'rgba(232,230,227,0.02)', border: '1px solid rgba(232,230,227,0.05)', borderRadius: '12px' }}>
                                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--cream)', marginBottom: '5px' }}>{c.customer_name}</div>
                                <div style={{ fontSize: '11px', opacity: 0.5, marginBottom: '8px' }}>{c.vehicle}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '700' }}>{c.due_type}</span>
                                    {c.is_overdue && <span style={{ padding: '2px 6px', background: '#ef4444', color: 'white', borderRadius: '4px', fontSize: '8px', fontWeight: '900' }}>OVERDUE</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px' }}>
                {data.vital_stats.map((stat, idx) => (
                    <GlassCard key={idx} style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}>
                            <Target size={100} />
                        </div>
                        <div style={{ opacity: 0.6, fontSize: '11px', letterSpacing: '2px', fontWeight: '800', marginBottom: '15px' }}>{stat.label}</div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                            <div style={{ fontSize: '24px', color: 'var(--cream)', fontWeight: '800' }}>
                                {typeof stat.value === 'number' ? `AED ${stat.value.toLocaleString()}` : stat.value}
                            </div>
                            <div style={{
                                color: stat.trend.startsWith('+') ? '#10b981' : '#ef4444',
                                fontSize: '12px', fontWeight: '800', marginBottom: '5px',
                                display: 'flex', alignItems: 'center', gap: '4px'
                            }}>
                                {stat.trend} <ArrowUpRight size={14} />
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </PortfolioPage>
    );
};

export default CEOConsole;
