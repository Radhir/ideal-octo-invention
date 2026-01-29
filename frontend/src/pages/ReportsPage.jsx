import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import { useNavigate } from 'react-router-dom';
import {
    BarChart3, TrendingUp, Users, Package,
    FileText, Download, Calendar, CreditCard,
    Briefcase, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';

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
    const [jobs, setJobs] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [jobsRes, invoicesRes, leadsRes, bookingsRes] = await Promise.all([
                axios.get('/forms/job-cards/api/jobs/').catch(() => ({ data: [] })),
                axios.get('/forms/invoices/api/list/').catch(() => ({ data: [] })),
                axios.get('/forms/leads/api/list/').catch(() => ({ data: [] })),
                axios.get('/forms/bookings/api/list/').catch(() => ({ data: [] })),
            ]);

            const jobsData = Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data.results || [];
            const invoicesData = Array.isArray(invoicesRes.data) ? invoicesRes.data : invoicesRes.data.results || [];
            const leadsData = Array.isArray(leadsRes.data) ? leadsRes.data : leadsRes.data.results || [];
            const bookingsData = Array.isArray(bookingsRes.data) ? bookingsRes.data : bookingsRes.data.results || [];

            setJobs(jobsData);
            setInvoices(invoicesData);

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
            'JobCard': '/job-cards',
            'Invoice': '/invoices',
            'Lead': '/leads',
            'Booking': '/bookings',
            'StockForm': '/stock',
            'LeaveApplication': '/requests',
            'WorkshopDiary': '/job-cards', // Best fallback for workshop context
            'Operation': '/job-cards',
            'AdvisorDaily': '/advisor-daily-report'
        };
        const path = routes[model] || '/';
        navigate(`${path}?print_confirm = true`);
    };

    if (loading) return <div style={{ color: '#fff', padding: '40px' }}>Loading Reports...</div>;

    // Count jobs by status
    const statusCounts = {};
    jobs.forEach(j => {
        statusCounts[j.status] = (statusCounts[j.status] || 0) + 1;
    });

    return (
        <div style={{ padding: '30px' }}>
            <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '2px' }}>ANALYTICS CENTER</div>
                    <h1 style={{ margin: '5px 0 0 0', fontSize: '2.5rem', fontWeight: '900', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>Reports Dashboard</h1>
                </div>
            </header>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <KPICard icon={Briefcase} label="Total Jobs" value={stats.totalJobs} color="#3b82f6" />
                <KPICard icon={CreditCard} label="Total Revenue" value={`AED ${stats.totalRevenue.toLocaleString()} `} color="#10b981" />
                <KPICard icon={FileText} label="Invoices" value={stats.totalInvoices} color="#f59e0b" />
                <KPICard icon={Users} label="Total Leads" value={stats.totalLeads} color="#ec4899" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
                {/* Job Status Breakdown */}
                <GlassCard style={{ padding: '25px' }}>
                    <h3 style={sectionTitle}>Job Card Status Breakdown</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {['RECEPTION', 'ESTIMATION', 'WORK_ASSIGNMENT', 'WIP', 'QC', 'INVOICING', 'DELIVERY'].map(status => {
                            const count = statusCounts[status] || 0;
                            const pct = stats.totalJobs > 0 ? (count / stats.totalJobs * 100) : 0;
                            return (
                                <div key={status}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>{status.replace('_', ' ')}</span>
                                        <span style={{ fontSize: '12px', color: '#fff', fontWeight: '700' }}>{count}</span>
                                    </div>
                                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${pct}% `, background: '#b08d57', borderRadius: '3px', transition: 'width 0.5s' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </GlassCard>

                {/* Invoice Summary */}
                <GlassCard style={{ padding: '25px' }}>
                    <h3 style={sectionTitle}>Invoice Summary</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ padding: '20px', background: 'rgba(16,185,129,0.05)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.2)' }}>
                            <CheckCircle2 size={20} color="#10b981" style={{ marginBottom: '8px' }} />
                            <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>{stats.paidInvoices}</div>
                            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Paid</div>
                        </div>
                        <div style={{ padding: '20px', background: 'rgba(245,158,11,0.05)', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.2)' }}>
                            <Clock size={20} color="#f59e0b" style={{ marginBottom: '8px' }} />
                            <div style={{ fontSize: '24px', fontWeight: '800', color: '#f59e0b' }}>{stats.pendingInvoices}</div>
                            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Pending</div>
                        </div>
                    </div>
                    <div style={{ padding: '15px', background: 'rgba(176,141,87,0.05)', borderRadius: '10px', border: '1px solid rgba(176,141,87,0.2)' }}>
                        <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', marginBottom: '5px' }}>Total Revenue (Paid)</div>
                        <div style={{ fontSize: '28px', fontWeight: '900', color: '#b08d57' }}>AED {stats.totalRevenue.toLocaleString()}</div>
                    </div>
                </GlassCard>
            </div>

            {/* Quick Counts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <StatBlock label="Active Jobs" value={stats.activeJobs} icon={Clock} color="#3b82f6" />
                <StatBlock label="Completed Jobs" value={stats.closedJobs} icon={CheckCircle2} color="#10b981" />
                <StatBlock label="Bookings" value={stats.totalBookings} icon={Calendar} color="#8b5cf6" />
                <StatBlock label="Leads" value={stats.totalLeads} icon={Users} color="#ec4899" />
            </div>

            {/* Export Section - Redesigned as Module Hub */}
            <div style={{ marginTop: '40px' }}>
                <h3 style={sectionTitle}>System Reports Library</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                    {[
                        { label: 'Job Cards', model: 'JobCard', icon: Briefcase, desc: 'Workflow & Status Operations' },
                        { label: 'Invoices', model: 'Invoice', icon: FileText, desc: 'Revenue & Financial Transactions' },
                        { label: 'Leads', model: 'Lead', icon: Users, desc: 'Sales Pipeline & Conversion' },
                        { label: 'Bookings', model: 'Booking', icon: Calendar, desc: 'Scheduled Appointments' },
                        { label: 'Operations', model: 'Operation', icon: CheckCircle2, desc: 'Task Execution Logs' },
                        { label: 'Inventory', model: 'StockForm', icon: Package, desc: 'Stock Levels & Valuation' },
                        { label: 'Leave Requests', model: 'LeaveApplication', icon: AlertCircle, desc: 'HR & Employee Absence' },
                        { label: 'Workshop Diary', model: 'WorkshopDiary', icon: Clock, desc: 'Daily Operational Logs' },
                        { label: 'Advisor Daily', model: 'AdvisorDaily', icon: TrendingUp, desc: 'Morning Briefing & Conversion' },
                    ].map(r => (
                        <GlassCard
                            key={r.model}
                            onClick={() => viewReport(r.model)}
                            style={{
                                padding: '20px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                border: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.borderColor = 'rgba(176,141,87,0.3)';
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ background: 'rgba(176,141,87,0.1)', padding: '10px', borderRadius: '10px' }}>
                                    <r.icon size={20} color="#b08d57" />
                                </div>
                                <Download size={16} color="#64748b" />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', fontWeight: '700', color: '#f1f5f9' }}>{r.label}</h4>
                                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{r.desc}</p>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </div>
    );
};

const KPICard = ({ icon: Icon, label, value, color }) => (
    <GlassCard style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: `4px solid ${color} ` }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: `${color} 15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={24} color={color} />
        </div>
        <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#fff' }}>{value}</div>
        </div>
    </GlassCard>
);

const StatBlock = ({ label, value, icon: Icon, color }) => (
    <GlassCard style={{ padding: '20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
            <Icon size={80} color={color} />
        </div>
        <Icon size={20} color={color} style={{ marginBottom: '10px', position: 'relative' }} />
        <div style={{ fontSize: '28px', fontWeight: '900', color: '#fff', position: 'relative' }}>{value}</div>
        <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '5px', position: 'relative' }}>{label}</div>
    </GlassCard>
);

const sectionTitle = {
    fontSize: '12px',
    textTransform: 'uppercase',
    color: '#b08d57',
    marginBottom: '20px',
    fontWeight: '800',
    letterSpacing: '2px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
};

export default ReportsPage;
