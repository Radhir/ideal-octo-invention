import React, { useState } from 'react';
import axios from 'axios';

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
            setMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-vh-100">
            <div className="glass-card p-5" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="premium-title mb-4">Reset Password</h2>
                <p className="text-secondary mb-4">Enter your email address to receive a secure reset link.</p>
                <form onSubmit={handleSubmit}>
                    <div className="premium-input-container">
                        <input
                            type="email"
                            className="premium-input"
                            placeholder=" "
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label className="premium-label">Email Address</label>
                    </div>
                    <button type="submit" className="btn-primary w-100" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                {message && <p className="mt-3 text-gold text-center">{message}</p>}
            </div>
        </div>
    );
};

export default PasswordResetRequestPage;
