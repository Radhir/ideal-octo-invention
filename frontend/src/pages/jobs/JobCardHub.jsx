import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    ClipboardList, Clock, CheckCircle,
    AlertCircle, FileText, Plus,
    LayoutDashboard, Filter, Search
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
            'RECEPTION': '#10b981', // Emerald
            'ESTIMATION_ASSIGNMENT': '#6366f1', // Indigo
            'WIP_QC': '#3b82f6', // Blue
            'INVOICING_DELIVERY': '#f59e0b', // Amber
            'CLOSED': '#64748b' // Slate
        };
        return colors[status] || '#e8dace';
    };

    const activeJobs = jobs.filter(j => j.status !== 'CLOSED');
    const pendingQC = jobs.filter(j => j.status === 'WIP_QC' && !j.qc_sign_off);
    const readyForDelivery = jobs.filter(j => j.status === 'INVOICING_DELIVERY');

    const filteredJobs = filter === 'ALL' ? jobs : jobs.filter(j => j.status === filter);

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)' }}>SYNCHRONIZING OPERATIONAL FLOW...</div></PortfolioPage>;

    return (
        <PortfolioPage breadcrumb="Operations / Workshop">
            <PortfolioTitle subtitle="Manage full-cycle vehicle intake, technical assignment, and quality control.">
                JOB CARDS
            </PortfolioTitle>

            <PortfolioStats stats={[
                { value: jobs.length, label: 'TOTAL LIFETIME' },
                { value: activeJobs.length, label: 'ACTIVE FLOW', color: '#10b981' },
                { value: pendingQC.length, label: 'PENDING QC', color: '#f59e0b' },
                { value: readyForDelivery.length, label: 'READY', color: '#6366f1' }
            ]} />

            <div style={{ display: 'flex', gap: '20px', marginBottom: '60px', flexWrap: 'wrap' }}>
                <PortfolioButton onClick={() => navigate('/jobs/builder')} variant="gold">
                    <Plus size={18} style={{ marginRight: '10px' }} /> INITIALIZE JOB CARD
                </PortfolioButton>
                <PortfolioButton variant="secondary" onClick={() => navigate('/job-board')}>
                    <LayoutDashboard size={18} style={{ marginRight: '10px' }} /> WORKSHOP BOARD
                </PortfolioButton>
                <PortfolioButton variant="secondary" onClick={() => navigate('/workshop')}>
                    <AlertCircle size={18} style={{ marginRight: '10px' }} /> INCIDENTS & DELAYS
                </PortfolioButton>
            </div>

            {/* Active Workflow Section */}
            <h3 style={sectionHeaderStyle}>Active Workshop Flow</h3>
            <PortfolioGrid columns="repeat(auto-fill, minmax(400px, 1fr))">
                {activeJobs.length === 0 ? (
                    <div style={emptyStateStyle}>No active jobs in the workshop.</div>
                ) : (
                    activeJobs.slice(0, 6).map(job => (
                        <PortfolioCard
                            key={job.id}
                            onClick={() => navigate(`/job-cards/${job.id}`)}
                            borderColor={getStatusColor(job.status)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '11px', color: getStatusColor(job.status), fontWeight: '900', letterSpacing: '1px', marginBottom: '5px' }}>
                                        {job.status_display.toUpperCase()}
                                    </div>
                                    <div style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', marginBottom: '5px' }}>
                                        {job.customer_name}
                                    </div>
                                    <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.5)' }}>
                                        {job.brand} {job.model} • {job.registration_number}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--cream)' }}>
                                        #{job.job_card_number}
                                    </div>
                                    <div style={{ fontSize: '11px', opacity: 0.4 }}>
                                        {new Date(job.date).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid rgba(232, 230, 227, 0.05)' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {job.qc_sign_off ? <CheckCircle size={14} color="#10b981" /> : <Clock size={14} color="rgba(232, 230, 227, 0.3)" />}
                                    <span style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.5)' }}>QC SIGN-OFF</span>
                                </div>
                                <div style={{ fontSize: '16px', color: '#10b981', fontWeight: 'bold' }}>
                                    AED {parseFloat(job.net_amount).toLocaleString()}
                                </div>
                            </div>
                        </PortfolioCard>
                    ))
                )}
            </PortfolioGrid>

            {/* Quick Filtered Lists */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginTop: '80px' }}>
                <div>
                    <h3 style={sectionHeaderStyle}>Pending Quality Checks</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {pendingQC.length === 0 ? (
                            <div style={{ color: 'rgba(232, 230, 227, 0.3)', fontSize: '13px' }}>All active jobs are QC-verified.</div>
                        ) : (
                            pendingQC.map(job => (
                                <div
                                    key={job.id}
                                    onClick={() => navigate(`/job-cards/${job.id}`)}
                                    style={miniCardStyle}
                                >
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>#{job.job_card_number}</div>
                                        <div style={{ fontSize: '12px', opacity: 0.6 }}>{job.customer_name}</div>
                                    </div>
                                    <ArrowRight size={16} color="var(--cream)" />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <h3 style={sectionHeaderStyle}>Ready for Invoicing</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {readyForDelivery.length === 0 ? (
                            <div style={{ color: 'rgba(232, 230, 227, 0.3)', fontSize: '13px' }}>No jobs awaiting delivery.</div>
                        ) : (
                            readyForDelivery.map(job => (
                                <div
                                    key={job.id}
                                    onClick={() => navigate(`/job-cards/${job.id}`)}
                                    style={miniCardStyle}
                                >
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>#{job.job_card_number}</div>
                                        <div style={{ fontSize: '12px', opacity: 0.6 }}>{job.customer_name}</div>
                                    </div>
                                    <div style={{ color: '#10b981', fontWeight: 'bold' }}>AED {job.net_amount}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Full History Access */}
            <h3 style={{ ...sectionHeaderStyle, marginTop: '100px' }}>Historical Archive</h3>
            <PortfolioButton variant="secondary" onClick={() => navigate('/job-cards/list')} style={{ width: 'fit-content' }}>
                BROWSE COMPLETE ARCHIVE <ArrowRight size={18} style={{ marginLeft: '10px' }} />
            </PortfolioButton>
        </PortfolioPage>
    );
};

const sectionHeaderStyle = {
    fontSize: '24px',
    fontFamily: 'var(--font-serif)',
    color: 'var(--cream)',
    marginBottom: '30px',
    letterSpacing: '-0.01em'
};

const emptyStateStyle = {
    gridColumn: '1/-1',
    textAlign: 'center',
    padding: '60px',
    color: 'rgba(232, 230, 227, 0.5)',
    border: '1px dashed rgba(232, 230, 227, 0.1)',
    borderRadius: '20px'
};

const miniCardStyle = {
    padding: '20px',
    background: 'rgba(232, 230, 227, 0.03)',
    border: '1px solid rgba(232, 230, 227, 0.1)',
    borderRadius: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    color: 'var(--cream)',
    transition: 'all 0.2s'
};

export default JobCardHub;
