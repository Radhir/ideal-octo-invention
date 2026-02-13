import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Layers, Search, Filter, ChevronRight } from 'lucide-react';
import {
    PortfolioPage, PortfolioTitle, PortfolioButton,
    PortfolioStats, PortfolioGrid, PortfolioCard
} from '../../components/PortfolioComponents';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
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
            'RECEPTION': '#b08d57',
            'ESTIMATION': '#6366f1',
            'WORK_ASSIGNMENT': '#10b981',
            'WIP': '#3b82f6',
            'QC': '#ec4899',
            'INVOICING': '#8b5cf6',
            'DELIVERY': '#f59e0b',
            'CLOSED': '#64748b'
        };
        return colors[status] || '#94a3b8';
    };

    const filteredJobs = jobs.filter(job =>
        job.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.job_card_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.registration_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeJobs = jobs.filter(j => j.status !== 'CLOSED');
    const totalValue = jobs.reduce((sum, j) => sum + parseFloat(j.net_amount || 0), 0);

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)' }}>LOADING PRODUCTION RECORDS...</div></PortfolioPage>;

    return (
        <PortfolioPage breadcrumb="Operations / Workshop">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Global workshop activity tracking and production status.">
                    PRODUCTION LOG
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton onClick={() => navigate('/jobs/builder')} variant="gold">
                        <Plus size={18} style={{ marginRight: '10px' }} /> INITIALIZE JOB
                    </PortfolioButton>
                    <PortfolioButton variant="secondary" onClick={() => navigate('/job-board')}>
                        <Layers size={18} style={{ marginRight: '10px' }} /> WORKSHOP BOARD
                    </PortfolioButton>
                </div>
            </div>

            <PortfolioStats stats={[
                { value: jobs.length, label: 'TOTAL LIFETIME' },
                { value: activeJobs.length, label: 'ACTIVE FLOW', color: '#10b981' },
                { value: `AED ${(totalValue / 1000).toFixed(1)}K`, label: 'PRODUCTION VALUE', color: '#b08d57' }
            ]} />

            <div style={{ marginBottom: '40px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={searchContainerStyle}>
                    <Search size={18} color="rgba(232, 230, 227, 0.3)" />
                    <input
                        type="text"
                        placeholder="Search by customer, plate, or JC#..."
                        style={searchInputStyle}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <PortfolioButton variant="secondary" style={{ padding: '12px 20px' }}>
                    <Filter size={18} />
                </PortfolioButton>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredJobs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: 'rgba(232, 230, 227, 0.2)', background: 'rgba(232, 230, 227, 0.02)', borderRadius: '24px', border: '1px dashed rgba(232, 230, 227, 0.1)' }}>
                        NO MATCHING RECORDS FOUND IN PRODUCTION LOG
                    </div>
                ) : (
                    filteredJobs.map((job) => (
                        <button
                            key={job.id}
                            onClick={() => navigate(`/job-cards/${job.id}`)}
                            style={jobListItemStyle(getStatusColor(job.status))}
                        >
                            <div style={statusIndicatorStyle(getStatusColor(job.status))}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: getStatusColor(job.status) }} />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: '900', color: 'var(--gold)', letterSpacing: '1px' }}>
                                        #{job.job_card_number}
                                    </span>
                                    <span style={statusBadgeStyle(getStatusColor(job.status))}>
                                        {job.status_display.toUpperCase()}
                                    </span>
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--cream)', marginBottom: '5px' }}>
                                    {job.customer_name}
                                </div>
                                <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.4)', fontWeight: '600' }}>
                                    {job.brand} {job.model} • {job.registration_number}
                                </div>
                            </div>

                            <div style={{ textAlign: 'right', marginRight: '20px' }}>
                                <div style={{ fontSize: '18px', fontWeight: '900', color: '#10b981', marginBottom: '5px', fontFamily: 'var(--font-serif)' }}>
                                    AED {job.net_amount}
                                </div>
                                <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.3)', fontWeight: '700' }}>
                                    {new Date(job.date).toLocaleDateString().toUpperCase()}
                                </div>
                            </div>

                            <ChevronRight size={20} color="rgba(232, 230, 227, 0.2)" />
                        </button>
                    ))
                )}
            </div>
        </PortfolioPage>
    );
};

const jobListItemStyle = (color) => ({
    padding: '25px 35px',
    background: 'rgba(232, 230, 227, 0.03)',
    border: '1px solid rgba(232, 230, 227, 0.1)',
    borderRadius: '24px',
    cursor: 'pointer',
    display: 'flex',
    gap: '30px',
    alignItems: 'center',
    textAlign: 'left',
    color: 'var(--cream)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    position: 'relative',
    overflow: 'hidden'
});

const statusIndicatorStyle = (color) => ({
    width: '48px',
    height: '48px',
    borderRadius: '16px',
    background: `${color}15`,
    border: `1px solid ${color}30`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
});

const statusBadgeStyle = (color) => ({
    padding: '4px 12px',
    background: `${color}15`,
    color: color,
    fontSize: '10px',
    borderRadius: '50px',
    fontWeight: '900',
    border: `1px solid ${color}30`,
    letterSpacing: '0.5px'
});

const searchContainerStyle = {
    flex: 1,
    background: 'rgba(232, 230, 227, 0.03)',
    border: '1px solid rgba(232, 230, 227, 0.1)',
    borderRadius: '16px',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
};

const searchInputStyle = {
    background: 'none',
    border: 'none',
    color: 'var(--cream)',
    padding: '15px 0',
    width: '100%',
    outline: 'none',
    fontSize: '14px',
    fontWeight: '500'
};

export default JobList;
