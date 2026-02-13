import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    PortfolioPage, PortfolioTitle, PortfolioButton,
    PortfolioStats, PortfolioGrid
} from '../../components/PortfolioComponents';
import {
    MoreHorizontal,
    Plus,
    LayoutList,
    Kanban,
    User,
    Clock,
    CheckCircle2,
    Truck,
    CreditCard,
    FileText,
    Camera,
    ChevronRight,
    Search
} from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';

const columns = [
    { id: 'RECEPTION', label: 'Reception', icon: Camera, color: '#b08d57' },
    { id: 'ESTIMATION_ASSIGNMENT', label: 'Estimation', icon: FileText, color: '#6366f1' },
    { id: 'WIP_QC', label: 'Production / QC', icon: CheckCircle2, color: '#10b981' },
    { id: 'INVOICING_DELIVERY', label: 'Delivery', icon: Truck, color: '#f59e0b' },
];

const JobBoard = () => {
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

    const advanceJob = async (jobId) => {
        try {
            await api.post(`/forms/job-cards/api/jobs/${jobId}/advance_status/`);
            fetchJobs();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to advance workflow');
        }
    };

    const getJobsByStatus = (status) => {
        return jobs.filter(j => {
            const matchesStatus = j.status === status;
            const matchesSearch = !searchQuery ||
                j.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                j.job_card_number?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    };

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)' }}>LOADING PRODUCTION FLOW...</div></PortfolioPage>;

    return (
        <PortfolioPage breadcrumb="Operations / Workshop">
            <PrintHeader title="Job Workflow Board" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Real-time production pipeline and asset flow monitoring.">
                    WORKSHOP BOARD
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={searchContainerStyle}>
                        <Search size={16} color="rgba(232, 230, 227, 0.4)" />
                        <input
                            type="text"
                            placeholder="Find asset..."
                            style={searchInputStyle}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <PortfolioButton onClick={() => navigate('/job-cards/list')} variant="secondary">
                        <LayoutList size={18} style={{ marginRight: '10px' }} /> LIST VIEW
                    </PortfolioButton>
                    <PortfolioButton onClick={() => navigate('/jobs/builder')} variant="gold">
                        <Plus size={18} style={{ marginRight: '10px' }} /> NEW COMMAND
                    </PortfolioButton>
                </div>
            </div>

            <div style={boardWrapperStyle}>
                {columns.map(col => (
                    <div key={col.id} style={columnContainerStyle}>
                        <div style={columnHeaderStyle(col.color)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <col.icon size={16} color={col.color} />
                                <span style={columnLabelStyle}>{col.label.toUpperCase()}</span>
                            </div>
                            <span style={countBadgeStyle}>{getJobsByStatus(col.id).length}</span>
                        </div>

                        <div style={cardsContainerStyle}>
                            {getJobsByStatus(col.id).map(job => (
                                <div
                                    key={job.id}
                                    style={kanbanCardStyle}
                                    onClick={() => navigate(`/job-cards/${job.id}`)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span style={jcNumberStyle}>#{job.job_card_number}</span>
                                        <button
                                            style={advanceBtnStyle}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                advanceJob(job.id);
                                            }}
                                        >
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>

                                    <div style={customerNameStyle}>{job.customer_name}</div>
                                    <div style={vehicleInfoStyle}>{job.brand} {job.model}</div>

                                    <div style={cardFooterStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={statusDotStyle(col.color)} />
                                            <span style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(232, 230, 227, 0.4)', letterSpacing: '0.5px' }}>{job.status_display.toUpperCase()}</span>
                                        </div>
                                        <div style={priceStyle}>AED {job.net_amount}</div>
                                    </div>
                                </div>
                            ))}
                            {getJobsByStatus(col.id).length === 0 && (
                                <div style={emptyColumnStyle}>NO ASSETS IN {col.label.toUpperCase()}</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </PortfolioPage>
    );
};

// Styles
const boardWrapperStyle = {
    display: 'flex',
    gap: '24px',
    overflowX: 'auto',
    paddingBottom: '40px',
    alignItems: 'stretch',
    minHeight: '600px'
};

const columnContainerStyle = {
    minWidth: '320px',
    width: '320px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
};

const columnHeaderStyle = (color) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    background: 'rgba(232, 230, 227, 0.02)',
    border: '1px solid rgba(232, 230, 227, 0.08)',
    borderRadius: '16px',
    borderLeft: `2px solid ${color}`
});

const columnLabelStyle = {
    fontSize: '11px',
    fontWeight: '900',
    color: 'var(--cream)',
    letterSpacing: '1px'
};

const countBadgeStyle = {
    fontSize: '10px',
    fontWeight: '900',
    color: 'rgba(232, 230, 227, 0.3)',
    background: 'rgba(232, 230, 227, 0.05)',
    padding: '4px 10px',
    borderRadius: '8px'
};

const cardsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flex: 1
};

const kanbanCardStyle = {
    padding: '24px',
    background: 'rgba(232, 230, 227, 0.03)',
    border: '1px solid rgba(232, 230, 227, 0.08)',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
        background: 'rgba(232, 230, 227, 0.05)',
        transform: 'translateY(-2px)',
        borderColor: 'rgba(232, 230, 227, 0.15)'
    }
};

const jcNumberStyle = {
    fontSize: '10px',
    fontWeight: '900',
    color: 'var(--gold)',
    letterSpacing: '1px'
};

const advanceBtnStyle = {
    background: 'rgba(232, 230, 227, 0.05)',
    border: 'none',
    color: 'var(--gold)',
    padding: '4px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const customerNameStyle = {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--cream)',
    marginBottom: '4px'
};

const vehicleInfoStyle = {
    fontSize: '12px',
    color: 'rgba(232, 230, 227, 0.4)',
    fontWeight: '600',
    marginBottom: '20px'
};

const cardFooterStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid rgba(232, 230, 227, 0.05)'
};

const priceStyle = {
    fontSize: '13px',
    fontWeight: '900',
    color: '#10b981',
    fontFamily: 'var(--font-serif)'
};

const statusDotStyle = (color) => ({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: color,
    boxShadow: `0 0 10px ${color}60`
});

const emptyColumnStyle = {
    padding: '40px 20px',
    textAlign: 'center',
    fontSize: '10px',
    fontWeight: '900',
    color: 'rgba(232, 230, 227, 0.15)',
    border: '1px dashed rgba(232, 230, 227, 0.05)',
    borderRadius: '16px',
    letterSpacing: '1px'
};

const searchContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(232, 230, 227, 0.05)',
    border: '1px solid rgba(232, 230, 227, 0.1)',
    borderRadius: '12px',
    padding: '0 15px',
    height: '42px'
};

const searchInputStyle = {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
    width: '150px'
};

export default JobBoard;
