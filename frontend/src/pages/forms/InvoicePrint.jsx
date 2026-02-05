import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Printer } from 'lucide-react';
import api from '../../api/axios';
import './InvoicePrint.css';

const InvoicePrint = ({ invoiceData: propData }) => {
    const { id } = useParams();
    const [data, setData] = useState(propData || null);
    const [loading, setLoading] = useState(!propData);

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
        <div className="invoice-print-container">
            <div className="print-controls no-print">
                <button onClick={() => window.print()} className="print-btn">
                    <Printer size={16} /> Print Invoice
                </button>
            </div>

            <div className="invoice-document">
                {/* Paid Stamp */}
                {displayData.status === "PAID" && (
                    <div className="paid-stamp">PAID</div>
                )}

                {/* Header */}
                <div className="invoice-header">
                    <div>
                        <h1>Elite SHINE</h1>
                        <p className="subtitle">CAR POLISH SERVICES LLC</p>
                        <p className="trn">TRN: {displayData.trn}</p>
                    </div>
                    <div className="header-right">
                        <h2>Tax Invoice</h2>
                        <p className="invoice-number">{displayData.number}</p>
                        <p className="date">{displayData.date}</p>
                    </div>
                </div>

                {/* Bill To */}
                <div className="bill-to">
                    <h3>Bill To</h3>
                    <p className="customer-name">{displayData.customer.name}</p>
                    <p className="customer-trn">TRN: {displayData.customer.trn}</p>
                </div>

                {/* Table */}
                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayData.items.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item.desc || item.description}</td>
                                <td className="center">{item.qty || item.quantity}</td>
                                <td className="right">{parseFloat(item.price || 0).toFixed(2)}</td>
                                <td className="right">{parseFloat(item.amount || 0).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Footer Totals */}
                <div className="totals-section">
                    <div className="totals">
                        <div className="total-row">
                            <span>Subtotal (Excl. VAT)</span>
                            <span>{displayData.totals.subtotal}</span>
                        </div>
                        <div className="total-row">
                            <span>VAT (5%)</span>
                            <span>{displayData.totals.vat}</span>
                        </div>
                        <div className="total-row grand">
                            <span>Grand Total</span>
                            <span>AED {displayData.totals.grandTotal}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="footer-note">
                    This is a computer-generated invoice and does not require a signature.
                </div>
            </div>
        </div>
    );
};

export default InvoicePrint;
