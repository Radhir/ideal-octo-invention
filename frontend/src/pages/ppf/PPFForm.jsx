import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { Save, ArrowLeft, PenTool } from 'lucide-react';
import SignaturePad from '../../components/SignaturePad';

const PPFForm = () => {
    const navigate = useNavigate();
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
        branch_location: 'DXB',
        film_brand: '',
        film_type: 'GLOSS',
        coverage_area: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/forms/ppf/api/warranties/', formData);
            alert('Warranty Registered Successfully');
            navigate('/ppf');
        } catch (err) {
            console.error('Error saving warranty', err);
            alert('Failed to save warranty. Check console for details.');
        }
    };

    return (
        <div style={{ padding: '30px 20px' }}>
            <button
                onClick={() => navigate('/ppf')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px' }}
            >
                <ArrowLeft size={20} /> Back to List
            </button>

            <GlassCard style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', color: '#b08d57', marginBottom: '30px', fontSize: '1.8rem' }}>PPF Registration</h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                        <div className="section">
                            <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#b08d57', marginBottom: '15px', borderLeft: '3px solid #b08d57', paddingLeft: '10px' }}>Customer Info</h3>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={labelStyle}>Full Name</label>
                                <input name="full_name" className="form-control" onChange={handleChange} required />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={labelStyle}>Contact Number</label>
                                <input name="contact_number" className="form-control" onChange={handleChange} required />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={labelStyle}>Email</label>
                                <input name="email" type="email" className="form-control" onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="section">
                            <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#b08d57', marginBottom: '15px', borderLeft: '3px solid #b08d57', paddingLeft: '10px' }}>Vehicle Details</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={labelStyle}>Brand</label>
                                    <input name="vehicle_brand" className="form-control" onChange={handleChange} required />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={labelStyle}>Model</label>
                                    <input name="vehicle_model" className="form-control" onChange={handleChange} required />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={labelStyle}>Year</label>
                                    <input name="vehicle_year" type="number" className="form-control" onChange={handleChange} value={formData.vehicle_year} required />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={labelStyle}>Color</label>
                                    <input name="vehicle_color" className="form-control" onChange={handleChange} required />
                                </div>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={labelStyle}>License Plate</label>
                                <input name="license_plate" className="form-control" onChange={handleChange} required />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={labelStyle}>VIN Number</label>
                                <input name="vin" className="form-control" onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="section" style={{ marginBottom: '30px' }}>
                        <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#b08d57', marginBottom: '15px', borderLeft: '3px solid #b08d57', paddingLeft: '10px' }}>Installation Details</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={labelStyle}>Date</label>
                                <input name="installation_date" type="date" className="form-control" onChange={handleChange} value={formData.installation_date} required />
                            </div>
                            <div>
                                <label style={labelStyle}>Branch</label>
                                <select name="branch_location" className="form-control" onChange={handleChange}>
                                    <option value="DXB">Dubai</option>
                                    <option value="AUH">Abu Dhabi</option>
                                    <option value="SHJ">Sharjah</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Film Type</label>
                                <select name="film_type" className="form-control" onChange={handleChange}>
                                    <option value="GLOSS">Gloss</option>
                                    <option value="MATTE">Matte</option>
                                    <option value="SATIN">Satin</option>
                                    <option value="VINYL">Vinyl Wrap</option>
                                    <option value="COLOR">Color PPF</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={labelStyle}>Film Brand</label>
                                <input name="film_brand" className="form-control" onChange={handleChange} required />
                            </div>
                            <div>
                                <label style={labelStyle}>Coverage Area</label>
                                <input name="coverage_area" className="form-control" onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="section" style={{ marginBottom: '30px' }}>
                        <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#b08d57', marginBottom: '15px', borderLeft: '3px solid #b08d57', paddingLeft: '10px' }}>Customer Authorization</h3>
                        <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '15px' }}>I confirm that the details above are correct and I accept the terms of the PPF warranty.</p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <SignaturePad
                                title="Customer Signature"
                                onSave={(data) => setFormData({ ...formData, signature_data: data })}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <Save size={20} /> Save Warranty
                    </button>
                </form>
            </GlassCard>
        </div>
    );
};

const labelStyle = {
    display: 'block',
    fontSize: '11px',
    color: '#94a3b8',
    marginBottom: '5px',
    textTransform: 'uppercase',
    fontWeight: '600'
};

export default PPFForm;
