import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [error, setError] = useState('');
    const [videoEnded, setVideoEnded] = useState(false);
    const videoRef = useRef(null);

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        if (!username || !password) return;

        setIsAuthenticating(true);
        setError('');

        try {
            const success = await login(username, password);
            if (success) {
                navigate('/portfolio');
            } else {
                setError('INVALID CREDENTIALS');
                setIsAuthenticating(false);
            }
        } catch (err) {
            console.error("Login failed", err);
            setError('ACCESS DENIED');
            setIsAuthenticating(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: '#0a0c10',
            position: 'relative',
            overflowY: 'auto',
            overflowX: 'hidden'
        }}>
            {/* Background Video */}
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                onEnded={() => setVideoEnded(true)}
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    minWidth: '100%',
                    minHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'cover',
                    opacity: videoEnded ? 0.3 : 0.8,
                    transition: 'opacity 1.5s ease',
                    zIndex: 0
                }}
            >
                <source src="/bglogin.mp4" type="video/mp4" />
            </video>

            {/* Premium Gradient Overlay */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at center, transparent 0%, rgba(10, 12, 16, 0.8) 100%)',
                zIndex: 1
            }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="executive-glass login-main-card"
            >
                {/* Left Side: Brand Section */}
                <div className="login-brand-section">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        style={{ marginBottom: '30px' }}
                    >
                        <img
                            src="/elite_shine_logo.png"
                            className="login-logo-img"
                            alt="Elite Shine Group"
                            style={{
                                width: '280px',
                                height: 'auto',
                                filter: 'drop-shadow(0 0 30px rgba(176, 141, 87, 0.4))'
                            }}
                        />
                    </motion.div>
                    <h2 style={{
                        color: '#fff',
                        fontSize: '2.5rem',
                        fontWeight: '900',
                        letterSpacing: '-1px',
                        lineHeight: '1.1',
                        marginBottom: '15px',
                        textTransform: 'uppercase'
                    }}>
                        Executive <br /> <span style={{ color: 'var(--gold)' }}>Intelligence</span>
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: '1.6', maxWidth: '300px' }}>
                        Secured access to the Elite Shine Group of Companies ERP infrastructure. Log in to manage global operations, logistics, and financials.
                    </p>
                </div>

                {/* Right Side: Login Form */}
                <div className="login-form-section">
                    <form onSubmit={handleLogin} className="login-form-v2" style={{ padding: 0, margin: 0, maxWidth: 'none' }}>
                        <div className="premium-input-container">
                            <input
                                type="text"
                                className="premium-input"
                                placeholder=" "
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <label className="premium-label">Username</label>
                        </div>

                        <div className="premium-input-container">
                            <input
                                type="password"
                                className="premium-input"
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label className="premium-label">Access ID</label>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(176, 141, 87, 0.3)' }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isAuthenticating}
                            style={{
                                width: '100%',
                                background: 'linear-gradient(135deg, var(--gold) 0%, #8c6d3e 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '16px',
                                color: '#000',
                                fontSize: '14px',
                                fontWeight: '800',
                                letterSpacing: '3px',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                marginTop: '20px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {isAuthenticating ? 'Authenticating...' : 'Enter System'}
                        </motion.button>
                    </form>
                </div>

                {/* Error Pulse */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'absolute',
                                bottom: '40px',
                                left: 0,
                                right: 0,
                                textAlign: 'center',
                                color: '#ef4444',
                                fontSize: '11px',
                                letterSpacing: '2px',
                                fontWeight: '700'
                            }}
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Bottom Brand Line */}
            <div className="bottom-brand-line" style={{
                position: 'absolute',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '10px',
                fontWeight: '600',
                color: 'rgba(255,255,255,0.2)',
                letterSpacing: '5px',
                zIndex: 1,
                textAlign: 'center',
                width: '100%'
            }}>
                ELITE SHINE GROUP OF COMPANIES
            </div>

            <style>{`
                /* Base styles */
                .login-brand-section {
                    border-right: 1px solid rgba(255,255,255,0.05);
                    padding-right: 40px;
                }
                .login-main-card {
                    width: 95%;
                    max-width: 900px;
                    position: relative;
                    z-index: 2;
                    padding: 80px 60px;
                    text-align: left;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 60px;
                    align-items: center;
                    overflow: visible;
                }
                /* Tablet */
                @media (max-width: 1024px) {
                    .login-main-card {
                        padding: 60px 40px;
                        max-width: 800px;
                    }
                    .login-brand-section h2 {
                        font-size: 2rem;
                    }
                    .login-brand-section p {
                        font-size: 13px;
                    }
                }
                /* Mobile */
                @media (max-width: 768px) {
                    .login-main-card {
                        padding: 40px 30px;
                        grid-template-columns: 1fr;
                        gap: 30px;
                        margin-top: 40px;
                        margin-bottom: 80px;
                    }
                    .login-brand-section {
                        border-right: none;
                        padding-right: 0;
                        border-bottom: 1px solid rgba(255,255,255,0.05);
                        padding-bottom: 30px;
                        text-align: center;
                    }
                    .login-logo-img {
                        margin: 0 auto;
                        width: 220px !important;
                    }
                    .login-brand-section h2 {
                        font-size: 1.8rem;
                    }
                    .login-brand-section p {
                        margin: 0 auto;
                        font-size: 13px;
                    }
                    .bottom-brand-line {
                        position: relative;
                        bottom: auto;
                        margin-top: -40px;
                        margin-bottom: 40px;
                    }
                }
                /* Small Mobile */
                @media (max-width: 480px) {
                    .login-main-card {
                        padding: 30px 20px;
                        border-radius: 20px;
                        gap: 20px;
                    }
                    .login-logo-img {
                        width: 180px !important;
                    }
                    .login-brand-section h2 {
                        font-size: 1.5rem;
                    }
                    .login-brand-section p {
                        font-size: 12px;
                    }
                    .premium-input {
                        padding: 14px 16px;
                        font-size: 14px;
                    }
                    .premium-label {
                        font-size: 12px;
                    }
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
