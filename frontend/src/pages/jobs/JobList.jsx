import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Layers, Search, Filter, ChevronRight, Briefcase } from 'lucide-react';
import {
    PortfolioPage, PortfolioTitle, PortfolioButton,
    PortfolioStats, PortfolioGrid, PortfolioCard, PortfolioBackButton
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
            'ESTIMATION_ASSIGNMENT': '#b08d57',
            'WIP_QC': '#b08d57',
            'INVOICING_DELIVERY': '#10b981',
            'CLOSED': 'rgba(232, 230, 227, 0.2)'
        };
        return colors[status] || '#b08d57';
    };

    const filteredJobs = jobs.filter(job =>
        job.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.job_card_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.registration_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeJobs = jobs.filter(j => j.status !== 'CLOSED');
    const totalValue = jobs.reduce((sum, j) => sum + parseFloat(j.net_amount || 0), 0);

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)', letterSpacing: '2px', fontWeight: '800' }}>RECOVERING PRODUCTION LOGS...</div></PortfolioPage>;

    return (
        <PortfolioPage breadcrumb="Operations / Manufacturing / Job Cards">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="A real-time ledger of elite workshop operations and asset transformations.">
                    Production Registry
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton onClick={() => navigate('/job-cards/create')} variant="primary">
                        <Plus size={18} /> INITIALIZE ASSET
                    </PortfolioButton>
                    <PortfolioButton variant="secondary" onClick={() => navigate('/job-board')}>
                        <Layers size={18} /> MISSION CONTROL
                    </PortfolioButton>
                </div>
            </div>

            <PortfolioStats stats={[
                { value: jobs.length, label: 'LIFETIME ASSETS' },
                { value: activeJobs.length, label: 'LIVE OPERATIONS', color: '#10b981' },
                { value: `AED ${(totalValue / 1000).toFixed(1)}K`, label: 'DORAY VALUATION', color: 'var(--gold)' }
            ]} />

            <div style={{ marginBottom: '40px', display: 'flex', gap: '20px', alignItems: 'center', marginTop: '40px' }}>
                <div style={searchContainerStyle}>
                    <Search size={18} color="rgba(232, 230, 227, 0.2)" />
                    <input
                        type="text"
                        placeholder="Search Registry (Customer, Plate, Dossier ID)..."
                        style={searchInputStyle}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <PortfolioButton variant="secondary" style={{ padding: '0 20px', height: '48px' }}>
                    <Filter size={18} />
                </PortfolioButton>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {filteredJobs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '120px', color: 'rgba(232, 230, 227, 0.2)', background: 'rgba(232, 230, 227, 0.01)', borderRadius: '32px', border: '1px dashed rgba(232, 230, 227, 0.05)', fontFamily: 'var(--font-serif)' }}>
                        NO OPERATIONS MATCH THE CURRENT SEARCH PARAMETERS.
                    </div>
                ) : (
                    filteredJobs.map((job) => (
                        <button
                            key={job.id}
                            onClick={() => navigate(`/job-cards/${job.id}`)}
                            style={jobListItemStyle}
                        >
                            <div style={statusIndicatorStyle(getStatusColor(job.status))}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(job.status) }} />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--gold)', letterSpacing: '2px' }}>
                                        {job.job_card_number}
                                    </span>
                                    <span style={statusBadgeStyle(getStatusColor(job.status))}>
                                        {job.status_display.toUpperCase()}
                                    </span>
                                </div>
                                <div style={{ fontSize: '20px', fontWeight: '400', color: 'var(--cream)', marginBottom: '4px', fontFamily: 'var(--font-serif)' }}>
                                    {job.customer_name}
                                </div>
                                <div style={{ fontSize: '12px', color: 'rgba(232, 230, 227, 0.3)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {job.brand} {job.model} • <span style={{ color: 'rgba(232, 230, 227, 0.5)' }}>{job.registration_number}</span>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right', marginRight: '30px' }}>
                                <div style={{ fontSize: '18px', fontWeight: '100', color: 'var(--gold)', marginBottom: '4px', fontFamily: 'var(--font-serif)' }}>
                                    AED {job.net_amount}
                                </div>
                                <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.2)', fontWeight: '900', letterSpacing: '1px' }}>
                                    REG: {new Date(job.date).toLocaleDateString().toUpperCase()}
                                </div>
                            </div>

                            <div style={{ opacity: 0.3 }}>
                                <ChevronRight size={20} />
                            </div>
                        </button>
                    ))
                )}
            </div>
        </PortfolioPage>
    );
};

const jobListItemStyle = {
    padding: '30px 40px',
    background: 'rgba(232, 230, 227, 0.01)',
    border: '1px solid rgba(232, 230, 227, 0.04)',
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
    overflow: 'hidden',
    ':hover': {
        background: 'rgba(232, 230, 227, 0.03)',
        border: '1px solid rgba(232, 230, 227, 0.1)',
        transform: 'translateX(5px)'
    }
};

const statusIndicatorStyle = (color) => ({
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: `${color}05`,
    border: `1px solid ${color}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
});

const statusBadgeStyle = (color) => ({
    padding: '4px 14px',
    background: `${color}05`,
    color: color,
    fontSize: '9px',
    borderRadius: '30px',
    fontWeight: '900',
    border: `1px solid ${color}15`,
    letterSpacing: '1px'
});

const searchContainerStyle = {
    flex: 1,
    background: 'rgba(232, 230, 227, 0.02)',
    border: '1px solid rgba(232, 230, 227, 0.05)',
    borderRadius: '16px',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    height: '48px',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
};

const searchInputStyle = {
    background: 'none',
    border: 'none',
    color: 'var(--cream)',
    padding: '15px 0',
    width: '100%',
    outline: 'none',
    fontSize: '14px',
    fontWeight: '400',
    fontFamily: 'var(--font-serif)'
};

export default JobList;

