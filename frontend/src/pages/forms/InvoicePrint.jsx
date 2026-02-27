import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Printer, FileDown, Image } from 'lucide-react';
import api from '../../api/axios';
import { useExport } from '../../utils/useExport';
import './SharedPrintTemplate.css';

const InvoicePrint = ({ invoiceData: propData }) => {
    const { id } = useParams();
    const [data, setData] = useState(propData || null);
    const [loading, setLoading] = useState(!propData);
    const { exportToPDF, exportToJPG } = useExport();

    useEffect(() => {
        if (!propData && id) {
            fetchInvoice();
        }
    }, [id, propData]);

    const fetchInvoice = async () => {
        try {
            const res = await api.get(`/forms/invoices/api/list/${id}/`);
            const inv = res.data;
            setData({
                number: inv.invoice_number || `INV-${inv.id}`,
                date: inv.date || new Date().toLocaleDateString(),
                trn: "100456789000003",
                customer: {
                    name: inv.customer_name || inv.job_card?.customer_name || '',
                    trn: inv.customer_trn || 'N/A'
                },
                items: inv.items || [],
                totals: {
                    subtotal: parseFloat(inv.subtotal || inv.total_amount || 0).toFixed(2),
                    vat: parseFloat(inv.vat_amount || 0).toFixed(2),
                    grandTotal: parseFloat(inv.grand_total || inv.net_amount || 0).toFixed(2)
                },
                status: inv.status || 'PENDING'
            });
        } catch (err) {
            console.error('Error fetching invoice:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '50px', textAlign: 'center', color: '#b08d57' }}>Loading Invoice...</div>;
    }

    const displayData = data || {
        number: "INV-0000",
        date: new Date().toLocaleDateString(),
        trn: "100456789000003",
        customer: { name: "", trn: "N/A" },
        items: [],
        totals: { subtotal: "0.00", vat: "0.00", grandTotal: "0.00" },
        status: "PENDING"
    };

    return (
        <div className="shared-print-body">
            <div style={{ position: 'fixed', top: '20px', left: '0', width: '100%', zIndex: 1000 }} className="export-controls no-print">
                <button onClick={() => window.print()} className="print-btn" style={{ padding: '10px 20px', background: '#222', color: '#fff', border: '1px solid #d4af37', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Printer size={16} /> Print Native
                </button>
                <button onClick={() => exportToPDF('invoice-pdf-area', `Invoice_${displayData.number}.pdf`)} className="print-btn" style={{ padding: '10px 20px', background: '#222', color: '#d4af37', border: '1px solid #d4af37', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileDown size={16} /> Export PDF
                </button>
                <button onClick={() => exportToJPG('invoice-pdf-area', `Invoice_${displayData.number}.jpg`)} className="print-btn" style={{ padding: '10px 20px', background: '#222', color: '#d4af37', border: '1px solid #d4af37', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Image size={16} /> Export JPG
                </button>
            </div>

            <div id="invoice-pdf-area" className="document-container">
                <div className="content-wrapper">

                    <header className="print-header">
                        <div className="print-logo">
                            Elite Shine
                            <span>GROUP OF COMPANIES</span>
                        </div>
                        <div className="doc-title">
                            <h2>Tax Invoice</h2>
                            <p>#{displayData.number}</p>
                            <p style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '5px' }}>Date: {displayData.date}</p>
                        </div>
                    </header>

                    <section className="print-section">
                        <h3 className="section-title">Billing Details</h3>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Customer Name</label>
                                <div className="form-control-static">{displayData.customer.name}</div>
                            </div>
                            <div className="form-group">
                                <label>Customer TRN</label>
                                <div className="form-control-static">{displayData.customer.trn}</div>
                            </div>
                            <div className="form-group">
                                <label>Elite Shine TRN</label>
                                <div className="form-control-static">{displayData.trn}</div>
                            </div>
                            <div className="form-group">
                                <label>Payment Status</label>
                                <div className="form-control-static" style={{ color: displayData.status === 'PAID' ? '#4CAF50' : '#f44336' }}>
                                    {displayData.status}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="print-section">
                        <h3 className="section-title">Services Rendered</h3>
                        <table className="service-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '40%' }}>Description</th>
                                    <th style={{ width: '15%', textAlign: 'center' }}>Qty</th>
                                    <th style={{ width: '20%', textAlign: 'right' }}>Unit Price</th>
                                    <th style={{ width: '25%', textAlign: 'right' }}>Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayData.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.desc || item.description}</td>
                                        <td style={{ textAlign: 'center' }}>{item.qty || item.quantity}</td>
                                        <td style={{ textAlign: 'right' }}>{parseFloat(item.price || 0).toFixed(2)}</td>
                                        <td style={{ textAlign: 'right' }}>{parseFloat(item.amount || 0).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    <section className="print-section" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
                        <div className="financial-rows" style={{ border: '1px solid #333', padding: '20px', background: '#1a1a1a' }}>
                            <div className="fin-row">
                                <span>Subtotal (Excl. VAT):</span>
                                <span>AED {displayData.totals.subtotal}</span>
                            </div>
                            <div className="fin-row">
                                <span>VAT (5%):</span>
                                <span>AED {displayData.totals.vat}</span>
                            </div>
                            <div className="fin-row grand-total">
                                <span>Grand Total:</span>
                                <span>AED {displayData.totals.grandTotal}</span>
                            </div>
                        </div>
                    </section>

                    <div className="signatures-row" style={{ marginTop: '80px' }}>
                        <div className="signature-block">
                            <div className="signature-line"></div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--print-gold)' }}>AUTHORIZED STAMP/SIGNATURE</p>
                            <p style={{ fontSize: '0.7rem', color: '#666' }}>Elite Shine Group</p>
                        </div>
                    </div>

                    <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #333', textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>
                        This is a computer-generated tax invoice.
                    </div>

                </div>
            </div>
        </div>
    );
};

export default InvoicePrint;
