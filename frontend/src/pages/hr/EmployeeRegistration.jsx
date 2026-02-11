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
        pin_code: '', // Mandatory for Employee model
        manager: '',
        date_joined: new Date().toISOString().split('T')[0],
        salary_type: 'MONTHLY',
        basic_salary: '0.00',
        workEmail: '',
        uae_address: '',
        uae_mobile: '',
        uae_emer_name: '',
        uae_emer_relation: '', // Fixed naming
        uae_emer_phone: '',
        home_country: '',
        home_address: '',
        home_mobile: '',
        home_emer_name: '',
        home_emer_relation: '', // Fixed naming
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
            pin_code: "123456",
            department: "Cyber Security",
            role: "Senior Scientist",
            uae_address: "Downtown Dubai, Tower 1",
            home_country: "India",
            skills: "React, Three.js, LLM Architecture, Security Protocols",
            basic_salary: "15000"
        });
    };

    return (
        <div style={{ padding: '40px 30px', background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        onClick={() => navigate('/hr/hub')}
                        style={{ background: 'var(--input-bg)', border: '1.5px solid var(--gold-border)', padding: '12px', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <ArrowLeft size={20} color="var(--gold)" />
                    </button>
                    <div>
                        <div style={{ color: 'var(--gold)', fontWeight: '900', letterSpacing: '4px', fontSize: '10px', marginBottom: '5px', textTransform: 'uppercase' }}>Human Capital Management</div>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>ONBOARDING</h1>
                    </div>
                </div>
                <button onClick={fillDemo} style={{ background: 'var(--input-bg)', border: '1.5px solid var(--gold-border)', color: 'var(--gold)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '900', letterSpacing: '1px' }}>
                    AUTO-FILL SIMULATION
                </button>
            </header>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>

                    {/* section 1: identity */}
                    <GlassCard style={{ padding: '40px', border: '1.5px solid var(--gold-border)', background: 'var(--input-bg)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', borderBottom: '1.5px solid var(--gold-border)', paddingBottom: '20px' }}>
                            <UserPlus size={24} color="var(--gold)" />
                            <h3 style={{ fontFamily: 'Outfit, sans-serif', margin: 0, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Personal Identity Portfolio</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
                            <FormGroup label="Employee ID" name="employee_id" value={formData.employee_id} onChange={handleChange} required />
                            <FormGroup label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
                            <FormGroup label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} />
                            <FormGroup label="Gender" name="gender" type="select" options={['Male', 'Female']} value={formData.gender} onChange={handleChange} />
                            <FormGroup label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                            <FormGroup label="Marital Status" name="marital_status" type="select" options={['Single', 'Married', 'Divorced']} value={formData.marital_status} onChange={handleChange} />
                            <FormGroup label="Security PIN" name="pin_code" type="number" placeholder="6-digit PIN" value={formData.pin_code} onChange={handleChange} required />
                        </div>
                    </GlassCard>

                    {/* section 2: professional */}
                    <GlassCard style={{ padding: '40px', border: '1.5px solid var(--gold-border)', background: 'var(--input-bg)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', borderBottom: '1.5px solid var(--gold-border)', paddingBottom: '20px' }}>
                            <Shield size={24} color="var(--gold)" />
                            <h3 style={{ fontFamily: 'Outfit, sans-serif', margin: 0, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Professional Deployment Protocols</h3>
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
                        <GlassCard style={{ padding: '30px', borderLeft: '6px solid var(--gold)', borderTop: '1.5px solid var(--gold-border)', borderRight: '1.5px solid var(--gold-border)', borderBottom: '1.5px solid var(--gold-border)', background: 'var(--input-bg)' }}>
                            <h4 style={{ color: 'var(--gold)', fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '25px', fontWeight: '900', textTransform: 'uppercase' }}>Current UAE Assignment</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <FormGroup label="UAE Residential Address" name="uae_address" value={formData.uae_address} onChange={handleChange} />
                                <FormGroup label="Primary UAE Mobile" name="uae_mobile" value={formData.uae_mobile} onChange={handleChange} />
                                <div style={{ background: 'var(--bg-glass)', padding: '20px', borderRadius: '12px', border: '1.5px solid var(--gold-border)' }}>
                                    <div style={{ fontSize: '10px', color: 'var(--gold)', marginBottom: '15px', fontWeight: '900', textTransform: 'uppercase' }}>Emergency Local Contact</div>
                                    <div style={{ display: 'grid', gap: '15px' }}>
                                        <input name="uae_emer_name" placeholder="Contact Person Name" value={formData.uae_emer_name} onChange={handleChange} className="form-control" style={{ border: '1px solid var(--gold-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontWeight: '900' }} />
                                        <input name="uae_emer_relation" placeholder="Kinship / Relation" value={formData.uae_emer_relation} onChange={handleChange} className="form-control" style={{ border: '1px solid var(--gold-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontWeight: '900' }} />
                                        <input name="uae_emer_phone" placeholder="Contact Mobile" value={formData.uae_emer_phone} onChange={handleChange} className="form-control" style={{ border: '1px solid var(--gold-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontWeight: '900' }} />
                                    </div>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard style={{ padding: '30px', borderLeft: '6px solid var(--border-color)', borderTop: '1.5px solid var(--gold-border)', borderRight: '1.5px solid var(--gold-border)', borderBottom: '1.5px solid var(--gold-border)', background: 'var(--input-bg)' }}>
                            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '25px', fontWeight: '900', textTransform: 'uppercase' }}>Home Country Repository</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <FormGroup label="Country of Origin" name="home_country" value={formData.home_country} onChange={handleChange} />
                                <FormGroup label="Registered Home Address" name="home_address" value={formData.home_address} onChange={handleChange} />
                                <div style={{ background: 'var(--bg-glass)', padding: '20px', borderRadius: '12px', border: '1.5px solid var(--gold-border)' }}>
                                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '15px', fontWeight: '900', textTransform: 'uppercase' }}>Global Emergency Node</div>
                                    <div style={{ display: 'grid', gap: '15px' }}>
                                        <input name="home_emer_name" placeholder="Home Contact Name" value={formData.home_emer_name} onChange={handleChange} className="form-control" style={{ border: '1px solid var(--gold-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontWeight: '900' }} />
                                        <input name="home_emer_relation" placeholder="Relation Status" value={formData.home_emer_relation} onChange={handleChange} className="form-control" style={{ border: '1px solid var(--gold-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontWeight: '900' }} />
                                        <input name="home_emer_phone" placeholder="International Mobile" value={formData.home_emer_phone} onChange={handleChange} className="form-control" style={{ border: '1px solid var(--gold-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontWeight: '900' }} />
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* section 4: compliance & skills */}
                    <GlassCard style={{ padding: '40px', border: '1.5px solid var(--gold-border)', background: 'var(--input-bg)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', borderBottom: '1.5px solid var(--gold-border)', paddingBottom: '20px' }}>
                            <Calendar size={24} color="var(--gold)" />
                            <h3 style={{ fontFamily: 'Outfit, sans-serif', margin: 0, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Compliance & Competencies</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '30px' }}>
                            <FormGroup label="Passport Node" name="passport_no" value={formData.passport_no} onChange={handleChange} />
                            <FormGroup label="Passport Expiry" name="passport_expiry" type="date" value={formData.passport_expiry} onChange={handleChange} />
                            <FormGroup label="Visa UID" name="visa_uid" value={formData.visa_uid} onChange={handleChange} />
                            <FormGroup label="Visa Expiry" name="visa_expiry" type="date" value={formData.visa_expiry} onChange={handleChange} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label className="form-label" style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '2px', fontWeight: '900', textTransform: 'uppercase' }}>Skill Set Synopsis</label>
                            <textarea
                                name="skills"
                                className="form-control"
                                rows="3"
                                placeholder="List operational capabilities..."
                                value={formData.skills}
                                onChange={handleChange}
                                style={{ background: 'var(--input-bg)', border: '1.5px solid var(--gold-border)', padding: '20px', color: 'var(--text-primary)', fontWeight: '900' }}
                            />
                        </div>
                    </GlassCard>

                    <button type="submit" className="glass-card" style={{ height: '80px', fontSize: '1.25rem', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', background: 'var(--gold)', color: '#000', border: '1.5px solid var(--gold-border)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '2px' }}>
                        <Save size={28} /> SECURE RECORD IN ARCHIVE
                    </button>
                </div>
            </form>
        </div>
    );
};

const FormGroup = ({ label, name, value, onChange, type = 'text', options = [], required = false, placeholder = '' }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label className="form-label" style={{ color: 'var(--gold)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '900' }}>{label}</label>
        {type === 'select' ? (
            <select name={name} className="form-control" value={value} onChange={onChange} required={required} style={{ background: 'var(--input-bg)', border: '1.5px solid var(--gold-border)', color: 'var(--text-primary)', fontWeight: '900', height: '45px' }}>
                {options.map(opt => <option key={opt} value={opt} style={{ background: 'var(--bg-primary)' }}>{opt}</option>)}
            </select>
        ) : (
            <input
                name={name}
                type={type}
                className="form-control"
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                style={{ background: 'var(--input-bg)', border: '1.5px solid var(--gold-border)', color: 'var(--text-primary)', fontWeight: '900', height: '45px' }}
            />
        )}
    </div>
);

export default EmployeeRegistration;
