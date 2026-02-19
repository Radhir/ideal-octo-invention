import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioButton,
    PortfolioSelect,
    PortfolioInput,
    PortfolioGrid,
    PortfolioCard,
    PortfolioStats,
    PortfolioBackButton
} from '../../components/PortfolioComponents';
import { Printer, Filter, Landmark, CreditCard, ArrowUpRight, Receipt, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FinancialReport = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: 'PAID',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, invoices]);

    const fetchData = async () => {
        try {
            const res = await api.get('/forms/invoices/api/list/');
            const data = Array.isArray(res.data) ? res.data : res.data.results || [];
            setInvoices(data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to load invoices", err);
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = [...invoices];

        if (filters.status !== 'ALL') {
            result = result.filter(inv => inv.payment_status === filters.status);
        }

        if (filters.startDate) {
            result = result.filter(inv => new Date(inv.date) >= new Date(filters.startDate));
        }

        if (filters.endDate) {
            result = result.filter(inv => new Date(inv.date) <= new Date(filters.endDate));
        }

        setFilteredInvoices(result);
    };

    const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + (parseFloat(inv.grand_total) || 0), 0);
    const taxTotal = filteredInvoices.reduce((sum, inv) => sum + (parseFloat(inv.tax_total) || 0), 0);
    const pendingTotal = filteredInvoices.filter(i => i.payment_status !== 'PAID').length;

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <PortfolioPage><div style={{ color: 'var(--gold)', letterSpacing: '2px', fontWeight: '900', fontSize: '10px', padding: '100px', textAlign: 'center' }}>DE-CRYPTING FISCAL LEDGER...</div></PortfolioPage>;

    const statsData = [
        { label: "SETTLED REVENUE", value: `AED ${totalRevenue.toLocaleString()}`, color: "#10b981" },
        { label: "VAT EXPOSURE", value: `AED ${taxTotal.toLocaleString()}`, color: "var(--gold)" },
        { label: "TRANSACTION VOLUME", value: filteredInvoices.length, color: "#3b82f6" },
        { label: "OUTSTANDING", value: pendingTotal, color: "#f43f5e" },
    ];

    return (
        <PortfolioPage breadcrumb="Executive Intelligence / Reports / Fiscal Ledger">
            <PortfolioBackButton onClick={() => navigate('/reports')} />

            <div className="no-print">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
                    <PortfolioTitle subtitle="High-level fiscal telemetry and corporate revenue analysis.">
                        Fiscal Performance Dossier
                    </PortfolioTitle>
                    <PortfolioButton onClick={handlePrint} variant="primary">
                        <Printer size={18} style={{ marginRight: '10px' }} /> GENERATE REPORT
                    </PortfolioButton>
                </div>

                <PortfolioStats stats={statsData} />

                <PortfolioCard style={{ marginTop: '60px', marginBottom: '60px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', color: 'var(--gold)' }}>
                        <Filter size={18} />
                        <span style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>Audit Filters</span>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '20px',
                        alignItems: 'end'
                    }}>
                        <PortfolioSelect
                            label="SETTLEMENT STATUS"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            style={{ margin: 0 }}
                        >
                            <option value="ALL">ALL INVOICES</option>
                            <option value="PAID">SETTLED (PAID)</option>
                            <option value="PENDING">PENDING CLEARANCE</option>
                            <option value="OVERDUE">OVERDUE / RISK</option>
                        </PortfolioSelect>
                        <PortfolioInput
                            label="AUDIT START"
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            style={{ margin: 0 }}
                        />
                        <PortfolioInput
                            label="AUDIT END"
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            style={{ margin: 0 }}
                        />
                    </div>
                </PortfolioCard>
            </div>



            <PortfolioCard style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--cream)' }}>
                        <thead>
                            <tr style={{ background: 'rgba(232, 230, 227, 0.02)', borderBottom: '1px solid rgba(232, 230, 227, 0.05)' }}>
                                <th style={thStyle}>FISCAL ID</th>
                                <th style={thStyle}>TIMESTAMP</th>
                                <th style={thStyle}>COUNTERPARTY</th>
                                <th style={thStyle}>SETTLEMENT</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>TAX (VAT)</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>VALUATION</th>
                                <th style={thStyle}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.length === 0 ? (
                                <tr><td colSpan="7" style={{ padding: '100px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.2)', letterSpacing: '2px', fontWeight: '800', fontSize: '11px' }}>NO FISCAL RECORDS MATCH CURRENT PARAMETERS</td></tr>
                            ) : filteredInvoices.map(inv => (
                                <tr key={inv.id} style={{ borderBottom: '1px solid rgba(232, 230, 227, 0.03)' }}>
                                    <td style={{ ...tdStyle, fontFamily: 'monospace', color: 'var(--gold)', fontWeight: '800' }}>#{inv.invoice_number}</td>
                                    <td style={tdStyle}>{new Date(inv.date).toLocaleDateString()}</td>
                                    <td style={{ ...tdStyle, fontFamily: 'var(--font-serif)', fontSize: '15px' }}>{inv.customer_name}</td>
                                    <td style={tdStyle}>
                                        <div style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            color: inv.payment_status === 'PAID' ? '#10b981' : '#f59e0b',
                                            fontSize: '10px',
                                            fontWeight: '900',
                                            letterSpacing: '1px'
                                        }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: inv.payment_status === 'PAID' ? '#10b981' : '#f59e0b' }} />
                                            {inv.payment_status}
                                        </div>
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'right', opacity: 0.6 }}>AED {parseFloat(inv.tax_total || 0).toFixed(2)}</td>
                                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '800', fontSize: '15px' }}>AED {parseFloat(inv.grand_total || 0).toLocaleString()}</td>
                                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                                        <button
                                            onClick={() => navigate(`/invoices/${inv.id}`)}
                                            style={{ background: 'none', border: 'none', color: 'rgba(232, 230, 227, 0.2)', cursor: 'pointer' }}
                                        >
                                            <ArrowUpRight size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr style={{ background: 'rgba(176, 141, 87, 0.05)' }}>
                                <td colSpan="4" style={{ ...tdStyle, textAlign: 'right', fontWeight: '900', letterSpacing: '2px', fontSize: '11px', color: 'var(--gold)' }}>AGGREGATED TOTALS</td>
                                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '800', color: 'var(--gold)' }}>AED {taxTotal.toLocaleString()}</td>
                                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '900', color: 'var(--cream)', fontSize: '18px' }}>AED {totalRevenue.toLocaleString()}</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </PortfolioCard>
        </PortfolioPage>
    );
};

const thStyle = {
    padding: '25px 20px',
    textAlign: 'left',
    color: 'var(--gold)',
    fontSize: '10px',
    fontWeight: '900',
    letterSpacing: '2px',
    textTransform: 'uppercase'
};

const tdStyle = {
    padding: '20px',
    fontSize: '13px',
    color: 'var(--cream)',
    fontWeight: '300'
};

export default FinancialReport;
