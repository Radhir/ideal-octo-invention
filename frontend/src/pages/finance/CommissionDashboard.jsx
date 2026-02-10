import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import {
    Award, TrendingUp, Users,
    CheckCircle, Clock, ArrowLeft, Search, Filter
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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
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
                                        padding: '15px',
                                        background: 'var(--input-bg)',
                                        borderRadius: '12px',
                                        border: '1.5px solid var(--border-color)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'var(--gold-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'var(--gold)' }}>
                                                {item.employee__full_name[0]}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '900', color: 'var(--text-primary)', fontSize: '15px' }}>{item.employee__full_name}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '800' }}>{item.jobs} Commissions Linked</div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: '900', fontSize: '20px', color: 'var(--text-primary)' }}>AED {parseFloat(item.earned).toLocaleString()}</div>
                                            <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Balance</div>
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
                                style={{ width: '100%', marginTop: '20px', border: '1.5px solid var(--gold-border)' }}
                                onClick={() => navigate('/hr/payroll')}
                            >
                                GO TO PAYROLL CONSOLE
                            </button>
                        </GlassCard>
                    </div>
                </>
            )}
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <GlassCard style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px', border: '1.5px solid var(--gold-border)' }}>
        <div style={{ background: 'var(--gold-glow)', padding: '15px', borderRadius: '12px', border: '1px solid var(--gold-border)' }}>{icon}</div>
        <div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '900', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-primary)' }}>{value}</div>
        </div>
    </GlassCard>
);

export default CommissionDashboard;
