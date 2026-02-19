import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Search, FileText, ChevronRight,
    CheckCircle2, AlertCircle, Printer, Download
} from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioGrid,
    PortfolioTitle,
    PortfolioButton,
    PortfolioInput,
    PortfolioBackButton
} from '../../components/PortfolioComponents';

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchInvoices();
        // Handle direct print request from Reports Dashboard
        const params = new URLSearchParams(window.location.search);
        if (params.get('print_confirm') === 'true') {
            setTimeout(() => {
                if (window.confirm("Perform bulk print of active Invoice Registry?")) {
                    window.print();
                }
            }, 1500);
        }
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await api.get('/forms/invoices/api/list/');
            setInvoices(res.data);
        } catch (err) {
            console.error('Error fetching invoices', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredInvoices = invoices.filter(i =>
        i.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PortfolioPage breadcrumb="Finance Division / Revenue Tracking">
            <PrintHeader title="Invoices Registry" />

            <div className="no-print">
                <PortfolioBackButton onClick={() => navigate('/finance/overview')} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <PortfolioTitle
                        subtitle="Revenue collection & payment tracking"
                    >
                        Invoice Registry
                    </PortfolioTitle>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <PortfolioButton
                            variant="glass"
                            onClick={() => window.print()}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Printer size={18} /> Print Registry
                        </PortfolioButton>
                        <PortfolioButton
                            variant="glass"
                            onClick={() => window.open(`/forms/utils/generate-pdf/Invoice/0/`, '_blank')}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Download size={18} /> Export PDF
                        </PortfolioButton>
                    </div>
                </div>

                <div style={{ marginBottom: '30px', maxWidth: '400px', position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)', opacity: 0.7 }} size={18} />
                    <PortfolioInput
                        placeholder="Search by client or invoice #..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '45px' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {loading ? (
                        <div style={{ padding: '50px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.4)' }}>Loading financial records...</div>
                    ) : filteredInvoices.length === 0 ? (
                        <div style={{ padding: '50px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.4)' }}>No invoices found matching criteria.</div>
                    ) : (
                        filteredInvoices.map((inv) => (
                            <PortfolioCard
                                key={inv.id}
                                onClick={() => navigate(`/invoices/${inv.id}`)}
                                style={{ padding: '25px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'transform 0.2s' }}
                                className="invoice-row"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '25px', flex: 1 }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '12px',
                                        background: 'rgba(176,141,87,0.1)',
                                        border: '1px solid rgba(176,141,87,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <FileText size={24} color="var(--gold)" />
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                                            <span style={{ color: 'var(--gold)', fontSize: '14px', fontWeight: '800', fontFamily: 'var(--font-serif)' }}>#{inv.invoice_number}</span>
                                            <span style={{
                                                fontSize: '10px',
                                                textTransform: 'uppercase',
                                                color: inv.payment_status === 'PAID' ? '#10b981' : '#f59e0b',
                                                background: inv.payment_status === 'PAID' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                border: `1px solid ${inv.payment_status === 'PAID' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                                                padding: '3px 10px',
                                                borderRadius: '20px',
                                                fontWeight: '800',
                                                letterSpacing: '1px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}>
                                                {inv.payment_status === 'PAID' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                                                {inv.payment_status}
                                            </span>
                                        </div>
                                        <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--cream)', marginBottom: '4px' }}>{inv.customer_name}</div>
                                        <div style={{ color: 'rgba(232, 230, 227, 0.5)', fontSize: '12px' }}>Issued: {new Date(inv.date).toLocaleDateString()}</div>
                                    </div>

                                    <div style={{ textAlign: 'right', marginRight: '30px' }}>
                                        <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>AED {inv.grand_total}</div>
                                        <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Incl. VAT</div>
                                    </div>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '50%' }}>
                                    <ChevronRight size={20} color="var(--gold)" />
                                </div>
                            </PortfolioCard>
                        ))
                    )}
                </div>
            </div>

            {/* Print View Table */}
            <div className="only-print" style={{ display: 'none' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #000' }}>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Invoice #</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Date</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Customer</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Status</th>
                            <th style={{ textAlign: 'right', padding: '10px' }}>Amount (AED)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.map(inv => (
                            <tr key={inv.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{inv.invoice_number}</td>
                                <td style={{ padding: '10px' }}>{new Date(inv.date).toLocaleDateString()}</td>
                                <td style={{ padding: '10px' }}>{inv.customer_name}</td>
                                <td style={{ padding: '10px' }}>{inv.payment_status}</td>
                                <td style={{ padding: '10px', textAlign: 'right' }}>{inv.grand_total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


        </PortfolioPage>
    );
};

export default InvoiceList;
