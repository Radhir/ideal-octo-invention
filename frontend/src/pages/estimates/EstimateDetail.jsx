import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, FileText, CheckCircle } from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';
import SignaturePad from '../../components/SignaturePad';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioTitle,
    PortfolioButton,
    PortfolioBackButton
} from '../../components/PortfolioComponents';

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
            const res = await api.get(`/api/job-cards/api/jobs/${id}/`);
            setEstimate(res.data);
        } catch (err) {
            console.error('Error fetching estimate', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <PortfolioPage>
            <div style={{ padding: '50px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.4)' }}>Loading Quotation...</div>
        </PortfolioPage>
    );

    if (!estimate) return (
        <PortfolioPage>
            <div style={{ padding: '50px', textAlign: 'center', color: '#f43f5e' }}>Quotation Not Found</div>
        </PortfolioPage>
    );

    return (
        <PortfolioPage breadcrumb="Sales Division / Estimates">
            <PrintHeader title="Professional Quotation" />

            <div className="no-print">
                <PortfolioBackButton onClick={() => navigate(-1)} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <PortfolioTitle
                        subtitle={`Reference: ${estimate.job_card_number}`}
                    >
                        Quotation Detail
                    </PortfolioTitle>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <PortfolioButton
                            variant="glass"
                            onClick={() => window.print()}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Printer size={18} /> Print Quotation
                        </PortfolioButton>
                        <PortfolioButton
                            variant="gold"
                            onClick={() => navigate(`/job-cards/${id}`)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <FileText size={18} /> View Job Card
                        </PortfolioButton>
                    </div>
                </div>
            </div>

            <PortfolioCard className="printable-quotation" style={{ padding: '50px', maxWidth: '900px', margin: '0 auto', border: '1px solid var(--gold)', boxShadow: '0 0 50px rgba(176,141,87,0.05)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '50px' }}>
                    <div>
                        <h4 style={sectionLabelStyle}>Client Details</h4>
                        <div style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '5px', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>{estimate.customer_name}</div>
                        <div style={{ color: 'var(--gold)', fontSize: '14px', fontWeight: '800' }}>{estimate.phone}</div>
                        <div style={{ color: 'rgba(232, 230, 227, 0.6)', fontSize: '12px', marginTop: '5px' }}>{estimate.address}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h4 style={sectionLabelStyle}>Vehicle Information</h4>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--cream)' }}>{estimate.brand} {estimate.model} ({estimate.year})</div>
                        <div style={{ color: 'var(--gold)', fontWeight: '800', fontSize: '16px', letterSpacing: '1px' }}>{estimate.registration_number}</div>
                        <div style={{ color: 'rgba(232, 230, 227, 0.6)', fontSize: '12px', marginTop: '5px' }}>VIN: {estimate.vin}</div>
                    </div>
                </div>

                <div style={{ marginBottom: '50px' }}>
                    <h4 style={sectionLabelStyle}>Proposed Services & Scope</h4>
                    <div style={{
                        background: 'rgba(232, 230, 227, 0.02)',
                        padding: '30px',
                        borderRadius: '15px',
                        border: '1px solid rgba(232, 230, 227, 0.05)',
                        color: 'var(--cream)',
                        fontSize: '15px',
                        lineHeight: '1.8',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'var(--font-mono)'
                    }}>
                        {estimate.job_description}
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '50px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid rgba(176, 141, 87, 0.2)', background: 'rgba(176, 141, 87, 0.05)' }}>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '11px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>SERVICE DESCRIPTION</th>
                            <th style={{ padding: '15px', textAlign: 'right', fontSize: '11px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>ESTIMATED TOTAL (AED)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '25px 15px', color: 'var(--cream)' }}>
                                <div style={{ fontWeight: '800', fontSize: '16px' }}>Comprehensive Service Estimate</div>
                                <div style={{ fontSize: '12px', color: 'rgba(232, 230, 227, 0.6)', marginTop: '5px' }}>As per initial inspection and client requirements</div>
                            </td>
                            <td style={{ padding: '25px 15px', textAlign: 'right', fontWeight: '800', fontSize: '1.2rem', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>
                                {estimate.total_amount}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '50px' }}>
                    <div style={{ width: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ color: 'rgba(232, 230, 227, 0.6)', fontSize: '14px' }}>Subtotal (Net)</span>
                            <span style={{ color: 'var(--cream)' }}>AED {estimate.total_amount}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ color: 'rgba(232, 230, 227, 0.6)', fontSize: '14px' }}>VAT (5%)</span>
                            <span style={{ color: 'var(--cream)' }}>AED {estimate.vat_amount}</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingTop: '20px',
                            marginTop: '20px',
                            borderTop: '2px solid rgba(176, 141, 87, 0.3)',
                            fontSize: '1.6rem',
                            fontWeight: '900',
                            color: 'var(--gold)',
                            fontFamily: 'var(--font-serif)'
                        }}>
                            <span>GRAND TOTAL</span>
                            <span>AED {estimate.net_amount}</span>
                        </div>
                    </div>
                </div>

                {/* Signature Section - Quotation Acceptance */}
                <div style={{ marginTop: '50px', borderTop: '1px solid rgba(176, 141, 87, 0.2)', paddingTop: '40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
                        <div>
                            <h4 style={sectionLabelStyle}>Client Acceptance</h4>
                            <p style={{ color: 'rgba(232, 230, 227, 0.6)', fontSize: '11px', marginBottom: '15px' }}>
                                I hereby accept this quotation and authorize Elite Shine to proceed with the services listed above.
                            </p>
                            {estimate.signature_data ? (
                                <div style={{ background: '#fff', padding: '15px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(176, 141, 87, 0.2)' }}>
                                    <img src={estimate.signature_data} alt="Accepted Signature" style={{ maxHeight: '60px' }} />
                                    <p style={{ color: '#000', fontSize: '10px', marginTop: '5px', fontWeight: '800', letterSpacing: '1px' }}>ACCEPTED & AUTHORIZED</p>
                                </div>
                            ) : (
                                <div className="no-print">
                                    <SignaturePad
                                        title="Sign to Accept Quotation"
                                        onSave={async (data) => {
                                            try {
                                                await api.patch(`/api/job-cards/api/jobs/${id}/`, { signature_data: data });
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
                                <div style={{ borderBottom: '1px solid rgba(232, 230, 227, 0.2)', height: '40px', width: '200px', marginLeft: 'auto' }}></div>
                                <p style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.6)', marginTop: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>{estimate.service_advisor || 'Elite Shine Manager'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '50px', borderTop: '1px solid rgba(232, 230, 227, 0.1)', paddingTop: '20px' }}>
                    <h4 style={{ fontSize: '10px', textTransform: 'uppercase', color: 'rgba(232, 230, 227, 0.4)', marginBottom: '10px', letterSpacing: '1px' }}>Terms & Conditions</h4>
                    <p style={{ fontSize: '10px', color: 'rgba(232, 230, 227, 0.4)', lineHeight: '1.6' }}>
                        1. This quotation is valid for 7 days from the date of issue.<br />
                        2. Final costs may vary based on additional findings during service.<br />
                        3. All parts and labor are subject to availability.<br />
                        4. 50% deposit required for parts procurement where applicable.
                    </p>
                </div>
            </PortfolioCard>

        </PortfolioPage>
    );
};

const sectionLabelStyle = {
    fontSize: '11px',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    marginBottom: '10px',
    letterSpacing: '1px',
    fontWeight: '800'
};

export default EstimateDetail;
