import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import {
    DollarSign, Printer, Download, Search,
    ArrowRight, CheckCircle2, Clock, AlertCircle, RefreshCw
} from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';

const PayrollConsole = () => {
    const [payroll, setPayroll] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, processed: 0, pending: 0 });

    useEffect(() => {
        fetchPayroll();
    }, []);

    const fetchPayroll = async () => {
        setLoading(true);
        try {
            const res = await api.get('/hr/api/payroll/');
            setPayroll(res.data);

            // Calculate stats from live data
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
    };

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
        <div style={{ padding: '40px 30px', background: '#05000a', minHeight: '100vh', color: '#fff' }}>
            <PrintHeader title="Master Payroll Ledger" />
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                <div>
                    <div style={{ color: '#8400ff', fontWeight: '900', letterSpacing: '4px', fontSize: '12px', marginBottom: '10px' }}>ESTABLISHED 2026</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '3rem', fontWeight: '900', margin: 0 }}>PAYROLL CONSOLE</h1>
                    <p style={{ color: '#94a3b8', fontSize: '18px', marginTop: '10px' }}>Real-time salary synthesis from workforce performance nodes.</p>
                </div>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                    <button
                        className="glass-card"
                        onClick={() => window.print()}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 25px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                    >
                        <Printer size={18} /> Bulk Slips
                    </button>
                    <button
                        onClick={runPayrollCycle}
                        disabled={loading}
                        style={{
                            background: 'rgba(132, 0, 255, 0.2)',
                            border: '1px solid #8400ff',
                            color: '#fff',
                            padding: '12px 25px',
                            borderRadius: '12px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(132, 0, 255, 0.4)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(132, 0, 255, 0.2)'}
                    >
                        {loading ? <RefreshCw size={18} className="spin-anim" /> : <Play size={18} />} Run Payroll Cycle
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' }}>
                <SummaryCard label="Live Disbursement" value={`AED ${stats.total.toLocaleString()}`} icon={<DollarSign color="#8400ff" />} color="#8400ff" />
                <SummaryCard label="Validated Entries" value={`${stats.processed} / ${payroll.length}`} icon={<CheckCircle2 color="#10b981" />} color="#10b981" />
                <SummaryCard label="Awaiting Sync" value={stats.pending} icon={<Clock color="#f59e0b" />} color="#f59e0b" />
            </div>

            <GlassCard style={{ padding: '40px', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>Master Payroll Register</h3>
                    <div style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Search size={16} color="#64748b" />
                        <span style={{ fontSize: '13px', color: '#64748b' }}>Search Nodes...</span>
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
                                        <div style={{ fontWeight: '800', color: '#fff' }}>{item.employee_name}</div>
                                        <div style={{ fontSize: '11px', color: '#64748b' }}>ID: {item.id}</div>
                                    </td>
                                    <td style={{ padding: '15px', color: '#94a3b8', fontSize: '13px' }}>{new Date(item.month).toLocaleDateString([], { month: 'short', year: 'numeric' })}</td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: '900', color: '#fff' }}>AED {parseFloat(item.net_salary).toLocaleString()}</div>
                                        <div style={{ fontSize: '10px', color: '#8400ff' }}>Attend. Based</div>
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
                                            style={{ padding: '8px 16px', fontSize: '11px', fontWeight: '800', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
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
    <GlassCard style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '25px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
            zIndex: 0
        }} />
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', position: 'relative', zIndex: 1 }}>{icon}</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>{label}</div>
            <div style={{ fontSize: '28px', fontWeight: '900', marginTop: '5px' }}>{value}</div>
        </div>
    </GlassCard>
);

const Play = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
);

export default PayrollConsole;
