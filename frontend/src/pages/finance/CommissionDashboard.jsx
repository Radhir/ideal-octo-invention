import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioStats,
    PortfolioButton,
    PortfolioCard
} from '../../components/PortfolioComponents';
import {
    Award, TrendingUp, Users,
    CheckCircle, Clock, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DateRangePicker from '../../components/finance/DateRangePicker';

const CommissionDashboard = () => {
    const navigate = useNavigate();
    const [breakdown, setBreakdown] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(1)).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`/finance/api/commissions/summary/?start_date=${startDate}&end_date=${endDate}`);
            setBreakdown(res.data.breakdown);
            setSummary(res.data.summary);
        } catch (err) {
            console.error('Error fetching commission data', err);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return <div style={{ color: 'var(--cream)', padding: '80px', textAlign: 'center', opacity: 0.5 }}>Calculating Performance Metrics...</div>;

    const stats = [
        { label: 'Total Accrued', value: `AED ${(summary?.total_accrued || 0).toLocaleString()}`, color: 'var(--gold)' },
        { label: 'Total Paid', value: `AED ${(summary?.total_paid || 0).toLocaleString()}`, color: '#10b981' },
        { label: 'Jobs Impacted', value: summary?.job_count || 0, color: '#3b82f6' }
    ];

    return (
        <PortfolioPage breadcrumb="Finance / Payroll / Commissions">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <PortfolioTitle subtitle="Staff incentive tracking, performance analytics, and payroll integration.">
                    Performance Analytics
                </PortfolioTitle>
                <div style={{ paddingTop: '10px' }}>
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onStartChange={setStartDate}
                        onEndChange={setEndDate}
                        onApply={fetchData}
                        style={{ background: 'transparent', border: '1px solid rgba(232, 230, 227, 0.2)', color: 'var(--cream)' }}
                    />
                </div>
            </div>

            <PortfolioStats stats={stats} />

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>

                {/* Breakdown List */}
                <PortfolioCard>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                        <Users size={20} color="var(--gold)" />
                        <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--cream)', textTransform: 'uppercase', letterSpacing: '2px' }}>Staff Earnings Breakdown</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {breakdown.map((item, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '25px',
                                background: 'rgba(232, 230, 227, 0.02)',
                                border: '1px solid rgba(232, 230, 227, 0.1)',
                                borderRadius: '15px',
                                transition: 'all 0.3s'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--gold)';
                                    e.currentTarget.style.background = 'rgba(232, 230, 227, 0.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(232, 230, 227, 0.1)';
                                    e.currentTarget.style.background = 'rgba(232, 230, 227, 0.02)';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        background: 'rgba(176, 141, 87, 0.1)',
                                        color: 'var(--gold)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px',
                                        fontFamily: 'var(--font-serif)'
                                    }}>
                                        {item.employee__full_name ? item.employee__full_name[0] : '?'}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '16px', color: 'var(--cream)', marginBottom: '5px', letterSpacing: '0.5px' }}>
                                            {item.employee__full_name}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            {item.jobs} Commissions Linked
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '24px', fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}>
                                        AED {parseFloat(item.earned).toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '1px', marginTop: '5px' }}>
                                        ACCRUED BALANCE
                                    </div>
                                </div>
                            </div>
                        ))}
                        {breakdown.length === 0 && (
                            <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.4)', fontSize: '13px', letterSpacing: '1px' }}>
                                NO PAYROLL DATA FOR THIS PERIOD
                            </div>
                        )}
                    </div>
                </PortfolioCard>

                {/* Info & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <PortfolioCard style={{ background: 'rgba(176, 141, 87, 0.05)', borderColor: 'rgba(176, 141, 87, 0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                            <Award size={24} color="var(--gold)" />
                            <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--cream)', textTransform: 'uppercase', letterSpacing: '2px' }}>Incentive Structure</h3>
                        </div>
                        <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.7)', lineHeight: '1.8' }}>
                            <p style={{ marginBottom: '15px' }}>Commissions are automatically accrued upon Job Card closure (Status: CLOSED).</p>
                            <ul style={{ paddingLeft: '20px', marginBottom: '25px' }}>
                                <li>Service Advisors: Tiered Profile Rates</li>
                                <li>Technicians: Flat 2% of Net Labour</li>
                            </ul>
                            <p style={{ fontSize: '12px', color: 'rgba(232, 230, 227, 0.5)' }}>All payouts are subject to final audit during the monthly payroll run.</p>
                        </div>
                    </PortfolioCard>

                    <PortfolioButton
                        variant="gold"
                        onClick={() => navigate('/hr/payroll')}
                        style={{ width: '100%', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}
                    >
                        <ArrowRight size={20} /> PAYROLL CONSOLE
                    </PortfolioButton>
                </div>
            </div>
        </PortfolioPage>
    );
};

export default CommissionDashboard;
