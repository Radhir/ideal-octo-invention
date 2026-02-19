import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

const PasswordResetRequestPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/auth/password-reset/', { email });
            setMessage('If an account exists with this email, you will receive a reset link shortly.');
        } catch (error) {
            setMessage('Unable to send reset link. Please verify your email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#0a0a0a', backgroundImage: 'radial-gradient(circle at center, #111 0%, #0a0a0a 100%)'
        }}>
            <div style={{
                width: '100%', maxWidth: '400px', padding: '40px',
                background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px', backdropFilter: 'blur(10px)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{
                        width: '50px', height: '50px', background: 'rgba(176,141,87,0.1)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px auto', color: 'var(--gold, #b08d57)'
                    }}>
                        <Mail size={24} />
                    </div>
                    <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '10px' }}>Reset Password</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: '1.5' }}>
                        Enter the email associated with your account and we'll send you a link to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{
                            display: 'block', color: 'var(--gold, #b08d57)', fontSize: '11px',
                            textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: '600'
                        }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@eliteshine.com"
                            style={{
                                width: '100%', padding: '12px 15px', background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                                color: '#fff', fontSize: '14px', outline: 'none'
                            }}
                            required
                        />
                    </div>

                    {message && (
                        <div style={{
                            padding: '12px', background: 'rgba(176,141,87,0.1)', borderRadius: '8px',
                            color: 'var(--gold, #b08d57)', fontSize: '13px', marginBottom: '20px', textAlign: 'center'
                        }}>
                            {message}
                        </div>
                    )}

                    <button type="submit" disabled={loading} style={{
                        width: '100%', padding: '14px', background: 'var(--gold, #b08d57)', border: 'none',
                        borderRadius: '8px', color: '#000', fontWeight: '600', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                    }}>
                        {loading ? <Loader2 className="animate-spin" /> : <>Send Reset Link <ArrowRight size={18} /></>}
                    </button>
                </form>

                <div style={{ marginTop: '25px', textAlign: 'center' }}>
                    <Link to="/login" style={{
                        color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '13px',
                        display: 'inline-flex', alignItems: 'center', gap: '5px'
                    }}>
                        <ArrowLeft size={14} /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetRequestPage;
