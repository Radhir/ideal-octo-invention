import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import {
    Printer, Download, Calendar, Users, Briefcase,
    TrendingUp, Clock, CheckCircle2, AlertCircle
} from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';

const AdvisorDailyReport = () => {
    const [data, setData] = useState({
        arrivals: [],
        activeJobs: [],
        hotLeads: [],
        stats: { conversion: 0, revenue: 0 }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDailyBriefing();
    }, []);

    const fetchDailyBriefing = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const [leadsRes, bookingsRes, jobsRes] = await Promise.all([
                api.get('/forms/leads/api/list/'),
                api.get('/forms/bookings/api/list/'),
                api.get('/forms/job-cards/api/jobs/')
            ]);

            setData({
                arrivals: bookingsRes.data.filter(b => b.booking_date === today),
                activeJobs: jobsRes.data.filter(j => j.status !== 'CLOSED'),
                hotLeads: leadsRes.data.filter(l => l.priority === 'HOT' && l.status !== 'CONVERTED'),
                stats: {
                    conversion: 68, // Mock for demo
                    revenue: 24500 // Mock for today
                }
            });

            // Auto-prompt print if triggered from dashboard
            const params = new URLSearchParams(window.location.search);
            if (params.get('print') === 'true') {
                setTimeout(() => {
                    if (window.confirm("Executive Briefing ready. Proceed to print?")) {
                        window.print();
                    }
                }, 2000);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '100px', color: '#fff', textAlign: 'center' }}>Synthesizing Daily Intelligence...</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <PrintHeader title="Executive Advisor Briefing" />

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px' }}>
                <div>
                    <div style={{ fontSize: '12px', color: '#b08d57', fontWeight: '900', letterSpacing: '3px', textTransform: 'uppercase' }}>Daily Operations</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '3rem', margin: 0, fontWeight: '900' }}>Advisor Briefing</h1>
                    <div style={{ color: '#94a3b8', marginTop: '5px' }}>Date: {new Date().toLocaleDateString()} | Service Department</div>
                </div>
                <button onClick={() => window.print()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Printer size={18} /> PRINT BRIEFING
                </button>
            </header>

            {/* QUICK KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <KPITile label="Expected Arrivals" value={data.arrivals.length} icon={Calendar} color="#3b82f6" />
                <KPITile label="WIP Inventory" value={data.activeJobs.length} icon={Briefcase} color="#b08d57" />
                <KPITile label="Hot Pipeline" value={data.hotLeads.length} icon={TrendingUp} color="#f43f5e" />
                <KPITile label="Est. Daily Value" value={`AED ${data.stats.revenue}`} icon={CheckCircle2} color="#10b981" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {/* ARRIVALS LIST */}
                <ReportSection title="Morning Arrivals" icon={Clock} color="#3b82f6">
                    {data.arrivals.length === 0 ? <p style={{ color: '#64748b' }}>No arrivals scheduled for today.</p> :
                        data.arrivals.map(b => (
                            <ReportRow key={b.id} title={b.customer_name} sub={b.v_registration_no} right={b.booking_time} />
                        ))
                    }
                </ReportSection>

                {/* HOT LEADS */}
                <ReportSection title="Conversion Watch" icon={TrendingUp} color="#f43f5e">
                    {data.hotLeads.length === 0 ? <p style={{ color: '#64748b' }}>No hot leads pending conversion.</p> :
                        data.hotLeads.map(l => (
                            <ReportRow key={l.id} title={l.customer_name} sub={l.interested_service} right={`AED ${l.estimated_value}`} />
                        ))
                    }
                </ReportSection>
            </div>

            {/* ACTIVE UNITS LIST */}
            <div style={{ marginTop: '30px' }}>
                <ReportSection title="Active Workshop Inventory" icon={Briefcase} color="#b08d57">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                        {data.activeJobs.slice(0, 10).map(j => (
                            <ReportRow key={j.id} title={j.job_card_number} sub={`${j.brand} ${j.model}`} right={j.status_display} />
                        ))}
                    </div>
                </ReportSection>
            </div>
        </div>
    );
};

const KPITile = ({ label, value, icon: Icon, color }) => (
    <GlassCard style={{ padding: '20px', borderLeft: `3px solid ${color}` }}>
        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#fff' }}>{value}</div>
            <Icon size={20} color={color} />
        </div>
    </GlassCard>
);

const ReportSection = ({ title, children, icon: Icon, color }) => (
    <GlassCard style={{ padding: '25px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: '900', color: color, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Icon size={18} /> {title}
        </h3>
        {children}
    </GlassCard>
);

const ReportRow = ({ title, sub, right }) => (
    <div style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
            <div style={{ fontWeight: '800', color: '#fff', fontSize: '14px' }}>{title}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{sub}</div>
        </div>
        <div style={{ fontWeight: '900', color: '#b08d57', fontSize: '13px' }}>{right}</div>
    </div>
);

export default AdvisorDailyReport;
