import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { AlertTriangle, Clock, ShieldAlert, CheckCircle, Plus, Info } from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioSectionTitle,
    PortfolioButton,
    PortfolioCard,
    GlassCard
} from '../../components/PortfolioComponents';

const WorkshopHub = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [delays, setDelays] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);

    const tabs = ["Service Delays", "Workshop Incidents", "Performance"];

    useEffect(() => {
        fetchWorkshopData();
    }, []);

    const fetchWorkshopData = async () => {
        setLoading(true);
        try {
            const [delayRes, incidentRes] = await Promise.all([
                api.get('/workshop/api/delays/'),
                api.get('/workshop/api/incidents/')
            ]);
            setDelays(delayRes.data);
            setIncidents(incidentRes.data);
        } catch (err) {
            console.error('Error fetching workshop data', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PortfolioPage breadcrumb="OPERATIONS / WORKSHOP HUB">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
                <div>
                    <PortfolioTitle subtitle="Central operational command for workshop agility and safety.">
                        Workshop Hub
                    </PortfolioTitle>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton
                        onClick={() => navigate('/workshop/delay')}
                        variant="secondary"
                    >
                        REPORT DELAY
                    </PortfolioButton>
                    <PortfolioButton
                        onClick={() => navigate('/workshop/incident')}
                        variant="gold"
                    >
                        REPORT INCIDENT
                    </PortfolioButton>
                </div>
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid #1e293b', gap: '2rem', marginBottom: '2rem' }}>
                {tabs.map((tab, idx) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(idx)}
                        style={{
                            padding: '0.5rem 0',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === idx ? '2px solid #b08d57' : '2px solid transparent',
                            color: activeTab === idx ? '#b08d57' : '#94a3b8',
                            fontWeight: activeTab === idx ? '600' : '400',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem', color: '#64748b' }}>SYNCHRONIZING OPERATIONAL DATA...</div>
            ) : (
                <>
                    {activeTab === 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                            {delays.length > 0 ? delays.map(delay => (
                                <GlassCard key={delay.id} style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '0.75rem', height: 'fit-content' }}>
                                            <Clock style={{ color: '#f59e0b' }} size={24} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>{delay.delay_number}</h3>
                                                <span style={{
                                                    backgroundColor: delay.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                    color: delay.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b',
                                                    fontSize: '0.7rem',
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '4px',
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {delay.severity}
                                                </span>
                                            </div>
                                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>Job Card: #{delay.job_card_number}</p>
                                            <p style={{ color: '#cbd5e1', marginTop: '1rem', fontStyle: 'italic', fontSize: '0.9rem' }}>"{delay.delay_reason}"</p>
                                            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                                                <span>Reported by: {delay.reported_by_name || 'System'}</span>
                                                <span>{new Date(delay.reported_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            )) : (
                                <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', color: '#64748b' }}>
                                    <CheckCircle size={48} style={{ color: '#10b981', marginBottom: '1rem', opacity: 0.5 }} />
                                    <h3>No Active Delays</h3>
                                    <p>Workshop timeline is currently optimal.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 1 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                            {incidents.length > 0 ? incidents.map(incident => (
                                <GlassCard key={incident.id} style={{ padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.75rem', height: 'fit-content' }}>
                                            <ShieldAlert style={{ color: '#ef4444' }} size={24} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>{incident.incident_number}</h3>
                                                <span style={{
                                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                                    color: '#ef4444',
                                                    fontSize: '0.7rem',
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '4px',
                                                    fontWeight: 'bold'
                                                }}>{incident.severity}</span>
                                            </div>
                                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>Type: {incident.incident_type.replace('_', ' ')}</p>
                                            <p style={{ color: '#cbd5e1', marginTop: '1rem', fontSize: '0.9rem' }}>{incident.incident_description}</p>
                                            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                                                <span>Location: {incident.incident_location}</span>
                                                <span>{new Date(incident.incident_date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            )) : (
                                <div className="glass-card" style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem', textAlign: 'center' }}>
                                    <CheckCircle size={48} style={{ color: '#10b981', marginBottom: '1rem', opacity: 0.5 }} />
                                    <h3>Zero Incidents</h3>
                                    <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Safe-zone maintained. No incidents reported.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 2 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            {[
                                { label: 'Avg. Delay Duration', value: delays.length > 0 ? (delays.reduce((acc, d) => acc + parseFloat(d.delay_duration_hours || 0), 0) / delays.length).toFixed(1) + ' hrs' : '0 hrs' },
                                { label: 'Active Delays', value: delays.length },
                                { label: 'Incidents Total', value: incidents.length }
                            ].map(stat => (
                                <div key={stat.label} className="glass-card" style={{ padding: '1.5rem' }}>
                                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>{stat.label}</p>
                                    <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 0' }}>{stat.value}</h2>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default WorkshopHub;
