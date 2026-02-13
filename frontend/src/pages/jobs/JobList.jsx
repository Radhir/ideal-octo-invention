import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Layers } from 'lucide-react';
import { PortfolioPage, PortfolioTitle, PortfolioButton, PortfolioStats, PortfolioGrid } from '../../components/PortfolioComponents';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
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
            'RECEPTION': '#b08d57', 'ESTIMATION': '#6366f1', 'WORK_ASSIGNMENT': '#10b981',
            'WIP': '#3b82f6', 'QC': '#ec4899', 'INVOICING': '#8b5cf6',
            'DELIVERY': '#f59e0b', 'CLOSED': '#64748b'
        };
        return colors[status] || '#94a3b8';
    };

    const activeJobs = jobs.filter(j => j.status !== 'CLOSED');
    const totalValue = jobs.reduce((sum, j) => sum + parseFloat(j.net_amount || 0), 0);

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)' }}>Loading...</div></PortfolioPage>;

    return (
        <PortfolioPage breadcrumb="Operations">
            <PortfolioTitle subtitle="Workshop workflow and service tracking">
                JOB CARDS
            </PortfolioTitle>

            <PortfolioStats stats={[
                { value: jobs.length, label: 'TOTAL JOBS' },
                { value: activeJobs.length, label: 'ACTIVE', color: '#3b82f6' },
                { value: `${(totalValue / 1000).toFixed(0)}K`, label: 'AED VALUE', color: '#10b981' }
            ]} />

            <div style={{ display: 'flex', gap: '20px', marginBottom: '60px' }}>
                <PortfolioButton onClick={() => navigate('/job-cards/create')}>
                    <Plus size={18} style={{ display: 'inline', marginRight: '10px', marginBottom: '-3px' }} />
                    New Job Card
                </PortfolioButton>
                <PortfolioButton variant="secondary" onClick={() => navigate('/job-board')}>
                    <Layers size={18} style={{ display: 'inline', marginRight: '10px', marginBottom: '-3px' }} />
                    Board View
                </PortfolioButton>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '1200px' }}>
                {jobs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(232, 230, 227, 0.5)' }}>
                        No job cards found
                    </div>
                ) : (
                    jobs.map((job) => (
                        <button
                            key={job.id}
                            onClick={() => navigate(`/job-cards/${job.id}`)}
                            style={{
                                padding: '25px 30px',
                                background: 'rgba(232, 230, 227, 0.03)',
                                border: '1px solid rgba(232, 230, 227, 0.1)',
                                borderLeft: `4px solid ${getStatusColor(job.status)}`,
                                borderRadius: '15px',
                                cursor: 'pointer',
                                display: 'grid',
                                gridTemplateColumns: 'auto 1fr auto',
                                gap: '25px',
                                alignItems: 'center',
                                textAlign: 'left',
                                color: 'var(--cream)',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(232, 230, 227, 0.05)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(232, 230, 227, 0.03)'}
                        >
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: `${getStatusColor(job.status)}20`,
                                border: `2px solid ${getStatusColor(job.status)}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: getStatusColor(job.status) }} />
                            </div>

                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '16px', fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}>
                                        #{job.job_card_number}
                                    </span>
                                    <span style={{
                                        padding: '4px 12px',
                                        background: `${getStatusColor(job.status)}20`,
                                        color: getStatusColor(job.status),
                                        fontSize: '11px',
                                        borderRadius: '50px',
                                        fontWeight: '500'
                                    }}>
                                        {job.status_display}
                                    </span>
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '5px' }}>
                                    {job.customer_name}
                                </div>
                                <div style={{ fontSize: '13px', opacity: 0.6 }}>
                                    {job.brand} {job.model} • {job.registration_number}
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', color: '#10b981', marginBottom: '5px' }}>
                                    AED {job.net_amount}
                                </div>
                                <div style={{ fontSize: '12px', opacity: 0.5 }}>
                                    {new Date(job.date).toLocaleDateString()}
                                </div>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </PortfolioPage>
    );
};

export default JobList;
