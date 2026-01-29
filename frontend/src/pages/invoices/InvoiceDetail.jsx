import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { ArrowLeft, Printer, Download, CreditCard, ShieldCheck, User } from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';
import SignaturePad from '../../components/SignaturePad';

const InvoiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoice();
    }, [id]);

    const fetchInvoice = async () => {
        try {
            const res = await axios.get(`/forms/invoices/api/list/${id}/`);
            setInvoice(res.data);
        } catch (err) {
            console.error('Error fetching invoice', err);
        } finally {
            setLoading(false);
        }
    };

    const markAsPaid = async () => {
        try {
            await axios.patch(`/forms/invoices/api/list/${id}/`, { payment_status: 'PAID' });
            setInvoice({ ...invoice, payment_status: 'PAID' });
            alert('Payment Received!');
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
    if (!invoice) return <div style={{ padding: '50px', textAlign: 'center' }}>Invoice Not Found</div>;

    return (
        <div style={{ padding: '30px 20px' }}>
            <PrintHeader title={`Tax Invoice: ${invoice.invoice_number}`} />
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button
                        onClick={() => navigate('/invoices')}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>Invoice #{invoice.invoice_number}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                            <div className="pulse-dot" style={{ width: '6px', height: '6px', background: '#b08d57', borderRadius: '50%' }} />
                            <p style={{ color: '#b08d57', fontSize: '12px', margin: 0, fontWeight: '900', letterSpacing: '2px' }}>ISSUED: {new Date(invoice.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => window.open(`/forms/utils/generate-pdf/Invoice/${id}/`, '_blank')}
                        className="glass-card"
                        style={{ padding: '12px 25px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: '700' }}
                    >
                        <Printer size={18} /> Print Tax Invoice
                    </button>
                    {invoice.payment_status !== 'PAID' && (
                        <button onClick={markAsPaid} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#b08d57', color: '#000', padding: '12px 25px', borderRadius: '12px', fontWeight: '900' }}>
                            <CreditCard size={18} /> Mark as Paid
                        </button>
                    )}
                </div>
            </header>

            <GlassCard className="printable-area" style={{ padding: '50px', maxWidth: '850px', margin: '0 auto', background: '#fff', color: '#000' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px' }}>
                    <div>
                        <img
                            src="/elite_shine_logo.png"
                            alt="Elite Shine Logo"
                            style={{
                                width: '200px',
                                height: 'auto',
                                marginBottom: '5px'
                            }}
                        />
                        <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '12px', fontWeight: 'bold' }}>Dubai, UAE | TRN: 100345678900003</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>TAX INVOICE</h3>
                        <p style={{ margin: 0, color: '#b08d57', fontWeight: '800' }}>#{invoice.invoice_number}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', marginBottom: '50px' }}>
                    <div>
                        <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#999', marginBottom: '10px' }}>Bill To:</h4>
                        <p style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem' }}>{invoice.customer_name}</p>
                        {invoice.customer_trn && <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>TRN: {invoice.customer_trn}</p>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#999', marginBottom: '10px' }}>Status:</h4>
                        <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '800',
                            color: invoice.payment_status === 'PAID' ? '#10b981' : '#f59e0b',
                            border: `1px solid ${invoice.payment_status === 'PAID' ? '#10b981' : '#f59e0b'}`,
                            textTransform: 'uppercase'
                        }}>{invoice.payment_status}</span>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '50px' }}>
                    <thead>
                        <tr style={{ background: '#f8f8f8', borderBottom: '2px solid #eee' }}>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px' }}>DESCRIPTION</th>
                            <th style={{ padding: '15px', textAlign: 'right', fontSize: '12px' }}>TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '20px 15px', verticalAlign: 'top' }}>
                                <div style={{ fontWeight: '600' }}>Service Package</div>
                                <div style={{ fontSize: '13px', color: '#666', marginTop: '5px', whiteSpace: 'pre-wrap' }}>{invoice.items}</div>
                            </td>
                            <td style={{ padding: '20px 15px', textAlign: 'right', fontWeight: '700' }}>
                                AED {invoice.total_amount}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: '250px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                            <span style={{ color: '#666' }}>Subtotal</span>
                            <span>AED {invoice.total_amount}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                            <span style={{ color: '#666' }}>VAT (5%)</span>
                            <span>AED {invoice.vat_amount}</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingTop: '15px',
                            marginTop: '15px',
                            borderTop: '2px solid #eee',
                            fontSize: '1.2rem',
                            fontWeight: '900',
                            color: '#b08d57'
                        }}>
                            <span>TOTAL</span>
                            <span>AED {invoice.grand_total}</span>
                        </div>
                    </div>
                </div>

                {/* Signature Section */}
                <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        <div>
                            <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#999', marginBottom: '10px' }}>Staff Authorization:</h4>
                            <div style={{ borderBottom: '1px solid #eee', height: '60px', position: 'relative' }}>
                                <p style={{ position: 'absolute', bottom: '5px', left: 0, margin: 0, fontSize: '12px', color: '#666' }}>Verified</p>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#999', marginBottom: '10px' }}>Customer Acceptance:</h4>
                            {invoice.signature_data ? (
                                <div style={{ borderBottom: '1px solid #eee', height: '80px', textAlign: 'center' }}>
                                    <img src={invoice.signature_data} alt="Customer Sig" style={{ maxHeight: '60px' }} />
                                </div>
                            ) : (
                                <div className="no-print">
                                    <SignaturePad
                                        title="Sign to Accept Invoice"
                                        onSave={async (data) => {
                                            try {
                                                await axios.patch(`/forms/invoices/api/list/${id}/`, { signature_data: data });
                                                setInvoice({ ...invoice, signature_data: data });
                                                alert('Invoice signed successfully!');
                                            } catch (err) {
                                                alert('Failed to save signature');
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px', fontSize: '11px', color: '#999', textAlign: 'center' }}>
                    Thank you for choosing Elite Shine. This is a computer generated invoice.
                </div>
            </GlassCard>

            <style>{`
                @media print {
                    body { background: #fff !important; color: #000 !important; }
                    .printable-area { border: 1px solid #eee !important; box-shadow: none !important; width: 100% !important; margin: 0 !important; padding: 30px !important; }
                    button, .btn-primary, header { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default InvoiceDetail;
