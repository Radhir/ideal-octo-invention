import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoader = () => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
            background: '#000',
            zIndex: 9999,
            color: '#fff'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <Loader2 className="animate-spin" size={48} color="#b08d57" />
                <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    letterSpacing: '2px',
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.6)'
                }}>
                    INITIALIZING SYSTEM...
                </div>
            </div>

        </div>
    );
};

export default PageLoader;
