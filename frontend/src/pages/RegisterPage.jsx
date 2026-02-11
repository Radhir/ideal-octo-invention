import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import GlassCard from '../components/GlassCard';
import { UserPlus, Upload, User, Briefcase, Heart, FileText, Calendar } from 'lucide-react';

const RegisterPage = () => {
    const [step, setStep] = useState(1); // Multi-step form
    const [form, setForm] = useState({
        // Step 1: Account Credentials
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',

        // Step 2: Employment Details
        role: '',
        department: '',
        basic_salary: '',
        employee_id: '',

        // Step 3: Personal Information
        medical_history: '',
        family_members_count: '',
        visa_start_date: '',
        experience_summary: '',
        bio: '',

        // Step 4: Emergency Contacts
        emergency_contact_1_name: '',
        emergency_contact_1_phone: '',
        emergency_contact_1_relation: '',
        emergency_contact_2_name: '',
        emergency_contact_2_phone: '',
        emergency_contact_2_relation: '',

        // Profile Photo
        profile_photo: null
    });
    const [photoPreview, setPhotoPreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

    const validateStep = () => {
        if (step === 1) {
            if (!form.username || !form.password) {
                setError('Username and password are required');
                return false;
            }
            if (form.password !== form.confirmPassword) {
                setError('Passwords do not match');
                return false;
            }
            if (form.password.length < 6) {
                setError('Password must be at least 6 characters');
                return false;
            }
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(step + 1);
            setError('');
        }
    };

    const prevStep = () => {
        setStep(step - 1);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateStep()) return;

        setLoading(true);
        try {
            // Create user account first
            const { confirmPassword: _confirmPassword, profile_photo, ...userData } = form;
            const _userResponse = await api.post('/api/auth/register/', {
                username: form.username,
                email: form.email,
                password: form.password,
                first_name: form.first_name,
                last_name: form.last_name
            });

            // Then create/update HR profile with additional data
            const formData = new FormData();
            formData.append('role', form.role || 'Employee');
            formData.append('bio', form.bio || '');
            formData.append('basic_salary', form.basic_salary || '0');
            formData.append('employee_id', form.employee_id || '');
            formData.append('medical_history', form.medical_history || '');
            formData.append('family_members_count', form.family_members_count || '0');
            formData.append('visa_start_date', form.visa_start_date || '');
            formData.append('experience_summary', form.experience_summary || '');
            formData.append('emergency_contact_1_name', form.emergency_contact_1_name || '');
            formData.append('emergency_contact_1_phone', form.emergency_contact_1_phone || '');
            formData.append('emergency_contact_1_relation', form.emergency_contact_1_relation || '');
            formData.append('emergency_contact_2_name', form.emergency_contact_2_name || '');
            formData.append('emergency_contact_2_phone', form.emergency_contact_2_phone || '');
            formData.append('emergency_contact_2_relation', form.emergency_contact_2_relation || '');

            if (profile_photo) {
                formData.append('profile_image', profile_photo);
            }

            // Note: This requires a backend endpoint to update HR profile
            // For now, we'll just register the user

            alert('Registration successful! Please login. Your profile will be completed by HR.');
            navigate('/login');
        } catch (err) {
            const data = err.response?.data;
            if (data) {
                const messages = Object.values(data).flat().join('. ');
                setError(messages || 'Registration failed');
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        display: 'block',
        fontSize: '12px',
        color: '#94a3b8',
        marginBottom: '8px',
        textTransform: 'uppercase',
        fontWeight: '600',
        letterSpacing: '1px'
    };

    const renderStep1 = () => (
        <>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <User size={40} color="#b08d57" style={{ marginBottom: '10px' }} />
                <h3 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '1.2rem' }}>Account Credentials</h3>
                <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>Create your login credentials</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                    <label style={inputStyle}>First Name *</label>
                    <input
                        type="text"
                        name="first_name"
                        className="form-control"
                        value={form.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label style={inputStyle}>Last Name *</label>
                    <input
                        type="text"
                        name="last_name"
                        className="form-control"
                        value={form.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={inputStyle}>Username *</label>
                <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={inputStyle}>Email</label>
                <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={form.email}
                    onChange={handleChange}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={inputStyle}>Password *</label>
                <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <div style={{ marginBottom: '25px' }}>
                <label style={inputStyle}>Confirm Password *</label>
                <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                />
            </div>
        </>
    );

    const renderStep2 = () => (
        <>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <Briefcase size={40} color="#b08d57" style={{ marginBottom: '10px' }} />
                <h3 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '1.2rem' }}>Employment Details</h3>
                <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>Professional information</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={inputStyle}>Role / Position</label>
                <input
                    type="text"
                    name="role"
                    className="form-control"
                    value={form.role}
                    onChange={handleChange}
                    placeholder="e.g., Technician, Service Advisor"
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={inputStyle}>Employee ID</label>
                <input
                    type="text"
                    name="employee_id"
                    className="form-control"
                    value={form.employee_id}
                    onChange={handleChange}
                    placeholder="ESG-XXXX"
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={inputStyle}>Experience Summary</label>
                <textarea
                    name="experience_summary"
                    className="form-control"
                    value={form.experience_summary}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Brief summary of your professional experience..."
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={inputStyle}>Bio</label>
                <textarea
                    name="bio"
                    className="form-control"
                    value={form.bio}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Short bio for your profile..."
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={inputStyle}>Profile Photo</label>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    {photoPreview && (
                        <img src={photoPreview} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #b08d57' }} />
                    )}
                    <label style={{ flex: 1, cursor: 'pointer', padding: '15px', background: 'rgba(176,141,87,0.1)', border: '1px dashed #b08d57', borderRadius: '10px', textAlign: 'center', color: '#b08d57', fontSize: '12px', fontWeight: '600' }}>
                        <Upload size={20} style={{ marginBottom: '5px' }} />
                        <div>Click to upload photo</div>
                        <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                    </label>
                </div>
            </div>
        </>
    );

    const renderStep3 = () => (
        <>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <FileText size={40} color="#b08d57" style={{ marginBottom: '10px' }} />
                <h3 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '1.2rem' }}>Personal Information</h3>
                <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>Health and visa details</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={inputStyle}>Medical History</label>
                <textarea
                    name="medical_history"
                    className="form-control"
                    value={form.medical_history}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Any medical conditions or allergies..."
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                    <label style={inputStyle}>Family Members</label>
                    <input
                        type="number"
                        name="family_members_count"
                        className="form-control"
                        value={form.family_members_count}
                        onChange={handleChange}
                        min="0"
                    />
                </div>
                <div>
                    <label style={inputStyle}>Visa Start Date</label>
                    <input
                        type="date"
                        name="visa_start_date"
                        className="form-control"
                        value={form.visa_start_date}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </>
    );

    const renderStep4 = () => (
        <>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <Heart size={40} color="#b08d57" style={{ marginBottom: '10px' }} />
                <h3 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '1.2rem' }}>Emergency Contacts</h3>
                <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>People to contact in case of emergency</p>
            </div>

            <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(176,141,87,0.05)', borderRadius: '10px', border: '1px solid rgba(176,141,87,0.2)' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#b08d57', marginBottom: '15px', letterSpacing: '1px' }}>PRIMARY CONTACT</div>
                <div style={{ marginBottom: '10px' }}>
                    <label style={inputStyle}>Name</label>
                    <input
                        type="text"
                        name="emergency_contact_1_name"
                        className="form-control"
                        value={form.emergency_contact_1_name}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                        <label style={inputStyle}>Phone</label>
                        <input
                            type="tel"
                            name="emergency_contact_1_phone"
                            className="form-control"
                            value={form.emergency_contact_1_phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label style={inputStyle}>Relation</label>
                        <input
                            type="text"
                            name="emergency_contact_1_relation"
                            className="form-control"
                            value={form.emergency_contact_1_relation}
                            onChange={handleChange}
                            placeholder="e.g., Spouse, Parent"
                        />
                    </div>
                </div>
            </div>

            <div style={{ padding: '15px', background: 'rgba(176,141,87,0.05)', borderRadius: '10px', border: '1px solid rgba(176,141,87,0.2)' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#b08d57', marginBottom: '15px', letterSpacing: '1px' }}>SECONDARY CONTACT</div>
                <div style={{ marginBottom: '10px' }}>
                    <label style={inputStyle}>Name</label>
                    <input
                        type="text"
                        name="emergency_contact_2_name"
                        className="form-control"
                        value={form.emergency_contact_2_name}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                        <label style={inputStyle}>Phone</label>
                        <input
                            type="tel"
                            name="emergency_contact_2_phone"
                            className="form-control"
                            value={form.emergency_contact_2_phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label style={inputStyle}>Relation</label>
                        <input
                            type="text"
                            name="emergency_contact_2_relation"
                            className="form-control"
                            value={form.emergency_contact_2_relation}
                            onChange={handleChange}
                            placeholder="e.g., Sibling, Friend"
                        />
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <GlassCard style={{ padding: '40px', maxWidth: '550px', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <img
                    src="/elite_shine_logo.png"
                    alt="Elite Shine Logo"
                    style={{
                        width: '240px',
                        height: 'auto',
                        marginBottom: '10px',
                        filter: 'drop-shadow(0 0 15px rgba(176, 141, 87, 0.3))'
                    }}
                />
                <h2 style={{ color: '#fff', fontSize: '1.3rem', margin: '10px 0 5px 0', fontFamily: 'Outfit, sans-serif' }}>Employee Registration</h2>
                <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Complete your profile in {4} easy steps</p>

                {/* Progress Indicator */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} style={{ flex: 1, height: '4px', background: s <= step ? '#b08d57' : 'rgba(255,255,255,0.1)', borderRadius: '2px', transition: 'background 0.3s' }} />
                    ))}
                </div>
            </div>

            {error && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    padding: '10px 15px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    marginBottom: '20px'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}

                <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="btn-secondary"
                            style={{ flex: 1 }}
                        >
                            Previous
                        </button>
                    )}
                    {step < 4 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="btn-primary"
                            style={{ flex: 1 }}
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            <UserPlus size={20} /> {loading ? 'Creating Account...' : 'Complete Registration'}
                        </button>
                    )}
                </div>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#94a3b8' }}>
                Already have an account? <Link to="/login" style={{ color: '#b08d57', textDecoration: 'none' }}>Login</Link>
            </div>
        </GlassCard>
    );
};

export default RegisterPage;
