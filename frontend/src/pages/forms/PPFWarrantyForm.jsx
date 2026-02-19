import React, { useState } from 'react';
import GlassCard from '../../components/GlassCard';
import { ShieldCheck, Calendar, Info, CheckCircle, Save, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const PPFWarrantyForm = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        contact_number: '',
        email: '',
        vehicle_brand: '',
        vehicle_model: '',
        vehicle_year: new Date().getFullYear(),
        vehicle_color: '',
        license_plate: '',
        vin: '',
        installation_date: new Date().toISOString().split('T')[0],
        warranty_duration_years: 5,
        branch_location: 'DXB',
        film_brand: 'Elite Pro Shield', // Default
        film_type: 'GLOSS',
        coverage_area: 'Full Body',
        film_lot_number: '',
        roll_number: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.post('/forms/ppf/api/warranties/', formData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            console.error('Error issuing warranty', err);
            alert('Failed to issue certificate. Please check all fields.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ padding: '100px 20px', textAlign: 'center', color: 'var(--cream)' }}>
                <CheckCircle size={80} color="#10b981" style={{ marginBottom: '30px' }} />
                <h1 style={{ fontSize: '32px', fontFamily: 'var(--font-serif)' }}>CERTIFICATE ISSUED</h1>
                <p style={{ opacity: 0.6, marginTop: '10px' }}>Digital registry synchronization complete.</p>
                <button
                    onClick={() => { setSuccess(false); window.location.reload(); }}
                    style={{ marginTop: '40px', background: 'none', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '12px 30px', borderRadius: '30px', cursor: 'pointer' }}
                >
                    NEW REGISTRATION
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>PPF Warranty Registration</h1>
                    <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>Register new Paint Protection Film installations</p>
                </div>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '6px 12px', borderRadius: '8px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                    <ShieldCheck size={16} />
                    Active Warranty System
                </div>
            </div>

            {/* Customer & Vehicle Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <GlassCard>
                    <div style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#b08d57', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                            Customer Information
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="input-group">
                                <label style={labelStyle}>Full Name</label>
                                <input
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="e.g. Ahmed Al-Mansoori"
                                    style={inputStyle}
                                />
                            </div>
                            <div className="input-group">
                                <label style={labelStyle}>Contact Number</label>
                                <input
                                    name="contact_number"
                                    value={formData.contact_number}
                                    onChange={handleChange}
                                    placeholder="+971 50 ..."
                                    style={inputStyle}
                                />
                            </div>
                            <div className="input-group">
                                <label style={labelStyle}>Email Address</label>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="client@example.com"
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard>
                    <div style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#b08d57', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                            Vehicle Details
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="input-group">
                                <label style={labelStyle}>Brand</label>
                                <input
                                    name="vehicle_brand"
                                    value={formData.vehicle_brand}
                                    onChange={handleChange}
                                    placeholder="Porsche"
                                    style={inputStyle}
                                />
                            </div>
                            <div className="input-group">
                                <label style={labelStyle}>Model</label>
                                <input
                                    name="vehicle_model"
                                    value={formData.vehicle_model}
                                    onChange={handleChange}
                                    placeholder="Cayenne"
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                        <div className="input-group" style={{ marginTop: '16px' }}>
                            <label style={labelStyle}>VIN Number</label>
                            <input
                                name="vin"
                                value={formData.vin}
                                onChange={handleChange}
                                placeholder="WP1ZZZ9Y..."
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                            <div className="input-group">
                                <label style={labelStyle}>Plate No.</label>
                                <input
                                    name="license_plate"
                                    value={formData.license_plate}
                                    onChange={handleChange}
                                    placeholder="DXB ..."
                                    style={inputStyle}
                                />
                            </div>
                            <div className="input-group">
                                <label style={labelStyle}>Color</label>
                                <input
                                    name="vehicle_color"
                                    value={formData.vehicle_color}
                                    onChange={handleChange}
                                    placeholder="Jet Black"
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Installation Specs */}
            <GlassCard>
                <div style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginBottom: '20px' }}>
                        Installation Specifications
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        <div>
                            <label style={labelStyle}>Branch</label>
                            <select
                                name="branch_location"
                                value={formData.branch_location}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="DXB">Dubai (Ras Al Khor)</option>
                                <option value="AUH">Abu Dhabi</option>
                                <option value="SHJ">Sharjah</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Film Type</label>
                            <select
                                name="film_type"
                                value={formData.film_type}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="GLOSS">Gloss PPF (Self-Healing)</option>
                                <option value="MATTE">Matte PPF</option>
                                <option value="SATIN">Satin PPF</option>
                                <option value="COLOR">Colored PPF</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Coverage Area</label>
                            <input
                                name="coverage_area"
                                value={formData.coverage_area}
                                onChange={handleChange}
                                placeholder="Full Body"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Warranty Period</label>
                            <select
                                name="warranty_duration_years"
                                value={formData.warranty_duration_years}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value={2}>2 Years</option>
                                <option value={5}>5 Years (Standard)</option>
                                <option value={10}>10 Years (Premium)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Mandatory Service History Log */}
            <GlassCard>
                <div style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Calendar size={18} color="#b08d57" /> Mandatory Maintenance Schedule
                    </h3>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', textAlign: 'left' }}>
                                <th style={{ padding: '12px' }}>Service Check</th>
                                <th style={{ padding: '12px' }}>Standard Interval</th>
                                <th style={{ padding: '12px' }}>Inspection Focus</th>
                                <th style={{ padding: '12px' }}>Eligibility Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '12px', color: '#e2e8f0' }}>Post-Install Audit</td>
                                <td style={{ padding: '12px' }}>7 Days</td>
                                <td style={{ padding: '12px' }}>Curing & Edge Adhesion</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Pending Install</span>
                                </td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '12px', color: '#e2e8f0' }}>Semi-Annual Review</td>
                                <td style={{ padding: '12px' }}>6 Months</td>
                                <td style={{ padding: '12px' }}>Surface Contamination</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ color: '#64748b', background: 'rgba(100, 116, 139, 0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Scheduled</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            <div style={{ display: 'flex', justifySelf: 'flex-end', marginTop: '20px' }}>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #b08d57 0%, #8a6d43 100%)',
                        color: '#fff',
                        border: 'none',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        boxShadow: '0 4px 20px rgba(176, 141, 87, 0.4)',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px'
                    }}>
                    {loading ? <Loader2 className="spin" size={20} /> : <ShieldCheck size={20} />}
                    {loading ? 'ARCHIVING TO SECURE LEDGER...' : 'Issue Digital Warranty Certificate'}
                </button>
            </div>
        </div>
    );
};

const labelStyle = {
    display: 'block',
    color: '#94a3b8',
    fontSize: '12px',
    marginBottom: '6px',
    fontWeight: '600'
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

const miniInputStyle = {
    ...inputStyle,
    padding: '6px 8px',
    fontSize: '13px'
};

export default PPFWarrantyForm;
