import React, { useState } from 'react';
import { CheckCircle2, Circle, PenTool } from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioGrid,
    PortfolioButton
} from '../../components/PortfolioComponents';
import SignaturePad from '../../components/SignaturePad';

const ChecklistForm = ({ title, packages }) => {
    const [activePackage, setActivePackage] = useState(Object.keys(packages)[0]);

    return (
        <PortfolioPage breadcrumb="OPERATIONS / QUALITY CONTROL">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                <PortfolioTitle subtitle="Standardized quality assurance protocols and compliance verification.">
                    {title}
                </PortfolioTitle>

                <div style={{ display: 'flex', gap: '10px', background: 'rgba(232, 230, 227, 0.05)', padding: '5px', borderRadius: '12px' }}>
                    {Object.keys(packages).map(pkg => (
                        <button
                            key={pkg}
                            onClick={() => setActivePackage(pkg)}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '700',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                border: 'none',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                background: activePackage === pkg ? 'var(--gold)' : 'transparent',
                                color: activePackage === pkg ? '#0a0a0a' : 'rgba(232, 230, 227, 0.5)',
                                boxShadow: activePackage === pkg ? '0 4px 15px rgba(176,141,87,0.3)' : 'none'
                            }}
                        >
                            {pkg}
                        </button>
                    ))}
                </div>
            </div>

            <PortfolioGrid>
                <PortfolioCard>
                    <div style={{
                        paddingBottom: '20px',
                        borderBottom: '1px solid rgba(232, 230, 227, 0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <CheckCircle2 color="var(--gold)" size={20} />
                            <span style={{ fontSize: '16px', fontWeight: '500', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>
                                {activePackage} Protocols
                            </span>
                        </div>
                        <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'rgba(232, 230, 227, 0.3)', fontWeight: '700', letterSpacing: '1px' }}>
                            {packages[activePackage].length} Verification Points
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {packages[activePackage].map((item, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '15px 20px',
                                background: 'rgba(232, 230, 227, 0.02)',
                                borderRadius: '10px',
                                border: '1px solid rgba(232, 230, 227, 0.05)',
                                transition: 'all 0.2s'
                            }}>
                                <span style={{ color: 'rgba(232, 230, 227, 0.8)', fontSize: '14px', fontWeight: '500' }}>{item}</span>

                                <div style={{ display: 'flex', gap: '30px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name={`item-${idx}`}
                                            style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
                                        />
                                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pass</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name={`item-${idx}`}
                                            style={{ accentColor: '#ef4444', width: '16px', height: '16px' }}
                                        />
                                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fail</span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </PortfolioCard>

                <PortfolioCard>
                    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <PenTool size={18} color="var(--gold)" />
                        <h3 style={{ fontSize: '16px', fontWeight: '500', color: 'var(--cream)', margin: 0, fontFamily: 'var(--font-serif)' }}>Final Approval</h3>
                    </div>
                    <SignaturePad label="Inspector / Supervisor Signature" />

                    <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                        <PortfolioButton variant="gold" style={{ padding: '12px 30px' }}>
                            Submit Assessment
                        </PortfolioButton>
                    </div>
                </PortfolioCard>
            </PortfolioGrid>
        </PortfolioPage>
    );
};

export default ChecklistForm;
