import React, { useState } from 'react';
import GlassCard from '../../components/GlassCard';
import SignaturePad from '../../components/SignaturePad';
import { CheckCircle2, Circle } from 'lucide-react';

const ChecklistForm = ({ title, packages }) => {
    const [activePackage, setActivePackage] = useState(Object.keys(packages)[0]);

    // Handle styling for package selection tabs
    const getTabStyle = (pkgName) => ({
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        border: 'none',
        transition: 'all 0.3s',
        background: activePackage === pkgName
            ? 'linear-gradient(135deg, #b08d57 0%, #8a6d43 100%)'
            : 'rgba(255, 255, 255, 0.05)',
        color: activePackage === pkgName ? '#fff' : '#94a3b8',
        boxShadow: activePackage === pkgName ? '0 4px 15px rgba(176, 141, 87, 0.3)' : 'none'
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>{title}</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {Object.keys(packages).map(pkg => (
                        <button
                            key={pkg}
                            onClick={() => setActivePackage(pkg)}
                            style={getTabStyle(pkg)}
                        >
                            {pkg}
                        </button>
                    ))}
                </div>
            </div>

            <GlassCard>
                <div style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.02)'
                }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#b08d57' }}>
                        {activePackage} Package Checklist
                    </span>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: '700', letterSpacing: '1px' }}>
                        Compliance Check
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {packages[activePackage].map((item, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px 24px',
                            borderBottom: idx === packages[activePackage].length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                            transition: 'background 0.2s'
                        }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <span style={{ color: '#e2e8f0', fontSize: '14px' }}>{item}</span>

                            <div style={{ display: 'flex', gap: '20px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                    <input type="radio" name={`item-${idx}`} style={{ accentColor: '#10b981' }} />
                                    <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Pass</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                    <input type="radio" name={`item-${idx}`} style={{ accentColor: '#ef4444' }} />
                                    <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Fail</span>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>

            <GlassCard>
                <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginBottom: '10px' }}>Final Approval</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                        <SignaturePad label="Inspector / Supervisor Signature" />
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default ChecklistForm;
