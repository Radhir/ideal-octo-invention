import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Printer, Shield, Car, User } from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioStats,
    PortfolioGrid,
    PortfolioCard,
    PortfolioButton
} from '../../components/PortfolioComponents';

const PPFList = () => {
    const navigate = useNavigate();
    const [warranties, setWarranties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchWarranties();
    }, []);

    const fetchWarranties = async () => {
        try {
            const res = await api.get('/forms/ppf/api/warranties/');
            setWarranties(res.data);
        } catch (err) {
            console.error('Error fetching warranties', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredWarranties = warranties.filter(w =>
        w.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.license_plate.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = [
        { label: 'Total Registrations', value: warranties.length.toString() },
        { label: 'Active Coverage', value: '100%', color: 'var(--gold)' },
        { label: 'Studio Registry', value: 'Live' }
    ];

    return (
        <PortfolioPage breadcrumb="Warranty / PPF Registry">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
                <PortfolioTitle
                    subtitle="Archive of premium paint protection film (PPF) applications, digital armor certificates, and installation vectors."
                >
                    Armor<br />Ledger
                </PortfolioTitle>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <PortfolioButton variant="glass" onClick={() => window.print()}>
                        <Printer size={16} /> PRINT.ledger
                    </PortfolioButton>
                    <PortfolioButton variant="gold" onClick={() => navigate('/ppf/create')}>
                        <Plus size={16} /> DEPLOY.node
                    </PortfolioButton>
                </div>
            </div>

            <PortfolioStats stats={stats} />

            <div style={{ marginBottom: '60px', position: 'relative', width: '100%' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '10px 25px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Search color="var(--gold)" size={20} opacity={0.5} />
                    <input
                        type="text"
                        placeholder="Search armor ledger (Client, Plate, Asset ID)..."
                        style={{
                            padding: '15px 0',
                            fontSize: '15px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--cream)',
                            width: '100%',
                            outline: 'none',
                            letterSpacing: '0.5px',
                            fontWeight: '300'
                        }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px', opacity: 0.4 }}>ARMOR.search</div>
                </div>
            </div>

            {loading ? (
                <div style={{ color: 'var(--cream)', opacity: 0.6, fontSize: '18px', fontFamily: 'var(--font-serif)' }}>Loading archive...</div>
            ) : filteredWarranties.length === 0 ? (
                <div style={{ color: 'var(--cream)', opacity: 0.6, fontSize: '18px', fontFamily: 'var(--font-serif)' }}>No records found in current view.</div>
            ) : (
                <PortfolioGrid columns="repeat(auto-fill, minmax(420px, 1fr))">
                    {filteredWarranties.map((w) => (
                        <PortfolioCard key={w.id} onClick={() => navigate(`/ppf/${w.id}`)} style={{ padding: '40px', background: 'rgba(0,0,0,0.3)', position: 'relative' }}>
                            <div className="telemetry-grid" style={{ zIndex: 0, opacity: 0.05 }} />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '35px' }}>
                                    <div>
                                        <div style={{ fontSize: '9px', color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px', fontWeight: '900' }}>
                                            ARMOR // #{w.id.toString().padStart(5, '0')}
                                        </div>
                                        <h3 style={{ fontSize: '26px', fontFamily: 'var(--font-serif)', margin: 0, fontWeight: '300', color: 'var(--cream)' }}>{w.full_name}</h3>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div className="status-pulse" />
                                        <Shield size={24} color="var(--gold)" strokeWidth={0.5} opacity={0.5} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', padding: '25px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div>
                                        <div style={{ fontSize: '8px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '8px', opacity: 0.5 }}>STRUCTURE.asset</div>
                                        <div style={{ fontSize: '14px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Car size={14} opacity={0.5} /> {w.vehicle_brand?.toUpperCase()}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '8px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '8px', opacity: 0.5 }}>VULNERABILITY.plate</div>
                                        <div style={{ fontSize: '14px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'var(--font-serif)' }}>{w.license_plate}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '25px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: '600', letterSpacing: '1px' }}>
                                        INSTALL.dat: {new Date(w.installation_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                        CERT.access <ArrowRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </PortfolioCard>
                    ))}
                </PortfolioGrid>
            )}
        </PortfolioPage>
    );
};

export default PPFList;
