import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
    PortfolioPage, PortfolioTitle, PortfolioStats,
    PortfolioGrid, PortfolioButton
} from '../../components/PortfolioComponents';
import {
    Search, Calendar, FileText,
    Download, ExternalLink, Filter,
    ChevronRight, CreditCard, CheckCircle2
} from 'lucide-react';

const InvoiceBook = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchInvoicedJobs();
    }, []);

    const fetchInvoicedJobs = async () => {
        setLoading(true);
        try {
            let url = '/forms/job-cards/api/jobs/?status=INVOICED';
            const params = new URLSearchParams();
            if (searchQuery) params.append('q', searchQuery);
            if (startDate && endDate) {
                params.append('start_date', startDate);
                params.append('end_date', endDate);
            }
            const fullUrl = params.toString() ? `${url}&${params.toString()}` : url;

            const res = await api.get(fullUrl);
            setInvoices(res.data);
        } catch (err) {
            console.error('Error fetching invoice book', err);
        } finally {
            setLoading(false);
        }
    };

    const totalBilled = invoices.reduce((sum, inv) => sum + parseFloat(inv.net_amount || 0), 0);

    return (
        <PortfolioPage breadcrumb="Finance / Invoice Book">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Unified fiscal record of all completed and invoiced service assets.">
                    INVOICE BOOK
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={filterGroupStyle}>
                        <div style={searchBoxStyle}>
                            <Search size={16} color="rgba(232, 230, 227, 0.4)" />
                            <input
                                type="text"
                                placeholder="Search Name / Phone / INV"
                                style={inputStyle}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchInvoicedJobs()}
                            />
                        </div>
                        <div style={dateBoxStyle}>
                            <Calendar size={16} color="rgba(232, 230, 227, 0.4)" />
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={dateInputStyle} />
                            <span style={{ color: 'rgba(232, 230, 227, 0.2)' }}>→</span>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={dateInputStyle} />
                            <PortfolioButton
                                onClick={fetchInvoicedJobs}
                                variant="gold"
                                style={{ height: '32px', padding: '0 15px', fontSize: '10px' }}
                            >
                                FETCH ARCHIVE
                            </PortfolioButton>
                        </div>
                    </div>
                </div>
            </div>

            <PortfolioStats stats={[
                { value: invoices.length, label: 'TOTAL INVOICES' },
                { value: `AED ${totalBilled.toLocaleString()}`, label: 'CUMULATIVE REVENUE', color: '#10b981' },
                { value: 'LIVE', label: 'DATABASE STATUS', color: '#10b981' }
            ]} />

            <div style={tableWrapperStyle}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>INVOICE / JOB #</th>
                            <th style={thStyle}>DATE</th>
                            <th style={thStyle}>CUSTOMER</th>
                            <th style={thStyle}>CONTACT</th>
                            <th style={thStyle}>VEHICLE</th>
                            <th style={thStyle}>AMOUNT</th>
                            <th style={thStyle}>STATUS</th>
                            <th style={thStyle}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '100px', color: 'rgba(232, 230, 227, 0.4)' }}>
                                    RETRIEVING FISCAL RECORDS...
                                </td>
                            </tr>
                        ) : invoices.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '100px', color: 'rgba(232, 230, 227, 0.2)' }}>
                                    NO INVOICES FOUND IN SPECIFIED RANGE
                                </td>
                            </tr>
                        ) : invoices.map(inv => (
                            <tr key={inv.id} style={trStyle}>
                                <td style={tdStyle}>
                                    <div style={invBadgeStyle}>
                                        <FileText size={12} style={{ marginRight: '8px' }} />
                                        {inv.job_card_number}
                                    </div>
                                </td>
                                <td style={tdStyle}>{new Date(inv.date).toLocaleDateString()}</td>
                                <td style={tdStyle}>
                                    <div style={{ fontWeight: '700', color: 'var(--cream)' }}>{inv.customer_name}</div>
                                </td>
                                <td style={tdStyle}>{inv.phone}</td>
                                <td style={tdStyle}>
                                    <div style={{ fontSize: '12px' }}>{inv.brand} {inv.model}</div>
                                    <div style={{ fontSize: '10px', opacity: 0.5 }}>{inv.registration_number}</div>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ fontWeight: '900', color: '#10b981' }}>AED {inv.net_amount}</div>
                                </td>
                                <td style={tdStyle}>
                                    <span style={statusBadgeStyle(inv.status)}>
                                        {inv.status_display.toUpperCase()}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => navigate(`/job-cards/${inv.id}`)}
                                            style={actionBtnStyle}
                                            title="View Job History"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                        <button
                                            onClick={() => inv.invoice && navigate(`/invoices/${inv.invoice.id}`)}
                                            style={{ ...actionBtnStyle, color: '#b08d57' }}
                                            title="View Official Invoice"
                                        >
                                            <Download size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PortfolioPage>
    );
};

// Styles
const filterGroupStyle = {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
};

const searchBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(232, 230, 227, 0.04)',
    border: '1px solid rgba(232, 230, 227, 0.08)',
    borderRadius: '12px',
    padding: '0 15px',
    height: '42px'
};

const dateBoxStyle = {
    ...searchBoxStyle,
    gap: '10px'
};

const inputStyle = {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
    width: '200px'
};

const dateInputStyle = {
    ...inputStyle,
    width: '120px',
    fontSize: '11px',
    fontWeight: '700',
    color: 'rgba(232, 230, 227, 0.6)'
};

const tableWrapperStyle = {
    background: 'rgba(232, 230, 227, 0.02)',
    border: '1px solid rgba(232, 230, 227, 0.08)',
    borderRadius: '24px',
    overflow: 'hidden',
    marginTop: '40px'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
};

const thStyle = {
    padding: '20px 25px',
    fontSize: '10px',
    fontWeight: '900',
    color: '#b08d57',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    background: 'rgba(232, 230, 227, 0.03)',
    borderBottom: '1px solid rgba(232, 230, 227, 0.08)'
};

const trStyle = {
    borderBottom: '1px solid rgba(232, 230, 227, 0.05)',
    transition: 'all 0.2s ease',
    ':hover': {
        background: 'rgba(232, 230, 227, 0.01)'
    }
};

const tdStyle = {
    padding: '18px 25px',
    fontSize: '13px',
    color: 'rgba(232, 230, 227, 0.6)'
};

const invBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 12px',
    background: 'rgba(176, 141, 87, 0.1)',
    border: '1px solid rgba(176, 141, 87, 0.2)',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '800',
    color: '#b08d57'
};

const statusBadgeStyle = (status) => ({
    fontSize: '9px',
    fontWeight: '900',
    padding: '4px 10px',
    borderRadius: '6px',
    background: status === 'CLOSED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(176, 141, 87, 0.1)',
    color: status === 'CLOSED' ? '#10b981' : '#b08d57',
    border: `1px solid ${status === 'CLOSED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(176, 141, 87, 0.2)'}`
});

const actionBtnStyle = {
    background: 'rgba(232, 230, 227, 0.05)',
    border: 'none',
    color: 'rgba(232, 230, 227, 0.4)',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
};

export default InvoiceBook;
