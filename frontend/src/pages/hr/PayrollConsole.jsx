import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    DollarSign, Play, CheckCircle2, Clock, AlertCircle,
    ChevronRight, Printer, Eye, X, BadgeCheck, TrendingUp
} from 'lucide-react';
import {
    PortfolioPage, PortfolioTitle, PortfolioStats,
    PortfolioButton, PortfolioCard, GlassCard
} from '../../components/PortfolioComponents';

const PayslipModal = ({ slip, onClose }) => {
    if (!slip) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
            zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: '#0a0a0a', border: '1px solid var(--gold)',
                borderRadius: '30px', width: '100%', maxWidth: '600px',
                padding: '50px', position: 'relative', boxShadow: '0 0 50px rgba(176, 141, 87, 0.2)'
            }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '30px', right: '30px', background: 'none', border: 'none', color: 'var(--cream)', cursor: 'pointer' }}>
                    <X size={24} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ color: 'var(--gold)', fontSize: '10px', letterSpacing: '3px', fontWeight: '800', marginBottom: '10px' }}>OFFICIAL PAYSLIP</div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: 'var(--cream)', margin: 0 }}>{slip.employee_name}</h2>
                    <div style={{ opacity: 0.5, fontSize: '12px', marginTop: '5px' }}>PERIOD: {slip.month}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(232,230,227,0.1)', paddingBottom: '15px' }}>
                        <span style={{ opacity: 0.6 }}>Basic Salary</span>
                        <span style={{ color: 'var(--cream)' }}>AED {parseFloat(slip.basic_salary).toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(232,230,227,0.1)', paddingBottom: '15px' }}>
                        <span style={{ opacity: 0.6 }}>Allowances (H+T)</span>
                        <span style={{ color: 'var(--cream)' }}>AED {parseFloat(slip.allowances).toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(232,230,227,0.1)', paddingBottom: '15px' }}>
                        <span style={{ opacity: 0.6 }}>Commissions</span>
                        <span style={{ color: '#10b981' }}>+ AED {parseFloat(slip.commissions_earned).toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(232,230,227,0.1)', paddingBottom: '15px' }}>
                        <span style={{ opacity: 0.6 }}>Bonuses</span>
                        <span style={{ color: '#10b981' }}>+ AED {parseFloat(slip.bonuses).toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(232,230,227,0.1)', paddingBottom: '15px' }}>
                        <span style={{ opacity: 0.6 }}>Deductions</span>
                        <span style={{ color: '#ef4444' }}>- AED {parseFloat(slip.deductions).toLocaleString()}</span>
                    </div>

                    <div style={{
                        marginTop: '20px', padding: '30px', background: 'rgba(176,141,87,0.05)',
                        borderRadius: '20px', border: '1px solid rgba(176,141,87,0.2)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--gold)' }}>NET PAYABLE</span>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: '#10b981', fontWeight: '800' }}>
                            AED {parseFloat(slip.net_salary).toLocaleString()}
                        </span>
                    </div>
                </div>

                <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
                    <PortfolioButton variant="secondary" onClick={() => window.print()} style={{ flex: 1 }}>
                        <Printer size={16} /> PRINT
                    </PortfolioButton>
                    {slip.payment_status !== 'PAID' && (
                        <PortfolioButton style={{ flex: 2 }}>GENERATE PAYOUT</PortfolioButton>
                    )}
                </div>
            </div>
        </div>
    );
};

const PayrollConsole = () => {
    const [slips, setSlips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [viewingSlip, setViewingSlip] = useState(null);

    useEffect(() => {
        fetchSlips();
    }, [selectedMonth]);

    const fetchSlips = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/hr/api/salary-slips/?month=${selectedMonth}`);
            setSlips(res.data.results || res.data);
        } catch (err) {
            console.error('Error fetching slips', err);
        } finally {
            setLoading(false);
        }
    };

    const runPayrollCycle = async () => {
        if (!window.confirm(`Generate payroll slips for ${selectedMonth}?`)) return;

        setLoading(true);
        try {
            await api.post('/hr/api/payroll/generate_payroll_cycle/', { month: selectedMonth });
            fetchSlips();
        } catch (err) {
            console.error('Payroll generation failed', err);
            alert("Payroll cycle failed. Ensure attendance logs exist for this period.");
        } finally {
            setLoading(false);
        }
    };

    const markAsPaid = async (id) => {
        if (!window.confirm("Mark as PAID and record ledger voucher?")) return;
        try {
            await api.patch(`/hr/api/salary-slips/${id}/`, { payment_status: 'PAID' });
            fetchSlips();
        } catch (err) {
            console.error('Payout failed', err);
        }
    };

    const totalDisbursement = slips.reduce((acc, curr) => acc + parseFloat(curr.net_salary || 0), 0);
    const paidCount = slips.filter(p => p.payment_status === 'PAID').length;
    const pendingCount = slips.filter(p => p.payment_status === 'PENDING').length;

    return (
        <PortfolioPage breadcrumb={`HR // PAYROLL`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Enterprise financial hub for employee compensation and statutory compliance.">
                    PAYROLL CONSOLE
                </PortfolioTitle>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        style={{
                            padding: '12px 20px', background: 'rgba(232, 230, 227, 0.05)',
                            border: '1px solid rgba(232, 230, 227, 0.1)', borderRadius: '12px',
                            color: 'var(--cream)', fontSize: '14px', fontFamily: 'inherit', outline: 'none'
                        }}
                    />
                    <PortfolioButton onClick={runPayrollCycle} disabled={loading}>
                        <Play size={16} /> GENERATE SLIPS
                    </PortfolioButton>
                </div>
            </div>

            <PortfolioStats stats={[
                { value: `AED ${totalDisbursement.toLocaleString()}`, label: 'ESTIMATED DISBURSEMENT', color: 'var(--gold)' },
                { value: paidCount, label: 'PAYOUTS COMPLETED', color: '#10b981' },
                { value: pendingCount, label: 'PAYMENTS PENDING', color: '#f59e0b' }
            ]} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {slips.length === 0 ? (
                    <GlassCard style={{ textAlign: 'center', padding: '100px', opacity: 0.5 }}>
                        NO SALARY SLIPS FOUND FOR {selectedMonth}
                    </GlassCard>
                ) : (
                    slips.map(slip => (
                        <div key={slip.id} style={{
                            background: 'rgba(232, 230, 227, 0.02)', border: '1px solid rgba(232, 230, 227, 0.1)',
                            borderRadius: '20px', padding: '25px 40px', display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', alignItems: 'center', gap: '30px'
                        }}>
                            <div>
                                <div style={{ fontSize: '18px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', marginBottom: '5px' }}>
                                    {slip.employee_name}
                                </div>
                                <div style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '2px', fontWeight: '800' }}>
                                    {slip.month}
                                </div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '10px', opacity: 0.4, letterSpacing: '1px', marginBottom: '5px' }}>BASIC + ALLOW</div>
                                <div style={{ fontSize: '15px', color: 'var(--cream)' }}>
                                    AED {(parseFloat(slip.basic_salary) + parseFloat(slip.allowances)).toLocaleString()}
                                </div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '10px', opacity: 0.4, letterSpacing: '1px', marginBottom: '5px' }}>COMM + BONUS</div>
                                <div style={{ fontSize: '15px', color: '#10b981' }}>
                                    + AED {(parseFloat(slip.commissions_earned) + parseFloat(slip.bonuses)).toLocaleString()}
                                </div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '10px', opacity: 0.4, letterSpacing: '1px', marginBottom: '5px' }}>NET PAYABLE</div>
                                <div style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', color: 'var(--gold)', fontWeight: '800' }}>
                                    AED {parseFloat(slip.net_salary).toLocaleString()}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <PortfolioButton variant="secondary" onClick={() => setViewingSlip(slip)} style={{ padding: '10px' }}>
                                    <Eye size={16} />
                                </PortfolioButton>
                                {slip.payment_status === 'PAID' ? (
                                    <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: '800' }}>
                                        <BadgeCheck size={18} /> PAID
                                    </div>
                                ) : (
                                    <PortfolioButton onClick={() => markAsPaid(slip.id)} style={{ fontSize: '11px', padding: '10px 20px' }}>
                                        PAY
                                    </PortfolioButton>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <PayslipModal slip={viewingSlip} onClose={() => setViewingSlip(null)} />
        </PortfolioPage>
    );
};

export default PayrollConsole;
