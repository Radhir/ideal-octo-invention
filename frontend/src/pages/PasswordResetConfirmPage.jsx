import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PasswordResetConfirmPage = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`/api/auth/password-reset-confirm/${uid}/${token}/`, { password });
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setMessage('Token invalid or expired. Please request a new link.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-vh-100">
            <div className="glass-card p-5" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="premium-title mb-4">Set New Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="premium-input-container">
                        <input
                            type="password"
                            className="premium-input"
                            placeholder=" "
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label className="premium-label">New Password</label>
                    </div>
                    <div className="premium-input-container">
                        <input
                            type="password"
                            className="premium-input"
                            placeholder=" "
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <label className="premium-label">Confirm Password</label>
                    </div>
                    <button type="submit" className="btn-primary w-100" disabled={loading}>
                        {loading ? 'Resetting...' : 'Update Password'}
                    </button>
                </form>
                {message && <p className="mt-3 text-gold text-center">{message}</p>}
            </div>
        </div>
    );
};

export default PasswordResetConfirmPage;
