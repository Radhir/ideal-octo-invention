import React from 'react';
import { Construction } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useNavigate } from 'react-router-dom';

const UnderConstruction = () => {
    const navigate = useNavigate();
    return (
        <div style={{ padding: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
            <GlassCard style={{ padding: '60px', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Construction size={40} color="#f59e0b" />
                </div>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', marginBottom: '10px' }}>In Development</h1>
                    <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.6' }}>
                        This module is currently being engineered by the system architects.
                        <br />Check back in the next deployment cycle.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="btn-primary"
                    style={{ padding: '12px 30px', fontSize: '14px', marginTop: '20px' }}
                >
                    Return to Mission Control
                </button>
            </GlassCard>
        </div>
    );
};

export default UnderConstruction;
