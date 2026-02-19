import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Printer, User, Car, Calendar, Shield } from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioStats,
    PortfolioGrid,
    PortfolioDetailBox,
    PortfolioBackButton,
    PortfolioButton
} from '../../components/PortfolioComponents';

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

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)', opacity: 0.6 }}>Loading Certificate...</div></PortfolioPage>;
    if (!warranty) return <PortfolioPage><div style={{ color: 'var(--cream)', opacity: 0.6 }}>Certificate Not Found</div></PortfolioPage>;

    const stats = [
        { label: 'Certificate ID', value: `PPF-${warranty.id.toString().padStart(5, '0')}` },
        { label: 'Issue Date', value: new Date(warranty.installation_date).toLocaleDateString() },
        { label: 'Status', value: 'Validated', color: 'var(--gold)' }
    ];

    return (
        <PortfolioPage breadcrumb="Warranty / Digital Certificate">
            <div className="no-print">
                <PortfolioBackButton onClick={() => navigate('/ppf')} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
                    <PortfolioTitle
                        subtitle="Detailed record of premium paint protection film installation, coverage area, and warranty terms."
                    >
                        Armor<br />Dossier
                    </PortfolioTitle>

                    <PortfolioButton variant="glass" onClick={() => window.print()}>
                        <Printer size={16} /> PRINT.certificate
                    </PortfolioButton>
                </div>

                <PortfolioStats stats={stats} />
            </div>

            <div className="certificate-container" style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1.5px solid rgba(255, 255, 255, 0.05)',
                padding: '100px 80px',
                borderRadius: '40px',
                position: 'relative',
                maxWidth: '1100px',
                margin: '0 auto',
                overflow: 'hidden'
            }}>
                <div className="telemetry-grid" style={{ zIndex: 0, opacity: 0.1 }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ position: 'absolute', top: '40px', right: '40px', opacity: 0.1 }}>
                        <ShieldCheck size={160} color="var(--gold)" strokeWidth={1} />
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
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
                                Armor Warranty
                            </h2>
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '6px', textTransform: 'uppercase', fontWeight: '900', opacity: 0.5 }}>
                            Paint Protection Film // Elite Shine protocol
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
                            label="Protected Asset"
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
                        background: 'rgba(232, 232, 232, 0.03)',
                        padding: '40px',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        marginBottom: '60px'
                    }}>
                        <h4 style={{
                            fontSize: '11px',
                            color: 'var(--gold)',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            marginBottom: '20px',
                            fontWeight: '800'
                        }}>
                            Installation Parameters
                        </h4>
                        <PortfolioGrid columns="repeat(3, 1fr)">
                            <div>
                                <div style={{ fontSize: '11px', opacity: 0.5, textTransform: 'uppercase', marginBottom: '5px' }}>Service Date</div>
                                <div style={{ fontWeight: '500' }}>{new Date(warranty.installation_date).toLocaleDateString()}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', opacity: 0.5, textTransform: 'uppercase', marginBottom: '5px' }}>Film System</div>
                                <div style={{ fontWeight: '500' }}>{warranty.film_type} ({warranty.film_brand})</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', opacity: 0.5, textTransform: 'uppercase', marginBottom: '5px' }}>Coverage Area</div>
                                <div style={{ fontWeight: '500' }}>{warranty.coverage_area}</div>
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
                                Terms of Sovereignty
                            </h4>
                            <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', lineHeight: '1.8', margin: 0 }}>
                                This digital instrument serves as proof of installation by authorized Elite Shine technicians.
                                Coverage includes protection against substrate yellowing, atmospheric bubbling, and structural cracking.
                                Maintenance at 6-month intervals at an authorized studio is essential to maintain sovereign validity.
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
                                Authorization
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
                                    <img src={warranty.signature_data} alt="Digital Sig" style={{ maxHeight: '60px', filter: 'contrast(1.2)' }} />
                                    <div style={{ fontSize: '9px', color: '#000', marginTop: '10px', fontWeight: '900', letterSpacing: '2px' }}>VERIFIED DIGITAL SIGNATURE</div>
                                </div>
                            ) : (
                                <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', height: '80px', width: '100%' }}></div>
                            )}
                            <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', marginTop: '15px' }}>Authorized Studio Representative</p>
                        </div>
                    </div>

                    <div style={{ marginTop: '80px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '30px', textAlign: 'center' }}>
                        <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.3)', letterSpacing: '1px' }}>
                            ELITE SHINE AUTOMOTIVE REFINISHING | www.eliteshine.ae | Registry ID: {warranty.id}
                        </p>
                    </div>
                </div>
            </div>
        </PortfolioPage>
    );
};

export default PPFDetail;
