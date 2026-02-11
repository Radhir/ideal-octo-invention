import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
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
    Camera
} from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';

const columns = [
    { id: 'RECEPTION', label: 'Reception', icon: Camera, color: '#3b82f6' },
    { id: 'ESTIMATION', label: 'Estimation', icon: FileText, color: '#f59e0b' },
    { id: 'WORK_ASSIGNMENT', label: 'Assignment', icon: User, color: '#8b5cf6' },
    { id: 'WIP', label: 'In Progress', icon: Clock, color: '#10b981' },
    { id: 'QC', label: 'QC Check', icon: CheckCircle2, color: '#ec4899' },
    { id: 'INVOICING', label: 'Invoicing', icon: CreditCard, color: '#b08d57' },
    { id: 'DELIVERY', label: 'Delivery', icon: Truck, color: '#2dd4bf' },
];

const JobBoard = () => {
    const [jobs, setJobs] = useState([]);
    const [_loading, setLoading] = useState(true);
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

    const advanceJob = async (jobId, currentStatus) => {
        if (!confirm('Are you sure you want to advance this job to the next stage?')) return;

        try {
            await api.post(`/forms/job-cards/api/jobs/${jobId}/advance_status/`);
            fetchJobs(); // Refresh to see change
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to advance workflow');
        }
    };

    const getJobsByStatus = (status) => jobs.filter(j => j.status === status);

    return (
        <div style={{ padding: '30px', height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <PrintHeader title="Job Workflow Board" />

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexShrink: 0 }}>
                <div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#b08d57', fontSize: '1.8rem', margin: 0 }}>Job Operations</h1>
                    <p style={{ color: '#94a3b8', margin: 0 }}>Kanban Workflow View</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                        onClick={() => navigate('/job-cards')}
                        className="glass-card"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                    >
                        <LayoutList size={20} /> List View
                    </button>
                    <button
                        onClick={() => navigate('/job-cards/create')}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Plus size={20} /> Open Job Card
                    </button>
                </div>
            </header>

            <div style={{
                display: 'flex',
                gap: '20px',
                overflowX: 'auto',
                paddingBottom: '20px',
                flex: 1,
                alignItems: 'stretch'
            }}>
                {columns.map(col => (
                    <div key={col.id} style={{ minWidth: '320px', width: '320px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '15px',
                            background: `rgba(${parseInt(col.color.slice(1, 3), 16)}, ${parseInt(col.color.slice(3, 5), 16)}, ${parseInt(col.color.slice(5, 7), 16)}, 0.1)`,
                            padding: '10px',
                            borderRadius: '10px',
                            border: `1px solid ${col.color}44`
                        }}>
                            <col.icon size={18} color={col.color} />
                            <span style={{ fontWeight: '800', color: '#fff', fontSize: '14px', textTransform: 'uppercase' }}>{col.label}</span>
                            <span style={{ marginLeft: 'auto', background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', color: '#94a3b8' }}>
                                {getJobsByStatus(col.id).length}
                            </span>
                        </div>

                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                            overflowY: 'auto',
                            paddingRight: '5px'
                        }}>
                            {getJobsByStatus(col.id).map(job => (
                                <GlassCard
                                    key={job.id}
                                    style={{
                                        padding: '15px',
                                        cursor: 'pointer',
                                        borderLeft: `4px solid ${col.color}`,
                                        transition: 'transform 0.2s',
                                        position: 'relative'
                                    }}
                                    onClick={() => navigate(`/job-cards/${job.id}`)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: col.color }}>#{job.job_card_number}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                advanceJob(job.id, job.status);
                                            }}
                                            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                                            title="Advance Workflow"
                                        >
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>

                                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '14px', marginBottom: '2px' }}>{job.customer_name}</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>{job.brand} {job.model}</div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        <span style={{ fontSize: '11px', color: '#64748b' }}>{new Date(job.created_at).toLocaleDateString()}</span>
                                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#b08d57' }}>
                                            AED {job.net_amount || '0'}
                                        </span>
                                    </div>
                                </GlassCard>
                            ))}
                            {getJobsByStatus(col.id).length === 0 && (
                                <div style={{
                                    padding: '30px',
                                    textAlign: 'center',
                                    border: '2px dashed rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    color: '#64748b',
                                    fontSize: '12px'
                                }}>
                                    No jobs
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {/* Custom Scrollbar Styles for the board */}
            <style>{`
                ::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.1); 
                }
                ::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1); 
                    borderRadius: 3px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(255,255,255,0.2); 
                }
            `}</style>
        </div>
    );
};

export default JobBoard;
