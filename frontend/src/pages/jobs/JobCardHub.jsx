import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    ClipboardList, Clock, CheckCircle,
    AlertCircle, FileText, Plus,
    LayoutDashboard, Filter, Search, ArrowRight,
    BookOpen, ShieldAlert, BadgeCheck, Printer,
    Activity, TrendingUp, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    PortfolioPage, PortfolioTitle, PortfolioStats,
    PortfolioGrid, PortfolioButton, PortfolioCard
} from '../../components/PortfolioComponents';

const JobCardHub = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/forms/job-cards/api/jobs/');
            setJobs(res.data);
        } catch (err) {
            console.error('Error fetching jobs', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'RECEIVED': '#b08d57', // Gold
            'IN_PROGRESS': '#3b82f6', // Blue
            'READY': '#10b981', // Emerald
            'INVOICED': '#8b5cf6', // Purple
            'CLOSED': '#64748b' // Slate
        };
        return colors[status] || '#e8dace';
    };

    const activeJobs = jobs.filter(j => j.status !== 'CLOSED');
    const pendingQC = jobs.filter(j => j.status === 'IN_PROGRESS');
    const readyForDelivery = jobs.filter(j => j.status === 'READY' || j.status === 'INVOICED');

    // Calculate Efficiency Score (Mock logic for visual impact, can be real later)
    const efficiencyScore = activeJobs.length > 0 ? Math.round((readyForDelivery.length / activeJobs.length) * 100) : 100;

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)', textAlign: 'center', marginTop: '100px', letterSpacing: '2px' }}>INITIALIZING COMMAND CENTER...</div></PortfolioPage>;

    return (
        <PortfolioPage breadcrumb="Operations / Command">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <PortfolioTitle subtitle="Real-time workshop telemetry and operational control.">
                    OPERATIONAL COMMAND
                </PortfolioTitle>
                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', marginBottom: '5px' }}>SYSTEM STATUS</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '14px', fontWeight: 'bold' }}>
                        <Zap size={16} /> ONLINE
                    </div>
                </div>
            </div>

            {/* High-Level Telemetry */}
            <PortfolioStats stats={[
                { value: activeJobs.length, label: 'ACTIVE VEHICLES', icon: <Activity size={18} /> },
                { value: `${efficiencyScore}%`, label: 'FLOW EFFICIENCY', color: '#10b981', icon: <TrendingUp size={18} /> },
                { value: pendingQC.length, label: 'IN PROGRESS', color: '#3b82f6', icon: <Clock size={18} /> },
                { value: readyForDelivery.length, label: 'READY FOR EXIT', color: '#8b5cf6', icon: <CheckCircle size={18} /> }
            ]} />

            {/* Premium Command Dock */}
            <div style={{
                background: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(176,141,87,0.1)',
                borderRadius: '24px',
                padding: '12px',
                marginBottom: '60px',
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                flexWrap: 'wrap',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                position: 'relative'
            }}>
                <div style={{
                    padding: '0 20px',
                    borderRight: '1px solid rgba(176,141,87,0.1)',
                    marginRight: '10px'
                }}>
                    <div style={{ fontSize: '9px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>
                        COMMAND
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>
                        DOCK V1.0
                    </div>
                </div>

                <PortfolioButton
                    onClick={() => navigate('/job-cards/create')}
                    variant="gold"
                    style={{ padding: '12px 24px', borderRadius: '14px', fontSize: '11px' }}
                >
                    <Plus size={16} style={{ marginRight: '8px' }} /> NEW JOB CARD
                </PortfolioButton>

                <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                    {[
                        { label: 'DIARY', path: '/job-cards/board', icon: LayoutDashboard },
                        { label: 'INVOICES', path: '/job-cards/invoice-book', icon: BookOpen },
                        { label: 'WARRANTY', path: '/job-cards/warranty', icon: ShieldAlert }
                    ].map(btn => (
                        <button
                            key={btn.label}
                            onClick={() => navigate(btn.path)}
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                color: 'var(--cream)',
                                padding: '12px 20px',
                                borderRadius: '14px',
                                fontSize: '10px',
                                fontWeight: '800',
                                letterSpacing: '1px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(176,141,87,0.1)';
                                e.currentTarget.style.borderColor = 'var(--gold)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                            }}
                        >
                            <btn.icon size={14} color="var(--gold)" /> {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Live Workflow Pulse */}
            <h3 style={sectionHeaderStyle}>Live Workflow Pulse</h3>
            <PortfolioGrid columns="repeat(auto-fill, minmax(380px, 1fr))">
                {activeJobs.length === 0 ? (
                    <div style={emptyStateStyle}>No vehicles currently in the workflow.</div>
                ) : (
                    activeJobs.map(job => (
                        <PortfolioCard
                            key={job.id}
                            onClick={() => navigate(`/job-cards/${job.id}`)}
                            borderColor={getStatusColor(job.status)}
                            style={{
                                position: 'relative',
                                overflow: 'hidden',
                                padding: '30px',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
                            }}
                            className="workflow-card"
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div>
                                    <div style={{
                                        fontSize: '9px',
                                        color: getStatusColor(job.status),
                                        fontWeight: '900',
                                        letterSpacing: '2px',
                                        marginBottom: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '4px 12px',
                                        background: `${getStatusColor(job.status)}10`,
                                        borderRadius: '20px',
                                        width: 'fit-content',
                                        border: `1px solid ${getStatusColor(job.status)}30`
                                    }}>
                                        <div className={`status-pulse ${job.status === 'IN_PROGRESS' ? 'active' : ''}`} style={{ background: getStatusColor(job.status) }} />
                                        {job.status_display}
                                    </div>
                                    <div style={{ fontSize: '22px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', fontWeight: '400', letterSpacing: '0.5px' }}>
                                        {job.customer_name}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontWeight: '600' }}>
                                        {job.brand} {job.model}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '14px', fontWeight: '900', color: 'var(--gold)', opacity: 0.8, letterSpacing: '1px' }}>
                                        #{job.job_card_number}
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '6px', fontWeight: '700' }}>
                                        {new Date(job.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }).toUpperCase()}
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: '20px',
                                borderTop: '1px solid rgba(255,255,255,0.03)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{
                                        padding: '6px 14px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px',
                                        fontSize: '11px',
                                        color: 'var(--cream)',
                                        fontWeight: '800',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        {job.registration_number}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); window.open(`/job-cards/${job.id}/print`, '_blank'); }}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid var(--gold)',
                                            borderRadius: '8px',
                                            padding: '8px 16px',
                                            color: 'var(--gold)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontSize: '10px',
                                            fontWeight: '800',
                                            transition: 'all 0.3s'
                                        }}
                                        className="print-btn-hover"
                                    >
                                        <Printer size={12} /> PRINT
                                    </button>
                                    <div style={{
                                        background: 'var(--gold)',
                                        borderRadius: '8px',
                                        padding: '8px 16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontSize: '12px',
                                        fontWeight: '900',
                                        color: '#000'
                                    }}>
                                        AED {Math.round(job.net_amount).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </PortfolioCard>
                    ))
                )}
            </PortfolioGrid>

            {/* Archive Access */}
            <div style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center' }}>
                <PortfolioButton variant="secondary" onClick={() => navigate('/job-cards/list')} style={{ width: 'fit-content', padding: '12px 30px' }}>
                    ACCESS FULL ARCHIVES <ArrowRight size={16} style={{ marginLeft: '10px' }} />
                </PortfolioButton>
            </div>
        </PortfolioPage >
    );
};

const sectionHeaderStyle = {
    fontSize: '20px',
    color: 'var(--cream)',
    marginBottom: '30px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
};

const emptyStateStyle = {
    gridColumn: '1/-1',
    textAlign: 'center',
    padding: '80px',
    color: 'rgba(255,255,255,0.3)',
    border: '1px dashed rgba(255,255,255,0.1)',
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.01)',
    fontSize: '14px',
    letterSpacing: '1px'
};

export default JobCardHub;
