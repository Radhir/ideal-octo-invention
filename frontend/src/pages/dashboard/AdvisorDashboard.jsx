import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    Users, Target, Calendar, Clock, ClipboardList,
    TrendingUp, Award, ArrowRightCircle, Star,
    CheckCircle2, AlertCircle, Phone, Printer, Plus
} from 'lucide-react';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioGrid,
    PortfolioTitle,
    PortfolioButton
} from '../../components/PortfolioComponents';

const AdvisorDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        myLeads: [],
        upcomingArrivals: [],
        activeJobs: [],
        metrics: {
            conversionRate: 0,
            revenueTarget: 500000,
            currentRevenue: 0,
            leadCount: 0
        }
    });

    useEffect(() => {
        fetchAdvisorStats();
    }, []);

    const fetchAdvisorStats = async () => {
        try {
            // In a real scenario, this would filter by the logged-in user
            const [leadsRes, bookingsRes, jobsRes] = await Promise.all([
                api.get('/forms/leads/api/list/'),
                api.get('/forms/bookings/api/list/'),
                api.get('/api/job-cards/api/jobs/')
            ]);

            setStats({
                myLeads: leadsRes.data.filter(l => l.status !== 'CONVERTED' && l.status !== 'LOST').slice(0, 5),
                upcomingArrivals: bookingsRes.data.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').slice(0, 5),
                activeJobs: jobsRes.data.filter(j => j.status !== 'CLOSED').slice(0, 5),
                metrics: {
                    conversionRate: 64.5, // Mock
                    revenueTarget: 500000,
                    currentRevenue: 312500, // Mock
                    leadCount: leadsRes.data.length
                }
            });
        } catch (err) {
            console.error("Advisor dashboard failed to load", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '20px' }}>
                <div className="spinner"></div>
                <p style={{ color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>Initializing Mission Control...</p>
            </div>
        </PortfolioPage>
    );

    return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <PortfolioTitle subtitle="Advisor Mission Control">
                        Executive Workspace
                    </PortfolioTitle>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                        <PortfolioButton
                            variant="primary"
                            onClick={() => navigate('/service-advisor/form')}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Plus size={18} /> New Vehicle Inspection
                        </PortfolioButton>
                        <PortfolioButton
                            variant="glass"
                            onClick={() => navigate('/advisor-daily-report?print=true')}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Printer size={18} /> Daily Briefing
                        </PortfolioButton>
                    </div>
                </div>
                <div style={{ textAlign: 'right', background: 'rgba(176,141,87,0.05)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(176,141,87,0.1)' }}>
                    <div style={{ color: 'rgba(232, 230, 227, 0.6)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Monthly Performance</div>
                    <div style={{ color: '#10b981', fontSize: '28px', fontWeight: '900', fontFamily: 'var(--font-serif)', margin: '5px 0' }}>
                        AED {stats.metrics.currentRevenue.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(232,230,227,0.4)' }}>Target: AED {stats.metrics.revenueTarget.toLocaleString()}</div>
                </div>
            </div>

            {/* QUICK STATS */}
            <PortfolioGrid columns={4} gap="20px" style={{ marginBottom: '30px' }}>
                <MetricCard icon={Star} label="Conversion" value={`${stats.metrics.conversionRate}%`} color="#fbbf24" />
                <MetricCard icon={Users} label="My Pipeline" value={stats.metrics.leadCount} color="#3b82f6" />
                <MetricCard icon={Calendar} label="Arrivals Today" value={stats.upcomingArrivals.length} color="#b08d57" />
                <MetricCard icon={ClipboardList} label="WIP Units" value={stats.activeJobs.length} color="#8b5cf6" />
            </PortfolioGrid>

            {/* MAIN DASHBOARD GRID */}
            <PortfolioGrid columns={3} gap="25px">

                {/* MY LEADS */}
                <PortfolioCard style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--cream)' }}>
                            <Target size={18} color="#f43f5e" /> My Hot Leads
                        </h3>
                        <button onClick={() => navigate('/leads')} style={{ background: 'none', border: 'none', color: 'rgba(232,230,227,0.4)', fontSize: '11px', cursor: 'pointer', fontWeight: '700' }}>VIEW ALL</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {stats.myLeads.length === 0 ? <div style={{ color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '20px' }}>No active leads</div> :
                            stats.myLeads.map(lead => (
                                <div key={lead.id} onClick={() => navigate(`/leads/${lead.id}`)} className="dashboard-row">
                                    <div>
                                        <div style={{ fontWeight: '700', color: 'var(--cream)', fontSize: '14px' }}>{lead.customer_name}</div>
                                        <div style={{ fontSize: '11px', color: 'rgba(232,230,227,0.5)' }}>{lead.interested_service}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--gold)' }}>AED {lead.estimated_value}</div>
                                        <div style={{ fontSize: '9px', color: lead.priority === 'HOT' ? '#f43f5e' : 'rgba(232,230,227,0.4)', fontWeight: '900' }}>{lead.priority}</div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </PortfolioCard>

                {/* UPCOMING ARRIVALS */}
                <PortfolioCard style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--cream)' }}>
                            <Calendar size={18} color="#3b82f6" /> Expected Arrivals
                        </h3>
                        <button onClick={() => navigate('/bookings')} style={{ background: 'none', border: 'none', color: 'rgba(232,230,227,0.4)', fontSize: '11px', cursor: 'pointer', fontWeight: '700' }}>CALENDAR</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {stats.upcomingArrivals.length === 0 ? <div style={{ color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '20px' }}>No bookings today</div> :
                            stats.upcomingArrivals.map(booking => (
                                <div key={booking.id} className="dashboard-row" style={{ cursor: 'default' }}>
                                    <div>
                                        <div style={{ fontWeight: '700', color: 'var(--cream)', fontSize: '14px' }}>{booking.customer_name}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '700' }}>{booking.v_registration_no}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--cream)' }}>{booking.booking_time}</div>
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                if (window.confirm("Mark arrived and create Job Card?")) {
                                                    try {
                                                        const res = await api.post(`/forms/bookings/api/list/${booking.id}/convert_to_job/`);
                                                        navigate(`/job-cards/${res.data.job_card_id}`);
                                                    } catch (err) { alert("Arrival process failed."); }
                                                }
                                            }}
                                            style={{
                                                background: 'var(--gold)', color: '#000', border: 'none',
                                                padding: '4px 10px', borderRadius: '6px', fontSize: '9px', fontWeight: '900',
                                                marginTop: '5px', cursor: 'pointer'
                                            }}
                                        >
                                            ARRIVE
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </PortfolioCard>

                {/* ACTIVE JOBS */}
                <PortfolioCard style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--cream)' }}>
                            <Clock size={18} color="#8b5cf6" /> My Active Units
                        </h3>
                        <button onClick={() => navigate('/job-cards')} style={{ background: 'none', border: 'none', color: 'rgba(232,230,227,0.4)', fontSize: '11px', cursor: 'pointer', fontWeight: '700' }}>TRACKING</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {stats.activeJobs.length === 0 ? <div style={{ color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '20px' }}>No active jobs</div> :
                            stats.activeJobs.map(job => (
                                <div key={job.id} onClick={() => navigate(`/job-cards/${job.id}`)} className="dashboard-row">
                                    <div>
                                        <div style={{ fontWeight: '700', color: 'var(--cream)', fontSize: '14px' }}>{job.job_card_number}</div>
                                        <div style={{ fontSize: '11px', color: 'rgba(232,230,227,0.5)' }}>{job.brand} {job.model}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{
                                            fontSize: '10px', fontWeight: '900', color: 'var(--cream)',
                                            background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '6px'
                                        }}>
                                            {job.status.split(':')[1] || job.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </PortfolioCard>

            </PortfolioGrid>

        </PortfolioPage>
    );
};

const MetricCard = ({ icon: Icon, label, value, color }) => (
    <PortfolioCard style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: `4px solid ${color}` }}>
        <div style={{
            padding: '12px', background: `${color}15`, borderRadius: '12px',
            color: color, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <Icon size={24} />
        </div>
        <div>
            <div style={{ fontSize: '11px', color: 'rgba(232,230,227,0.5)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>{value}</div>
        </div>
    </PortfolioCard>
);

export default AdvisorDashboard;
