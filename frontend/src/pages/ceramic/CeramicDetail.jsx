import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Printer, User, Car, Star, Shield, Award } from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioStats,
    PortfolioGrid,
    PortfolioDetailBox,
    PortfolioBackButton,
    PortfolioButton
} from '../../components/PortfolioComponents';

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
            const res = await api.get(`/forms/ceramic/api/warranties/${id}/`);
            setWarranty(res.data);
        } catch (err) {
            console.error('Error fetching warranty', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)', opacity: 0.6 }}>Loading Certificate...</div></PortfolioPage>;
    if (!warranty) return <PortfolioPage><div style={{ color: 'var(--cream)', opacity: 0.6 }}>Certificate Not Found</div></PortfolioPage>;

    const stats = [
        { label: 'Registry Ref', value: `CW-${warranty.id.toString().padStart(5, '0')}` },
        { label: 'Activation', value: new Date(warranty.installation_date).toLocaleDateString() },
        { label: 'Guarantee', value: warranty.warranty_period, color: 'var(--gold)' }
    ];

    return (
        <PortfolioPage breadcrumb="Warranty / Ceramic Certificate">
            <div className="no-print">
                <PortfolioBackButton onClick={() => navigate('/ceramic')} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
                    <PortfolioTitle
                        subtitle="Authentication records for professional ceramic and graphene coating applications, including maintenance obligations."
                    >
                        Protection<br />Dossier
                    </PortfolioTitle>

                    <PortfolioButton variant="glass" onClick={() => window.print()}>
                        <Printer size={16} /> PRINT.certificate
                    </PortfolioButton>
                </div>

                <PortfolioStats stats={stats} />
            </div>

            <div className="certificate-container" style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1.5px solid rgba(176, 141, 87, 0.2)',
                padding: '100px 80px',
                borderRadius: '40px',
                position: 'relative',
                maxWidth: '1100px',
                margin: '0 auto',
                overflow: 'hidden'
            }}>
                <div className="telemetry-grid" style={{ zIndex: 0, opacity: 0.1 }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '30px' }}>
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="var(--gold)" color="var(--gold)" strokeWidth={1} opacity={0.5} />)}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                            <div className="status-pulse" />
                            <h2 style={{
                                fontFamily: 'var(--font-serif)',
                                fontSize: '56px',
                                color: 'var(--gold)',
                                margin: 0,
                                fontWeight: '300',
                                textTransform: 'uppercase',
                                letterSpacing: '4px'
                            }}>
                                Ceramic Warranty
                            </h2>
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '6px', textTransform: 'uppercase', fontWeight: '900', opacity: 0.5 }}>
                            Advanced Surface Protection // Elite Shine protocol
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '60px' }}>
                        <PortfolioDetailBox
                            label="Beneficiary"
                            value={
                                <div>
                                    <div style={{ fontSize: '20px', fontWeight: '500', marginBottom: '5px' }}>{warranty.full_name}</div>
                                    <div style={{ fontSize: '13px', opacity: 0.6 }}>{warranty.contact_number}</div>
                                    <div style={{ fontSize: '13px', opacity: 0.6 }}>{warranty.email}</div>
                                </div>
                            }
                            icon={<User size={18} color="var(--gold)" />}
                        />
                        <PortfolioDetailBox
                            label="Vehicle Profile"
                            value={
                                <div>
                                    <div style={{ fontSize: '20px', fontWeight: '500', marginBottom: '5px' }}>{warranty.vehicle_brand} {warranty.vehicle_model}</div>
                                    <div style={{ color: 'var(--gold)', fontWeight: '800', letterSpacing: '1px' }}>PLATE: {warranty.license_plate}</div>
                                    <div style={{ fontSize: '12px', opacity: 0.6 }}>VIN: {warranty.vin}</div>
                                </div>
                            }
                            icon={<Car size={18} color="var(--gold)" />}
                        />
                    </div>

                    <div style={{
                        background: 'rgba(232, 230, 227, 0.03)',
                        padding: '40px',
                        borderRadius: '20px',
                        border: '1px solid rgba(176, 141, 87, 0.2)',
                        marginBottom: '60px'
                    }}>
                        <PortfolioGrid columns="repeat(4, 1fr)">
                            <div>
                                <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Service Type</div>
                                <div style={{ fontWeight: '600', fontSize: '15px' }}>{warranty.coating_type}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Product Used</div>
                                <div style={{ fontWeight: '600', fontSize: '15px' }}>{warranty.coating_brand}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Inception Date</div>
                                <div style={{ fontWeight: '600', fontSize: '15px' }}>{new Date(warranty.installation_date).toLocaleDateString()}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Guarantee</div>
                                <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--gold)' }}>{warranty.warranty_period}</div>
                            </div>
                        </PortfolioGrid>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '60px', alignItems: 'flex-end' }}>
                        <div>
                            <h4 style={{
                                fontSize: '11px',
                                color: 'var(--gold)',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                marginBottom: '15px',
                                fontWeight: '800'
                            }}>
                                Maintenance Obligations
                            </h4>
                            <p style={{ fontSize: '12px', color: 'rgba(232, 230, 227, 0.5)', lineHeight: '1.8', margin: 0 }}>
                                Validation of this luxury protective coating requires annual maintenance and professional check-ups
                                exclusively at Elite Shine studios. Use of non-approved cleaners or mechanical car washes will void this premium coverage.
                                Warranty covers oxidation, loss of gloss and environmental fallout protection.
                            </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h4 style={{
                                fontSize: '11px',
                                color: 'var(--gold)',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                marginBottom: '15px',
                                fontWeight: '800'
                            }}>
                                Owner Authorization
                            </h4>
                            {warranty.signature_data ? (
                                <div style={{
                                    background: '#fff',
                                    padding: '15px',
                                    borderRadius: '15px',
                                    border: '1.5px solid var(--gold)',
                                    display: 'inline-block',
                                    width: '100%'
                                }}>
                                    <img src={warranty.signature_data} alt="Owner Sig" style={{ maxHeight: '70px', filter: 'contrast(1.2)' }} />
                                    <div style={{ fontSize: '9px', color: '#000', marginTop: '10px', fontWeight: '900', letterSpacing: '2px' }}>VERIFIED DIGITAL SIGNATURE</div>
                                </div>
                            ) : (
                                <div style={{ borderBottom: '1px solid rgba(232, 230, 227, 0.3)', height: '80px', width: '100%' }}></div>
                            )}
                            <p style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.4)', marginTop: '15px' }}>Signature & Date</p>
                        </div>
                    </div>

                    <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', opacity: 0.3 }}>
                        <div style={{ fontSize: '10px', letterSpacing: '1px' }}>
                            <p style={{ margin: 0 }}>OFFICIAL SEAL REQUIRED FOR VALIDITY</p>
                            <p style={{ margin: 0 }}>SECURITY-ID: {warranty.id}-SEC-CER</p>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '10px' }}>
                            <p style={{ margin: 0 }}>ELITE SHINE AUTOMOTIVE REFINISHING</p>
                            <p style={{ margin: 0 }}>UNITED ARAB EMIRATES</p>
                        </div>
                    </div>
                </div>
            </div>
        </PortfolioPage>
    );
};

export default CeramicDetail;
