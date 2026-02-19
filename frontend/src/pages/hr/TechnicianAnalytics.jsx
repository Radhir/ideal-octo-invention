import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import {
    Trophy, Activity,
    TrendingUp, CheckCircle, AlertCircle
} from 'lucide-react';
import { PortfolioPage, PortfolioTitle, PortfolioStats, PortfolioGrid, PortfolioCard } from '../../components/PortfolioComponents';

const TechnicianAnalytics = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const response = await api.get('/hr/api/employees/technician_leaderboard/');
            setLeaderboard(response.data);
        } catch (err) {
            console.error('Leaderboard fetch failed', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const totals = leaderboard.reduce((acc, curr) => ({
        jobs: acc.jobs + (curr.jobs_closed || 0),
        revenue: acc.revenue + (curr.revenue_generated || 0)
    }), { jobs: 0, revenue: 0 });

    const avgQcPass = leaderboard.length
        ? (leaderboard.reduce((a, c) => a + (c.qc_pass_rate || 0), 0) / leaderboard.length).toFixed(1)
        : 0;

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)' }}>CALCULATING PERFORMANCE...</div></PortfolioPage>;

    return (
        <PortfolioPage breadcrumb="HUMAN RESOURCES // PERFORMANCE TELEMETRY">
            <PortfolioTitle subtitle="Workshop throughput, realization vectors, and quality control precision.">
                Intelligence<br />Dashboard
            </PortfolioTitle>

            <PortfolioStats stats={[
                { value: totals.jobs, label: 'TOTAL THROUGHPUT', color: 'var(--gold)' },
                { value: `AED ${totals.revenue.toLocaleString()}`, label: 'REALIZED REVENUE', color: '#10b981' },
                { value: `${avgQcPass}%`, label: 'QC CAPABILITY', color: 'var(--gold)' }
            ]} />

            <div style={{ marginTop: '100px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    <Trophy size={20} color="var(--gold)" opacity={0.5} />
                    <h2 style={{
                        fontSize: '11px',
                        fontWeight: '900',
                        color: 'var(--gold)',
                        margin: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '3px'
                    }}>
                        Technician Performance Grid
                    </h2>
                </div>

                <div style={{ overflow: 'hidden', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)', position: 'relative' }}>
                    <div className="telemetry-grid" style={{ zIndex: 0, opacity: 0.03 }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1.5fr 1fr',
                            padding: '30px 40px',
                            background: 'rgba(255,255,255,0.02)',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            color: 'var(--gold)',
                            fontSize: '9px',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            opacity: 0.5
                        }}>
                            <div>Technician Dossier</div>
                            <div style={{ textAlign: 'center' }}>Throughput</div>
                            <div style={{ textAlign: 'center' }}>Value Manifest</div>
                            <div style={{ textAlign: 'right' }}>Precision</div>
                        </div>

                        {leaderboard.length === 0 ? (
                            <div style={{ padding: '100px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontWeight: '900', fontSize: '10px', letterSpacing: '2px' }}>
                                NO PERFORMANCE VECTORS DETECTED
                            </div>
                        ) : leaderboard.map((tech, index) => (
                            <div key={tech.id} className="table-row-hover" style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr 1.5fr 1fr',
                                padding: '35px 40px',
                                borderBottom: index === leaderboard.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.03)',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '15px',
                                        background: index < 3 ? 'rgba(176, 141, 87, 0.15)' : 'rgba(255,255,255,0.02)',
                                        border: index < 3 ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.05)',
                                        color: index < 3 ? 'var(--gold)' : 'rgba(255,255,255,0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '900',
                                        fontSize: '14px',
                                        fontFamily: 'var(--font-serif)'
                                    }}>
                                        {String(index + 1).padStart(2, '0')}
                                    </div>
                                    <div>
                                        <div style={{ color: 'var(--cream)', fontWeight: '300', fontSize: '18px', fontFamily: 'var(--font-serif)' }}>{tech.full_name}</div>
                                        <div style={{ color: 'var(--gold)', fontSize: '9px', fontWeight: '900', letterSpacing: '1px', opacity: 0.4, textTransform: 'uppercase' }}>{tech.role || 'SPECIALIST'}</div>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'center', color: 'var(--cream)', fontWeight: '300', fontSize: '18px', fontFamily: 'var(--font-serif)' }}>
                                    {tech.jobs_closed}
                                </div>

                                <div style={{ textAlign: 'center', color: 'var(--gold)', fontWeight: '300', fontSize: '18px', fontFamily: 'var(--font-serif)' }}>
                                    <span style={{ fontSize: '10px', fontWeight: '900', marginRight: '5px' }}>AED</span>
                                    {(tech.revenue_generated || 0).toLocaleString()}
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: (tech.qc_pass_rate || 0) >= 90 ? '#10b981' : '#f59e0b',
                                            boxShadow: `0 0 10px ${(tech.qc_pass_rate || 0) >= 90 ? '#10b981' : '#f59e0b'}40`
                                        }} />
                                        <div style={{ fontSize: '18px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'var(--font-serif)' }}>
                                            {(tech.qc_pass_rate || 0)}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PortfolioPage>
    );
};

export default TechnicianAnalytics;
