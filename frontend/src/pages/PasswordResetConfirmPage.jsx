import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

const PasswordResetConfirmPage = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            setStatus('error');
            return;
        }

        setStatus('loading');
        try {
            await axios.post(`/api/auth/password-reset-confirm/${uid}/${token}/`, { password });
            setStatus('success');
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setStatus('error');
            setMessage('Token invalid or expired. Please request a new link.');
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
                        {status === 'success' ? <CheckCircle2 size={24} /> : <Lock size={24} />}
                    </div>
                    <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '10px' }}>Set New Password</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                        Your new password should be at least 8 characters long.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '25px' }}>
                        <label style={labelStyle}>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>

                    {message && (
                        <div style={{
                            padding: '12px',
                            background: status === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                            color: status === 'success' ? '#10b981' : '#ef4444',
                            borderRadius: '8px', fontSize: '13px', marginBottom: '20px', textAlign: 'center'
                        }}>
                            {message}
                        </div>
                    )}

                    <button type="submit" disabled={status === 'loading' || status === 'success'} style={{
                        width: '100%', padding: '14px', background: 'var(--gold, #b08d57)', border: 'none',
                        borderRadius: '8px', color: '#000', fontWeight: '600', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                    }}>
                        {status === 'loading' ? <Loader2 className="animate-spin" /> : <>Update Password <ArrowRight size={18} /></>}
                    </button>
                </form>
            </div>
        </div>
    );
};

const labelStyle = {
    display: 'block', color: 'var(--gold, #b08d57)', fontSize: '11px',
    textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: '600'
};

const inputStyle = {
    width: '100%', padding: '12px 15px', background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    color: '#fff', fontSize: '14px', outline: 'none'
};

export default PasswordResetConfirmPage;
