import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { ArrowLeft, Printer, Award, Calendar, User, Car, Star } from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';

const CeramicDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [warranty, setWarranty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWarranty();
    }, [id]);

    const fetchWarranty = async () => {
        try {
            const res = await axios.get(`/forms/ceramic/api/warranties/${id}/`);
            setWarranty(res.data);
        } catch (err) {
            console.error('Error fetching warranty', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center', color: '#fff' }}>Loading Certificate...</div>;
    if (!warranty) return <div style={{ padding: '50px', textAlign: 'center', color: '#fff' }}>Certificate Not Found</div>;

    return (
        <div style={{ padding: '30px 20px' }}>
            <PrintHeader title="Ceramic Protection Warranty" />

            <header className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button
                        onClick={() => navigate('/ceramic')}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '12px', cursor: 'pointer', color: '#fff' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', margin: 0 }}>Ceramic Certificate</h1>
                        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Ref: CW-{warranty.id.toString().padStart(5, '0')}</p>
                    </div>
                </div>

                <button
                    onClick={() => window.print()}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Printer size={18} /> Print Certificate
                </button>
            </header>

            <GlassCard className="printable-certificate" style={{ padding: '50px', maxWidth: '850px', margin: '0 auto', border: '2px solid rgba(176, 141, 87, 0.4)', borderRadius: '0' }}>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '20px' }}>
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="#b08d57" color="#b08d57" />)}
                    </div>
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', color: '#b08d57', fontSize: '2.4rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '5px' }}>Warranty Certificate</h2>
                    <p style={{ color: '#94a3b8', fontSize: '12px', letterSpacing: '4px' }}>ELITE SHINE PROTECTION PROGRAM</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginBottom: '50px' }}>
                    <div>
                        <h4 style={labelStyle}>Customer Data</h4>
                        <p style={valueStyle}>{warranty.full_name}</p>
                        <div style={{ marginTop: '10px', fontSize: '14px' }}>
                            <p style={{ margin: '2px 0', color: '#f8fafc' }}>{warranty.contact_number}</p>
                            <p style={{ margin: '2px 0', color: '#94a3b8' }}>{warranty.email}</p>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h4 style={labelStyle}>Vehicle Profile</h4>
                        <p style={valueStyle}>{warranty.vehicle_brand} {warranty.vehicle_model}</p>
                        <p style={{ color: '#b08d57', fontSize: '1.2rem', fontWeight: '900', marginTop: '5px' }}>{warranty.license_plate}</p>
                        <p style={{ color: '#94a3b8', fontSize: '11px', marginTop: '5px' }}>VIN: {warranty.vin}</p>
                    </div>
                </div>

                <div style={{ border: '1px solid rgba(176, 141, 87, 0.2)', padding: '30px', marginBottom: '50px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        <div>
                            <h4 style={subLabelStyle}>Service Type</h4>
                            <p style={{ fontWeight: '700' }}>{warranty.coating_type}</p>
                        </div>
                        <div>
                            <h4 style={subLabelStyle}>Product Used</h4>
                            <p style={{ fontWeight: '700' }}>{warranty.coating_brand}</p>
                        </div>
                        <div>
                            <h4 style={subLabelStyle}>Inception Date</h4>
                            <p style={{ fontWeight: '700' }}>{new Date(warranty.installation_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <h4 style={subLabelStyle}>Valid Period</h4>
                            <p style={{ fontWeight: '700', color: '#b08d57' }}>{warranty.warranty_period}</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '60px' }}>
                    <div>
                        <h4 style={labelStyle}>Maintenance Obligations</h4>
                        <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.8' }}>
                            Validation of this luxury protective coating requires annual maintenance and professional check-ups
                            exclusively at Elite Shine studios. Use of non-approved cleaners or mechanical car washes will void this premium coverage.
                            Warranty covers oxidation, loss of gloss and environmental fallout protection.
                        </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h4 style={labelStyle}>Owner Authorization</h4>
                        <div style={{ height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            {warranty.signature_data ? (
                                <div style={{ background: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #b08d57', width: '100%' }}>
                                    <img src={warranty.signature_data} alt="Owner Sig" style={{ maxHeight: '70px', maxWidth: '100%' }} />
                                </div>
                            ) : (
                                <div style={{ borderBottom: '1px solid #64748b', width: '100%', height: '40px' }}></div>
                            )}
                        </div>
                        <p style={{ fontSize: '10px', color: '#64748b', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Signature & Date</p>
                    </div>
                </div>

                <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', opacity: 0.5 }}>
                    <div style={{ fontSize: '10px' }}>
                        <p style={{ margin: 0 }}>Official Seal Required for Validity</p>
                        <p style={{ margin: 0 }}>Elite Shine ERP Security-ID: {warranty.id}-SEC-CER</p>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '10px' }}>
                        <p style={{ margin: 0 }}>ELITE SHINE AUTOMOTIVE REFINISHING</p>
                        <p style={{ margin: 0 }}>UNITED ARAB EMIRATES</p>
                    </div>
                </div>
            </GlassCard>

            <style>{`
                @media print {
                    body { background: #fff !important; }
                    .printable-certificate { 
                        background: #fff !important; 
                        color: #000 !important; 
                        border: 3px double #b08d57 !important; 
                        box-shadow: none !important; 
                        max-width: 100% !important; 
                        padding: 60px !important;
                        margin: 0 !important;
                    }
                    .printable-certificate * { color: #000 !important; }
                    .printable-certificate h2, .printable-certificate h4 { color: #b08d57 !important; }
                    .printable-certificate div[style*="border"] { border-color: #b08d57 !important; }
                    .no-print { display: none !important; }
                }
            `}</style>
        </div>
    );
};

const labelStyle = {
    fontSize: '11px',
    color: '#b08d57',
    textTransform: 'uppercase',
    fontWeight: '900',
    letterSpacing: '2px',
    marginBottom: '15px'
};

const subLabelStyle = {
    fontSize: '9px',
    color: '#64748b',
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: '8px'
};

const valueStyle = {
    fontSize: '1.5rem',
    fontWeight: '900',
    margin: '0',
    color: '#fff',
    fontFamily: 'Outfit, sans-serif'
};

export default CeramicDetail;
