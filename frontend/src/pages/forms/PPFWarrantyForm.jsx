import React from 'react';
import GlassCard from '../../components/GlassCard';
import { ShieldCheck, Calendar, Info, CheckCircle } from 'lucide-react';

const PPFWarrantyForm = () => {
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
                                <input placeholder="e.g. Ahmed Al-Mansoori" style={inputStyle} />
                            </div>
                            <div className="input-group">
                                <label style={labelStyle}>Contact Number</label>
                                <input placeholder="+971 50 ..." style={inputStyle} />
                            </div>
                            <div className="input-group">
                                <label style={labelStyle}>Email Address</label>
                                <input placeholder="client@example.com" style={inputStyle} />
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
                                <input placeholder="Porsche" style={inputStyle} />
                            </div>
                            <div className="input-group">
                                <label style={labelStyle}>Model</label>
                                <input placeholder="Cayenne" style={inputStyle} />
                            </div>
                        </div>
                        <div className="input-group" style={{ marginTop: '16px' }}>
                            <label style={labelStyle}>VIN Number</label>
                            <input placeholder="WP1ZZZ9Y..." style={inputStyle} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                            <div className="input-group">
                                <label style={labelStyle}>Plate No.</label>
                                <input placeholder="DXB ..." style={inputStyle} />
                            </div>
                            <div className="input-group">
                                <label style={labelStyle}>Color</label>
                                <input placeholder="Jet Black" style={inputStyle} />
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
                            <select style={inputStyle}>
                                <option>Ras Al Khor</option>
                                <option>Al Quoz</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Film Type</label>
                            <select style={inputStyle}>
                                <option>Gloss PPF (Self-Healing)</option>
                                <option>Matte PPF</option>
                                <option>Colored PPF</option>
                                <option>Black PPF</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Coverage Area</label>
                            <select style={inputStyle}>
                                <option>Full Body</option>
                                <option>Full Front</option>
                                <option>Custom Panel</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Warranty Period</label>
                            <select style={inputStyle}>
                                <option>3 Years</option>
                                <option>5 Years (Standard)</option>
                                <option>7 Years (Premium)</option>
                                <option>10 Years (Lifetime)</option>
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
                                <th style={{ padding: '12px' }}>Due Date</th>
                                <th style={{ padding: '12px' }}>Inspection Notes</th>
                                <th style={{ padding: '12px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '12px', color: '#e2e8f0' }}>1st Check-up (7 Days)</td>
                                <td style={{ padding: '12px' }}><input type="date" style={miniInputStyle} /></td>
                                <td style={{ padding: '12px' }}>Curing & Bubble Check</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Pending</span>
                                </td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '12px', color: '#e2e8f0' }}>2nd Check-up (6 Months)</td>
                                <td style={{ padding: '12px' }}><input type="date" style={miniInputStyle} /></td>
                                <td style={{ padding: '12px' }}>General Inspection</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ color: '#64748b', background: 'rgba(100, 116, 139, 0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Locked</span>
                                </td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '12px', color: '#e2e8f0' }}>Annual Warranty Service</td>
                                <td style={{ padding: '12px' }}><input type="date" style={miniInputStyle} /></td>
                                <td style={{ padding: '12px' }}>Comprehensive Detail</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ color: '#64748b', background: 'rgba(100, 116, 139, 0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Locked</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            <div style={{ display: 'flex', justifySelf: 'flex-end', marginTop: '20px' }}>
                <button style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #b08d57 0%, #8a6d43 100%)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    boxShadow: '0 4px 20px rgba(176, 141, 87, 0.4)',
                    cursor: 'pointer'
                }}>
                    Issue Digital Warranty Certificate
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
