import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import SignaturePad from '../../components/SignaturePad';
import OCRScanner from '../../components/OCRScanner';
import { Car, AlertCircle, CheckCircle, Save } from 'lucide-react';

const ServiceAdvisorForm = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const jobId = searchParams.get('jobId');

    const [vehicleData, setVehicleData] = useState({
        name: '', model: '', plate: '', jobCard: '', odo: '', jobId: jobId || ''
    });
    const [loading, setLoading] = useState(false);

    const checklistItems = [
        "Dashboard Condition", "Steering Wheel", "Gear Lever", "AC Functionality",
        "Radio/Infotainment", "Reverse Camera", "Instrument Cluster", "Warning Signs",
        "Power Windows", "Central Locking", "Seat Adjustment", "Seat Belts",
        "Sunroof", "Horn", "Floor Mats"
    ];

    useEffect(() => {
        if (jobId) {
            fetchJobData();
        }
    }, [jobId]);

    const fetchJobData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/forms/job-cards/api/jobs/${jobId}/`);
            const job = res.data;
            setVehicleData({
                name: job.customer_name || '',
                model: `${job.brand} ${job.model}` || '',
                plate: job.registration_number || '',
                jobCard: job.job_card_number || '',
                odo: job.kilometers || '',
                jobId: job.id
            });
        } catch (err) {
            console.error('Error fetching job details:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submissionData = {
                ...vehicleData,
                job_card: vehicleData.jobId,
                date: new Date().toISOString().split('T')[0],
                // Add other sections like checklist, inventory later or if needed
            };
            await api.post('/forms/checklists/api/checklists/', submissionData);
            alert('Checklist Submitted Successfully!');
            navigate(`/job-cards/${vehicleData.jobId}`);
        } catch (err) {
            console.error('Error submitting checklist:', err);
            alert('Failed to submit checklist.');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', color: 'var(--text-primary)' }}>

            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>Service Advisor Checklist</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Comprehensive vehicle intake inspection</p>
                </div>
                <OCRScanner onScan={(data) => setVehicleData(prev => ({ ...prev, ...data }))} />
            </div>

            {/* Vehicle Details Input */}
            <GlassCard>
                <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div className="input-group">
                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px' }}>Customer Name</label>
                        <input
                            placeholder="Full Name"
                            style={getInputStyle()}
                            value={vehicleData.name}
                            onChange={e => setVehicleData({ ...vehicleData, name: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px' }}>Vehicle Model</label>
                        <input
                            placeholder="e.g. Porsche 911"
                            style={getInputStyle()}
                            value={vehicleData.model}
                            onChange={e => setVehicleData({ ...vehicleData, model: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px' }}>Plate Number</label>
                        <input
                            placeholder="DXB A 12345"
                            style={getInputStyle()}
                            value={vehicleData.plate}
                            onChange={e => setVehicleData({ ...vehicleData, plate: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px' }}>Job Card #</label>
                        <input
                            placeholder="JC-2024-..."
                            style={getInputStyle()}
                            value={vehicleData.jobCard}
                            onChange={e => setVehicleData({ ...vehicleData, jobCard: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px' }}>Odometer (KM)</label>
                        <input
                            placeholder="0"
                            style={getInputStyle()}
                            value={vehicleData.odo}
                            onChange={e => setVehicleData({ ...vehicleData, odo: e.target.value })}
                        />
                    </div>
                </div>
            </GlassCard>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>

                {/* Exterior Inspection (Visual Markup Placeholder) */}
                <GlassCard>
                    <div style={{ padding: '24px', height: '100%' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Car size={20} color="var(--gold)" /> Exterior Inspection
                        </h3>
                        <div style={{
                            background: 'var(--input-bg)',
                            borderRadius: '12px',
                            height: '400px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px dashed var(--border-color)',
                            position: 'relative'
                        }}>
                            <Car size={80} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: '16px' }} />
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center' }}>
                                Interactive 360° Vehicle Diagram<br />
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Click to mark scratches / dents</span>
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
                            background: 'var(--bg-secondary)',
                            zIndex: 10,
                            borderBottom: '1px solid var(--border-color)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Interior Check</h3>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{checklistItems.length} Points</span>
                        </div>

                        <div style={{ padding: '10px 24px 24px 24px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                                        <th style={{ paddingBottom: '12px', width: '60%' }}>Item</th>
                                        <th style={{ paddingBottom: '12px', textAlign: 'center' }}>Pass</th>
                                        <th style={{ paddingBottom: '12px', textAlign: 'center' }}>Fail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checklistItems.map((item, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '12px 0', color: 'var(--text-primary)', fontSize: '14px' }}>{item}</td>
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
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '16px' }}>Inventory & Loose Items</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                        {['Spare Wheel', 'Jack & Tools', 'First Aid Kit', 'Fire Extinguisher', 'Owner Manual', 'Service Book', 'Key Lock Nut'].map(item => (
                            <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '14px', cursor: 'pointer' }}>
                                <input type="checkbox" style={{ accentColor: 'var(--gold)', width: '16px', height: '16px' }} />
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
                    background: 'var(--bg-glass)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                }}>
                    Save Draft
                </button>
                <button style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-mute) 100%)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px var(--gold-glow)',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                }}>
                    Submit Inspection
                </button>
            </div>
        </div>
    );
};

const getInputStyle = () => ({
    width: '100%',
    background: 'var(--input-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '10px 12px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s'
});

export default ServiceAdvisorForm;
