import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import {
    Trophy, Activity,
    TrendingUp, CheckCircle
} from 'lucide-react';
import '../../layouts/AppLayout.css';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="glass-card p-6" style={{
        background: 'var(--input-bg)',
        border: '1.5px solid var(--gold-border)',
        borderRadius: '20px'
    }}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <p style={{ color: 'var(--gold)', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>{title}</p>
                <h3 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)' }}>{value}</h3>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
                <Icon size={24} style={{ color: 'var(--gold)' }} />
            </div>
        </div>
    </div>
);

const TechnicianAnalytics = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const response = await api.get('/hr/api/employees/technician_leaderboard/');
            setLeaderboard(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Leaderboard fetch failed', err);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const totals = leaderboard.reduce((acc, curr) => ({
        jobs: acc.jobs + curr.jobs_closed,
        revenue: acc.revenue + curr.revenue_generated
    }), { jobs: 0, revenue: 0 });

    if (loading) return <div className="p-12" style={{ color: 'var(--text-primary)', fontWeight: '900' }}>CALCULATING PERFORMANCE...</div>;

    return (
        <div className="p-8" style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                <div>
                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Performance Intelligence</div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>ROI ANALYTICS</h1>
                    <p style={{ color: 'var(--gold)', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>Workshop throughput & elite detailing metrics</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard
                    title="Total Detailing Jobs"
                    value={totals.jobs}
                    icon={Activity}
                    color="blue"
                />
                <StatCard
                    title="Realized Revenue"
                    value={`AED ${totals.revenue.toLocaleString()}`}
                    icon={TrendingUp}
                    color="green"
                />
                <StatCard
                    title="Avg. QC Pass"
                    value={`${(leaderboard.reduce((a, c) => a + c.qc_pass_rate, 0) / (leaderboard.length || 1)).toFixed(1)}%`}
                    icon={CheckCircle}
                    color="amber"
                />
            </div>

            <div className="glass-card overflow-hidden" style={{
                background: 'var(--input-bg)',
                border: '1.5px solid var(--gold-border)',
                borderRadius: '24px'
            }}>
                <div className="p-8 border-b border-gold-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Trophy size={24} style={{ color: 'var(--gold)' }} />
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>ELITE TECHNICIAN LEADERBOARD</h2>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr style={{ background: 'var(--gold-glow)', borderBottom: '1.5px solid var(--gold-border)' }}>
                                <th className="p-6" style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Technician</th>
                                <th className="p-6" style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Jobs Closed</th>
                                <th className="p-6" style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Revenue Contribution</th>
                                <th className="p-6 text-center" style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>QC Precision</th>
                                <th className="p-6" style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gold-border text-text-primary">
                            {leaderboard.map((tech, i) => (
                                <tr key={i} className="hover:bg-gold-glow transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--input-bg)', border: '1.5px solid var(--gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'var(--gold)' }}>
                                                {tech.technician.charAt(0)}
                                            </div>
                                            <span style={{ fontWeight: '900', color: 'var(--text-primary)', fontSize: '15px' }}>
                                                {tech.technician}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-6" style={{ fontWeight: '900', color: 'var(--text-primary)' }}>{tech.jobs_closed}</td>
                                    <td className="p-6" style={{ fontWeight: '900', color: 'var(--gold)' }}>AED {tech.revenue_generated.toLocaleString()}</td>
                                    <td className="p-6">
                                        <div className="flex flex-col items-center gap-2">
                                            <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-primary)' }}>{tech.qc_pass_rate}%</span>
                                            <div style={{ width: '100px', height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--gold-border)' }}>
                                                <div
                                                    style={{ width: `${tech.qc_pass_rate}%`, height: '100%', background: 'var(--gold)', transition: 'all 1s ease' }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        {i === 0 && (
                                            <span style={{ px: '12px', py: '4px', borderRadius: '4px', background: 'var(--gold)', color: '#000', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Top Performer</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TechnicianAnalytics;
