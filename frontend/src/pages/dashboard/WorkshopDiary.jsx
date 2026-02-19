import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    Calendar, Download, Package, CheckCircle,
    TrendingUp, RefreshCw, AlertCircle, Printer
} from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioStats,
    PortfolioGrid,
    PortfolioCard,
    PortfolioButton,
    PortfolioSectionTitle
} from '../../components/PortfolioComponents';

const WorkshopDiary = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCapturing, setIsCapturing] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/api/dashboard/workshop-diary/');
            const data = Array.isArray(res.data) ? res.data : res.data.results || [];
            setHistory(data);
        } catch (err) {
            console.error('Error fetching diary', err);
        } finally {
            setLoading(false);
        }
    };

    const captureToday = async () => {
        setIsCapturing(true);
        try {
            await api.post('/api/dashboard/workshop-diary/capture_snapshot/');
            await fetchHistory();
        } catch (err) {
            console.error('Snapshot failed', err);
        } finally {
            setIsCapturing(false);
        }
    };

    const exportPDF = () => {
        window.open(`${api.defaults.baseURL}/forms/utils/generate-pdf/WorkshopDiary/0/`, '_blank');
    };

    if (loading) return (
        <PortfolioPage breadcrumb="Operations / Intelligence / Archive">
            <div style={{ color: 'var(--cream)', padding: '100px', textAlign: 'center', letterSpacing: '2px', fontWeight: '800' }}>
                RECOVERING OPERATIONAL SNAPSHOTS...
            </div>
        </PortfolioPage>
    );

    const latest = history[0] || {};
    const stats = [
        { value: latest.new_bookings_count || 0, label: 'DAILY BOOKINGS', color: 'var(--gold)' },
        { value: latest.new_jobs_count || 0, label: 'INBOUND JOBS', color: '#f59e0b' },
        { value: latest.closed_jobs_count || 0, label: 'DISPATCHED', color: '#10b981' },
        { value: `AED ${(latest.revenue || 0).toLocaleString()}`, label: 'REALIZED REVENUE', color: '#ec4899' }
    ];

    return (
        <PortfolioPage breadcrumb="Operations / Intelligence / Workshop Diary">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="A chronological record of workshop performance and daily operational snapshots.">
                    Workshop Diary
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton onClick={captureToday} disabled={isCapturing} variant="secondary">
                        <RefreshCw size={18} className={isCapturing ? 'spin' : ''} style={{ marginRight: '10px' }} />
                        {isCapturing ? 'SYNCHRONIZING...' : 'CAPTURE SNAPSHOT'}
                    </PortfolioButton>
                    <PortfolioButton onClick={() => window.print()} variant="secondary">
                        <Printer size={18} style={{ marginRight: '10px' }} /> PRINT
                    </PortfolioButton>
                    <PortfolioButton onClick={exportPDF} variant="primary">
                        <Download size={18} style={{ marginRight: '10px' }} /> EXPORT
                    </PortfolioButton>
                </div>
            </div>

            <PortfolioStats stats={stats} />

            <ActiveOperations />

            <PortfolioSectionTitle style={{ marginTop: '100px' }}>Historical Snapshots</PortfolioSectionTitle>

            <PortfolioGrid columns="1fr">
                {history.map((entry) => (
                    <PortfolioCard key={entry.id} style={{ padding: '30px', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', marginBottom: '5px' }}>SNAPSHOT DATE</div>
                            <div style={{ fontSize: '20px', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>{entry.date}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '9px', color: 'rgba(232,230,227,0.4)', fontWeight: '800', letterSpacing: '1px' }}>BOOKINGS</div>
                            <div style={{ fontSize: '18px', color: 'var(--cream)' }}>{entry.new_bookings_count}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '9px', color: 'rgba(232,230,227,0.4)', fontWeight: '800', letterSpacing: '1px' }}>RECEIVED</div>
                            <div style={{ fontSize: '18px', color: 'var(--cream)' }}>{entry.new_jobs_count}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '9px', color: 'rgba(232,230,227,0.4)', fontWeight: '800', letterSpacing: '1px' }}>RELEASED</div>
                            <div style={{ fontSize: '18px', color: 'var(--cream)' }}>{entry.closed_jobs_count}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '9px', color: 'rgba(232,230,227,0.4)', fontWeight: '800', letterSpacing: '1px' }}>REVENUE</div>
                            <div style={{ fontSize: '18px', color: 'var(--gold)', fontWeight: '800' }}>AED {parseFloat(entry.revenue || 0).toLocaleString()}</div>
                        </div>
                    </PortfolioCard>
                ))}
                {history.length === 0 && (
                    <div style={{ padding: '100px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.2)', background: 'rgba(232, 230, 227, 0.01)', borderRadius: '32px', border: '1px dashed rgba(232, 230, 227, 0.05)' }}>
                        <AlertCircle size={40} style={{ margin: '0 auto 15px auto', opacity: 0.5 }} />
                        <p style={{ letterSpacing: '1px' }}>NO OPERATIONAL SIGNALS ARCHIVED.</p>
                    </div>
                )}
            </PortfolioGrid>

        </PortfolioPage>
    );
};

const ActiveOperations = () => {
    const [pendingJobs, setPendingJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPending = async () => {
        try {
            const res = await api.get('/forms/job-cards/api/jobs/');
            setPendingJobs(res.data.filter(j => !j.is_released));
        } catch (err) {
            console.error('Error fetching pending jobs', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const releaseJob = async (jobId) => {
        if (!confirm('Authorize this job card for workshop scheduling?')) return;
        try {
            await api.post(`/forms/job-cards/api/jobs/${jobId}/release/`);
            fetchPending();
        } catch (err) {
            alert('Authorization failed: ' + (err.response?.data?.error || 'Unknown error'));
        }
    };

    if (loading) return null;

    return (
        <div style={{ marginTop: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <PortfolioSectionTitle>Active Operations</PortfolioSectionTitle>
                <div style={{ background: 'rgba(176, 141, 87, 0.1)', color: 'var(--gold)', padding: '8px 20px', borderRadius: '50px', fontSize: '11px', fontWeight: '800', letterSpacing: '2px', border: '1px solid rgba(176, 141, 87, 0.2)' }}>
                    {pendingJobs.length} JOBS ON HOLD
                </div>
            </div>

            <PortfolioGrid columns="1fr">
                {pendingJobs.map((job) => (
                    <PortfolioCard key={job.id} style={{ padding: '30px', display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1.5fr 1fr 1fr', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '1px', marginBottom: '5px' }}>JOB ID</div>
                            <div style={{ fontSize: '16px', color: 'var(--cream)', fontWeight: '700' }}>#{job.job_card_number}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '9px', color: 'rgba(232,230,227,0.4)', fontWeight: '800', letterSpacing: '1px', marginBottom: '5px' }}>CLIENT</div>
                            <div style={{ fontSize: '15px', color: 'var(--cream)' }}>{job.customer_name}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '9px', color: 'rgba(232,230,227,0.4)', fontWeight: '800', letterSpacing: '1px', marginBottom: '5px' }}>VEHICLE ASSET</div>
                            <div style={{ fontSize: '15px', color: 'var(--cream)' }}>{job.brand} {job.model}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '9px', color: 'rgba(232,230,227,0.4)', fontWeight: '800', letterSpacing: '1px', marginBottom: '5px' }}>VALUE</div>
                            <div style={{ fontSize: '15px', color: 'var(--cream)', fontWeight: '700' }}>AED {job.net_amount}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <PortfolioButton
                                onClick={() => releaseJob(job.id)}
                                variant="gold"
                                style={{ padding: '10px 20px', fontSize: '10px', height: '40px' }}
                            >
                                RELEASE
                            </PortfolioButton>
                        </div>
                    </PortfolioCard>
                ))}
            </PortfolioGrid>

            {pendingJobs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(232, 230, 227, 0.2)', border: '1px dashed rgba(232, 230, 227, 0.1)', borderRadius: '24px' }}>
                    ALL PROTOCOLS DISPATCHED TO WORKSHOP.
                </div>
            )}
        </div>
    );
};

export default WorkshopDiary;
