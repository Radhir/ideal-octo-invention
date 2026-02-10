import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { UserPlus, ArrowLeft, Save, Shield, DollarSign, Calendar } from 'lucide-react';

const EmployeeRegistration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        employee_id: '',
        fullName: '', // Used for User creation splitting
        nationality: '',
        gender: 'Male',
        dob: '',
        marital_status: 'Single',
        department: '',
        role: '',
        manager: '',
        date_joined: new Date().toISOString().split('T')[0],
        salary_type: 'MONTHLY',
        basic_salary: '0.00',
        workEmail: '',
        uae_address: '',
        uae_mobile: '',
        uae_emer_name: '',
        uae_emer_rel: '',
        uae_emer_phone: '',
        home_country: '',
        home_address: '',
        home_mobile: '',
        home_emer_name: '',
        home_emer_rel: '',
        home_emer_phone: '',
        passport_no: '',
        passport_expiry: '',
        visa_uid: '',
        visa_expiry: '',
        skills: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Map 'Work Email' to 'user.email' and other fields appropriately
            await api.post('/hr/api/employees/', formData);
            alert('Personnel Node Secured in Master Database.');
            navigate('/hr');
        } catch (err) {
            console.error(err);
            alert('Failed to register employee. Check network status.');
        }
    };

    const fillDemo = () => {
        setFormData({
            ...formData,
            employee_id: "ES-2026-882",
            fullName: "Ravit Adhir",
            nationality: "Indian",
            department: "Cyber Security",
            role: "Senior Scientist",
            uaeAddress: "Downtown Dubai, Tower 1",
            homeCountry: "India",
            skills: "React, Three.js, LLM Architecture, Security Protocols",
            baseSalary: "15000"
        });
    };

    return (
        <div style={{ padding: '40px 30px', background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        onClick={() => navigate('/hr')}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: '#fff' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div style={{ color: '#b08d57', fontWeight: '900', letterSpacing: '4px', fontSize: '10px', marginBottom: '5px' }}>HUMAN CAPITAL MANAGEMENT</div>
                        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>EMPLOYEE ONBOARDING</h1>
                    </div>
                </div>
                <button onClick={fillDemo} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
                    AUTO-FILL SIMULATION
                </button>
            </header>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>

                    {/* section 1: identity */}
                    <GlassCard style={{ padding: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
                            <UserPlus size={24} color="#b08d57" />
                            <h3 style={{ fontFamily: 'Cinzel, serif', margin: 0, letterSpacing: '2px' }}>PERSONAL IDENTITY</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
                            <FormGroup label="Employee ID" name="employee_id" value={formData.employee_id} onChange={handleChange} required />
                            <FormGroup label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
                            <FormGroup label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} />
                            <FormGroup label="Gender" name="gender" type="select" options={['Male', 'Female']} value={formData.gender} onChange={handleChange} />
                            <FormGroup label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                            <FormGroup label="Marital Status" name="marital_status" type="select" options={['Single', 'Married', 'Divorced']} value={formData.marital_status} onChange={handleChange} />
                        </div>
                    </GlassCard>

                    {/* section 2: professional */}
                    <GlassCard style={{ padding: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
                            <Shield size={24} color="#b08d57" />
                            <h3 style={{ fontFamily: 'Cinzel, serif', margin: 0, letterSpacing: '2px' }}>PROFESSIONAL DEPLOYMENT</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
                            <FormGroup label="Department" name="department" type="select" options={['Cyber Security', 'IT & Development', 'Engineering', 'HR & Admin', 'Sales', 'Executive Office']} value={formData.department} onChange={handleChange} />
                            <FormGroup label="Position / Role" name="role" value={formData.role} onChange={handleChange} />
                            <FormGroup label="Reporting Manager" name="manager" value={formData.manager} onChange={handleChange} />
                            <FormGroup label="Joining Date" name="date_joined" type="date" value={formData.date_joined} onChange={handleChange} />
                            <FormGroup label="Salary Type" name="salary_type" type="select" options={['MONTHLY', 'DAILY', 'HOURLY']} value={formData.salary_type} onChange={handleChange} />
                            <FormGroup label="Base Rate / Salary (AED)" name="basic_salary" type="number" value={formData.basic_salary} onChange={handleChange} />
                            <FormGroup label="Work Email" name="workEmail" type="email" value={formData.workEmail} onChange={handleChange} />
                        </div>
                    </GlassCard>

                    {/* section 3: locations */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        <GlassCard style={{ padding: '30px', borderLeft: '4px solid #b08d57' }}>
                            <h4 style={{ color: '#b08d57', fontSize: '0.8rem', letterSpacing: '3px', marginBottom: '25px' }}>CURRENT LOCATION (UAE)</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <FormGroup label="UAE Address" name="uae_address" value={formData.uae_address} onChange={handleChange} />
                                <FormGroup label="UAE Mobile" name="uae_mobile" value={formData.uae_mobile} onChange={handleChange} />
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '15px' }}>EMERGENCY CONTACT (LOCAL)</div>
                                    <div style={{ display: 'grid', gap: '15px' }}>
                                        <input name="uae_emer_name" placeholder="Name" value={formData.uae_emer_name} onChange={handleChange} className="form-control" style={{ border: 'none', background: 'rgba(255,255,255,0.03)' }} />
                                        <input name="uae_emer_rel" placeholder="Relation" value={formData.uae_emer_rel} onChange={handleChange} className="form-control" style={{ border: 'none', background: 'rgba(255,255,255,0.03)' }} />
                                        <input name="uae_emer_phone" placeholder="Phone" value={formData.uae_emer_phone} onChange={handleChange} className="form-control" style={{ border: 'none', background: 'rgba(255,255,255,0.03)' }} />
                                    </div>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard style={{ padding: '30px', borderLeft: '4px solid #64748b' }}>
                            <h4 style={{ color: '#64748b', fontSize: '0.8rem', letterSpacing: '3px', marginBottom: '25px' }}>HOME COUNTRY ORIGIN</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <FormGroup label="Country of Origin" name="home_country" value={formData.home_country} onChange={handleChange} />
                                <FormGroup label="Home Address" name="home_address" value={formData.home_address} onChange={handleChange} />
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '15px' }}>EMERGENCY CONTACT (HOME)</div>
                                    <div style={{ display: 'grid', gap: '15px' }}>
                                        <input name="home_emer_name" placeholder="Name" value={formData.home_emer_name} onChange={handleChange} className="form-control" style={{ border: 'none', background: 'rgba(255,255,255,0.03)' }} />
                                        <input name="home_emer_rel" placeholder="Relation" value={formData.home_emer_rel} onChange={handleChange} className="form-control" style={{ border: 'none', background: 'rgba(255,255,255,0.03)' }} />
                                        <input name="home_emer_phone" placeholder="Phone" value={formData.home_emer_phone} onChange={handleChange} className="form-control" style={{ border: 'none', background: 'rgba(255,255,255,0.03)' }} />
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* section 4: compliance & skills */}
                    <GlassCard style={{ padding: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                            <Calendar size={24} color="#b08d57" />
                            <h3 style={{ fontFamily: 'Cinzel, serif', margin: 0, letterSpacing: '2px' }}>COMPLIANCE & COMPETENCIES</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '30px' }}>
                            <FormGroup label="Passport No" name="passport_no" value={formData.passport_no} onChange={handleChange} />
                            <FormGroup label="Passp. Expiry" name="passport_expiry" type="date" value={formData.passport_expiry} onChange={handleChange} />
                            <FormGroup label="Visa UID" name="visa_uid" value={formData.visa_uid} onChange={handleChange} />
                            <FormGroup label="Visa Expiry" name="visa_expiry" type="date" value={formData.visa_expiry} onChange={handleChange} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label className="form-label" style={{ color: '#b08d57', fontSize: '11px', letterSpacing: '2px' }}>SKILL SET SYNOPSIS</label>
                            <textarea
                                name="skills"
                                className="form-control"
                                rows="3"
                                placeholder="Comma separated competencies..."
                                value={formData.skills}
                                onChange={handleChange}
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px' }}
                            />
                        </div>
                    </GlassCard>

                    <button type="submit" className="btn-primary" style={{ height: '70px', fontSize: '1.2rem', fontWeight: '900', fontFamily: 'Cinzel, serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', boxShadow: '0 0 30px rgba(176,141,87,0.2)' }}>
                        <Save size={24} /> SECURE RECORD IN ARCHIVE
                    </button>
                </div>
            </form>
        </div>
    );
};

const FormGroup = ({ label, name, value, onChange, type = 'text', options = [], required = false }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label className="form-label" style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>{label}</label>
        {type === 'select' ? (
            <select name={name} className="form-control" value={value} onChange={onChange} required={required}>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        ) : (
            <input
                name={name}
                type={type}
                className="form-control"
                value={value}
                onChange={onChange}
                required={required}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            />
        )}
    </div>
);

export default EmployeeRegistration;
