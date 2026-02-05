import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import {
    Users, Target, Calendar, Clock, ClipboardList,
    TrendingUp, Award, ArrowRightCircle, Star,
    CheckCircle2, AlertCircle, Phone, Printer
} from 'lucide-react';

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
                api.get('/forms/job-cards/api/jobs/')
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

    if (loading) return <div style={{ padding: '40px', color: '#fff' }}>Initializing Personal Command...</div>;

    return (
        <div style={{ padding: '30px', maxWidth: '1600px', margin: '0 auto' }}>
            <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '2px' }}>ADVISOR MISSION CONTROL</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>Executive Workspace</h1>
                    <button
                        onClick={() => navigate('/service-advisor/form')}
                        style={{
                            marginTop: '10px',
                            background: 'linear-gradient(135deg, #b08d57 0%, #8a6d43 100%)',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '13px'
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>+</span> New Vehicle Inspection
                    </button>
                    <button
                        onClick={() => navigate('/advisor-daily-report?print=true')}
                        style={{
                            marginTop: '10px',
                            background: 'rgba(255,255,255,0.05)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.1)',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '13px',
                            marginLeft: '15px'
                        }}
                    >
                        <Printer size={16} /> Generate Daily Briefing
                    </button>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>MY MONTHLY PERFORMANCE</div>
                    <div style={{ color: '#10b981', fontSize: '24px', fontWeight: '800' }}>AED {stats.metrics.currentRevenue.toLocaleString()} <span style={{ fontSize: '12px', color: '#64748b' }}>/ {stats.metrics.revenueTarget.toLocaleString()}</span></div>
                </div>
            </header>

            {/* QUICK STATS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <MetricCard icon={Star} label="Conversion" value={`${stats.metrics.conversionRate}%`} color="#fbbf24" />
                <MetricCard icon={Users} label="My Pipeline" value={stats.metrics.leadCount} color="#3b82f6" />
                <MetricCard icon={Calendar} label="Arrivals Today" value={stats.upcomingArrivals.length} color="#b08d57" />
                <MetricCard icon={ClipboardList} label="WIP Units" value={stats.activeJobs.length} color="#8b5cf6" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>

                {/* MY LEADS */}
                <GlassCard style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Target size={18} color="#f43f5e" /> My Hot Leads
                        </h3>
                        <button onClick={() => navigate('/leads')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '11px', cursor: 'pointer', fontWeight: '700' }}>VIEW ALL</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {stats.myLeads.map(lead => (
                            <div key={lead.id} onClick={() => navigate(`/leads/${lead.id}`)} style={rowStyle}>
                                <div>
                                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>{lead.customer_name}</div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{lead.interested_service}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#b08d57' }}>AED {lead.estimated_value}</div>
                                    <div style={{ fontSize: '9px', color: lead.priority === 'HOT' ? '#f43f5e' : '#64748b', fontWeight: '900' }}>{lead.priority}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* UPCOMING ARRIVALS */}
                <GlassCard style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={18} color="#3b82f6" /> Expected Arrivals
                        </h3>
                        <button onClick={() => navigate('/bookings')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '11px', cursor: 'pointer', fontWeight: '700' }}>RESOURCES</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {stats.upcomingArrivals.map(booking => (
                            <div key={booking.id} style={rowStyle}>
                                <div>
                                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>{booking.customer_name}</div>
                                    <div style={{ fontSize: '11px', color: '#b08d57', fontWeight: '700' }}>{booking.v_registration_no}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#fff' }}>{booking.booking_time}</div>
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            if (window.confirm("Mark arrived and create Job Card?")) {
                                                try {
                                                    const res = await axios.post(`/forms/bookings/api/list/${booking.id}/convert_to_job/`);
                                                    navigate(`/job-cards/${res.data.job_card_id}`);
                                                } catch (err) { alert("Arrival process failed."); }
                                            }
                                        }}
                                        style={actionBtnStyle}
                                    >
                                        ARRIVED
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* ACTIVE JOBS */}
                <GlassCard style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={18} color="#8b5cf6" /> My Active Units
                        </h3>
                        <button onClick={() => navigate('/job-cards')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '11px', cursor: 'pointer', fontWeight: '700' }}>TRACKING</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {stats.activeJobs.map(job => (
                            <div key={job.id} onClick={() => navigate(`/job-cards/${job.id}`)} style={rowStyle}>
                                <div>
                                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>{job.job_card_number}</div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{job.brand} {job.model}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        fontSize: '10px',
                                        fontWeight: '900',
                                        color: '#fff',
                                        background: 'rgba(255,255,255,0.05)',
                                        padding: '4px 8px',
                                        borderRadius: '6px'
                                    }}>
                                        {job.status.split(':')[1] || job.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

            </div>
        </div>
    );
};

const MetricCard = ({ icon: Icon, label, value, color }) => (
    <GlassCard style={{ padding: '20px', borderLeft: `4px solid ${color}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: `${color}15`, borderRadius: '10px', color: color }}>
                <Icon size={18} />
            </div>
            <div>
                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: '#fff' }}>{value}</div>
            </div>
        </div>
    </GlassCard>
);

const rowStyle = {
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid transparent'
};

const actionBtnStyle = {
    background: '#b08d57',
    color: '#000',
    border: 'none',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '9px',
    fontWeight: '900',
    marginTop: '5px',
    cursor: 'pointer'
};

export default AdvisorDashboard;
