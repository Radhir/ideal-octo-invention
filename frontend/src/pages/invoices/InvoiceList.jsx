import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { Plus, Search, FileText, ChevronRight, CheckCircle2, AlertCircle, Printer } from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';

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
            }, 1500); // Wait for data to render
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
        <div style={{ padding: '30px 20px' }}>
            <PrintHeader title="Invoices Registry" />
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#b08d57', fontSize: '1.8rem' }}>Billing & Invoices</h1>
                    <p style={{ color: '#94a3b8' }}>Revenue and payment tracking</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                        onClick={() => window.print()}
                        className="glass-card"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                    >
                        <Printer size={20} /> Print Registry
                    </button>
                    <button
                        onClick={() => window.open(`/forms/utils/generate-pdf/Invoice/0/`, '_blank')}
                        className="glass-card"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                    >
                        <Printer size={20} /> Export PDF
                    </button>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6, cursor: 'not-allowed' }}>
                        <Plus size={20} /> (Created via Job Cards)
                    </button>
                </div>
            </header>

            <div style={{ marginBottom: '20px', position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name or invoice#..."
                    style={{ paddingLeft: '45px' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '40px' }}>Loading Invoices...</p>
                ) : filteredInvoices.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '40px' }}>No invoices found.</p>
                ) : (
                    filteredInvoices.map((inv) => (
                        <GlassCard
                            key={inv.id}
                            onClick={() => navigate(`/invoices/${inv.id}`)}
                            style={{ padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <FileText size={24} color="#b08d57" />
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                        <span style={{ color: '#b08d57', fontSize: '14px', fontWeight: '700' }}>#{inv.invoice_number}</span>
                                        <span style={{
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            color: inv.payment_status === 'PAID' ? '#10b981' : '#f59e0b',
                                            background: inv.payment_status === 'PAID' ? '#10b98111' : '#f59e0b11',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            fontWeight: '800',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            {inv.payment_status === 'PAID' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                                            {inv.payment_status}
                                        </span>
                                    </div>
                                    <div style={{ fontWeight: '600', fontSize: '16px' }}>{inv.customer_name}</div>
                                    <div style={{ color: '#94a3b8', fontSize: '13px' }}>{new Date(inv.date).toLocaleDateString()}</div>
                                </div>

                                <div style={{ textAlign: 'right', marginRight: '20px' }}>
                                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>AED {inv.grand_total}</div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Incl. VAT</div>
                                </div>
                            </div>
                            <ChevronRight size={24} style={{ color: '#94a3b8' }} />
                        </GlassCard>
                    ))
                )}
            </div>
            <style>{`
            `}</style>
        </div>
    );
};

export default InvoiceList;
