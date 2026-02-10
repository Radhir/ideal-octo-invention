import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, Calendar, Car, Award, FileText, Printer } from 'lucide-react';
import './WarrantyPortalView.css';

const WarrantyPortalView = () => {
    const { token } = useParams();
    const [warranty, setWarranty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWarranty = async () => {
            try {
                const response = await fetch(`/forms/ppf/api/portal/${token}/`);
                if (!response.ok) throw new Error('Warranty not found');
                const data = await response.json();
                setWarranty(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchWarranty();
    }, [token]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="warranty-portal-loading">
                <div className="spinner"></div>
                <p>Loading warranty details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="warranty-portal-error">
                <Shield size={64} style={{ color: '#ef4444' }} />
                <h2>Warranty Not Found</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="warranty-portal-container">
            <div className="warranty-portal-header">
                <img src="/logo.png" alt="Elite Shine" className="warranty-logo" />
                <h1>PPF Warranty Certificate</h1>
                <p className="certificate-number">{warranty.certificate_number}</p>
            </div>

            <div className="warranty-portal-content">
                {/* Customer & Vehicle Info */}
                <div className="warranty-section">
                    <div className="section-header">
                        <Car size={24} />
                        <h3>Vehicle Information</h3>
                    </div>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="label">Owner</span>
                            <span className="value">{warranty.customer_name}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Vehicle</span>
                            <span className="value">{warranty.vehicle.brand} {warranty.vehicle.model} ({warranty.vehicle.year})</span>
                        </div>
                        <div className="info-item">
                            <span className="label">VIN</span>
                            <span className="value">{warranty.vehicle.vin}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">License Plate</span>
                            <span className="value">{warranty.vehicle.license_plate}</span>
                        </div>
                    </div>
                </div>

                {/* Warranty Details */}
                <div className="warranty-section">
                    <div className="section-header">
                        <Shield size={24} />
                        <h3>Warranty Details</h3>
                    </div>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="label">Installation Date</span>
                            <span className="value">{new Date(warranty.warranty.installation_date).toLocaleDateString()}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Duration</span>
                            <span className="value">{warranty.warranty.duration_years} Years</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Expiry Date</span>
                            <span className="value">{new Date(warranty.warranty.expiry_date).toLocaleDateString()}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Branch</span>
                            <span className="value">{warranty.warranty.branch}</span>
                        </div>
                    </div>
                </div>

                {/* Film Information */}
                <div className="warranty-section">
                    <div className="section-header">
                        <Award size={24} />
                        <h3>Film Specifications</h3>
                    </div>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="label">Film Brand</span>
                            <span className="value">{warranty.warranty.film_brand}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Film Type</span>
                            <span className="value">{warranty.warranty.film_type}</span>
                        </div>
                        {warranty.warranty.film_lot_number && (
                            <div className="info-item">
                                <span className="label">Lot Number</span>
                                <span className="value">{warranty.warranty.film_lot_number}</span>
                            </div>
                        )}
                        <div className="info-item">
                            <span className="label">Coverage</span>
                            <span className="value">{warranty.warranty.coverage_area}</span>
                        </div>
                    </div>
                </div>

                {/* Terms & Conditions */}
                <div className="warranty-section">
                    <div className="section-header">
                        <FileText size={24} />
                        <h3>Warranty Terms</h3>
                    </div>
                    <ul className="warranty-terms">
                        {warranty.terms.map((term, idx) => (
                            <li key={idx}>{term}</li>
                        ))}
                    </ul>
                </div>

                {/* QR Code */}
                {warranty.qr_code_url && (
                    <div className="warranty-qr-section">
                        <img src={warranty.qr_code_url} alt="Warranty QR Code" className="warranty-qr-code" />
                        <p className="qr-instruction">Scan to verify warranty</p>
                    </div>
                )}
            </div>

            <div className="warranty-portal-actions no-print">
                <button onClick={handlePrint} className="btn-print">
                    <Printer size={20} />
                    Print Certificate
                </button>
            </div>

            <div className="warranty-portal-footer">
                <p>Elite Shine Auto Detailing - Premium Paint Protection Film Installation</p>
                <p>For service inquiries, contact your installation branch</p>
            </div>
        </div>
    );
};

export default WarrantyPortalView;
