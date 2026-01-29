import React, { useState } from 'react';
import { AlertTriangle, Clock, ShieldAlert, CheckCircle } from 'lucide-react';

const WorkshopHub = () => {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = ["Service Delays", "Workshop Incidents", "Performance"];

    return (
        <div className="p-8 max-w-7xl mx-auto" style={{ color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 800, margin: 0 }}>Workshop Operations</h1>
                    <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Manage service delays, incidents, and workshop performance</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-primary">Report Delay</button>
                    <button style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem 1.5rem', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer' }}>Report Incident</button>
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

            {activeTab === 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '0.75rem' }}>
                                <Clock style={{ color: '#f59e0b' }} size={24} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Delay #SD-2024-001</h3>
                                    <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 'bold' }}>Customer Informed</span>
                                </div>
                                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>Job Card: JC-00892 | Ford Mustang</p>
                                <p style={{ color: '#cbd5e1', marginTop: '1rem', fontStyle: 'italic', fontSize: '0.9rem' }}>"Waiting for specialized parts from supplier. Estimated delay: 4 hours."</p>
                                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                                    <span>Reported by: Radhir</span>
                                    <span>2 hours ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 1 && (
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem', textAlign: 'center' }}>
                    <CheckCircle size={48} style={{ color: '#10b981', marginBottom: '1rem' }} />
                    <h3 style={{ margin: 0 }}>All Clear</h3>
                    <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>No active workshop incidents reported in the last 24 hours.</p>
                </div>
            )}

            {activeTab === 2 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { label: 'Avg. Delay Duration', value: '1.4 hrs' },
                        { label: 'Resolution Rate', value: '94%' },
                        { label: 'Incidents (MTD)', value: '2' }
                    ].map(stat => (
                        <div key={stat.label} className="glass-card" style={{ padding: '1.5rem' }}>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>{stat.label}</p>
                            <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 0' }}>{stat.value}</h2>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WorkshopHub;
