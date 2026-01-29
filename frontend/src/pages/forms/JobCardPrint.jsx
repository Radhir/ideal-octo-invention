import React, { useState } from 'react';
import { Printer, Car, User, FileText } from 'lucide-react';
import './JobCardPrint.css';

const JobCardPrint = ({ jobCardData }) => {
    const data = jobCardData || {
        id: "JC-9999",
        date: new Date().toISOString().split('T')[0],
        customer: { name: "", phone: "", address: "" },
        vehicle: { brand: "", model: "", year: "", color: "", reg: "", km: "" },
        description: "",
        financials: { total: "0.00", vat: "0.00", discount: "0.00", net: "0.00", advance: "0.00", balance: "0.00" }
    };

    return (
        <div className="job-card-print-container">
            <div className="print-controls no-print">
                <button onClick={() => window.print()} className="print-btn">
                    <Printer size={16} /> Print Job Card
                </button>
            </div>

            <div className="job-card-document">
                {/* Header */}
                <div className="job-card-header">
                    <div>
                        <h1>Elite SHINE</h1>
                        <p className="subtitle">CAR POLISH SERVICES LLC</p>
                    </div>
                    <div className="header-right">
                        <h2>Workshop Job Card</h2>
                        <p className="job-id">#{data.id}</p>
                        <p className="date">{data.date}</p>
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
                                <div className="field-value">{data.customer.name}</div>
                            </div>
                            <div className="field-row">
                                <label>Phone</label>
                                <div className="field-value">{data.customer.phone}</div>
                            </div>
                            <div className="field-row">
                                <label>Address</label>
                                <div className="field-value">{data.customer.address || "N/A"}</div>
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
                                <div className="field-value">{data.vehicle.brand}</div>
                            </div>
                            <div className="field-col">
                                <label>Model</label>
                                <div className="field-value">{data.vehicle.model}</div>
                            </div>
                            <div className="field-col">
                                <label>Reg #</label>
                                <div className="field-value">{data.vehicle.reg}</div>
                            </div>
                            <div className="field-col">
                                <label>KM</label>
                                <div className="field-value">{data.vehicle.km}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Job Description */}
                <div className="job-description">
                    <div className="section-header">
                        <FileText size={18} />
                        <h3>Job Description</h3>
                    </div>
                    <textarea
                        className="description-field"
                        defaultValue={data.description}
                        readOnly={!!jobCardData}
                    />
                </div>

                {/* Financial Summary */}
                <div className="financial-summary-container">
                    <div className="financial-summary">
                        <div className="summary-header">Financial Summary</div>
                        <div className="summary-rows">
                            <div className="summary-row"><span>Total</span> <span>{data.financials.total}</span></div>
                            <div className="summary-row"><span>VAT</span> <span>{data.financials.vat}</span></div>
                            <div className="summary-row discount"><span>Discount</span> <span>{data.financials.discount}</span></div>
                            <div className="summary-divider"></div>
                            <div className="summary-row net"><span>Net</span> <span>{data.financials.net}</span></div>
                            <div className="summary-row advance"><span>Advance</span> <span>{data.financials.advance}</span></div>
                            <div className="summary-row balance"><span>Balance</span> <span>{data.financials.balance}</span></div>
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
