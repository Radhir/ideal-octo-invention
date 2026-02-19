import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioStats,
    PortfolioButton,
    PortfolioCard,
    PortfolioBackButton,
    PortfolioSectionTitle
} from '../../components/PortfolioComponents';
import {
    FileText,
    CheckCircle, XCircle, Download, Calendar as CalendarIcon
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

    const fetchData = useCallback(async () => {
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
    }, [startDate, endDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <PortfolioPage breadcrumb="FINANCE // INVOICE BOOK">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '80px' }}>
                <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-end' }}>
                    <PortfolioBackButton onClick={() => navigate('/finance')} />
                    <PortfolioTitle subtitle="A detailed historical registry of all financial transactions and fiscal certificates.">
                        INVOICE BOOK
                    </PortfolioTitle>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '100px' }}>
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onStartChange={setStartDate}
                        onEndChange={setEndDate}
                        onApply={fetchData}
                        styled
                    />
                    <PortfolioButton variant="gold" onClick={() => { }} style={{ padding: '12px 25px' }}>
                        <Download size={16} /> EXPORT BOOK
                    </PortfolioButton>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '80px', textAlign: 'center', color: 'var(--cream)', opacity: 0.5 }}>Compiling Fiscal Records...</div>
            ) : (
                <>
                    <PortfolioStats stats={[
                        { label: 'TOTAL INVOICES', value: summary?.total_invoices || 0 },
                        { label: 'GRAND TOTAL', value: `AED ${(summary?.total_grand || 0).toLocaleString()}`, color: 'var(--cream)' },
                        { label: 'VAT COLLECTED', value: `AED ${(summary?.total_vat || 0).toLocaleString()}`, color: 'var(--gold)' },
                        { label: 'OUTSTANDING', value: summary?.pending_count || 0, color: '#f43f5e' }
                    ]} />

                    <div style={{ marginTop: '60px' }}>
                        <PortfolioSectionTitle>FISCAL ENTRIES</PortfolioSectionTitle>

                        <div style={{
                            background: 'rgba(232, 230, 227, 0.02)',
                            border: '1.5px solid rgba(232, 230, 227, 0.1)',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            marginTop: '30px'
                        }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(232, 230, 227, 0.05)', borderBottom: '1px solid rgba(232, 230, 227, 0.1)' }}>
                                        <th style={thStyle}>Date</th>
                                        <th style={thStyle}>Identity #</th>
                                        <th style={thStyle}>Client Narrative</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>VAT (5%)</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>Grand Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.map(entry => (
                                        <tr key={entry.id} style={{ borderBottom: '1px solid rgba(232, 230, 227, 0.05)', transition: 'background 0.3s' }}>
                                            <td style={tdStyle}>{new Date(entry.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                            <td style={{ ...tdStyle, color: 'var(--gold)', fontWeight: '700', letterSpacing: '1px' }}>{entry.number}</td>
                                            <td style={{ ...tdStyle, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{entry.customer}</td>
                                            <td style={tdStyle}>
                                                <div style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    color: entry.status === 'PAID' ? '#10b981' : '#f43f5e',
                                                    fontSize: '10px',
                                                    fontWeight: '800',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '1px'
                                                }}>
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></div>
                                                    {entry.status}
                                                </div>
                                            </td>
                                            <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'var(--font-serif)', fontSize: '15px' }}>
                                                AED {parseFloat(entry.vat_amount).toLocaleString()}
                                            </td>
                                            <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--cream)' }}>
                                                AED {parseFloat(entry.grand_total).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </PortfolioPage>
    );
};

const thStyle = {
    padding: '25px 30px',
    textAlign: 'left',
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--gold)',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    opacity: 0.8
};

const tdStyle = {
    padding: '25px 30px',
    fontSize: '13px',
    color: 'var(--cream)',
    opacity: 0.9
};

export default InvoiceBook;
