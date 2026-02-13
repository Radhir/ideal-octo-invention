import React from 'react';
import GlassCard from '../components/GlassCard';
import {
    Activity, Calculator, Package, Settings, Globe, UserCircle, UserPlus,
    BarChart3, Clock, CheckCircle2, AlertCircle, MessageSquare
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
        <div className="home-page-container">
            <style>{`
                .home-page-container {
                    padding: 40px;
                    max-width: 1400px;
                    margin: 0 auto;
                }
                
                .editorial-grid {
                    display: grid;
                    grid-template-columns: repeat(12, 1fr);
                    grid-auto-rows: minmax(100px, auto);
                    gap: 30px;
                }
                
                .editorial-card {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    padding: 30px;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                }

                .editorial-card:hover {
                    border-color: var(--gold-mute);
                    transform: translateY(-5px);
                }

                .hero-section {
                    grid-column: span 8;
                    grid-row: span 4;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    background: var(--editorial-gradient);
                    padding: 60px;
                    position: relative;
                    overflow: hidden;
                }

                .hero-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 40%;
                    height: 100%;
                    background: url('/elite_shine_hero.jpg') center/cover;
                    opacity: 0.15;
                    mix-blend-mode: overlay;
                }

                .philosophy-card {
                    grid-column: span 4;
                    grid-row: span 4;
                    background: var(--cream);
                    color: var(--umber);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .stat-card {
                    grid-column: span 3;
                    grid-row: span 2;
                }

                .wide-card {
                    grid-column: span 6;
                    grid-row: span 2;
                }

                .tall-card {
                    grid-column: span 3;
                    grid-row: span 4;
                }

                @media (max-width: 1024px) {
                    .hero-section, .philosophy-card, .stat-card, .wide-card, .tall-card {
                        grid-column: span 6;
                    }
                }

                @media (max-width: 768px) {
                    .editorial-grid {
                        grid-template-columns: 1fr;
                    }
                    .hero-section, .philosophy-card, .stat-card, .wide-card, .tall-card {
                        grid-column: span 1;
                        grid-row: span 1;
                    }
                }

                .value-serif {
                    font-family: var(--font-serif);
                    font-size: 4rem;
                    line-height: 1;
                    font-weight: 300;
                }
            `}</style>

            <div className="editorial-grid">
                {/* Hero Section */}
                <div className="editorial-card hero-section">
                    <div className="editorial-label" style={{ marginBottom: '20px' }}>ESTABLISHED 2024</div>
                    <h1 className="serif-display">The Art of <br /> Engineering</h1>
                    <p className="editorial-text" style={{ maxWidth: '500px', marginTop: '30px', fontSize: '1.2rem' }}>
                        Precision mechanics meeting high-fidelity design. We redefine the automotive workshop experience through meticulous attention to detail.
                    </p>
                    <div style={{ marginTop: 'auto', display: 'flex', gap: '20px' }}>
                        <button className="btn-primary" style={{ background: 'var(--gold)', color: '#fff' }}>SYSTEMS</button>
                        <button className="btn-secondary">EXPLORE MISSION</button>
                    </div>
                </div>

                {/* Side Philosophy Card */}
                <div className="editorial-card philosophy-card">
                    <div>
                        <div className="editorial-label" style={{ color: 'var(--umber)', opacity: 0.6 }}>CORE STRATEGY</div>
                        <h2 className="editorial-title" style={{ color: 'var(--umber)', fontSize: '2.5rem', marginTop: '15px' }}>
                            Precision<br />Through<br />Purpose
                        </h2>
                    </div>
                    <div className="editorial-text" style={{ color: 'var(--umber)', fontSize: '15px', opacity: 0.9 }}>
                        "Every movement in the workshop is a deliberate step toward perfection."
                    </div>
                </div>

                {/* Stats */}
                <div className="editorial-card stat-card">
                    <div className="editorial-label">PRODUCTION</div>
                    <div className="value-serif">24</div>
                    <div className="editorial-text" style={{ fontSize: '13px', marginTop: 'auto' }}>
                        Active vehicles in detailing bays.
                    </div>
                </div>

                <div className="editorial-card stat-card">
                    <div className="editorial-label">COMPLIANCE</div>
                    <div className="value-serif">92%</div>
                    <div className="editorial-text" style={{ fontSize: '13px', marginTop: 'auto' }}>
                        Live SLA compliance rating.
                    </div>
                </div>

                {/* Meeting/War Room */}
                <div className="editorial-card wide-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <MeetingRoomWidget />
                </div>

                {/* Quick Access / Notes */}
                <div className="editorial-card tall-card">
                    <div className="editorial-label">MEMENTO</div>
                    <div style={{ marginTop: '20px', flex: 1 }}>
                        <QuickNotes />
                    </div>
                </div>

                <div className="editorial-card stat-card">
                    <div className="editorial-label">NETWORK</div>
                    <div className="value-serif">04</div>
                    <div className="editorial-text" style={{ fontSize: '13px', marginTop: 'auto' }}>
                        Relay nodes active across Dubai.
                    </div>
                </div>

                <div className="editorial-card stat-card">
                    <button className="btn-secondary" style={{ height: '100%', width: '100%', borderRadius: 0, borderStyle: 'dashed' }}>
                        ADD MODULE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;

