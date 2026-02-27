import React, { useState } from 'react';
import { Printer, FileDown, Image } from 'lucide-react';
import { useExport } from '../../utils/useExport';
import './SharedPrintTemplate.css';

const PPFWarrantyPrint = ({ jobCardData }) => {
    const [formData, setFormData] = useState({
        customerName: jobCardData?.customer_name || "",
        contactNumber: jobCardData?.phone || "",
        invoiceNumber: jobCardData?.invoice?.invoice_number || "",
        email: jobCardData?.customer_profile?.email || "",

        brand: jobCardData?.brand || "",
        model: jobCardData?.model || "",
        year: jobCardData?.year || "",
        color: jobCardData?.color || "",
        plateNumber: jobCardData?.registration_number || "",
        vin: jobCardData?.vin || "",

        installDate: jobCardData?.date || new Date().toISOString().split('T')[0],
        branch: "Ras Al Khor",
        filmBrand: "",
        filmType: "Gloss (PPF)",
        coverage: "Full Body",
    });

    const { exportToPDF, exportToJPG } = useExport();

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="shared-print-body">
            <div style={{ position: 'fixed', top: '20px', left: '0', width: '100%', zIndex: 1000 }} className="export-controls no-print">
                <button onClick={handlePrint} className="print-btn" style={{ padding: '10px 20px', background: '#222', color: '#fff', border: '1px solid #d4af37', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Printer size={16} /> Print Native
                </button>
                <button onClick={() => exportToPDF('warranty-pdf-area', `Warranty_${formData.invoiceNumber || 'Registration'}.pdf`)} className="print-btn" style={{ padding: '10px 20px', background: '#222', color: '#d4af37', border: '1px solid #d4af37', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileDown size={16} /> Export PDF
                </button>
                <button onClick={() => exportToJPG('warranty-pdf-area', `Warranty_${formData.invoiceNumber || 'Registration'}.jpg`)} className="print-btn" style={{ padding: '10px 20px', background: '#222', color: '#d4af37', border: '1px solid #d4af37', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Image size={16} /> Export JPG
                </button>
            </div>

            <div id="warranty-pdf-area" className="document-container">
                <div className="content-wrapper">

                    <header className="print-header">
                        <div className="print-logo">
                            Elite Shine
                            <span>GROUP OF COMPANIES</span>
                        </div>
                        <div className="doc-title">
                            <h2>Warranty Registration</h2>
                            <p>Paint Protection Film (PPF)</p>
                        </div>
                    </header>

                    <section className="print-section">
                        <h3 className="section-title">Customer Details</h3>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Full Name</label>
                                <input type="text" className="form-control-static" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} style={{ borderBottom: '1px solid #444', outline: 'none' }} />
                            </div>
                            <div className="form-group">
                                <label>Contact Number</label>
                                <input type="text" className="form-control-static" value={formData.contactNumber} onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} style={{ borderBottom: '1px solid #444', outline: 'none' }} />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" className="form-control-static" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ borderBottom: '1px solid #444', outline: 'none' }} />
                            </div>
                            <div className="form-group">
                                <label>Invoice Number</label>
                                <input type="text" className="form-control-static" value={formData.invoiceNumber} onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })} style={{ borderBottom: '1px solid #444', outline: 'none' }} />
                            </div>
                        </div>
                    </section>

                    <section className="print-section">
                        <h3 className="section-title">Vehicle Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Brand</label>
                                <input type="text" className="form-control-static" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} style={{ borderBottom: '1px solid #444', outline: 'none' }} />
                            </div>
                            <div className="form-group">
                                <label>Model</label>
                                <input type="text" className="form-control-static" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} style={{ borderBottom: '1px solid #444', outline: 'none' }} />
                            </div>
                            <div className="form-group">
                                <label>Year</label>
                                <input type="text" className="form-control-static" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} style={{ borderBottom: '1px solid #444', outline: 'none' }} />
                            </div>
                            <div className="form-group">
                                <label>Color</label>
                                <input type="text" className="form-control-static" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} style={{ borderBottom: '1px solid #444', outline: 'none' }} />
                            </div>
                            <div className="form-group">
                                <label>License Plate Number</label>
                                <input type="text" className="form-control-static" value={formData.plateNumber} onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })} style={{ borderBottom: '1px solid #444', outline: 'none' }} />
                            </div>
                            <div className="form-group">
                                <label>VIN (Vehicle Identification Number)</label>
                                <input type="text" className="form-control-static" value={formData.vin} onChange={(e) => setFormData({ ...formData, vin: e.target.value })} style={{ borderBottom: '1px solid #444', outline: 'none' }} />
                            </div>
                        </div>
                    </section>

                    <section className="print-section">
                        <h3 className="section-title">PPF Installation Details</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Date of Installation</label>
                                <input type="date" className="form-control-static" value={formData.installDate} onChange={(e) => setFormData({ ...formData, installDate: e.target.value })} style={{ borderBottom: '1px solid #444', outline: 'none', colorScheme: 'dark' }} />
                            </div>

                            <div className="form-group">
                                <label>Branch Location</label>
                                <div className="checkbox-group">
                                    <label className="custom-checkbox" onClick={() => setFormData({ ...formData, branch: "Ras Al Khor" })} style={{ cursor: 'pointer' }}>
                                        <div className={`check-box ${formData.branch === "Ras Al Khor" ? 'checked' : ''}`}></div> Ras Al Khor
                                    </label>
                                    <label className="custom-checkbox" onClick={() => setFormData({ ...formData, branch: "Al Quoz" })} style={{ cursor: 'pointer' }}>
                                        <div className={`check-box ${formData.branch === "Al Quoz" ? 'checked' : ''}`}></div> Al Quoz
                                    </label>
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Type of Film</label>
                                <div className="checkbox-group">
                                    {["Gloss (PPF)", "Matte (PPF)", "Satin (PPF)", "Vinyl Wrap", "Color PPF"].map((type) => (
                                        <label key={type} className="custom-checkbox" onClick={() => setFormData({ ...formData, filmType: type })} style={{ cursor: 'pointer' }}>
                                            <div className={`check-box ${formData.filmType === type ? 'checked' : ''}`}></div> {type}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Coverage Area</label>
                                <div className="checkbox-group">
                                    {["Full Body", "Full Front", "Partial", "Custom"].map((area) => (
                                        <label key={area} className="custom-checkbox" onClick={() => setFormData({ ...formData, coverage: area })} style={{ cursor: 'pointer' }}>
                                            <div className={`check-box ${formData.coverage === area ? 'checked' : ''}`}></div> {area}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="print-section">
                        <h3 className="section-title">Service History</h3>
                        <table className="service-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '25%' }}>Service Details</th>
                                    <th style={{ width: '20%' }}>Date</th>
                                    <th>Service Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1st Check up</td>
                                    <td>
                                        <input type="date" className="form-control-static" style={{ border: 'none' }} value={new Date(new Date(formData.installDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} readOnly />
                                    </td>
                                    <td>Post installation inspection mandatory. Check for bubbles/edges.</td>
                                </tr>
                                <tr>
                                    <td>2nd Check up</td>
                                    <td><input type="date" className="form-control-static" style={{ border: 'none' }} /></td>
                                    <td><input type="text" className="form-control-static" style={{ border: 'none', width: '100%' }} /></td>
                                </tr>
                                <tr>
                                    <td>3rd Check up</td>
                                    <td><input type="date" className="form-control-static" style={{ border: 'none' }} /></td>
                                    <td><input type="text" className="form-control-static" style={{ border: 'none', width: '100%' }} /></td>
                                </tr>
                                <tr>
                                    <td>4th Check up</td>
                                    <td><input type="date" className="form-control-static" style={{ border: 'none' }} /></td>
                                    <td><input type="text" className="form-control-static" style={{ border: 'none', width: '100%' }} /></td>
                                </tr>
                                <tr>
                                    <td>5th Check up</td>
                                    <td><input type="date" className="form-control-static" style={{ border: 'none' }} /></td>
                                    <td><input type="text" className="form-control-static" style={{ border: 'none', width: '100%' }} /></td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="advisor-section">
                            <div className="signature-block">
                                <div className="signature-line"></div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--print-gold)' }}>ANISH AZEEZ</p>
                                <p style={{ fontSize: '0.7rem', color: '#666' }}>Service Advisor</p>
                            </div>
                        </div>
                    </section>

                    <div className="page-break"></div>

                    <section className="print-section">
                        <h3 className="section-title">Warranty Terms & Conditions</h3>
                        <ol className="terms-list">
                            <li>
                                <span className="term-title">1. Inspection & Acceptance</span>
                                <ul className="terms-sub-list">
                                    <li>The customer must inspect the vehicle at the time of delivery. Any concerns about the PPF installation (alignment, bubbles, edges, etc.) must be raised immediately.</li>
                                    <li>Once the vehicle leaves the premises, it is considered accepted in good condition unless otherwise noted.</li>
                                </ul>
                            </li>
                            <li>
                                <span className="term-title">2. Curing Period</span>
                                <ul className="terms-sub-list">
                                    <li>PPF requires 7-10 days (depending on weather conditions) to fully cure. During this period, minor haziness, small water bubbles, or slight lifting may appear and will settle naturally.</li>
                                    <li>Customers are advised not to wash, wax, or apply pressure to the film during the curing period.</li>
                                </ul>
                            </li>
                            <li>
                                <span className="term-title">3. Maintenance Responsibility</span>
                                <ul className="terms-sub-list">
                                    <li>Regular washing and care of the vehicle are the customer's responsibility.</li>
                                    <li>Avoid using harsh chemicals, abrasive cleaners, or automatic car washes with brushes, as they may damage the film.</li>
                                </ul>
                            </li>
                            <li>
                                <span className="term-title">4. Warranty Coverage</span>
                                <ul className="terms-sub-list">
                                    <li>Warranty applies only to film defects such as yellowing, cracking, or peeling within the manufacturer's warranty period.</li>
                                    <li>Warranty does not cover damage caused by accidents, misuse, improper cleaning, natural wear and tear, or external factors such as stone chips beyond the film's capacity.</li>
                                    <li>Any modification or removal of the film by a third party will void the warranty.</li>
                                </ul>
                            </li>
                            <li>
                                <span className="term-title">5. After-Job Support</span>
                                <ul className="terms-sub-list">
                                    <li>Customers may return for a free inspection within 7 days after installation to ensure proper curing.</li>
                                    <li>Small adjustments or re-fittings (if required and deemed installation-related) will be corrected free of charge within this period.</li>
                                </ul>
                            </li>
                            <li>
                                <span className="term-title">6. Exclusions</span>
                                <ul className="terms-sub-list">
                                    <li>PPF is designed to protect against minor scratches and stone chips but does not make the vehicle 100% damage-proof.</li>
                                    <li>Deep scratches, accidents, intentional damage, or improper maintenance are not covered under warranty.</li>
                                </ul>
                            </li>
                            <li>
                                <span className="term-title">7. Film Removal</span>
                                <p style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '5px' }}>If removal is required, it must be carried out by our trained team. Any removal attempted by a third party may damage the paint and void the warranty.</p>
                            </li>
                        </ol>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default PPFWarrantyPrint;
