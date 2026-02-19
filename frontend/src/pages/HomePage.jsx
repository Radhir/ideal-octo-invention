import React from 'react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioGrid,
    PortfolioButton
} from '../components/PortfolioComponents';
import {
    Activity, Calculator, Package, Settings, Globe, UserCircle, UserPlus,
    BarChart3, Clock, CheckCircle2, AlertCircle, MessageSquare, ArrowRight
} from 'lucide-react';
import QuickNotes from '../components/QuickNotes';
import MeetingRoomWidget from '../components/MeetingRoomWidget';
import { usePermissions } from '../context/PermissionContext';
import EmployeeDashboard from './dashboard/EmployeeDashboard';

const HomePage = () => {
    const { hasPermission } = usePermissions();

    if (!hasPermission('dashboard')) {
        return <EmployeeDashboard />;
    }

    return (
        <PortfolioPage>
            <div style={{ marginBottom: '30px' }}>
                <div style={{ fontSize: '11px', color: 'var(--gold, #b08d57)', fontWeight: '800', letterSpacing: '2px', marginBottom: '10px', textTransform: 'uppercase' }}>Established 2024</div>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '300', fontFamily: 'var(--font-serif, serif)', color: '#fff', margin: 0, lineHeight: 1.1 }}>
                    The Art of <br /> Engineering
                </h1>
                <p style={{ maxWidth: '600px', fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', marginTop: '20px', lineHeight: 1.6 }}>
                    Precision mechanics meeting high-fidelity design. We redefine the automotive workshop experience through meticulous attention to detail.
                </p>
                <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                    <PortfolioButton variant="gold">EXPLORE MISSION</PortfolioButton>
                    <PortfolioButton variant="outline">SYSTEMS</PortfolioButton>
                </div>
            </div>

            <PortfolioGrid columns="repeat(12, 1fr)" gap="20px">
                {/* Philosophy Card - Span 4 */}
                <PortfolioCard style={{ gridColumn: 'span 4', gridRow: 'span 2', background: '#e8e6e3', color: '#1c1917' }}>
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: '10px', color: '#1c1917', opacity: 0.6, fontWeight: '700', letterSpacing: '1px' }}>CORE STRATEGY</div>
                            <h2 style={{ fontSize: '2rem', fontWeight: '300', fontFamily: 'var(--font-serif)', margin: '15px 0 0 0', lineHeight: 1.2 }}>
                                Precision<br />Through<br />Purpose
                            </h2>
                        </div>
                        <div style={{ fontSize: '14px', lineHeight: 1.6, marginTop: '20px', opacity: 0.8, fontStyle: 'italic' }}>
                            "Every movement in the workshop is a deliberate step toward perfection."
                        </div>
                    </div>
                </PortfolioCard>

                {/* Stat Cards - Span 3 */}
                <PortfolioCard style={{ gridColumn: 'span 3' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: '700', letterSpacing: '1px' }}>PRODUCTION</div>
                    <div style={{ fontSize: '3rem', fontWeight: '300', fontFamily: 'var(--font-serif)', color: 'var(--gold)', margin: '10px 0' }}>24</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Active vehicles in detailing bays.</div>
                </PortfolioCard>

                <PortfolioCard style={{ gridColumn: 'span 3' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: '700', letterSpacing: '1px' }}>COMPLIANCE</div>
                    <div style={{ fontSize: '3rem', fontWeight: '300', fontFamily: 'var(--font-serif)', color: '#fff', margin: '10px 0' }}>92%</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Live SLA compliance rating.</div>
                </PortfolioCard>

                <PortfolioCard style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: '700', letterSpacing: '1px', marginBottom: '5px' }}>NETWORK</div>
                        <div style={{ fontSize: '2rem', fontWeight: '900', color: '#fff' }}>04</div>
                    </div>
                </PortfolioCard>

                {/* Wide Widget - Span 8 */}
                <PortfolioCard style={{ gridColumn: 'span 8', padding: 0, overflow: 'hidden' }}>
                    <MeetingRoomWidget />
                </PortfolioCard>

                {/* Note Widget - Span 4 */}
                <PortfolioCard style={{ gridColumn: 'span 4' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: '700', letterSpacing: '1px', marginBottom: '15px' }}>MEMENTO</div>
                    <QuickNotes />
                </PortfolioCard>
            </PortfolioGrid>
        </PortfolioPage>
    );
};

export default HomePage;
