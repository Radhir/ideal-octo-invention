import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { DollarSign, Play, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { PortfolioPage, PortfolioTitle, PortfolioStats, PortfolioButton, PortfolioSelect } from '../../components/PortfolioComponents';

const PayrollConsole = () => {
    const [payroll, setPayroll] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

    useEffect(() => {
        fetchPayroll();
    }, [selectedMonth]);

    const fetchPayroll = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/hr/api/payroll/?month=${selectedMonth}`);
            setPayroll(res.data);
        } catch (err) {
            console.error('Error fetching payroll', err);
        } finally {
            setLoading(false);
        }
    };

    const runPayrollCycle = async () => {
        if (!window.confirm("Generate payroll from attendance logs?")) return;

        setLoading(true);
        try {
            await api.post('/hr/api/payroll/generate_payroll_cycle/');
            fetchPayroll();
            alert("Payroll cycle completed successfully");
        } catch (err) {
            console.error('Payroll generation failed', err);
            alert("Payroll cycle failed. Check logs.");
        } finally {
            setLoading(false);
        }
    };

    const totalDisbursement = payroll.reduce((acc, curr) => acc + parseFloat(curr.net_salary || 0), 0);
    const processed = payroll.filter(p => p.status === 'PROCESSED').length;
    const pending = payroll.filter(p => p.status === 'PENDING').length;

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)' }}>Loading...</div></PortfolioPage>;

    return (
        <PortfolioPage breadcrumb="Human Resources">
            <PortfolioTitle subtitle="Automated payroll calculation and salary disbursement">
                PAYROLL
            </PortfolioTitle>

            <div style={{ marginBottom: '80px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={{
                        padding: '15px 20px',
                        background: 'transparent',
                        border: '1px solid rgba(232, 230, 227, 0.3)',
                        borderRadius: '10px',
                        color: 'var(--cream)',
                        fontSize: '15px',
                        fontFamily: 'inherit'
                    }}
                />
                <PortfolioButton onClick={runPayrollCycle} disabled={loading}>
                    <Play size={18} style={{ display: 'inline', marginRight: '8px', marginBottom: '-3px' }} />
                    Run Payroll Cycle
                </PortfolioButton>
            </div>

            <PortfolioStats stats={[
                { value: `AED ${totalDisbursement.toLocaleString()}`, label: 'TOTAL DISBURSEMENT', color: '#10b981' },
                { value: processed, label: 'PROCESSED' },
                { value: pending, label: 'PENDING', color: pending > 0 ? '#f59e0b' : 'var(--cream)' }
            ]} />

            {/* Payroll Table */}
            <div style={{
                background: 'rgba(232, 230, 227, 0.03)',
                border: '1px solid rgba(232, 230, 227, 0.1)',
                borderRadius: '20px',
                padding: '40px',
                maxWidth: '1200px'
            }}>
                <h3 style={{
                    fontSize: '24px',
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--cream)',
                    marginBottom: '40px',
                    letterSpacing: '-0.01em'
                }}>
                    Salary Register
                </h3>

                {payroll.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(232, 230, 227, 0.5)' }}>
                        No payroll records for selected period
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {payroll.map(item => (
                            <div
                                key={item.id}
                                style={{
                                    padding: '25px 30px',
                                    background: 'rgba(232, 230, 227, 0.02)',
                                    border: '1px solid rgba(232, 230, 227, 0.1)',
                                    borderRadius: '15px',
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1fr 1fr 1fr',
                                    gap: '20px',
                                    alignItems: 'center'
                                }}
                            >
                                <div>
                                    <div style={{ fontSize: '18px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', marginBottom: '5px' }}>
                                        {item.employee_name}
                                    </div>
                                    <div style={{ fontSize: '12px', opacity: 0.5 }}>
                                        ID: {item.employee_id || item.id}
                                    </div>
                                </div>

                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.5)', marginBottom: '5px', letterSpacing: '1px' }}>
                                        PERIOD
                                    </div>
                                    <div style={{ fontSize: '14px', color: 'var(--cream)' }}>
                                        {new Date(item.month).toLocaleDateString([], { month: 'short', year: 'numeric' })}
                                    </div>
                                </div>

                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.5)', marginBottom: '5px', letterSpacing: '1px' }}>
                                        NET SALARY
                                    </div>
                                    <div style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', color: '#10b981' }}>
                                        AED {parseFloat(item.net_salary).toLocaleString()}
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        padding: '6px 15px',
                                        background: item.status === 'PROCESSED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                        color: item.status === 'PROCESSED' ? '#10b981' : '#f59e0b',
                                        borderRadius: '50px',
                                        fontSize: '11px',
                                        fontWeight: '500',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        {item.status === 'PROCESSED' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                        {item.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PortfolioPage>
    );
};

export default PayrollConsole;
