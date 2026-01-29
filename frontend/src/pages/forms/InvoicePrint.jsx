import React from 'react';
import { Printer } from 'lucide-react';
import './InvoicePrint.css';

const InvoicePrint = ({ invoiceData }) => {
    const data = invoiceData || {
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
                {data.status === "PAID" && (
                    <div className="paid-stamp">PAID</div>
                )}

                {/* Header */}
                <div className="invoice-header">
                    <div>
                        <h1>Elite SHINE</h1>
                        <p className="subtitle">CAR POLISH SERVICES LLC</p>
                        <p className="trn">TRN: {data.trn}</p>
                    </div>
                    <div className="header-right">
                        <h2>Tax Invoice</h2>
                        <p className="invoice-number">{data.number}</p>
                        <p className="date">{data.date}</p>
                    </div>
                </div>

                {/* Bill To */}
                <div className="bill-to">
                    <h3>Bill To</h3>
                    <p className="customer-name">{data.customer.name}</p>
                    <p className="customer-trn">TRN: {data.customer.trn}</p>
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
                        {data.items.map((item, idx) => (
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
                            <span>{data.totals.subtotal}</span>
                        </div>
                        <div className="total-row">
                            <span>VAT (5%)</span>
                            <span>{data.totals.vat}</span>
                        </div>
                        <div className="total-row grand">
                            <span>Grand Total</span>
                            <span>AED {data.totals.grandTotal}</span>
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
