import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { UserPlus, ArrowLeft, Save, Shield, DollarSign, Calendar } from 'lucide-react';

const EmployeeRegistration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        email: '',
        employee_id: '',
        pin_code: '',
        role: '',
        basic_salary: '0.00',
        housing_allowance: '0.00',
        transport_allowance: '0.00',
        date_joined: new Date().toISOString().split('T')[0]
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // First create user, then profile (simplified for this demo)
            // In a real app, this would be an atomic backend action
            alert('Registration logic triggered. (Backend integration in progress)');
            navigate('/hr');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '30px 20px' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                <button
                    onClick={() => navigate('/hr')}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: '#fff' }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: '900', margin: 0 }}>OFFBOARDING / REGISTRATION</h1>
                    <p style={{ color: '#94a3b8' }}>Onboard a new team member to Elite Shine</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                <GlassCard style={{ padding: '40px' }}>
                    <h3 style={{ marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px' }}>Personal & Security</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label className="form-label">Username</label>
                            <input name="username" className="form-control" onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="form-label">PIN Code (4-6 digits)</label>
                            <input name="pin_code" className="form-control" onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="form-label">First Name</label>
                            <input name="first_name" className="form-control" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="form-label">Last Name</label>
                            <input name="last_name" className="form-control" onChange={handleChange} />
                        </div>
                    </div>

                    <h3 style={{ marginTop: '40px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px' }}>Professional Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label className="form-label">Role / Designation</label>
                            <select name="role" className="form-control" onChange={handleChange}>
                                <option value="">Select Role</option>
                                <option value="Detailer">Detailer</option>
                                <option value="Technician">Technician</option>
                                <option value="Manager">Manager</option>
                                <option value="Sales">Sales Advisor</option>
                                <option value="Social Media">Social Media Specialist</option>
                                <option value="SEO">SEO / Digital Marketer</option>
                                <option value="Videographer">Videographer</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Employee ID</label>
                            <input name="employee_id" className="form-control" placeholder="ES-000" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="form-label">Basic Salary (AED)</label>
                            <input name="basic_salary" className="form-control" type="number" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="form-label">Date Joined</label>
                            <input name="date_joined" className="form-control" type="date" value={formData.date_joined} onChange={handleChange} />
                        </div>
                    </div>
                </GlassCard>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <GlassCard style={{ padding: '30px' }}>
                        <h4 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#b08d57' }}>SYSTEM ACCESS</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(59,130,246,0.1)', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.2)' }}>
                            <Shield color="#3b82f6" />
                            <div style={{ fontSize: '12px' }}>Standard user permissions will be granted upon activation.</div>
                        </div>
                    </GlassCard>

                    <button type="submit" className="btn-primary" style={{ height: '60px', fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <Save size={20} /> Register Member
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmployeeRegistration;
