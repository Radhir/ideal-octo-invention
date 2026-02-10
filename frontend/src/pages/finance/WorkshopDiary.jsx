import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import {
    Calendar, ClipboardList, TrendingUp,
    CheckCircle, Clock, AlertCircle, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DateRangePicker from '../../components/finance/DateRangePicker';

const WorkshopDiary = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(1)).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/reports/api/workshop-diary/?start_date=${startDate}&end_date=${endDate}`);
            setEntries(res.data.entries);
            setSummary(res.data.summary);
        } catch (err) {
            console.error('Error fetching workshop diary', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '30px 20px', animation: 'fadeIn 0.5s ease-out' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        onClick={() => navigate('/finance')}
                        style={{ background: 'var(--input-bg)', border: '1.5px solid var(--gold-border)', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-primary)' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px' }}>OPERATIONAL LOG</div>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>Workshop Diary</h1>
                    </div>
                </div>

                <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onStartChange={setStartDate}
                    onEndChange={setEndDate}
                    onApply={fetchData}
                />
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-secondary)' }}>Syncing Operational Data...</div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                        <SummaryCard icon={<ClipboardList color="var(--gold)" />} label="Total Jobs" value={summary?.total_jobs || 0} />
                        <SummaryCard icon={<TrendingUp color="#10b981" />} label="Total Value" value={`AED ${(summary?.total_value || 0).toLocaleString()}`} />
                        <SummaryCard icon={<Clock color="#3b82f6" />} label="Active (WIP)" value={entries.filter(e => e.status !== 'CLOSED').length} />
                    </div>

                    <GlassCard style={{ padding: '30px', border: '1.5px solid var(--gold-border)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2.5px solid var(--gold-border)', color: 'var(--gold)', fontSize: '12px', textTransform: 'uppercase', fontWeight: '900' }}>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Job ID</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Customer / Vehicle</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Advisor</th>
                                    <th style={{ padding: '15px', textAlign: 'right' }}>Net Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map(entry => (
                                    <tr key={entry.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'all 0.2s' }} className="hover-row">
                                        <td style={{ padding: '15px', fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '800' }}>{new Date(entry.date).toLocaleDateString()}</td>
                                        <td style={{ padding: '15px', fontWeight: '900', color: 'var(--gold)' }}>#{entry.number}</td>
                                        <td style={{ padding: '15px', fontWeight: '900', color: 'var(--text-primary)', fontSize: '14px' }}>{entry.customer}</td>
                                        <td style={{ padding: '15px' }}>
                                            <StatusBadge status={entry.status} />
                                        </td>
                                        <td style={{ padding: '15px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: '900' }}>{entry.advisor || '--'}</td>
                                        <td style={{ padding: '15px', textAlign: 'right', fontWeight: '900', fontSize: '18px', color: 'var(--text-primary)' }}>
                                            AED {parseFloat(entry.net_amount).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {entries.length === 0 && (
                                    <tr><td colSpan="6" style={{ padding: '50px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '900' }}>No entries found for the selected period.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </GlassCard>
                </>
            )}

            <style>{`
                .hover-row:hover { background: rgba(176,141,87,0.05); }
                [data-theme='light'] .hover-row:hover { background: rgba(0,0,0,0.02); }
            `}</style>
        </div>
    );
};

const SummaryCard = ({ icon, label, value }) => (
    <GlassCard style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px', border: '1.5px solid var(--gold-border)' }}>
        <div style={{ background: 'var(--gold-glow)', padding: '15px', borderRadius: '12px', border: '1px solid var(--gold-border)' }}>{icon}</div>
        <div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>{value}</div>
        </div>
    </GlassCard>
);

const StatusBadge = ({ status }) => {
    const config = {
        'CLOSED': { color: '#10b981', label: 'Closed', icon: <CheckCircle size={12} /> },
        'WIP': { color: '#3b82f6', label: 'In Progress', icon: <Clock size={12} /> },
        'RECEPTION': { color: '#64748b', label: 'Reception', icon: <AlertCircle size={12} /> },
        'INVOICING': { color: '#f59e0b', label: 'Invoicing', icon: <ClipboardList size={12} /> },
    };
    const s = config[status] || { color: '#64748b', label: status, icon: <AlertCircle size={12} /> };

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '10px',
            fontWeight: '900',
            background: `${s.color}25`,
            color: s.color === '#64748b' ? 'var(--text-secondary)' : s.color,
            textTransform: 'uppercase',
            border: `1.5px solid ${s.color}60`
        }}>
            {s.icon} {s.label}
        </span>
    );
};

export default WorkshopDiary;
