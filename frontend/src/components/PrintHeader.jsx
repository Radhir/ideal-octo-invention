import React from 'react';

const PrintHeader = ({ title }) => {
    const today = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="print-only-header" style={{
            display: 'none',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #b08d57',
            paddingBottom: '20px',
            marginBottom: '30px',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <img
                    src="/logo_dark.png"
                    alt="Elite Shine Logo"
                    style={{ height: '60px', width: 'auto' }}
                />
                <div>
                    <h1 style={{
                        margin: 0,
                        fontSize: '24px',
                        color: '#b08d57',
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: '800'
                    }}>ELITE SHINE AUTO MASTER</h1>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666', fontWeight: '600' }}>Executive Operational Report</p>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#333' }}>{title}</h2>
                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Generated on: {today}</p>
            </div>
        </div>
    );
};

export default PrintHeader;
