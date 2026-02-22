import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, CheckCircle, Car, Calendar, User, Info, FileText, Download } from 'lucide-react';
import api from '../../api/axios';
import { PortfolioPage, PortfolioCard, PortfolioTitle, PortfolioButton } from '../../components/PortfolioComponents';

const WarrantyVerify = () => {
    const { token } = useParams();
    const [warranty, setWarranty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWarranty = async () => {
            try {
                // Use the public_verify action
                const res = await api.get(`/api/warranty-book/api/registrations/public_verify/?token=${token}`);
                setWarranty(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Verification error', err);
                setError('Invalid or expired warranty certificate.');
                setLoading(false);
            }
        };

        fetchWarranty();
    }, [token]);

    if (loading) return <div style={{ color: 'var(--gold)', textAlign: 'center', padding: '100px' }}>VERIFYING DIGITAL BOND...</div>;

    if (error) return (
        <div style={{ padding: '100px', textAlign: 'center' }}>
            <Shield size={64} color="#f43f5e" style={{ marginBottom: '20px', opacity: 0.5 }} />
            <h2 style={{ color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>{error}</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '10px' }}>Please contact Elite Shine Support if you believe this is an error.</p>
        </div>
    );

    return (
        <PortfolioPage>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <Shield size={80} color="var(--gold)" style={{ marginBottom: '30px' }} />
                <PortfolioTitle subtitle={`Official Digital Certificate for ${warranty.category_display}`}>
                    WARRANTY VERIFIED
                </PortfolioTitle>

                <PortfolioCard style={{ marginTop: '60px', padding: '50px', border: '1px solid var(--gold-border)' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '8px 20px',
                        borderRadius: '30px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        fontSize: '10px',
                        fontWeight: '900',
                        letterSpacing: '2px',
                        marginBottom: '40px',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                        STATUS: SECURE & ACTIVE
                    </div>

                    <div style={{ textAlign: 'left', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        <div>
                            <div style={label}>CERTIFICATE NO.</div>
                            <div style={value}>{warranty.warranty_number}</div>

                            <div style={{ ...label, marginTop: '30px' }}>HOLDER</div>
                            <div style={value}>{warranty.customer_name}</div>
                        </div>
                        <div>
                            <div style={label}>ASSET</div>
                            <div style={value}>{warranty.vehicle_brand} {warranty.vehicle_model}</div>

                            <div style={{ ...label, marginTop: '30px' }}>PLATE</div>
                            <div style={value}>{warranty.plate_number}</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '50px', padding: '30px', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ textAlign: 'left' }}>
                            <div style={label}>EXPIRATION DATE</div>
                            <div style={{ ...value, color: 'var(--gold)', fontSize: '24px' }}>{new Date(warranty.expiry_date).toLocaleDateString()}</div>
                        </div>
                        <CheckCircle size={40} color="var(--gold)" style={{ opacity: 0.5 }} />
                    </div>

                    <div style={{ marginTop: '60px' }}>
                        <PortfolioButton style={{ width: '100%' }} onClick={() => window.print()}>
                            <Download size={18} style={{ marginRight: '10px' }} /> DOWNLOAD CERTIFICATE
                        </PortfolioButton>
                    </div>
                </PortfolioCard>

                <p style={{ marginTop: '40px', color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '1px' }}>
                    Elite Shine ERP // Secure Warranty Network // Generated on {new Date(warranty.created_at).toLocaleString()}
                </p>
            </div>
        </PortfolioPage>
    );
};

const label = {
    fontSize: '10px',
    color: 'var(--gold)',
    fontWeight: '900',
    letterSpacing: '2px',
    marginBottom: '8px'
};

const value = {
    fontSize: '18px',
    color: 'var(--cream)',
    fontFamily: 'var(--font-serif)',
    letterSpacing: '0.5px'
};

export default WarrantyVerify;
