import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../../components/GlassCard';
import {
    Calendar, Download, Package, CheckCircle,
    TrendingUp, FileText, RefreshCw, AlertCircle, Printer
} from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';

const WorkshopDiary = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCapturing, setIsCapturing] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('/api/dashboard/workshop-diary/');
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
            await axios.post('/api/dashboard/workshop-diary/capture_snapshot/');
            await fetchHistory();
        } catch (err) {
            console.error('Snapshot failed', err);
        } finally {
            setIsCapturing(false);
        }
    };

    const exportPDF = () => {
        window.open(`${axios.defaults.baseURL}/forms/utils/generate-pdf/WorkshopDiary/0/`, '_blank');
    };

    if (loading) return <div style={{ color: '#fff', padding: '40px' }}>Analyzing Daily Snapshots...</div>;

    return (
        <div style={{ padding: '30px' }}>
            <PrintHeader title="Workshop Diary" />
            <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '2px' }}>OPERATIONAL NEXUS</div>
                    <h1 style={{ margin: '5px 0 0 0', fontSize: '2.5rem', fontWeight: '900', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>Workshop Diary</h1>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                        onClick={captureToday}
                        disabled={isCapturing}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', background: isCapturing ? '#334155' : undefined }}
                    >
                        <RefreshCw size={18} className={isCapturing ? 'spin' : ''} /> {isCapturing ? 'Capturing...' : 'Capture Snapshot'}
                    </button>
                    <button onClick={() => window.print()} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '10px 20px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                        <Printer size={18} /> Print Report
                    </button>
                    <button onClick={exportPDF} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                        <Download size={18} /> Export PDF
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <MetricCard label="Today's Bookings" value={history[0]?.new_bookings_count || 0} icon={Calendar} color="#3b82f6" />
                <MetricCard label="Jobs Received" value={history[0]?.new_jobs_count || 0} icon={Package} color="#f59e0b" />
                <MetricCard label="Jobs Closed" value={history[0]?.closed_jobs_count || 0} icon={CheckCircle} color="#10b981" />
                <MetricCard label="Sales Revenue" value={`AED ${(history[0]?.revenue || 0).toLocaleString()}`} icon={TrendingUp} color="#ec4899" />
            </div>

            <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', textAlign: 'left' }}>
                            <th style={{ padding: '20px' }}>Date</th>
                            <th style={{ padding: '20px' }}>New Bookings</th>
                            <th style={{ padding: '20px' }}>Jobs Received</th>
                            <th style={{ padding: '20px' }}>Jobs Closed</th>
                            <th style={{ padding: '20px' }}>Daily Revenue</th>
                            <th style={{ padding: '20px' }}>Audit Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((entry) => (
                            <tr key={entry.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                                <td style={{ padding: '20px', fontWeight: '700', color: '#b08d57' }}>{entry.date}</td>
                                <td style={{ padding: '20px' }}>{entry.new_bookings_count}</td>
                                <td style={{ padding: '20px' }}>{entry.new_jobs_count}</td>
                                <td style={{ padding: '20px' }}>{entry.closed_jobs_count}</td>
                                <td style={{ padding: '20px', fontWeight: '800' }}>AED {parseFloat(entry.revenue || 0).toLocaleString()}</td>
                                <td style={{ padding: '20px' }}>
                                    <span style={{
                                        padding: '5px 12px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        color: '#10b981',
                                        border: '1px solid rgba(16, 185, 129, 0.2)'
                                    }}>Verified</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {history.length === 0 && (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                        <AlertCircle size={40} style={{ margin: '0 auto 15px auto', opacity: 0.5 }} />
                        <p>No operational snapshots captured yet.</p>
                    </div>
                )}
            </GlassCard>

            <style>{`
                .spin { animation: rotate 1s linear infinite; }
                @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

const MetricCard = ({ label, value, icon: Icon, color }) => (
    <GlassCard style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={24} color={color} />
        </div>
        <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#fff' }}>{value}</div>
        </div>
    </GlassCard>
);

export default WorkshopDiary;
