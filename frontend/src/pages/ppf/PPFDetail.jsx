import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { ArrowLeft, Printer, ShieldCheck, Calendar, User, Car } from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';

const PPFDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [warranty, setWarranty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWarranty();
    }, [id]);

    const fetchWarranty = async () => {
        try {
            const res = await api.get(`/forms/ppf/api/warranties/${id}/`);
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
            <PrintHeader title="Paint Protection Film Warranty" />

            <header className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button
                        onClick={() => navigate('/ppf')}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '12px', cursor: 'pointer', color: '#fff' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', margin: 0 }}>Warranty Certificate</h1>
                        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Certificate ID: PPF-{warranty.id.toString().padStart(5, '0')}</p>
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

            <GlassCard className="printable-certificate" style={{ padding: '50px', maxWidth: '850px', margin: '0 auto', border: '2px solid rgba(176, 141, 87, 0.3)', position: 'relative' }}>
                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.1 }}>
                    <ShieldCheck size={120} color="#b08d57" />
                </div>

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', color: '#b08d57', fontSize: '2rem', marginBottom: '10px' }}>Certificate of Warranty</h2>
                    <div style={{ height: '2px', width: '100px', background: '#b08d57', margin: '0 auto' }}></div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
                    <div>
                        <h4 style={labelStyle}><User size={12} style={{ marginRight: '5px' }} /> Beneficiary</h4>
                        <p style={valueStyle}>{warranty.full_name}</p>
                        <p style={{ color: '#94a3b8', fontSize: '13px' }}>{warranty.contact_number}</p>
                        <p style={{ color: '#94a3b8', fontSize: '13px' }}>{warranty.email}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h4 style={labelStyle}><Car size={12} style={{ marginRight: '5px' }} /> Vehicle Protected</h4>
                        <p style={valueStyle}>{warranty.vehicle_brand} {warranty.vehicle_model} ({warranty.vehicle_year})</p>
                        <p style={{ color: '#b08d57', fontWeight: '800' }}>PLATE: {warranty.license_plate}</p>
                        <p style={{ color: '#94a3b8', fontSize: '12px' }}>VIN: {warranty.vin}</p>
                    </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '40px' }}>
                    <h4 style={labelStyle}>Installation Details</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '15px' }}>
                        <div>
                            <p style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Install Date</p>
                            <p style={{ fontWeight: '600' }}>{new Date(warranty.installation_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Film Type</p>
                            <p style={{ fontWeight: '600' }}>{warranty.film_type} - {warranty.film_brand}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Coverage</p>
                            <p style={{ fontWeight: '600' }}>{warranty.coverage_area}</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
                    <div>
                        <h4 style={labelStyle}>Terms of Protection</h4>
                        <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.6' }}>
                            This certificate entitles the above mentioned vehicle for the Elite Shine PPF Protection Warranty.
                            The warranty covers yellowing, bubbling, and cracking under normal usage conditions.
                            Periodic maintenance every 6 months is required to maintain the validity of this warranty.
                        </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h4 style={labelStyle}>Client Authorization</h4>
                        {warranty.signature_data ? (
                            <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #eee' }}>
                                <img src={warranty.signature_data} alt="Customer Sig" style={{ maxHeight: '60px' }} />
                                <p style={{ fontSize: '9px', color: '#000', margin: '5px 0 0 0', fontWeight: '800' }}>DIGITALLY AUTHORIZED</p>
                            </div>
                        ) : (
                            <div style={{ borderBottom: '1px solid #aaa', height: '60px' }}></div>
                        )}
                        <p style={{ fontSize: '11px', color: '#64748b', marginTop: '8px' }}>Authorized Representative</p>
                    </div>
                </div>

                <div style={{ marginTop: '50px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: '#64748b' }}>
                        Elite Shine Detailing Studio | Dubai - Abu Dhabi - Sharjah | www.eliteshine.ae
                    </p>
                </div>
            </GlassCard>

            <style>{`
                @media print {
                    body { background: #fff !important; }
                    .printable-certificate { 
                        background: #fff !important; 
                        color: #000 !important; 
                        border: 2px solid #b08d57 !important; 
                        box-shadow: none !important; 
                        max-width: 100% !important; 
                        padding: 40px !important;
                        margin: 0 !important;
                    }
                    .printable-certificate * { color: #000 !important; }
                    .printable-certificate h2, .printable-certificate h4 { color: #b08d57 !important; }
                    .printable-certificate div[style*="background"] { background: #fafafa !important; border-color: #eee !important; }
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
    fontWeight: '800',
    letterSpacing: '1px',
    marginBottom: '10px'
};

const valueStyle = {
    fontSize: '1.2rem',
    fontWeight: '800',
    margin: '0 0 5px 0'
};

export default PPFDetail;
