import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import {
    Award, TrendingUp, Users,
    CheckCircle, Clock, ArrowLeft
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
                        <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px' }}>PERFORMANCE ANALYTICS</div>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>Commission Hub</h1>
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
                <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-secondary)' }}>Calculating Earnings...</div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                        <StatCard icon={<Clock color="var(--gold)" />} label="Total Accrued" value={`AED ${(summary?.total_accrued || 0).toLocaleString()}`} />
                        <StatCard icon={<CheckCircle color="#10b981" />} label="Total Paid" value={`AED ${(summary?.total_paid || 0).toLocaleString()}`} />
                        <StatCard icon={<TrendingUp color="#3b82f6" />} label="Jobs Impacted" value={summary?.job_count || 0} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
                        <GlassCard style={{ padding: '30px', border: '1.5px solid var(--gold-border)' }}>
                            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)' }}>Staff Earnings Breakdown</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {breakdown.map((item, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '20px',
                                        background: 'var(--input-bg)',
                                        borderRadius: '15px',
                                        border: '1.5px solid var(--gold-border)',
                                        marginBottom: '10px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'var(--gold-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'var(--gold)' }}>
                                                {item.employee__full_name[0]}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '900', color: 'var(--text-primary)', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.employee__full_name}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.jobs} COMMISSIONS LINKED</div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: '900', fontSize: '24px', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>AED {parseFloat(item.earned).toLocaleString()}</div>
                                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>LEDGER BALANCE</div>
                                        </div>
                                    </div>
                                ))}
                                {breakdown.length === 0 && (
                                    <div style={{ padding: '50px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '800' }}>No commissions recorded for this period.</div>
                                )}
                            </div>
                        </GlassCard>

                        <GlassCard style={{ padding: '30px', background: 'var(--gold-glow)', border: '1.5px solid var(--gold-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                <Award color="var(--gold)" size={24} />
                                <h3 style={{ margin: 0, fontWeight: '900', color: 'var(--text-primary)' }}>Legal & Payroll Info</h3>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', fontWeight: '800' }}>
                                Commissions are automatically accrued when a Job Card is marked as **CLOSED**.
                                <br /><br />
                                Standard rates:
                                <ul>
                                    <li>Service Advisor: Based on Employee Profile</li>
                                    <li>Technician: Flat 2% of Net Amount</li>
                                </ul>
                                All commissions are subject to internal audit and are finalized during the monthly payroll run.
                            </p>
                            <button
                                className="btn-primary"
                                style={{ width: '100%', marginTop: '30px', height: '60px', borderRadius: '30px', fontSize: '1.2rem', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', border: '2px solid var(--gold-border)', background: 'var(--gold)', color: '#000', letterSpacing: '1px' }}
                                onClick={() => navigate('/hr/payroll')}
                            >
                                <Users size={24} /> GO TO PAYROLL CONSOLE
                            </button>
                        </GlassCard>
                    </div>
                </>
            )}
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value }) => (
    <GlassCard style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px', border: '1.5px solid var(--gold-border)' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'var(--gold-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--gold-border)' }}>
            <Icon size={28} color="var(--gold)" />
        </div>
        <div>
            <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '5px' }}>{label}</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{value}</div>
        </div>
    </GlassCard>
);

export default CommissionDashboard;
