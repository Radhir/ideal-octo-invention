import React from 'react';
import { Construction, ArrowRight } from 'lucide-react';
import { PortfolioPage, PortfolioCard, PortfolioButton } from '../components/PortfolioComponents';
import { useNavigate } from 'react-router-dom';

const UnderConstruction = () => {
    const navigate = useNavigate();
    return (
        <PortfolioPage style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <PortfolioCard style={{ padding: '60px', maxWidth: '500px', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Construction size={40} color="#f59e0b" />
                </div>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', marginBottom: '10px', fontFamily: 'var(--font-serif)' }}>In Development</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6' }}>
                        This module is currently being engineered by the system architects.
                        <br />Check back in the next deployment cycle.
                    </p>
                </div>
                <PortfolioButton variant="gold" onClick={() => navigate('/')} style={{ width: '100%' }}>
                    Return to Mission Control <ArrowRight size={16} />
                </PortfolioButton>
            </PortfolioCard>
        </PortfolioPage>
    );
};

export default UnderConstruction;
