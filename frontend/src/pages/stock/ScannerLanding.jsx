import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PortfolioPage, PortfolioTitle, PortfolioCard } from '../../components/PortfolioComponents';
import { Scan, Box, Layers, PenTool, ArrowRight } from 'lucide-react';

const ScannerLanding = () => {
    const navigate = useNavigate();

    const modules = [
        {
            id: 'general',
            label: 'General Workshop',
            desc: 'Tools, consumables, & general parts.',
            icon: Box,
            color: '#b08d57'
        },
        {
            id: 'ceramic',
            label: 'Ceramic Inventory',
            desc: 'Coatings, activators, & applicators.',
            icon: Layers, // Represents layers of coating
            color: '#3b82f6' // Blue for liquid/chemical
        },
        {
            id: 'ppf',
            label: 'PPF Scanner',
            desc: 'Rolls, squeegees, & cutting blades.',
            icon: PenTool,
            color: '#10b981' // Green for "film" or safe
        }
    ];

    return (
        <PortfolioPage breadcrumb="Operations / Inventory / Scanner Hub">
            <header style={{ textAlign: 'center', marginBottom: '50px' }}>
                <PortfolioTitle subtitle="Select the inventory category to initialize the optical scanner.">
                    Workshop Scanner
                </PortfolioTitle>
            </header>

            <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {modules.map(mod => {
                    const Icon = mod.icon;
                    return (
                        <PortfolioCard
                            key={mod.id}
                            style={{
                                padding: '30px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                border: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center'
                            }}
                            onClick={() => navigate(`/stock/scanner/active?type=${mod.id}`)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.borderColor = mod.color;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                            }}
                        >
                            <div style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                background: `${mod.color}15`,
                                color: mod.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '20px'
                            }}>
                                <Icon size={32} />
                            </div>
                            <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>{mod.label}</h3>
                            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.4', marginBottom: '25px' }}>{mod.desc}</p>

                            <div style={{
                                marginTop: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '11px',
                                fontWeight: '800',
                                color: mod.color,
                                letterSpacing: '1px',
                                textTransform: 'uppercase'
                            }}>
                                Initialize <ArrowRight size={14} />
                            </div>
                        </PortfolioCard>
                    );
                })}
            </div>
        </PortfolioPage>
    );
};

export default ScannerLanding;
