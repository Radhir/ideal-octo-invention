import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioButton,
    PortfolioCard,
    PortfolioStats,
    PortfolioBackButton
} from '../../components/PortfolioComponents';
import {
    Printer, Download, Calendar, Users, Briefcase,
    TrendingUp, Clock, CheckCircle2, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdvisorDailyReport = () => {
    const navigate = useNavigate();
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
                api.get('/forms/leads/api/list/').catch(() => ({ data: [] })),
                api.get('/forms/bookings/api/list/').catch(() => ({ data: [] })),
                api.get('/api/job-cards/api/jobs/').catch(() => ({ data: [] }))
            ]);

            const leadsData = Array.isArray(leadsRes.data) ? leadsRes.data : leadsRes.data.results || [];
            const bookingsData = Array.isArray(bookingsRes.data) ? bookingsRes.data : bookingsRes.data.results || [];
            const jobsData = Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data.results || [];

            setData({
                arrivals: bookingsData.filter(b => b.booking_date === today),
                activeJobs: jobsData.filter(j => j.status !== 'CLOSED' && j.status !== 'DELIVERED'),
                hotLeads: leadsData.filter(l => l.priority === 'HOT' && l.status !== 'CONVERTED'),
                stats: {
                    conversion: 68,
                    revenue: 24500
                }
            });

            const params = new URLSearchParams(window.location.search);
            if (params.get('print_confirm') === 'true') {
                setTimeout(() => {
                    if (window.confirm("Executive Briefing ready. Proceed to print generation?")) {
                        window.print();
                    }
                }, 1500);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <PortfolioPage><div style={{ color: 'var(--gold)', letterSpacing: '2px', fontWeight: '900', fontSize: '10px', padding: '100px', textAlign: 'center' }}>COLLATING STRATEGIC INTELLIGENCE...</div></PortfolioPage>;

    const statsData = [
        { label: "EXPECTED ARRIVALS", value: data.arrivals.length, color: "#3b82f6" },
        { label: "WORKSHOP INVENTORY", value: data.activeJobs.length, color: "var(--gold)" },
        { label: "HOT PIPELINE", value: data.hotLeads.length, color: "#f43f5e" },
        { label: "EST. DAILY VALUE", value: `AED ${data.stats.revenue.toLocaleString()}`, color: "#10b981" },
    ];

    return (
        <PortfolioPage breadcrumb="Executive Intelligence / Daily Briefing">
            <PortfolioBackButton onClick={() => navigate('/reports')} />

            <div className="no-print">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '80px' }}>
                    <PortfolioTitle subtitle="Strategic morning briefing and operational summary for Service Advisors.">
                        Advisor Mission Control
                    </PortfolioTitle>
                    <PortfolioButton onClick={() => window.print()} variant="primary">
                        <Printer size={18} style={{ marginRight: '10px' }} /> PRINT BRIEFING
                    </PortfolioButton>
                </div>

                <PortfolioStats stats={statsData} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '60px' }}>
                    <BriefingSection title="Morning Arrivals" icon={Clock} color="#3b82f6">
                        {data.arrivals.length === 0 ? <p style={{ color: 'rgba(232, 230, 227, 0.2)', fontSize: '12px', padding: '20px 0' }}>No arrivals scheduled for the current cycle.</p> :
                            data.arrivals.map(b => (
                                <BriefingRow
                                    key={b.id}
                                    title={b.customer_name}
                                    sub={b.v_registration_no}
                                    right={b.booking_time}
                                    onClick={() => navigate(`/bookings/${b.id}`)}
                                />
                            ))
                        }
                    </BriefingSection>

                    <BriefingSection title="Conversion Watch" icon={TrendingUp} color="#f43f5e">
                        {data.hotLeads.length === 0 ? <p style={{ color: 'rgba(232, 230, 227, 0.2)', fontSize: '12px', padding: '20px 0' }}>No high-priority leads identified.</p> :
                            data.hotLeads.map(l => (
                                <BriefingRow
                                    key={l.id}
                                    title={l.customer_name}
                                    sub={l.interested_service}
                                    right={`AED ${l.estimated_value || 'TBD'}`}
                                    onClick={() => navigate(`/leads/${l.id}`)}
                                />
                            ))
                        }
                    </BriefingSection>
                </div>

                <div style={{ marginTop: '40px' }}>
                    <BriefingSection title="Active Workshop Inventory" icon={Briefcase} color="var(--gold)">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 40px' }}>
                            {data.activeJobs.length === 0 ? <p style={{ color: 'rgba(232, 230, 227, 0.2)', fontSize: '12px', padding: '20px 0' }}>Workshop floor is currently clear.</p> :
                                data.activeJobs.slice(0, 12).map(j => (
                                    <BriefingRow
                                        key={j.id}
                                        title={`#${j.job_card_number}`}
                                        sub={`${j.brand} ${j.model}`}
                                        right={j.status}
                                        onClick={() => navigate(`/jobs/${j.id}`)}
                                    />
                                ))
                            }
                        </div>
                    </BriefingSection>
                </div>
            </div>

            {/* PRINT COMPONENT */}
            <div className="print-only" style={{ display: 'none' }}>
                <div style={{ borderBottom: '2px solid #000', paddingBottom: '20px', marginBottom: '30px' }}>
                    <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', letterSpacing: '2px' }}>EXECUTIVE BRIEFING: SERVICE DEPARTMENT</h1>
                    <div style={{ fontSize: '10px', fontWeight: '700', marginTop: '5px' }}>
                        DATE: {new Date().toLocaleDateString().toUpperCase()} | GENERATED BY SYSTEM INTELLIGENCE
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '30px' }}>
                    {statsData.map(s => (
                        <div key={s.label} style={{ border: '1px solid #ddd', padding: '10px' }}>
                            <div style={{ fontSize: '8px', color: '#666', fontWeight: '800' }}>{s.label}</div>
                            <div style={{ fontSize: '16px', fontWeight: '900' }}>{s.value}</div>
                        </div>
                    ))}
                </div>

                {/* Print Tables */}
                <h3 style={{ fontSize: '12px', fontWeight: '900', borderBottom: '1px solid #000', paddingBottom: '5px' }}>MORNING ARRIVALS</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', fontSize: '10px' }}>
                    <thead><tr><th style={pth}>CLIENT</th><th style={pth}>VEHICLE</th><th style={{ ...pth, textAlign: 'right' }}>ETA</th></tr></thead>
                    <tbody>
                        {data.arrivals.map(b => (
                            <tr key={b.id}><td style={ptd}>{b.customer_name}</td><td style={ptd}>{b.v_registration_no}</td><td style={{ ...ptd, textAlign: 'right' }}>{b.booking_time}</td></tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </PortfolioPage>
    );
};

const pth = { padding: '8px', borderBottom: '1px solid #eee', textAlign: 'left', fontSize: '8px', fontWeight: '900' };
const ptd = { padding: '8px', borderBottom: '1px solid #eee' };

const BriefingSection = ({ title, children, icon: Icon, color }) => (
    <PortfolioCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px', color: color }}>
            <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${color}20`
            }}>
                <Icon size={16} />
            </div>
            <h3 style={{ margin: 0, fontSize: '10px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>
                {title}
            </h3>
        </div>
        {children}
    </PortfolioCard>
);

const BriefingRow = ({ title, sub, right, onClick }) => (
    <div
        onClick={onClick}
        style={{
            padding: '15px 0',
            borderBottom: '1px solid rgba(232, 230, 227, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
    >
        <div>
            <div style={{ fontWeight: '400', color: 'var(--cream)', fontSize: '15px', fontFamily: 'var(--font-serif)' }}>{title}</div>
            <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.3)', letterSpacing: '0.5px' }}>{sub}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontWeight: '800', color: 'var(--gold)', fontSize: '13px', letterSpacing: '0.5px' }}>{right}</div>
            <ArrowUpRight size={14} color="rgba(232, 230, 227, 0.1)" />
        </div>
    </div>
);

export default AdvisorDailyReport;
