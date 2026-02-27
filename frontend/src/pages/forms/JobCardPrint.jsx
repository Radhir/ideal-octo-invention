import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Printer, FileDown, Image } from 'lucide-react';
import api from '../../api/axios';
import { useExport } from '../../utils/useExport';
import './SharedPrintTemplate.css';

const JobCardPrint = ({ jobCardData: propData }) => {
    const { id } = useParams();
    const [data, setData] = useState(propData || null);
    const [loading, setLoading] = useState(!propData);
    const { exportToPDF, exportToJPG } = useExport();

    useEffect(() => {
        if (!propData && id) {
            fetchJobCard();
        }
    }, [id, propData]);

    const fetchJobCard = async () => {
        try {
            const res = await api.get(`/api/job-cards/api/jobs/${id}/`);
            const jc = res.data;
            setData({
                id: jc.job_card_number || `JC-${jc.id}`,
                date: jc.date,
                customer: {
                    name: jc.customer_name,
                    phone: jc.phone,
                    address: jc.address || 'N/A'
                },
                vehicle: {
                    brand: jc.brand,
                    model: jc.model,
                    year: jc.year,
                    color: jc.color,
                    reg: jc.registration_number,
                    km: jc.kilometers
                },
                description: jc.job_description,
                inspection_notes: jc.initial_inspection_notes,
                financials: {
                    total: parseFloat(jc.total_amount || 0).toFixed(2),
                    vat: parseFloat(jc.vat_amount || 0).toFixed(2),
                    discount: parseFloat(jc.discount_amount || 0).toFixed(2),
                    net: parseFloat(jc.net_amount || 0).toFixed(2),
                    advance: parseFloat(jc.advance_amount || 0).toFixed(2),
                    balance: parseFloat(jc.balance_amount || 0).toFixed(2)
                }
            });
        } catch (err) {
            console.error('Error fetching job card:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '50px', textAlign: 'center', color: '#b08d57' }}>Loading Job Card...</div>;
    }

    const displayData = data || {
        id: "JC-0000",
        date: new Date().toISOString().split('T')[0],
        customer: { name: "", phone: "", address: "" },
        vehicle: { brand: "", model: "", year: "", color: "", reg: "", km: "" },
        description: "",
        financials: { total: "0.00", vat: "0.00", discount: "0.00", net: "0.00", advance: "0.00", balance: "0.00" }
    };

    return (
        <div className="shared-print-body">
            <div style={{ position: 'fixed', top: '20px', left: '0', width: '100%', zIndex: 1000 }} className="export-controls no-print">
                <button onClick={() => window.print()} className="print-btn" style={{ padding: '10px 20px', background: '#222', color: '#fff', border: '1px solid #d4af37', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Printer size={16} /> Print Native
                </button>
                <button onClick={() => exportToPDF('job-card-pdf-area', `JobCard_${displayData.id}.pdf`)} className="print-btn" style={{ padding: '10px 20px', background: '#222', color: '#d4af37', border: '1px solid #d4af37', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileDown size={16} /> Export PDF
                </button>
                <button onClick={() => exportToJPG('job-card-pdf-area', `JobCard_${displayData.id}.jpg`)} className="print-btn" style={{ padding: '10px 20px', background: '#222', color: '#d4af37', border: '1px solid #d4af37', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Image size={16} /> Export JPG
                </button>
            </div>

            <div id="job-card-pdf-area" className="document-container">
                <div className="content-wrapper">

                    <header className="print-header">
                        <div className="print-logo">
                            Elite Shine
                            <span>GROUP OF COMPANIES</span>
                        </div>
                        <div className="doc-title">
                            <h2>Workshop Job Card</h2>
                            <p>#{displayData.id}</p>
                            <p style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '5px' }}>Date: {displayData.date}</p>
                        </div>
                    </header>

                    <section className="print-section">
                        <h3 className="section-title">Customer Details</h3>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Full Name</label>
                                <div className="form-control-static">{displayData.customer.name}</div>
                            </div>
                            <div className="form-group">
                                <label>Contact Number</label>
                                <div className="form-control-static">{displayData.customer.phone}</div>
                            </div>
                            <div className="form-group">
                                <label>Address / Email</label>
                                <div className="form-control-static">{displayData.customer.address}</div>
                            </div>
                        </div>
                    </section>

                    <section className="print-section">
                        <h3 className="section-title">Vehicle Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Brand</label>
                                <div className="form-control-static">{displayData.vehicle.brand}</div>
                            </div>
                            <div className="form-group">
                                <label>Model</label>
                                <div className="form-control-static">{displayData.vehicle.model}</div>
                            </div>
                            <div className="form-group">
                                <label>Year</label>
                                <div className="form-control-static">{displayData.vehicle.year}</div>
                            </div>
                            <div className="form-group">
                                <label>Color</label>
                                <div className="form-control-static">{displayData.vehicle.color}</div>
                            </div>
                            <div className="form-group">
                                <label>License Plate Number</label>
                                <div className="form-control-static">{displayData.vehicle.reg}</div>
                            </div>
                            <div className="form-group">
                                <label>Mileage (KM)</label>
                                <div className="form-control-static">{displayData.vehicle.km}</div>
                            </div>
                        </div>
                    </section>

                    <section className="print-section">
                        <h3 className="section-title">Job Instructions</h3>
                        <div style={{
                            padding: '20px',
                            border: '1px solid #333',
                            background: '#1a1a1a',
                            color: '#ccc',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'Lato, sans-serif'
                        }}>
                            {displayData.description || "No specific instructions provided."}
                        </div>
                    </section>

                    <section className="print-section">
                        <h3 className="section-title">Financial Summary</h3>
                        <div className="financial-rows">
                            <div className="fin-row">
                                <span>Subtotal:</span>
                                <span>AED {displayData.financials.total}</span>
                            </div>
                            <div className="fin-row">
                                <span>VAT (5%):</span>
                                <span>AED {displayData.financials.vat}</span>
                            </div>
                            <div className="fin-row">
                                <span>Discount:</span>
                                <span>AED {displayData.financials.discount}</span>
                            </div>
                            <div className="fin-row grand-total">
                                <span>Total Amount:</span>
                                <span>AED {displayData.financials.net}</span>
                            </div>
                            <div className="fin-row" style={{ marginTop: '10px' }}>
                                <span>Advance Paid:</span>
                                <span>AED {displayData.financials.advance}</span>
                            </div>
                            <div className="fin-row" style={{ color: '#da3e3e' }}>
                                <span>Balance Remaining:</span>
                                <span>AED {displayData.financials.balance}</span>
                            </div>
                        </div>
                    </section>

                    <div className="signatures-row">
                        <div className="signature-block">
                            <div className="signature-line"></div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--print-gold)' }}>CUSTOMER SIGNATURE</p>
                            <p style={{ fontSize: '0.7rem', color: '#666' }}>I authorize the repair work herein set forth to be done along with the necessary material.</p>
                        </div>
                        <div className="signature-block">
                            <div className="signature-line"></div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--print-gold)' }}>SERVICE ADVISOR</p>
                            <p style={{ fontSize: '0.7rem', color: '#666' }}>Elite Shine Group</p>
                        </div>
                    </div>

                    <div className="page-break"></div>

                    <section className="print-section">
                        <h3 className="section-title">Job Card Terms & Conditions</h3>
                        <ol className="terms-list">
                            <li>
                                <span className="term-title">1. Authorization</span>
                                <p>I hereby authorize the above repair work to be done along with the necessary materials. You and your employees may operate the vehicle for purposes of testing, inspection or delivery at my risk.</p>
                            </li>
                            <li>
                                <span className="term-title">2. Valuables</span>
                                <p>Elite Shine will not be held responsible for loss or damage to the vehicle or articles left in the vehicle in case of fire, theft or any other cause beyond our control.</p>
                            </li>
                            <li>
                                <span className="term-title">3. Estimate Changes</span>
                                <p>The initial estimate is an approximation. If further damage or required parts are discovered during repair, the customer will be notified of any additional costs.</p>
                            </li>
                            <li>
                                <span className="term-title">4. Payment & Delivery</span>
                                <p>All charges must be paid in full upon delivery of the vehicle. Vehicles left for more than 3 days after completion may incur storage charges.</p>
                            </li>
                        </ol>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default JobCardPrint;
