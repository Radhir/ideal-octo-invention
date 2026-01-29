import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { ArrowLeft, Printer, Download, Clock, User, Car, FileText, CheckCircle } from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';
import SignaturePad from '../../components/SignaturePad';

const EstimateDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [estimate, setEstimate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEstimate();
    }, [id]);

    const fetchEstimate = async () => {
        try {
            // Estimates are actually Job Cards in the early stages
            const res = await axios.get(`/forms/job-cards/api/jobs/${id}/`);
            setEstimate(res.data);
        } catch (err) {
            console.error('Error fetching estimate', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center', color: '#fff' }}>Loading Quotation...</div>;
    if (!estimate) return <div style={{ padding: '50px', textAlign: 'center', color: '#fff' }}>Quotation Not Found</div>;

    return (
        <div style={{ padding: '30px 20px' }}>
            <PrintHeader title="Professional Quotation" />

            <header className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '12px', cursor: 'pointer', color: '#fff' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', margin: 0 }}>Quotation Detail</h1>
                        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Reference: {estimate.job_card_number}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => window.print()}
                        className="glass-card"
                        style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                    >
                        <Printer size={18} /> Print Quotation
                    </button>
                    <button
                        onClick={() => navigate(`/job-cards/${id}`)}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <FileText size={18} /> View Job Card
                    </button>
                </div>
            </header>

            <GlassCard className="printable-quotation" style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
                    <div>
                        <h4 style={sectionLabelStyle}>Client Details</h4>
                        <div style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '5px' }}>{estimate.customer_name}</div>
                        <div style={{ color: '#94a3b8', fontSize: '14px' }}>{estimate.phone}</div>
                        <div style={{ color: '#64748b', fontSize: '12px', marginTop: '5px' }}>{estimate.address}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h4 style={sectionLabelStyle}>Vehicle Information</h4>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{estimate.brand} {estimate.model} ({estimate.year})</div>
                        <div style={{ color: '#b08d57', fontWeight: '800' }}>{estimate.registration_number}</div>
                        <div style={{ color: '#94a3b8', fontSize: '13px' }}>VIN: {estimate.vin}</div>
                    </div>
                </div>

                <div style={{ marginBottom: '40px' }}>
                    <h4 style={sectionLabelStyle}>Proposed Services & Scope</h4>
                    <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        padding: '25px',
                        borderRadius: '15px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        color: '#fff',
                        fontSize: '15px',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {estimate.job_description}
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid rgba(176, 141, 87, 0.2)', background: 'rgba(176, 141, 87, 0.05)' }}>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', color: '#b08d57' }}>SERVICE DESCRIPTION</th>
                            <th style={{ padding: '15px', textAlign: 'right', fontSize: '12px', color: '#b08d57' }}>ESTIMATED TOTAL (AED)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '20px 15px', color: '#f8fafc' }}>
                                <div style={{ fontWeight: '700' }}>Comprehensive Service Estimate</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '5px' }}>As per initial inspection and client requirements</div>
                            </td>
                            <td style={{ padding: '20px 15px', textAlign: 'right', fontWeight: '800', fontSize: '1.1rem', color: '#fff' }}>
                                {estimate.total_amount}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ color: '#94a3b8' }}>Subtotal (Net)</span>
                            <span style={{ color: '#fff' }}>AED {estimate.total_amount}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ color: '#94a3b8' }}>VAT (5%)</span>
                            <span style={{ color: '#fff' }}>AED {estimate.vat_amount}</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingTop: '15px',
                            marginTop: '15px',
                            borderTop: '2px solid rgba(176, 141, 87, 0.3)',
                            fontSize: '1.4rem',
                            fontWeight: '900',
                            color: '#b08d57'
                        }}>
                            <span>GRAND TOTAL</span>
                            <span>AED {estimate.net_amount}</span>
                        </div>
                    </div>
                </div>

                {/* Signature Section - Quotation Acceptance */}
                <div style={{ marginTop: '50px', borderTop: '1px solid rgba(176, 141, 87, 0.2)', paddingTop: '30px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        <div>
                            <h4 style={sectionLabelStyle}>Client Acceptance</h4>
                            <p style={{ color: '#64748b', fontSize: '11px', marginBottom: '15px' }}>
                                I hereby accept this quotation and authorize Elite Shine to proceed with the services listed above.
                            </p>
                            {estimate.signature_data ? (
                                <div style={{ background: '#fff', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                                    <img src={estimate.signature_data} alt="Accepted Signature" style={{ maxHeight: '60px' }} />
                                    <p style={{ color: '#000', fontSize: '10px', marginTop: '5px', fontWeight: '800' }}>ACCEPTED & AUTHORIZED</p>
                                </div>
                            ) : (
                                <div className="no-print">
                                    <SignaturePad
                                        title="Sign to Accept Quotation"
                                        onSave={async (data) => {
                                            try {
                                                await axios.patch(`/forms/job-cards/api/jobs/${id}/`, { signature_data: data });
                                                setEstimate({ ...estimate, signature_data: data });
                                                alert('Quotation Accepted!');
                                            } catch (err) {
                                                alert('Failed to save signature');
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={sectionLabelStyle}>Authorized Representative</h4>
                                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', height: '40px', width: '200px', marginLeft: 'auto' }}></div>
                                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '5px' }}>{estimate.service_advisor || 'Elite Shine Manager'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                    <h4 style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748b', marginBottom: '10px' }}>Terms & Conditions</h4>
                    <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>
                        1. This quotation is valid for 7 days from the date of issue.<br />
                        2. Final costs may vary based on additional findings during service.<br />
                        3. All parts and labor are subject to availability.
                    </p>
                </div>
            </GlassCard>

            <style>{`
                @media print {
                    body { background: #fff !important; color: #000 !important; }
                    .printable-quotation { 
                        background: #fff !important; 
                        color: #000 !important; 
                        border: 1px solid #eee !important; 
                        box-shadow: none !important; 
                        max-width: 100% !important; 
                        margin: 0 !important;
                        padding: 20px !important;
                    }
                    .printable-quotation * { color: #000 !important; }
                    .printable-quotation h4 { color: #b08d57 !important; }
                    .printable-quotation div[style*="background"] { background: #fafafa !important; border-color: #eee !important; }
                    .no-print, header, button { display: none !important; }
                }
            `}</style>
        </div>
    );
};

const sectionLabelStyle = {
    fontSize: '10px',
    textTransform: 'uppercase',
    color: '#b08d57',
    marginBottom: '10px',
    letterSpacing: '1px',
    fontWeight: '800'
};

export default EstimateDetail;
