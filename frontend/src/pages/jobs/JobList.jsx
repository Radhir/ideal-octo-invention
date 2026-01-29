import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { Plus, Search, ChevronRight, Filter, Printer, Kanban } from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();

        // Handle direct print request from Reports Dashboard
        const params = new URLSearchParams(window.location.search);
        if (params.get('print_confirm') === 'true') {
            setTimeout(() => {
                if (window.confirm("Perform bulk print of current Job Card Registry?")) {
                    window.print();
                }
            }, 1500); // Wait for data to render
        }
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await axios.get('/forms/job-cards/api/jobs/');
            setJobs(res.data);
        } catch (err) {
            console.error('Error fetching jobs', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(j =>
        j.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.job_card_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.registration_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return (
        <div style={{ padding: '30px 20px' }}>
            <PrintHeader title="Job Card Registry" />
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#b08d57', fontSize: '1.8rem' }}>Job Cards</h1>
                    <p style={{ color: '#94a3b8' }}>Live workshop workflow tracking</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                        onClick={() => navigate('/job-board')}
                        className="glass-card"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                    >
                        <Kanban size={20} /> Board View
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="glass-card"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                    >
                        <Printer size={20} /> Print Registry
                    </button>
                    <button
                        onClick={() => window.open(`/forms/utils/generate-pdf/JobCard/0/`, '_blank')}
                        className="glass-card"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                    >
                        <Printer size={20} /> Export PDF
                    </button>
                    <Link to="/job-cards/create" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <Plus size={20} /> Open Job Card
                    </Link>
                </div>
            </header>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name, JC#, or Plate..."
                        style={{ paddingLeft: '45px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="glass-card" style={{ padding: '0 15px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                    <Filter size={18} />
                </button>
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '40px' }}>Loading Job Cards...</p>
                ) : filteredJobs.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '40px' }}>No active job cards found.</p>
                ) : (
                    filteredJobs.map((job) => (
                        <GlassCard
                            key={job.id}
                            onClick={() => navigate(`/job-cards/${job.id}`)}
                            style={{ padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: `1px solid ${getStatusColor(job.status)}22`
                                }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: getStatusColor(job.status), boxShadow: `0 0 10px ${getStatusColor(job.status)}` }}></div>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                        <span style={{ color: '#b08d57', fontSize: '14px', fontWeight: '700' }}>#{job.job_card_number}</span>
                                        <span style={{ fontSize: '11px', textTransform: 'uppercase', color: getStatusColor(job.status), background: `${getStatusColor(job.status)}11`, padding: '2px 8px', borderRadius: '4px', fontWeight: '800' }}>
                                            {job.status_display}
                                        </span>
                                    </div>
                                    <div style={{ fontWeight: '600', fontSize: '16px' }}>{job.customer_name}</div>
                                    <div style={{ color: '#94a3b8', fontSize: '13px' }}>{job.brand} {job.model} • {job.registration_number}</div>
                                </div>

                                <div style={{ textAlign: 'right', marginRight: '20px' }}>
                                    <div style={{ fontSize: '14px', fontWeight: '600' }}>AED {job.net_amount}</div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(job.date).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <ChevronRight size={24} style={{ color: '#94a3b8' }} />
                        </GlassCard>
                    ))
                )}
            </div>
            <style>{`
            `}</style>
        </div>
    );
};

export default JobList;
