import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import {
    DollarSign, Printer, Search,
    CheckCircle2, Clock, RefreshCw
} from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';

const PayrollConsole = () => {
    const [payroll, setPayroll] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, processed: 0, pending: 0 });
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

    const fetchPayroll = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`/hr/api/payroll/?month=${selectedMonth}`);
            setPayroll(res.data);

            const totalDisbursement = res.data.reduce((acc, curr) => acc + parseFloat(curr.net_salary || 0), 0);
            const processed = res.data.filter(p => p.status === 'PROCESSED').length;
            const pending = res.data.filter(p => p.status === 'PENDING').length;

            setStats({
                total: totalDisbursement,
                processed: processed,
                pending: pending
            });
        } catch (err) {
            console.error('Error fetching payroll', err);
        } finally {
            setLoading(false);
        }
    }, [selectedMonth]);

    useEffect(() => {
        fetchPayroll();
    }, [fetchPayroll]);

    const runPayrollCycle = async () => {
        if (!window.confirm("Automate salary generation from live attendance logs?")) return;

        setLoading(true);
        try {
            await api.post('/hr/api/payroll/generate_payroll_cycle/');
            fetchPayroll();
            alert("Elite Shine Payroll Cycle execution complete. All accounts synchronized.");
        } catch (err) {
            console.error('Payroll generation failed', err);
            alert("Cycle failed. Check service logs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px 30px', background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
            <PrintHeader title="Master Payroll Ledger" />
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                <div>
                    <div style={{ color: 'var(--gold)', fontWeight: '900', letterSpacing: '4px', fontSize: '10px', marginBottom: '10px', textTransform: 'uppercase' }}>Established 2026 • Fiscal Division</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', fontSize: '3rem', fontWeight: '900', margin: 0 }}>PAYROLL CONSOLE</h1>
                    <p style={{ color: 'var(--gold)', fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '10px' }}>Real-time payroll synthesis from workforce performance nodes.</p>
                </div>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                    <button
                        className="glass-card"
                        onClick={() => window.print()}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 25px', color: 'var(--text-primary)', border: '1.5px solid var(--gold-border)', background: 'var(--input-bg)', cursor: 'pointer', fontWeight: '900', fontSize: '12px' }}
                    >
                        <Printer size={18} color="var(--gold)" /> BULK SLIPS
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', textTransform: 'uppercase' }}>Fiscal Period:</div>
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            style={{
                                background: 'var(--input-bg)',
                                border: '1.5px solid var(--gold-border)',
                                color: 'var(--gold)',
                                padding: '10px 15px',
                                borderRadius: '10px',
                                fontWeight: '900',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                    <button
                        onClick={runPayrollCycle}
                        disabled={loading}
                        style={{
                            background: 'var(--input-bg)',
                            border: '1.5px solid var(--gold-border)',
                            color: 'var(--text-primary)',
                            padding: '12px 25px',
                            borderRadius: '12px',
                            fontWeight: '900',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s',
                            fontSize: '12px',
                            textTransform: 'uppercase'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = 'var(--gold-glow)'; e.currentTarget.style.boxShadow = '0 0 15px var(--gold-glow)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'var(--input-bg)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        {loading ? <RefreshCw size={18} className="spin-anim" /> : <Play size={18} />} Run Payroll Cycle
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' }}>
                <SummaryCard label="Live Disbursement" value={`AED ${stats.total.toLocaleString()}`} icon={<DollarSign color="var(--gold)" />} color="var(--gold)" />
                <SummaryCard label="Validated Entries" value={`${stats.processed} / ${payroll.length}`} icon={<CheckCircle2 color="#10b981" />} color="#10b981" />
                <SummaryCard label="Awaiting Sync" value={stats.pending} icon={<Clock color="#f59e0b" />} color="#f59e0b" />
            </div>

            <GlassCard style={{ padding: '40px', background: 'var(--input-bg)', border: '1.5px solid var(--gold-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)' }}>MASTER PAYROLL REGISTER</h3>
                    <div style={{ padding: '10px 20px', background: 'var(--bg-glass)', borderRadius: '10px', border: '1.5px solid var(--gold-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Search size={16} color="var(--gold)" />
                        <span style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: '900', textTransform: 'uppercase' }}>SEARCH NODES...</span>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Personnel Node</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Fiscal Period</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Computation</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Compliance</th>
                            <th style={{ padding: '15px', textAlign: 'right' }}>Logistics</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payroll.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>No active fiscal sessions found. Run Cycle to synthesize data.</td></tr>
                        ) : (
                            payroll.map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: '900', color: 'var(--text-primary)' }}>{item.employee_name}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '800' }}>ID: {item.employee_id || item.id}</div>
                                    </td>
                                    <td style={{ padding: '15px', color: '#94a3b8', fontSize: '13px' }}>{new Date(item.month).toLocaleDateString([], { month: 'short', year: 'numeric' })}</td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: '900', color: 'var(--text-primary)', fontSize: '1.1rem' }}>AED {parseFloat(item.net_salary).toLocaleString()}</div>
                                        <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Calculated Net Disbursement</div>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '10px',
                                            fontWeight: '900',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            background: item.status === 'PROCESSED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: item.status === 'PROCESSED' ? '#10b981' : '#f59e0b',
                                            border: `1px solid ${item.status === 'PROCESSED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                                        }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
                                            {item.status}
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'right' }}>
                                        <button
                                            onClick={() => window.print()}
                                            className="glass-card"
                                            style={{ padding: '10px 20px', fontSize: '11px', fontWeight: '900', color: 'var(--text-primary)', border: '1.5px solid var(--gold-border)', background: 'var(--input-bg)', cursor: 'pointer', textTransform: 'uppercase' }}
                                        >
                                            SYNTHESIZE SLIP
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </GlassCard>
            <style>{`
                @media print {
                    body { background: #fff !important; color: #000 !important; }
                    .glass-card { border: 1px solid #eee !important; box-shadow: none !important; background: #fff !important; color: #000 !important; }
                    button, header > div:last-child { display: none !important; }
                    h1 { color: #8400ff !important; }
                    table th { color: #666 !important; }
                    table td { color: #000 !important; border-bottom: 1px solid #eee !important; }
                }
            `}</style>
        </div>
    );
};

const SummaryCard = ({ label, value, icon, color }) => (
    <GlassCard style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '25px', position: 'relative', overflow: 'hidden', border: '1.5px solid var(--gold-border)' }}>
        <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
            zIndex: 0
        }} />
        <div style={{ padding: '20px', background: 'var(--gold-glow)', borderRadius: '20px', position: 'relative', zIndex: 1, border: '1px solid var(--gold-border)' }}>{icon}</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '11px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '900' }}>{label}</div>
            <div style={{ fontSize: '28px', fontWeight: '900', marginTop: '5px', color: 'var(--text-primary)' }}>{value}</div>
        </div>
    </GlassCard>
);

const Play = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
);

export default PayrollConsole;
