import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import {
    FileText, CreditCard, PieChart,
    CheckCircle, XCircle, ArrowLeft, Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DateRangePicker from '../../components/finance/DateRangePicker';

const InvoiceBook = () => {
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
            const res = await api.get(`/reports/api/invoice-book/?start_date=${startDate}&end_date=${endDate}`);
            setEntries(res.data.entries);
            setSummary(res.data.summary);
        } catch (err) {
            console.error('Error fetching invoice book', err);
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
                        <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px' }}>EXECUTIVE BILLING</div>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>Invoice Book</h1>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onStartChange={setStartDate}
                        onEndChange={setEndDate}
                        onApply={fetchData}
                    />
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Download size={18} /> EXPORT
                    </button>
                </div>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-secondary)' }}>Compiling Fiscal Records...</div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                        <SummaryCard label="Invoices" value={summary?.total_invoices || 0} color="var(--gold)" />
                        <SummaryCard label="Total Grand" value={`AED ${(summary?.total_grand || 0).toLocaleString()}`} color="#10b981" />
                        <SummaryCard label="VAT Collected" value={`AED ${(summary?.total_vat || 0).toLocaleString()}`} color="#3b82f6" />
                        <SummaryCard label="Outstanding" value={summary?.pending_count || 0} color="#ef4444" />
                    </div>

                    <GlassCard style={{ padding: '30px', border: '1.5px solid var(--gold-border)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2.5px solid var(--gold-border)', color: 'var(--gold)', fontSize: '12px', textTransform: 'uppercase', fontWeight: '900' }}>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Invoice #</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Customer</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Payment Status</th>
                                    <th style={{ padding: '15px', textAlign: 'right' }}>VAT (5%)</th>
                                    <th style={{ padding: '15px', textAlign: 'right' }}>Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map(entry => (
                                    <tr key={entry.id} style={{ borderBottom: '1px solid var(--border-color)' }} className="hover-row">
                                        <td style={{ padding: '15px', fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '800' }}>{new Date(entry.date).toLocaleDateString()}</td>
                                        <td style={{ padding: '15px', fontWeight: '900', color: 'var(--gold)' }}>{entry.number}</td>
                                        <td style={{ padding: '15px', fontWeight: '900', color: 'var(--text-primary)', fontSize: '14px' }}>{entry.customer}</td>
                                        <td style={{ padding: '15px' }}>
                                            <PaymentStatus status={entry.status} />
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'right', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '900' }}>
                                            AED {parseFloat(entry.vat_amount).toLocaleString()}
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'right', fontWeight: '1000', fontSize: '18px', color: entry.status === 'PAID' ? '#10b981' : 'var(--text-primary)' }}>
                                            AED {parseFloat(entry.grand_total).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </GlassCard>
                </>
            )}

            <style>{`
                .hover-row:hover { background: rgba(0,0,0,0.02); }
            `}</style>
        </div>
    );
};

const SummaryCard = ({ label, value, color }) => (
    <GlassCard style={{ padding: '20px', textAlign: 'center', border: '1.5px solid var(--gold-border)' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '10px' }}>{label}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: color }}>{value}</div>
    </GlassCard>
);

const PaymentStatus = ({ status }) => {
    const isPaid = status === 'PAID';
    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '900',
            background: isPaid ? '#10b98125' : '#ef444425',
            color: isPaid ? '#10b981' : '#ef4444',
            border: `1.5px solid ${isPaid ? '#10b98160' : '#ef444460'}`,
            textTransform: 'uppercase'
        }}>
            {isPaid ? <CheckCircle size={14} /> : <XCircle size={14} />} {status}
        </span>
    );
};

export default InvoiceBook;
