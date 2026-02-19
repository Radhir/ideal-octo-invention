import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    PortfolioPage, PortfolioTitle, PortfolioButton,
    PortfolioStats, PortfolioGrid, PortfolioCard
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
    Search,
    ArrowRight,
    BadgeCheck,
    Zap
} from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';

const columns = [
    { id: 'RECEIVED', label: 'RECEPTION', icon: Camera, color: '#b08d57' },
    { id: 'IN_PROGRESS', label: 'WORKSHOP', icon: Zap, color: '#3b82f6' },
    { id: 'READY', label: 'QUALITY CHECK', icon: BadgeCheck, color: '#10b981' },
    { id: 'INVOICED', label: 'INVOICED', icon: CreditCard, color: '#8b5cf6' },
];

const JobBoard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            let url = '/forms/job-cards/api/jobs/';
            const params = new URLSearchParams();
            if (searchQuery) params.append('q', searchQuery);
            if (startDate && endDate) {
                params.append('start_date', startDate);
                params.append('end_date', endDate);
            }
            if (params.toString()) url += `?${params.toString()}`;

            const res = await api.get(url);
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

    const calculateDaysOpen = (dateString) => {
        const start = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
        return diff === 0 ? 'Today' : `${diff}d ago`;
    };

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)', textAlign: 'center', marginTop: '100px', letterSpacing: '2px' }}>SYNCHRONIZING WORKSHOP DIARY...</div></PortfolioPage>;

    return (
        <PortfolioPage breadcrumb="Operations / Workshop">
            <PrintHeader title="Job Workflow Board" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <PortfolioTitle subtitle="Visual production pipeline and asset flow monitoring.">
                    WORKSHOP DIARY
                </PortfolioTitle>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
                    {/* Search & Filters */}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={searchContainerStyle}>
                            <Search size={16} color="rgba(232, 230, 227, 0.4)" />
                            <input
                                type="text"
                                placeholder="Search Pipeline..."
                                style={searchInputStyle}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
                            />
                        </div>
                        <PortfolioButton onClick={() => navigate('/job-cards/list')} variant="secondary" style={{ padding: '8px 15px', height: '42px' }}>
                            <LayoutList size={16} style={{ marginRight: '8px' }} /> LIST VIEW
                        </PortfolioButton>
                        <PortfolioButton onClick={() => navigate('/job-cards/create')} variant="gold" style={{ padding: '8px 15px', height: '42px' }}>
                            <Plus size={16} style={{ marginRight: '8px' }} /> NEW JOB
                        </PortfolioButton>
                    </div>
                </div>
            </div>

            <div style={boardWrapperStyle}>
                {columns.map(col => (
                    <div key={col.id} style={columnContainerStyle}>
                        <div style={columnHeaderStyle(col.color)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    padding: '6px',
                                    borderRadius: '6px',
                                    background: `${col.color}20`,
                                    border: `1px solid ${col.color}40`,
                                    color: col.color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <col.icon size={14} />
                                </div>
                                <span style={columnLabelStyle}>{col.label}</span>
                            </div>
                            <span style={countBadgeStyle}>{getJobsByStatus(col.id).length}</span>
                        </div>

                        <div style={cardsContainerStyle}>
                            {getJobsByStatus(col.id).map(job => (
                                <PortfolioCard
                                    key={job.id}
                                    onClick={() => navigate(`/job-cards/${job.id}`)}
                                    borderColor={col.color}
                                    style={{ padding: '20px', cursor: 'pointer', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-2px)' } }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span style={jcNumberStyle}>#{job.job_card_number}</span>
                                        <button
                                            style={advanceBtnStyle(col.color)}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                advanceJob(job.id);
                                            }}
                                            title="Advance Stage"
                                        >
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>

                                    <div style={customerNameStyle}>{job.customer_name}</div>
                                    <div style={vehicleInfoStyle}>{job.brand} {job.model} • {job.registration_number}</div>

                                    <div style={cardFooterStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Clock size={12} color="rgba(232, 230, 227, 0.4)" />
                                            <span style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(232, 230, 227, 0.4)' }}>
                                                {calculateDaysOpen(job.date)}
                                            </span>
                                        </div>
                                        <div style={priceStyle}>AED {Math.round(job.net_amount).toLocaleString()}</div>
                                    </div>
                                </PortfolioCard>
                            ))}
                            {getJobsByStatus(col.id).length === 0 && (
                                <div style={emptyColumnStyle}>
                                    <div style={{ opacity: 0.3, marginBottom: '5px' }}>EMPTY STAGE</div>
                                    <div style={{ fontSize: '24px', opacity: 0.1 }}>—</div>
                                </div>
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
    minWidth: '340px',
    width: '340px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
};

const columnHeaderStyle = (color) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: 'rgba(20, 20, 20, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
    borderBottom: `2px solid ${color}`
});

const columnLabelStyle = {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--cream)',
    letterSpacing: '1px'
};

const countBadgeStyle = {
    fontSize: '10px',
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.5)',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '2px 8px',
    borderRadius: '6px'
};

const cardsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flex: 1
};

const jcNumberStyle = {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--gold)',
    letterSpacing: '0.5px',
    background: 'rgba(176,141,87,0.1)',
    padding: '2px 6px',
    borderRadius: '4px'
};

const advanceBtnStyle = (color) => ({
    background: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${color}40`,
    color: color,
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
});

const customerNameStyle = {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--cream)',
    marginBottom: '4px',
    fontFamily: 'var(--font-serif)'
};

const vehicleInfoStyle = {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
    marginBottom: '15px'
};

const cardFooterStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '15px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
};

const priceStyle = {
    fontSize: '13px',
    fontWeight: '800',
    color: '#10b981',
    letterSpacing: '0.5px'
};

const emptyColumnStyle = {
    padding: '60px 20px',
    textAlign: 'center',
    fontSize: '10px',
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.2)',
    border: '1px dashed rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    letterSpacing: '1px',
    background: 'rgba(255, 255, 255, 0.01)'
};

const searchContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '0 15px',
    height: '42px',
    width: '240px'
};

const searchInputStyle = {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
    fontWeight: '500'
};

export default JobBoard;
