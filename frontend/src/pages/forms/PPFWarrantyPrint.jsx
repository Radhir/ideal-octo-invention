import React, { useState } from 'react';
import { Printer } from 'lucide-react';
import './PPFWarrantyPrint.css';

const PPFWarrantyForm = ({ jobCardData }) => {
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

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="warranty-form-container">
            {/* Print Button */}
            <div className="print-controls no-print">
                <button onClick={handlePrint} className="print-btn">
                    <Printer size={16} /> Print Warranty
                </button>
            </div>

            {/* Main Document Sheet */}
            <div className="warranty-document">

                {/* HEADER */}
                <div className="warranty-header">
                    <h1>Elite SHINE</h1>
                    <h2>Paint Protection Film (PPF) Warranty Registration Form</h2>
                </div>

                {/* FORM GRID */}
                <div className="warranty-form-grid">

                    {/* Customer Details */}
                    <div className="form-section">
                        <h3>Customer Details</h3>
                        <div className="form-fields">
                            <div className="form-field">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    placeholder="Customer Name"
                                />
                            </div>
                            <div className="form-field">
                                <label>Contact Number</label>
                                <input
                                    type="text"
                                    value={formData.contactNumber}
                                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                    placeholder="+971..."
                                />
                            </div>
                            <div className="form-field">
                                <label>Invoice Number</label>
                                <input
                                    type="text"
                                    value={formData.invoiceNumber}
                                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                                />
                            </div>
                            <div className="form-field">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Information */}
                    <div className="form-section">
                        <h3>Vehicle Information</h3>
                        <div className="form-fields">
                            <div className="form-row">
                                <div className="form-field">
                                    <label>Brand</label>
                                    <input type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
                                </div>
                                <div className="form-field">
                                    <label>Model</label>
                                    <input type="text" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-field">
                                    <label>Year</label>
                                    <input type="text" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
                                </div>
                                <div className="form-field">
                                    <label>Color</label>
                                    <input type="text" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-field">
                                <label>License Plate</label>
                                <input type="text" value={formData.plateNumber} onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })} />
                            </div>
                            <div className="form-field">
                                <label>VIN</label>
                                <input type="text" value={formData.vin} onChange={(e) => setFormData({ ...formData, vin: e.target.value })} placeholder="XXXXXXXXXXXXXXXXX" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* INSTALLATION DETAILS */}
                <div className="form-section installation-details">
                    <h3>PPF Installation Details</h3>

                    <div className="installation-grid">
                        <div className="form-field">
                            <label>Date of Installation</label>
                            <input type="date" value={formData.installDate} onChange={(e) => setFormData({ ...formData, installDate: e.target.value })} />
                        </div>

                        <div className="form-field">
                            <label>Branch Location</label>
                            <div className="radio-group">
                                <label>
                                    <input type="radio" name="branch" checked={formData.branch === "Ras Al Khor"} onChange={() => setFormData({ ...formData, branch: "Ras Al Khor" })} /> Ras Al Khor
                                </label>
                                <label>
                                    <input type="radio" name="branch" checked={formData.branch === "Al Quoz"} onChange={() => setFormData({ ...formData, branch: "Al Quoz" })} /> Al Quoz
                                </label>
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Type of Film</label>
                            <div className="checkbox-grid">
                                {["Gloss (PPF)", "Matte (PPF)", "Satin (PPF)", "Vinyl Wrap", "Color PPF"].map((type) => (
                                    <label key={type}>
                                        <input type="radio" name="filmType" checked={formData.filmType === type} onChange={() => setFormData({ ...formData, filmType: type })} /> {type}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Coverage Area</label>
                            <div className="checkbox-grid">
                                {["Full Body", "Full Front", "Partial", "Custom", "Other"].map((area) => (
                                    <label key={area}>
                                        <input type="radio" name="coverage" checked={formData.coverage === area} onChange={() => setFormData({ ...formData, coverage: area })} /> {area}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SERVICE HISTORY TABLE */}
                <div className="service-history">
                    <h3>Service History</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Service Details</th>
                                <th>Date</th>
                                <th>Service Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1st Check up</td>
                                <td>{new Date(new Date(formData.installDate).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</td>
                                <td className="service-note">A post-installation inspection is mandatory. The customer must return within 7 days after installation for a check-up to ensure proper curing and film condition.</td>
                            </tr>
                            {[2, 3, 4, 5].map((num) => (
                                <tr key={num}>
                                    <td>{num === 2 ? "2nd" : num === 3 ? "3rd" : `${num}th`} Check up</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* SIGNATURE */}
                <div className="signature-section">
                    <div className="signature-box">
                        <div className="signature-line">Anish Azeez</div>
                        <p className="signature-title">Service Advisor</p>
                    </div>
                </div>

                {/* PAGE BREAK FOR TERMS */}
                <div className="page-break"></div>

                {/* TERMS & CONDITIONS */}
                <div className="terms-section">
                    <h3>Warranty Terms & Conditions</h3>

                    <div className="terms-grid">
                        <div>
                            <h4>1. Inspection & Acceptance</h4>
                            <p>The customer must inspect the vehicle at the time of delivery. Any concerns about the PPF installation must be raised immediately. Once the vehicle leaves the premises, it is considered accepted in good condition.</p>

                            <h4>2. Curing Period</h4>
                            <ul>
                                <li>PPF requires 7-10 days to fully cure. Minor haziness or small water bubbles may appear and will settle naturally.</li>
                                <li>Do not wash, wax, or apply pressure to the film during curing.</li>
                            </ul>

                            <h4>3. Maintenance Responsibility</h4>
                            <ul>
                                <li>Regular washing and care are the customer's responsibility.</li>
                                <li>Avoid harsh chemicals, abrasive cleaners, or automatic car washes with brushes.</li>
                            </ul>
                        </div>

                        <div>
                            <h4>4. Warranty Coverage</h4>
                            <ul>
                                <li>Covers film defects: yellowing, cracking, or peeling within manufacturer's period.</li>
                                <li>Does NOT cover damage from accidents, misuse, improper cleaning, or external factors.</li>
                                <li>Third-party modifications void the warranty.</li>
                            </ul>

                            <h4>5. After-Job Support</h4>
                            <ul>
                                <li>Free inspection within 7 days after installation.</li>
                                <li>Small adjustments or re-fittings (installation-related) are free within this period.</li>
                            </ul>

                            <h4>6. Exclusions</h4>
                            <p>PPF protects against minor scratches but is not 100% damage-proof. Deep scratches, accidents, or intentional damage are not covered. Warranty is non-transferable.</p>

                            <h4>7. Film Removal</h4>
                            <p>Removal must be done by our trained team. Third-party removal may damage paint and void warranty.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PPFWarrantyForm;
