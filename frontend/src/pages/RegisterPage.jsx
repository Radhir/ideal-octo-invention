import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import {
    User, Briefcase, FileText, Heart, CheckCircle2,
    ArrowRight, ArrowLeft, Loader2, Upload
} from 'lucide-react';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [photoPreview, setPhotoPreview] = useState(null);
    const [form, setForm] = useState({
        username: '', email: '', password: '', confirmPassword: '',
        first_name: '', last_name: '',
        role: '', employee_id: '',
        bio: '', emergency_contact_1_name: '', emergency_contact_1_phone: '',
        profile_photo: null
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, profile_photo: file });
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const nextStep = () => {
        if (validateStep()) setStep(p => p + 1);
    };

    const prevStep = () => setStep(p => p - 1);

    const validateStep = () => {
        if (step === 1) {
            if (!form.username || !form.password || !form.first_name) {
                setError('Please fill in all required fields.');
                return false;
            }
            if (form.password !== form.confirmPassword) {
                setError('Passwords do not match.');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep()) return;
        setLoading(true);

        try {
            await api.post('/api/auth/register/', {
                username: form.username,
                email: form.email,
                password: form.password,
                first_name: form.first_name,
                last_name: form.last_name
            });
            // Simplified registration for now - User Profile updates would happen post-login or via separate endpoint
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError('Registration failed. Username may be taken.');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, title: 'Account', icon: <User size={18} /> },
        { id: 2, title: 'Professional', icon: <Briefcase size={18} /> },
        { id: 3, title: 'Personal', icon: <Heart size={18} /> },
    ];

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#0a0a0a' }}>
            {/* Left Side - Visual */}
            <div className="desktop-visual" style={{
                flex: '1', position: 'relative',
                display: 'none',
                '@media (min-width: 1024px)': { display: 'block' }
            }}>

                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'url(/assets/register-bg.jpg) center/cover no-repeat', // Fallback
                    filter: 'grayscale(100%) brightness(0.4)'
                }}>
                    <div style={{ width: '100%', height: '100%', background: '#111' }} /> {/* Placeholder if image missing */}
                </div>
                <div style={{
                    position: 'absolute', bottom: '80px', left: '80px', maxWidth: '400px',
                    color: 'var(--cream, #f5f5f5)'
                }}>
                    <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', lineHeight: 1, marginBottom: '20px' }}>Join the Elite.</h1>
                    <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                        Create your profile to access the operational ecosystem.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div style={{
                flex: '1', display: 'flex', flexDirection: 'column',
                padding: '40px', overflowY: 'auto'
            }}>
                <div style={{ maxWidth: '500px', width: '100%', margin: 'auto' }}>

                    <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <img src="/elite_shine_logo.png" alt="Logo" style={{ height: '40px', marginBottom: '20px' }} />
                            <h2 style={{ color: '#fff', fontSize: '1.8rem', margin: 0 }}>Create Account</h2>
                        </div>
                        <div style={{ textAlign: 'right', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                            Step {step} of 3
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '40px' }}>
                        {steps.map(s => (
                            <div key={s.id} style={{
                                flex: 1, height: '4px', borderRadius: '2px',
                                background: s.id <= step ? 'var(--gold, #b08d57)' : 'rgba(255,255,255,0.1)'
                            }} />
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="animate-fade-in">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                    <InputGroup label="First Name" name="first_name" value={form.first_name} onChange={handleChange} />
                                    <InputGroup label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} />
                                </div>
                                <InputGroup label="Username" name="username" value={form.username} onChange={handleChange} mb="20px" />
                                <InputGroup label="Email Address" type="email" name="email" value={form.email} onChange={handleChange} mb="20px" />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                    <InputGroup label="Password" type="password" name="password" value={form.password} onChange={handleChange} />
                                    <InputGroup label="Confirm Password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-fade-in">
                                <InputGroup label="Role / Position" name="role" value={form.role} onChange={handleChange} mb="20px" placeholder="e.g. Technician" />
                                <InputGroup label="Employee ID" name="employee_id" value={form.employee_id} onChange={handleChange} mb="20px" placeholder="Optional" />

                                <div style={{ marginBottom: '25px' }}>
                                    <label style={labelStyle}>Profile Photo</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{
                                            width: '60px', height: '60px', borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.05)', overflow: 'hidden',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {photoPreview ?
                                                <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                                                <User color="rgba(255,255,255,0.2)" />
                                            }
                                        </div>
                                        <label style={{
                                            padding: '8px 16px', border: '1px dashed rgba(255,255,255,0.2)',
                                            borderRadius: '6px', color: 'var(--gold, #b08d57)', fontSize: '12px',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                                        }}>
                                            <Upload size={14} /> Upload Image
                                            <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-fade-in">
                                <InputGroup label="Emergency Contact Name" name="emergency_contact_1_name" value={form.emergency_contact_1_name} onChange={handleChange} mb="20px" />
                                <InputGroup label="Emergency Contact Phone" name="emergency_contact_1_phone" value={form.emergency_contact_1_phone} onChange={handleChange} mb="20px" />
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={labelStyle}>Bio</label>
                                    <textarea
                                        name="bio"
                                        value={form.bio}
                                        onChange={handleChange}
                                        rows={3}
                                        style={{ ...inputBaseStyle, resize: 'none' }}
                                        placeholder="Short professional bio..."
                                    />
                                </div>
                            </div>
                        )}

                        {error && <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '20px' }}>{error}</div>}

                        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                            {step > 1 && (
                                <button type="button" onClick={prevStep} style={secondaryBtnStyle}>
                                    <ArrowLeft size={18} /> Back
                                </button>
                            )}

                            {step < 3 ? (
                                <button type="button" onClick={nextStep} style={primaryBtnStyle}>
                                    Next Step <ArrowRight size={18} />
                                </button>
                            ) : (
                                <button type="submit" style={primaryBtnStyle} disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={18} /> Create Account</>}
                                </button>
                            )}
                        </div>
                    </form>

                    <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--gold, #b08d57)', textDecoration: 'none' }}>Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InputGroup = ({ label, type = "text", name, value, onChange, mb = "0px", placeholder = "" }) => (
    <div style={{ marginBottom: mb }}>
        <label style={labelStyle}>{label}</label>
        <input
            type={type} name={name} value={value} onChange={onChange}
            placeholder={placeholder}
            style={inputBaseStyle}
        />
    </div>
);

const labelStyle = {
    display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px',
    textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: '600'
};

const inputBaseStyle = {
    width: '100%', padding: '12px 15px', background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    color: '#fff', fontSize: '14px', outline: 'none'
};

const primaryBtnStyle = {
    flex: 1, padding: '14px', background: 'var(--gold, #b08d57)', border: 'none',
    borderRadius: '8px', color: '#000', fontWeight: '600', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
};

const secondaryBtnStyle = {
    flex: 1, padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
};

export default RegisterPage;
