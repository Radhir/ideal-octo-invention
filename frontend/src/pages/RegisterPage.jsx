import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import { UserPlus } from 'lucide-react';

const RegisterPage = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const { confirmPassword, ...payload } = form;
            await axios.post('/api/auth/register/', payload);
            alert('Registration successful! Please login.');
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
        textTransform: 'uppercase'
    };

    return (
        <GlassCard style={{ padding: '40px', maxWidth: '450px', width: '100%' }}>
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
                <h2 style={{ color: '#fff', fontSize: '1.3rem', margin: '10px 0 5px 0', fontFamily: 'Outfit, sans-serif' }}>Create Account</h2>
                <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Join the Elite Shine management platform</p>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                        <label style={inputStyle}>First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            className="form-control"
                            value={form.first_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label style={inputStyle}>Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            className="form-control"
                            value={form.last_name}
                            onChange={handleChange}
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

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    <UserPlus size={20} /> {loading ? 'Creating Account...' : 'Register'}
                </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#94a3b8' }}>
                Already have an account? <Link to="/login" style={{ color: '#b08d57', textDecoration: 'none' }}>Login</Link>
            </div>
        </GlassCard>
    );
};

export default RegisterPage;
