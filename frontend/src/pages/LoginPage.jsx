import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ShieldCheck, Cpu, Key } from 'lucide-react';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState('');
    const [videoEnded, setVideoEnded] = useState(false);
    const videoRef = useRef(null);
    const lastAttempt = useRef({ u: '', p: '' });

    // Auto-login logic
    useEffect(() => {
        if (username.length > 3 && password.length > 5 && (username !== lastAttempt.current.u || password !== lastAttempt.current.p)) {
            setIsScanning(true);
            const timer = setTimeout(() => {
                handleLogin();
                lastAttempt.current = { u: username, p: password };
                setIsScanning(false);
            }, 3000);
            return () => {
                clearTimeout(timer);
                setIsScanning(false);
            };
        }
    }, [username, password]);

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        if (!username || !password || isAuthenticating) return;

        setIsAuthenticating(true);
        setError('');

        try {
            const success = await login(username, password);
            if (success) {
                navigate('/portfolio');
            } else {
                setError('AUTHENTICATION FAILED: INVALID CREDENTIALS');
                setIsAuthenticating(false);
            }
        } catch (err) {
            setError('SERVER UNREACHABLE: ACCESS DENIED');
            setIsAuthenticating(false);
        }
    };

    const containerStyle = {
        height: '100vh',
        width: '100vw',
        background: '#050505',
        display: 'flex',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
    };

    const leftPaneStyle = {
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 60%)',
    };

    const rightPaneStyle = {
        width: '450px',
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(50px)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        zIndex: 10,
    };

    const inputStyle = {
        width: '100%',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '16px 20px',
        borderRadius: '12px',
        color: '#fff',
        fontSize: '14px',
        letterSpacing: '1px',
        outline: 'none',
        transition: 'all 0.3s ease',
        marginBottom: '20px',
    };

    const labelStyle = {
        fontSize: '11px',
        color: 'rgba(255, 255, 255, 0.3)',
        letterSpacing: '2px',
        marginBottom: '8px',
        display: 'block',
        textAlign: 'left',
        width: '100%',
    };

    return (
        <div style={containerStyle}>
            {/* Background Video (Legacy support) */}
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                loop
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.2,
                    zIndex: 0,
                    filter: 'grayscale(100%) brightness(0.5)'
                }}
            >
                <source src="/bglogin.mp4" type="video/mp4" />
            </video>

            <div style={leftPaneStyle}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{ zIndex: 5, textAlign: 'center' }}
                >
                    <img
                        src="/elite_shine_logo.png"
                        alt="Logo"
                        style={{ width: '300px', filter: 'drop-shadow(0 0 40px rgba(176, 141, 87, 0.2))', marginBottom: '40px' }}
                    />
                    <div style={{
                        color: 'var(--gold)',
                        fontSize: '11px',
                        fontWeight: '800',
                        letterSpacing: '6px',
                        textTransform: 'uppercase',
                        opacity: 0.6
                    }}>
                        Industrial Ledger Command // v6.2
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                style={rightPaneStyle}
            >
                <div style={{ width: '100%' }}>
                    <div style={{ marginBottom: '60px', textAlign: 'left' }}>
                        <h1 style={{
                            color: 'var(--cream)',
                            fontSize: '42px',
                            fontFamily: 'var(--font-serif)',
                            fontWeight: '300',
                            marginBottom: '10px',
                            letterSpacing: '-0.02em'
                        }}>Initialize Session</h1>
                        <p style={{ color: 'rgba(250, 249, 246, 0.3)', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>Authorized Personnel Only</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ width: '100%' }}>
                        <div style={{ marginBottom: '30px' }}>
                            <span style={labelStyle}>Identity Token</span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="USERNAME"
                                style={inputStyle}
                                className="elite-input"
                                autoComplete="off"
                            />
                        </div>

                        <div style={{ marginBottom: '45px' }}>
                            <span style={labelStyle}>Security Password</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={inputStyle}
                                className="elite-input"
                            />
                        </div>

                        <div style={{ minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AnimatePresence mode="wait">
                                {isScanning ? (
                                    <motion.div
                                        key="scanning"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        style={{ textAlign: 'center' }}
                                    >
                                        <Cpu className="animate-pulse" color="var(--gold)" size={24} style={{ marginBottom: '15px', opacity: 0.6 }} />
                                        <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '4px' }}>SCANNING NEURAL INTERFACE...</div>
                                    </motion.div>
                                ) : isAuthenticating ? (
                                    <motion.div
                                        key="auth"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        style={{ textAlign: 'center' }}
                                    >
                                        <Loader2 className="animate-spin" color="var(--purple)" size={24} style={{ marginBottom: '15px' }} />
                                        <div style={{ fontSize: '10px', color: 'var(--purple)', fontWeight: '800', letterSpacing: '4px' }}>ESTABLISHING ENCRYPTED UPLINK...</div>
                                    </motion.div>
                                ) : (
                                    <motion.button
                                        key="btn"
                                        whileHover={{ scale: 1.02, background: 'rgba(250, 249, 246, 0.03)' }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            width: '100%',
                                            padding: '20px',
                                            borderRadius: '15px',
                                            background: 'transparent',
                                            border: '1px solid rgba(250, 249, 246, 0.1)',
                                            color: 'var(--cream)',
                                            fontSize: '12px',
                                            fontWeight: '800',
                                            letterSpacing: '3px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '15px',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        <ShieldCheck size={18} color="var(--gold)" />
                                        INITIALIZE SECURE ACCESS
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        <div style={{ marginTop: '50px', display: 'flex', gap: '30px', justifyContent: 'center' }}>
                            <Link to="/password-reset" style={{ color: 'rgba(250, 249, 246, 0.2)', fontSize: '10px', fontWeight: '800', textDecoration: 'none', letterSpacing: '2px' }}>RECOVERY</Link>
                            <Link to="/register" style={{ color: 'rgba(250, 249, 246, 0.2)', fontSize: '10px', fontWeight: '800', textDecoration: 'none', letterSpacing: '2px' }}>PROVISION NODE</Link>
                        </div>
                    </form>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                marginTop: '40px',
                                padding: '15px',
                                borderRadius: '12px',
                                background: 'rgba(239, 68, 68, 0.05)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                color: '#ef4444',
                                fontSize: '10px',
                                letterSpacing: '1px',
                                fontWeight: '800',
                                textAlign: 'center',
                                textTransform: 'uppercase'
                            }}
                        >
                            {error}
                        </motion.div>
                    )}
                </div>
            </motion.div>

        </div>
    );
};

export default LoginPage;
