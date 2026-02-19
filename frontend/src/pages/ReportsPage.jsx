import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    BarChart3, TrendingUp, Users, Package,
    FileText, Download, Calendar, CreditCard,
    Briefcase, CheckCircle2, Clock, AlertCircle,
    ArrowUpRight
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioGrid,
    PortfolioCard,
    PortfolioStats,
    PortfolioSectionTitle
} from '../components/PortfolioComponents';

const ReportsPage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        closedJobs: 0,
        totalInvoices: 0,
        paidInvoices: 0,
        pendingInvoices: 0,
        totalLeads: 0,
        totalBookings: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [jobsRes, invoicesRes, leadsRes, bookingsRes] = await Promise.all([
                api.get('/forms/job-cards/api/jobs/').catch(() => ({ data: [] })),
                api.get('/forms/invoices/api/list/').catch(() => ({ data: [] })),
                api.get('/forms/leads/api/list/').catch(() => ({ data: [] })),
                api.get('/forms/bookings/api/list/').catch(() => ({ data: [] })),
            ]);

            const jobsData = Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data.results || [];
            const invoicesData = Array.isArray(invoicesRes.data) ? invoicesRes.data : invoicesRes.data.results || [];
            const leadsData = Array.isArray(leadsRes.data) ? leadsRes.data : leadsRes.data.results || [];
            const bookingsData = Array.isArray(bookingsRes.data) ? bookingsRes.data : bookingsRes.data.results || [];

            const paidInv = invoicesData.filter(i => i.payment_status === 'PAID');
            const totalRev = paidInv.reduce((sum, i) => sum + (parseFloat(i.grand_total) || 0), 0);

            setStats({
                totalJobs: jobsData.length,
                activeJobs: jobsData.filter(j => j.status !== 'CLOSED' && j.status !== 'DELIVERY').length,
                closedJobs: jobsData.filter(j => j.status === 'CLOSED' || j.status === 'DELIVERY').length,
                totalInvoices: invoicesData.length,
                paidInvoices: paidInv.length,
                pendingInvoices: invoicesData.filter(i => i.payment_status !== 'PAID').length,
                totalLeads: leadsData.length,
                totalBookings: bookingsData.length,
                totalRevenue: totalRev,
            });
        } catch (err) {
            console.error('Error loading reports', err);
        } finally {
            setLoading(false);
        }
    };

    const viewReport = (model) => {
        const routes = {
            'JobCard': '/reports/jobs',
            'Invoice': '/reports/financial',
            'Lead': '/leads',
            'Booking': '/bookings',
            'StockForm': '/reports/inventory',
            'LeaveApplication': '/requests',
            'WorkshopDiary': '/job-cards',
            'Operation': '/job-cards',
            'AdvisorDaily': '/advisor-daily-report',
            'Budget': '/finance/budget'
        };
        const path = routes[model] || '/';
        navigate(`${path}?print_confirm=true`);
    };

    if (loading) return (
        <PortfolioPage><div style={{ color: 'var(--gold)', letterSpacing: '2px', fontWeight: '900', fontSize: '10px', padding: '100px', textAlign: 'center' }}>CALIBRATING ANALYTICS ENGINE...</div></PortfolioPage>
    );

    const portfolioStatsData = [
        { label: "FISCAL REVENUE", value: `AED ${stats.totalRevenue.toLocaleString()}`, color: "var(--gold)" },
        { label: "ACTIVE PIPELINE", value: stats.totalJobs, color: "#3b82f6" },
        { label: "MARKET LEADS", value: stats.totalLeads, color: "#ec4899" },
        { label: "SETTLEMENT GAP", value: stats.pendingInvoices, color: "#f43f5e" },
    ];

    return (
        <PortfolioPage breadcrumb="Executive Intelligence / Analytics Hub">
            <div style={{ marginBottom: '80px' }}>
                <PortfolioTitle subtitle="System-wide telemetry and operational performance metrics.">
                    Intelligence Command
                </PortfolioTitle>
            </div>

            <PortfolioStats stats={portfolioStatsData} />

            <PortfolioGrid columns="2fr 1fr" gap="40px" style={{ marginTop: '60px' }}>
                <PortfolioCard>
                    <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '5px' }}>TELEMETRY</div>
                            <h3 style={{ margin: 0, color: 'var(--cream)', fontSize: '20px', fontWeight: '400', fontFamily: 'var(--font-serif)' }}>Revenue Velocity</h3>
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(232,230,227,0.3)', fontWeight: '700', letterSpacing: '1px' }}>QUARTERLY TREND</div>
                    </div>
                    <div style={{ height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[
                                { name: 'OCT', revenue: 48000 },
                                { name: 'NOV', revenue: 61000 },
                                { name: 'DEC', revenue: 55000 },
                                { name: 'JAN', revenue: stats.totalRevenue || 75000 }
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(232, 230, 227, 0.03)" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="rgba(232,230,227,0.2)"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                    style={{ fontWeight: '800', letterSpacing: '1px' }}
                                />
                                <YAxis
                                    stroke="rgba(232,230,227,0.2)"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={val => `${val / 1000}K`}
                                    style={{ fontWeight: '800' }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0c0c0c', border: '1px solid rgba(176, 141, 87, 0.2)', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: 'var(--gold)', fontSize: '12px', fontWeight: '800' }}
                                    cursor={{ stroke: 'rgba(176, 141, 87, 0.2)', strokeWidth: 1 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="var(--gold)"
                                    strokeWidth={4}
                                    dot={{ r: 4, fill: '#0c0c0c', stroke: 'var(--gold)', strokeWidth: 2 }}
                                    activeDot={{ r: 8, strokeWidth: 0, fill: 'var(--gold)' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </PortfolioCard>

                <PortfolioCard>
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '5px' }}>QUOTIENT</div>
                        <h3 style={{ margin: 0, color: 'var(--cream)', fontSize: '20px', fontWeight: '400', fontFamily: 'var(--font-serif)' }}>Capacity Load</h3>
                    </div>
                    <div style={{ height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'ACTIVE', value: stats.activeJobs },
                                        { name: 'ARCHIVED', value: stats.closedJobs },
                                        { name: 'QUEUED', value: Math.max(0, stats.totalJobs - stats.activeJobs - stats.closedJobs) }
                                    ]}
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    <Cell fill="#3b82f6" />
                                    <Cell fill="var(--gold)" />
                                    <Cell fill="rgba(232, 230, 227, 0.1)" />
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0c0c0c', border: '1px solid rgba(176, 141, 87, 0.2)', borderRadius: '12px' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value) => <span style={{ color: 'rgba(232,230,227,0.5)', fontSize: '10px', fontWeight: '800', letterSpacing: '1px' }}>{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </PortfolioCard>
            </PortfolioGrid>

            <div style={{ marginTop: '100px' }}>
                <PortfolioSectionTitle>Archive Dossiers</PortfolioSectionTitle>
                <PortfolioGrid columns="repeat(auto-fill, minmax(280px, 1fr))" gap="25px">
                    {[
                        { label: 'Job Cards', model: 'JobCard', icon: Briefcase, desc: 'Operational workflow telemetry.' },
                        { label: 'Fiscal Ledger', model: 'Invoice', icon: FileText, desc: 'Revenue & settlement history.' },
                        { label: 'Sales Pipeline', model: 'Lead', icon: Users, desc: 'Conversion & market acquisition.' },
                        { label: 'Apt. Registry', model: 'Booking', icon: Calendar, desc: 'High-level scheduling book.' },
                        { label: 'Execution Logs', model: 'Operation', icon: CheckCircle2, desc: 'Technical task performance.' },
                        { label: 'Asset Inventory', model: 'StockForm', icon: Package, desc: 'Valuation & resource levels.' },
                        { label: 'Governance', model: 'LeaveApplication', icon: AlertCircle, desc: 'Human resource & compliance.' },
                        { label: 'Production Log', model: 'WorkshopDiary', icon: Clock, desc: 'Daily workshop telemetry.' },
                        { label: 'Advisor Daily', model: 'AdvisorDaily', icon: TrendingUp, desc: 'Morning strategic briefing.' },
                        { label: 'Capital Budgeting', model: 'Budget', icon: BarChart3, desc: 'Fiscal limits & forecasts.' },
                    ].map(r => (
                        <PortfolioCard
                            key={r.model}
                            onClick={() => viewReport(r.model)}
                            className="archive-card"
                            style={{ cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                <div style={{
                                    width: '45px', height: '45px', borderRadius: '12px',
                                    background: 'rgba(176,141,87,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '1px solid rgba(176,141,87,0.1)'
                                }}>
                                    <r.icon size={22} color="var(--gold)" />
                                </div>
                                <ArrowUpRight size={16} color="rgba(232, 230, 227, 0.1)" />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '500', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>{r.label}</h4>
                                <p style={{ margin: 0, fontSize: '12px', color: 'rgba(232, 230, 227, 0.3)', lineHeight: '1.6', letterSpacing: '0.5px' }}>{r.desc}</p>
                            </div>
                        </PortfolioCard>
                    ))}
                </PortfolioGrid>
            </div>

        </PortfolioPage>
    );
};

export default ReportsPage;
