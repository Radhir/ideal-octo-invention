import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Printer, Car, User, FileText } from 'lucide-react';
import api from '../../api/axios';
import './JobCardPrint.css';

const JobCardPrint = ({ jobCardData: propData }) => {
    const { id } = useParams();
    const [data, setData] = useState(propData || null);
    const [loading, setLoading] = useState(!propData);

    useEffect(() => {
        if (!propData && id) {
            fetchJobCard();
        }
    }, [id, propData]);

    const fetchJobCard = async () => {
        try {
            const res = await api.get(`/forms/job-cards/api/jobs/${id}/`);
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
        <div className="job-card-print-container" style={{ maxWidth: '210mm', margin: '0 auto', background: 'white', color: 'black' }}>
            <div className="print-controls no-print">
                <button onClick={() => window.print()} className="print-btn">
                    <Printer size={16} /> Print Job Card
                </button>
            </div>

            <div className="job-card-document">
                {/* Header */}
                <div className="job-card-header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '20px', marginBottom: '30px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '28px', textTransform: 'uppercase' }}>Elite SHINE</h1>
                        <p style={{ margin: 0, fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase' }}>CAR POLISH SERVICES LLC</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={{ margin: 0, fontSize: '18px', textTransform: 'uppercase' }}>Job Card</h2>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>#{displayData.id}</p>
                        <p style={{ margin: 0, fontSize: '12px' }}>{displayData.date}</p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="info-grid">
                    {/* Customer Info */}
                    <div className="info-section">
                        <div className="section-header">
                            <User size={18} />
                            <h3>Customer Information</h3>
                        </div>
                        <div className="info-fields">
                            <div className="field-row">
                                <label>Name</label>
                                <div className="field-value">{displayData.customer.name}</div>
                            </div>
                            <div className="field-row">
                                <label>Phone</label>
                                <div className="field-value">{displayData.customer.phone}</div>
                            </div>
                            <div className="field-row">
                                <label>Address</label>
                                <div className="field-value">{displayData.customer.address || "N/A"}</div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Info */}
                    <div className="info-section">
                        <div className="section-header">
                            <Car size={18} />
                            <h3>Vehicle Details</h3>
                        </div>
                        <div className="vehicle-grid">
                            <div className="field-col">
                                <label>Brand</label>
                                <div className="field-value">{displayData.vehicle.brand}</div>
                            </div>
                            <div className="field-col">
                                <label>Model</label>
                                <div className="field-value">{displayData.vehicle.model}</div>
                            </div>
                            <div className="field-col">
                                <label>Reg #</label>
                                <div className="field-value">{displayData.vehicle.reg}</div>
                            </div>
                            <div className="field-col">
                                <label>KM</label>
                                <div className="field-value">{displayData.vehicle.km}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                    {/* Job Description */}
                    <div className="job-description">
                        <div className="section-header">
                            <FileText size={18} />
                            <h3>Job Description</h3>
                        </div>
                        <div className="description-field" style={{ whiteSpace: 'pre-wrap', padding: '15px', background: '#f9f9f9', borderRadius: '8px', minHeight: '80px', fontSize: '13px' }}>
                            {displayData.description}
                        </div>
                    </div>

                    {/* Inspection Notes */}
                    <div className="job-description">
                        <div className="section-header">
                            <FileText size={18} />
                            <h3>Internal Inspection Notes</h3>
                        </div>
                        <div className="description-field" style={{ whiteSpace: 'pre-wrap', padding: '15px', background: '#f9f9f9', borderRadius: '8px', minHeight: '80px', fontSize: '13px' }}>
                            {displayData.inspection_notes || "No internal notes provided."}
                        </div>
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="financial-summary-container">
                    <div className="financial-summary">
                        <div className="summary-header">Financial Summary</div>
                        <div className="summary-rows">
                            <div className="summary-row"><span>Total</span> <span>{displayData.financials.total}</span></div>
                            <div className="summary-row"><span>VAT</span> <span>{displayData.financials.vat}</span></div>
                            <div className="summary-row discount"><span>Discount</span> <span>{displayData.financials.discount}</span></div>
                            <div className="summary-divider"></div>
                            <div className="summary-row net"><span>Net</span> <span>{displayData.financials.net}</span></div>
                            <div className="summary-row advance"><span>Advance</span> <span>{displayData.financials.advance}</span></div>
                            <div className="summary-row balance"><span>Balance</span> <span>{displayData.financials.balance}</span></div>
                        </div>
                    </div>
                </div>

                {/* Signature */}
                <div className="signature-section">
                    <div className="signature-box">
                        <div className="signature-line"></div>
                        <p>Customer Signature</p>
                    </div>
                    <div className="signature-box">
                        <div className="signature-line"></div>
                        <p>Advisor Signature</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobCardPrint;
