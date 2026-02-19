import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { PortfolioPage, PortfolioButton } from '../../components/PortfolioComponents';
import GlassCard from '../../components/GlassCard';
import { ArrowLeft, Printer, CreditCard, CheckCircle, Download } from 'lucide-react';
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
            const res = await api.get(`/forms/invoices/api/list/${id}/`);
            setInvoice(res.data);
        } catch (err) {
            console.error('Error fetching invoice', err);
        } finally {
            setLoading(false);
        }
    };

    const markAsPaid = async () => {
        try {
            await api.patch(`/forms/invoices/api/list/${id}/`, { payment_status: 'PAID' });
            setInvoice({ ...invoice, payment_status: 'PAID' });
            alert('Payment Received!');
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading) return <PortfolioPage><div style={{ padding: '50px', textAlign: 'center', color: 'var(--cream)' }}>Loading...</div></PortfolioPage>;
    if (!invoice) return <PortfolioPage><div style={{ padding: '50px', textAlign: 'center', color: 'var(--cream)' }}>Invoice Not Found</div></PortfolioPage>;

    return (
        <PortfolioPage>
            <div style={{ padding: '40px 0' }}>
                <PrintHeader title={`Tax Invoice: ${invoice.invoice_number}`} />

                {/* Header Actions - Hidden on Print */}
                <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                    <div>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px',
                            color: 'var(--cream)', fontSize: '13px', letterSpacing: '1px', cursor: 'pointer'
                        }} onClick={() => navigate('/invoices')}>
                            <ArrowLeft size={16} /> BACK TO LIST
                        </div>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '32px', fontWeight: '700', color: 'var(--cream)', margin: 0 }}>
                            INVOICE <span style={{ color: 'var(--gold)' }}>#{invoice.invoice_number}</span>
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                            <div style={{
                                padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800',
                                background: invoice.payment_status === 'PAID' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                color: invoice.payment_status === 'PAID' ? '#10b981' : '#f59e0b',
                                border: `1px solid ${invoice.payment_status === 'PAID' ? '#10b981' : '#f59e0b'}`,
                                letterSpacing: '1px'
                            }}>
                                {invoice.payment_status}
                            </div>
                            <span style={{ color: 'rgba(232, 230, 227, 0.5)', fontSize: '12px' }}>
                                Issued: {new Date(invoice.date).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <PortfolioButton
                            onClick={() => window.open(`/forms/utils/generate-pdf/Invoice/${id}/`, '_blank')}
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            <Printer size={18} /> PRINT INVOICE
                        </PortfolioButton>
                        {invoice.payment_status !== 'PAID' && (
                            <PortfolioButton primary onClick={markAsPaid}>
                                <CreditCard size={18} /> MARK AS PAID
                            </PortfolioButton>
                        )}
                    </div>
                </div>

                {/* Invoice Paper Document */}
                <div className="printable-area" style={{
                    background: '#fff',
                    color: '#000',
                    padding: '60px',
                    maxWidth: '850px',
                    margin: '0 auto',
                    borderRadius: '4px', // Slight radius for digital view, sharp for print
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px' }}>
                        <div>
                            <img
                                src="/elite_shine_logo.png"
                                alt="Elite Shine Logo"
                                style={{
                                    width: '180px',
                                    height: 'auto',
                                    marginBottom: '10px',
                                    filter: 'none' // Ensure logo colors are accurate
                                }}
                            />
                            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '11px', fontWeight: '600' }}>
                                Dubai, UAE | TRN: 100345678900003
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h3 style={{ fontSize: '28px', margin: '0 0 5px 0', color: '#000', fontFamily: 'serif', letterSpacing: '1px' }}>TAX INVOICE</h3>
                            <p style={{ margin: 0, color: '#b08d57', fontWeight: '700', fontSize: '14px' }}>#{invoice.invoice_number}</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', marginBottom: '50px', borderTop: '2px solid #000', paddingTop: '20px' }}>
                        <div>
                            <h4 style={{ fontSize: '10px', textTransform: 'uppercase', color: '#999', marginBottom: '8px', letterSpacing: '1px' }}>BILL TO CLIENT</h4>
                            <p style={{ margin: 0, fontWeight: '700', fontSize: '16px', color: '#000' }}>{invoice.customer_name}</p>
                            {invoice.customer_trn && <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#444' }}>TRN: {invoice.customer_trn}</p>}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            {/* Details can go here if needed, keeping it clean for now */}
                        </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #000' }}>
                                <th style={{ padding: '15px 0', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#666' }}>Description</th>
                                <th style={{ padding: '15px 0', textAlign: 'right', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#666' }}>Amount (AED)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '20px 0', verticalAlign: 'top', borderBottom: '1px solid #eee' }}>
                                    <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '5px' }}>Service Package</div>
                                    <div style={{ fontSize: '13px', color: '#555', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{invoice.items}</div>
                                </td>
                                <td style={{ padding: '20px 0', verticalAlign: 'top', textAlign: 'right', fontWeight: '600', borderBottom: '1px solid #eee' }}>
                                    {parseFloat(invoice.total_amount).toFixed(2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ width: '280px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px', color: '#666' }}>
                                <span>Subtotal</span>
                                <span>{parseFloat(invoice.total_amount).toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '13px', color: '#666' }}>
                                <span>VAT (5%)</span>
                                <span>{parseFloat(invoice.vat_amount).toFixed(2)}</span>
                            </div>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between', paddingTop: '15px', borderTop: '2px solid #000',
                                fontSize: '18px', fontWeight: '800', color: '#b08d57'
                            }}>
                                <span>TOTAL</span>
                                <span>AED {parseFloat(invoice.grand_total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Signatures */}
                    <div style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
                        <div>
                            <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#999', marginBottom: '40px', letterSpacing: '1px' }}>Authorized Signature</div>
                            <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
                                <span style={{ fontSize: '14px', fontFamily: 'cursive' }}>Elite Shine Auto</span>
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#999', marginBottom: '10px', letterSpacing: '1px' }}>Customer Acceptance</div>
                            {invoice.signature_data ? (
                                <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', textAlign: 'center' }}>
                                    <img src={invoice.signature_data} alt="Signature" style={{ maxHeight: '50px' }} />
                                </div>
                            ) : (
                                <div className="no-print" style={{ border: '1px dashed #ccc', padding: '10px', borderRadius: '4px' }}>
                                    <SignaturePad
                                        title="Sign Here"
                                        onSave={async (data) => {
                                            try {
                                                await api.patch(`/forms/invoices/api/list/${id}/`, { signature_data: data });
                                                setInvoice({ ...invoice, signature_data: data });
                                                // No alert to keep flow smooth
                                            } catch (err) {
                                                console.error('Signature save failed', err);
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ marginTop: '50px', textAlign: 'center', fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Thank you for your business.
                    </div>
                </div>
            </div>


        </PortfolioPage>
    );
};

export default InvoiceDetail;
