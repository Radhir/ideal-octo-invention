import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import {
    CheckCircle2, Printer, ArrowRight, Package,
    ShieldCheck, Activity, Globe, Download
} from 'lucide-react';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioButton,
    PortfolioTitle,
    PortfolioGrid
} from '../../components/PortfolioComponents';

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { order, totals } = location.state || {};

    if (!order) {
        return (
            <PortfolioPage>
                <div style={{ textAlign: 'center', padding: '100px' }}>
                    <h2 style={{ color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>Terminal Standby...</h2>
                    <PortfolioButton onClick={() => navigate('/logistics')} variant="glass" style={{ marginTop: '30px' }}>
                        RETURN TO HUB
                    </PortfolioButton>
                </div>
            </PortfolioPage>
        );
    }

    return (
        <PortfolioPage breadcrumb="LOGISTICS // VALIDATION">
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <header style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 15 }}
                        style={{
                            width: '100px', height: '100px', borderRadius: '50%',
                            background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 30px'
                        }}
                    >
                        <CheckCircle2 size={50} />
                    </motion.div>
                    <PortfolioTitle subtitle="Transaction authenticated and synchronized with the global supply chain ledger.">
                        Supply Order<br />Authenticated
                    </PortfolioTitle>
                </header>

                <PortfolioGrid columns="1.5fr 1fr" gap="40px">
                    <PortfolioCard style={{ padding: '60px', background: 'rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' }}>
                        <div className="telemetry-grid" style={{ zIndex: 0, opacity: 0.05 }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px' }}>
                                <div>
                                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '3px', marginBottom: '8px' }}>MANIFEST.ID</div>
                                    <h3 style={{ fontSize: '30px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'var(--font-serif)', margin: 0 }}>{order.purchase_number}</h3>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '10px', color: 'rgba(232, 230, 227, 0.3)', fontWeight: '900', letterSpacing: '2px', marginBottom: '8px' }}>STATUS.NODE</div>
                                    <div style={{
                                        padding: '6px 16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                                        borderRadius: '30px', fontSize: '10px', fontWeight: '900', border: '1px solid rgba(16, 185, 129, 0.2)'
                                    }}>SYNCHRONIZED</div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '50px' }}>
                                <div>
                                    <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '12px', opacity: 0.6 }}>SUPPLY SOURCE</div>
                                    <div style={{ fontSize: '18px', color: 'var(--cream)', fontWeight: '300' }}>{order.vendor_name}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '12px', opacity: 0.6 }}>VALUATION</div>
                                    <div style={{ fontSize: '24px', color: 'var(--cream)', fontWeight: '800' }}>AED {totals.grandTotal.toLocaleString()}</div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px' }}>
                                <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '20px', opacity: 0.6 }}>DATA.TELEMETRY</div>
                                <PortfolioGrid columns="1fr 1fr" gap="20px">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(232,230,227,0.5)', fontSize: '12px' }}>
                                        <Globe size={14} color="var(--gold)" /> SATELLITE_LINK: ACTIVE
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(232,230,227,0.5)', fontSize: '12px' }}>
                                        <ShieldCheck size={14} color="var(--gold)" /> ENCRYPTION: SHA-256
                                    </div>
                                </PortfolioGrid>
                            </div>
                        </div>
                    </PortfolioCard>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <PortfolioCard style={{ padding: '40px' }}>
                            <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '25px' }}>POST-SYNCHRONIZATION</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <PortfolioButton onClick={() => window.print()} variant="glass" style={{ width: '100%', height: '60px' }}>
                                    <Printer size={18} /> PRINT.manifest
                                </PortfolioButton>
                                <PortfolioButton onClick={() => navigate('/stock')} variant="secondary" style={{ width: '100%', height: '60px' }}>
                                    <Package size={18} /> VIEW.inventory
                                </PortfolioButton>
                                <PortfolioButton onClick={() => navigate('/logistics')} variant="gold" style={{ width: '100%', height: '60px' }}>
                                    RETURN.center <ArrowRight size={18} />
                                </PortfolioButton>
                            </div>
                        </PortfolioCard>

                        <PortfolioCard style={{ padding: '30px', background: 'rgba(176,141,87,0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--gold)' }}>
                                <Activity size={16} />
                                <div style={{ fontSize: '9px', fontWeight: '900', letterSpacing: '2px' }}>LEDGER PULSE</div>
                            </div>
                            <div style={{ fontSize: '12px', color: 'rgba(232,230,227,0.4)', marginTop: '10px' }}>
                                Transaction finalized and available in procurement history.
                            </div>
                        </PortfolioCard>
                    </div>
                </PortfolioGrid>
            </div>
        </PortfolioPage>
    );
};

export default OrderConfirmation;
