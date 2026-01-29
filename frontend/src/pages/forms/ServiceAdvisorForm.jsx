import React, { useState } from 'react';
import GlassCard from '../../components/GlassCard';
import SignaturePad from '../../components/SignaturePad';
import OCRScanner from '../../components/OCRScanner';
import { Car, AlertCircle, CheckCircle } from 'lucide-react';

const ServiceAdvisorForm = () => {
    const [vehicleData, setVehicleData] = useState({
        name: '', model: '', plate: '', jobCard: '', odo: ''
    });

    const checklistItems = [
        "Dashboard Condition", "Steering Wheel", "Gear Lever", "AC Functionality",
        "Radio/Infotainment", "Reverse Camera", "Instrument Cluster", "Warning Signs",
        "Power Windows", "Central Locking", "Seat Adjustment", "Seat Belts",
        "Sunroof", "Horn", "Floor Mats"
    ];

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>Service Advisor Checklist</h1>
                    <p style={{ color: '#94a3b8', fontSize: '14px' }}>Comprehensive vehicle intake inspection</p>
                </div>
                <OCRScanner onScan={(data) => setVehicleData(prev => ({ ...prev, ...data }))} />
            </div>

            {/* Vehicle Details Input */}
            <GlassCard>
                <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div className="input-group">
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>Customer Name</label>
                        <input
                            placeholder="Full Name"
                            style={inputStyle}
                            value={vehicleData.name}
                            onChange={e => setVehicleData({ ...vehicleData, name: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>Vehicle Model</label>
                        <input
                            placeholder="e.g. Porsche 911"
                            style={inputStyle}
                            value={vehicleData.model}
                            onChange={e => setVehicleData({ ...vehicleData, model: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>Plate Number</label>
                        <input
                            placeholder="DXB A 12345"
                            style={inputStyle}
                            value={vehicleData.plate}
                            onChange={e => setVehicleData({ ...vehicleData, plate: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>Job Card #</label>
                        <input
                            placeholder="JC-2024-..."
                            style={inputStyle}
                            value={vehicleData.jobCard}
                            onChange={e => setVehicleData({ ...vehicleData, jobCard: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>Odometer (KM)</label>
                        <input
                            placeholder="0"
                            style={inputStyle}
                            value={vehicleData.odo}
                            onChange={e => setVehicleData({ ...vehicleData, odo: e.target.value })}
                        />
                    </div>
                </div>
            </GlassCard>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                {/* Exterior Inspection (Visual Markup Placeholder) */}
                <GlassCard>
                    <div style={{ padding: '24px', height: '100%' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Car size={20} color="#b08d57" /> Exterior Inspection
                        </h3>
                        <div style={{
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: '12px',
                            height: '400px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px dashed rgba(255,255,255,0.1)',
                            position: 'relative'
                        }}>
                            <Car size={80} color="#475569" style={{ opacity: 0.5, marginBottom: '16px' }} />
                            <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>
                                Interactive 360° Vehicle Diagram<br />
                                <span style={{ fontSize: '12px', color: '#64748b' }}>Click to mark scratches / dents</span>
                            </p>
                        </div>
                    </div>
                </GlassCard>

                {/* Interior Checklist */}
                <GlassCard>
                    <div style={{ padding: '0', height: '100%', maxHeight: '500px', overflowY: 'auto' }}>
                        <div style={{
                            padding: '24px',
                            position: 'sticky',
                            top: 0,
                            background: 'rgba(15, 23, 42, 0.95)',
                            zIndex: 10,
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>Interior Check</h3>
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{checklistItems.length} Points</span>
                        </div>

                        <div style={{ padding: '10px 24px 24px 24px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                                        <th style={{ paddingBottom: '12px', width: '60%' }}>Item</th>
                                        <th style={{ paddingBottom: '12px', textAlign: 'center' }}>Pass</th>
                                        <th style={{ paddingBottom: '12px', textAlign: 'center' }}>Fail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checklistItems.map((item, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            <td style={{ padding: '12px 0', color: '#e2e8f0', fontSize: '14px' }}>{item}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <input type="checkbox" style={{ accentColor: '#10b981', width: '16px', height: '16px', cursor: 'pointer' }} />
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <input type="checkbox" style={{ accentColor: '#ef4444', width: '16px', height: '16px', cursor: 'pointer' }} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Inventory / Loose Items */}
            <GlassCard>
                <div style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginBottom: '16px' }}>Inventory & Loose Items</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                        {['Spare Wheel', 'Jack & Tools', 'First Aid Kit', 'Fire Extinguisher', 'Owner Manual', 'Service Book', 'Key Lock Nut'].map(item => (
                            <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1', fontSize: '14px', cursor: 'pointer' }}>
                                <input type="checkbox" style={{ accentColor: '#b08d57', width: '16px', height: '16px' }} />
                                {item}
                            </label>
                        ))}
                    </div>
                </div>
            </GlassCard>

            {/* Signatures */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <SignaturePad label="Service Advisor Signature" />
                <SignaturePad label="Customer Signature (Acceptance)" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '20px', paddingBottom: '40px' }}>
                <button style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer'
                }}>
                    Save Draft
                </button>
                <button style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #b08d57 0%, #8a6d43 100%)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(176, 141, 87, 0.4)',
                    cursor: 'pointer'
                }}>
                    Submit Inspection
                </button>
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '10px 12px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none'
};

export default ServiceAdvisorForm;
