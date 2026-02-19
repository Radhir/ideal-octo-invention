import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, Activity, ShieldAlert, Plus, Search,
    Filter, AlertTriangle, CheckCircle2, ChevronRight
} from 'lucide-react';
import api from '../../api/axios';
import {
    PortfolioPage, PortfolioTitle, PortfolioStats,
    PortfolioButton, PortfolioGrid, PortfolioCard
} from '../../components/PortfolioComponents';

const WorkshopPortal = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('radar'); // radar, ops, stats
    const [jobs, setJobs] = useState([]);
    const [delays, setDelays] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPortalData();
    }, []);

    const fetchPortalData = async () => {
        setLoading(true);
        try {
            const [jobsRes, delayRes, incidentRes] = await Promise.all([
                api.get('/forms/job-cards/api/jobs/'),
                api.get('/workshop/api/delays/'),
                api.get('/workshop/api/incidents/')
            ]);
            setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data.results || []);
            setDelays(Array.isArray(delayRes.data) ? delayRes.data : delayRes.data.results || []);
            setIncidents(Array.isArray(incidentRes.data) ? incidentRes.data : incidentRes.data.results || []);
        } catch (err) {
            console.error('Error fetching workshop portal data', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'RECEIVED': return '#FFC700';
            case 'IN_PROGRESS': return '#00D1FF';
            case 'READY': return '#00FFA3';
            case 'CLOSED': return '#888';
            default: return 'var(--cream)';
        }
    };

    const stats = [
        { label: 'Vehicles In Facility', value: jobs.filter(j => j.status !== 'CLOSED').length },
        { label: 'Active Delays', value: delays.length, color: delays.length > 0 ? '#FF7E75' : 'var(--cream)' },
        { label: 'Safety Incidents', value: incidents.length, color: incidents.length > 0 ? '#FF4D4D' : 'var(--cream)' },
        { label: 'Completed Today', value: jobs.filter(j => j.status === 'READY').length }
    ];

    const filteredJobs = jobs.filter(job => {
        const query = searchQuery.toLowerCase();
        return (job.job_card_number?.toLowerCase().includes(query) ||
            job.registration_number?.toLowerCase().includes(query) ||
            job.customer_name?.toLowerCase().includes(query) ||
            job.brand?.toLowerCase().includes(query));
    });

    return (
        <PortfolioPage breadcrumb="OPERATIONS / WORKSHOP">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Lifecycle Monitoring & Operational Safety">
                    WORKSHOP<br />REGISTRY
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '100px' }}>
                    <PortfolioButton onClick={() => navigate('/workshop/delay')} variant="secondary">
                        Report Delay
                    </PortfolioButton>
                    <PortfolioButton onClick={() => navigate('/workshop/incident')} variant="primary" style={{ background: '#FF4D4D', color: '#fff' }}>
                        Log Incident
                    </PortfolioButton>
                </div>
            </div>

            <PortfolioStats stats={stats} />

            <div style={{ display: 'flex', gap: '30px', marginBottom: '60px', borderBottom: '1px solid rgba(232, 230, 227, 0.1)' }}>
                {['radar', 'operations', 'analytics'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '15px 0',
                            color: activeTab === tab ? 'var(--cream)' : 'rgba(232, 230, 227, 0.4)',
                            fontSize: '13px',
                            fontWeight: '600',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            borderBottom: activeTab === tab ? '2px solid var(--cream)' : '2px solid transparent',
                            transition: 'all 0.3s'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ padding: '100px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.3)', letterSpacing: '2px' }}>
                    SYNCHRONIZING WORKSHOP DATA...
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    {activeTab === 'radar' && (
                        <motion.div
                            key="radar"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div style={{ marginBottom: '40px', display: 'flex', gap: '20px' }}>
                                <div style={{
                                    flex: 1,
                                    background: 'rgba(232, 230, 227, 0.03)',
                                    border: '1px solid rgba(232, 230, 227, 0.1)',
                                    borderRadius: '50px',
                                    padding: '12px 25px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px'
                                }}>
                                    <Search size={18} opacity={0.4} />
                                    <input
                                        type="text"
                                        placeholder="Search by Plate, Job Card, or Brand..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            outline: 'none',
                                            color: 'var(--cream)',
                                            width: '100%',
                                            fontSize: '14px'
                                        }}
                                    />
                                </div>
                            </div>

                            <PortfolioGrid columns="repeat(auto-fill, minmax(320px, 1fr))">
                                {filteredJobs.map(job => (
                                    <PortfolioCard key={job.id} onClick={() => navigate(`/job-cards/${job.id}`)}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                            <span style={{
                                                background: 'var(--cream)',
                                                color: '#000',
                                                padding: '4px 12px',
                                                borderRadius: '4px',
                                                fontSize: '11px',
                                                fontWeight: '800'
                                            }}>
                                                {job.registration_number || 'NO PLATE'}
                                            </span>
                                            <span style={{ fontSize: '11px', opacity: 0.4 }}>#{job.job_card_number}</span>
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>
                                            {job.brand} {job.model}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: getStatusColor(job.status)
                                            }} />
                                            <span style={{ fontSize: '12px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                                {job.status_display || job.status}
                                            </span>
                                        </div>
                                    </PortfolioCard>
                                ))}
                            </PortfolioGrid>
                        </motion.div>
                    )}

                    {activeTab === 'operations' && (
                        <motion.div
                            key="ops"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                <div>
                                    <h3 style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '30px', opacity: 0.6 }}>Active Delays</h3>
                                    {delays.length > 0 ? delays.map(delay => (
                                        <PortfolioCard key={delay.id} borderColor="rgba(245, 158, 11, 0.2)" style={{ marginBottom: '15px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: '800' }}>DELAY #{delay.delay_number}</span>
                                                <span style={{ fontSize: '10px', opacity: 0.4 }}>{new Date(delay.reported_at).toLocaleDateString()}</span>
                                            </div>
                                            <div style={{ fontSize: '15px', fontWeight: '500', marginBottom: '10px' }}>{delay.job_card_number}</div>
                                            <div style={{ fontSize: '13px', opacity: 0.6, fontStyle: 'italic' }}>"{delay.delay_reason}"</div>
                                        </PortfolioCard>
                                    )) : (
                                        <div style={{ padding: '40px', border: '1px dashed rgba(232, 230, 227, 0.1)', borderRadius: '20px', textAlign: 'center', opacity: 0.4 }}>
                                            No active delays reported
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '30px', opacity: 0.6 }}>Safety Incidents</h3>
                                    {incidents.length > 0 ? incidents.map(incident => (
                                        <PortfolioCard key={incident.id} borderColor="rgba(239, 68, 68, 0.2)" style={{ marginBottom: '15px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: '800' }}>{incident.incident_type}</span>
                                                <span style={{ fontSize: '10px', opacity: 0.4 }}>{new Date(incident.incident_date).toLocaleDateString()}</span>
                                            </div>
                                            <div style={{ fontSize: '15px', fontWeight: '500', marginBottom: '10px' }}>{incident.incident_number}</div>
                                            <div style={{ fontSize: '13px', opacity: 0.6 }}>{incident.incident_description}</div>
                                        </PortfolioCard>
                                    )) : (
                                        <div style={{ padding: '40px', border: '1px dashed rgba(232, 230, 227, 0.1)', borderRadius: '20px', textAlign: 'center', opacity: 0.4 }}>
                                            Zero incidents recorded
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'analytics' && (
                        <motion.div
                            key="stats"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <PortfolioGrid columns="1fr 1fr 1fr">
                                <div style={{ background: 'rgba(232, 230, 227, 0.02)', padding: '40px', borderRadius: '20px', border: '1px solid rgba(232, 230, 227, 0.05)' }}>
                                    <div style={{ fontSize: '11px', opacity: 0.5, letterSpacing: '1px', marginBottom: '10px' }}>AVG. SERVICE TIME</div>
                                    <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)' }}>4.2 Days</div>
                                </div>
                                <div style={{ background: 'rgba(232, 230, 227, 0.02)', padding: '40px', borderRadius: '20px', border: '1px solid rgba(232, 230, 227, 0.05)' }}>
                                    <div style={{ fontSize: '11px', opacity: 0.5, letterSpacing: '1px', marginBottom: '10px' }}>THROUGHPUT RATIO</div>
                                    <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)' }}>92%</div>
                                </div>
                                <div style={{ background: 'rgba(232, 230, 227, 0.02)', padding: '40px', borderRadius: '20px', border: '1px solid rgba(232, 230, 227, 0.05)' }}>
                                    <div style={{ fontSize: '11px', opacity: 0.5, letterSpacing: '1px', marginBottom: '10px' }}>QC PASS RATE</div>
                                    <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)' }}>98.5%</div>
                                </div>
                            </PortfolioGrid>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </PortfolioPage>
    );
};

export default WorkshopPortal;
