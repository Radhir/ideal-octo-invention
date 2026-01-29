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

    // Auto-login after 3 seconds of inactivity
    useEffect(() => {
        if (!username || !password) return;

        const timer = setTimeout(() => {
            handleLogin();
        }, 3000);

        return () => clearTimeout(timer);
    }, [username, password]);

    const inputStyle = {
        width: '100%',
        background: 'transparent',
        border: 'none',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: '1px solid rgba(176, 141, 87, 0.4)',
        borderRadius: 0,
        padding: '10px 0',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '15px',
        outline: 'none',
        transition: 'border-color 0.3s ease',
        textAlign: 'center',
        letterSpacing: '3px',
        fontFamily: 'Outfit, sans-serif',
        caretColor: 'var(--gold)',
        boxShadow: 'none'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '9px',
        color: 'rgba(176, 141, 87, 0.6)',
        letterSpacing: '5px',
        textTransform: 'uppercase',
        marginBottom: '5px',
        textAlign: 'center',
        fontWeight: '500'
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: '#000',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Video - plays once */}
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                onEnded={() => setVideoEnded(true)}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    minWidth: '100%',
                    minHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'cover',
                    opacity: videoEnded ? 0 : 1,
                    transition: 'opacity 1s ease',
                    zIndex: 0
                }}
            >
                <source src="/bglogin.mp4" type="video/mp4" />
            </video>

            {/* Dark overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: videoEnded
                    ? 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.95) 100%)'
                    : 'rgba(0,0,0,0.3)',
                transition: 'background 1s ease',
                zIndex: 1
            }} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: videoEnded ? 1 : 0 }}
                transition={{ duration: 2, delay: 0.5 }}
                style={{ width: '100%', maxWidth: '900px', position: 'relative', zIndex: 2 }}
            >
                <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>

                    {/* Spotlight / Beam Effect */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2 }}
                        style={{
                            position: 'absolute',
                            top: '-150px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '400px',
                            height: '500px',
                            background: 'conic-gradient(from 180deg at 50% 0%, transparent 45%, rgba(255, 255, 255, 0.15) 50%, transparent 55%)',
                            filter: 'blur(30px)',
                            pointerEvents: 'none',
                            zIndex: 0
                        }}
                    />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ duration: 3, delay: 0.5 }}
                        style={{
                            position: 'absolute',
                            top: '-50px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '600px',
                            height: '300px',
                            background: 'radial-gradient(ellipse at center, rgba(176, 141, 87, 0.2) 0%, transparent 70%)',
                            zIndex: 0
                        }}
                    />

                    <motion.img
                        initial={{ opacity: 0, y: -20 }}
                        animate={{
                            opacity: [0.85, 1, 0.9, 1],
                            scale: [0.98, 1, 0.99, 1],
                            filter: [
                                'brightness(1.1) drop-shadow(0 0 20px rgba(176, 141, 87, 0.4)) drop-shadow(0 0 40px rgba(212, 175, 55, 0.2))',
                                'brightness(1.3) drop-shadow(0 0 35px rgba(176, 141, 87, 0.6)) drop-shadow(0 0 60px rgba(212, 175, 55, 0.3))',
                                'brightness(1.2) drop-shadow(0 0 25px rgba(176, 141, 87, 0.5)) drop-shadow(0 0 50px rgba(212, 175, 55, 0.25))',
                                'brightness(1.3) drop-shadow(0 0 35px rgba(176, 141, 87, 0.6)) drop-shadow(0 0 60px rgba(212, 175, 55, 0.3))'
                            ]
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut"
                        }}
                        src="/elite_shine_logo.png"
                        alt="Elite Shine Logo"
                        style={{
                            width: '600px',
                            maxWidth: '90vw',
                            height: 'auto',
                            position: 'relative',
                            zIndex: 1,
                            filter: 'drop-shadow(0 0 30px rgba(176, 141, 87, 0.5)) drop-shadow(0 0 60px rgba(212, 175, 55, 0.2))'
                        }}
                    />
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'row', gap: '60px', alignItems: 'flex-end', justifyContent: 'center', position: 'relative', zIndex: 2, width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                    <div className="input-field" style={{ flex: 1, position: 'relative' }}>
                        <label style={labelStyle}>NAME</label>
                        <input
                            type="text"
                            name="username"
                            autoComplete="username"
                            style={inputStyle}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-field" style={{ flex: 1, position: 'relative' }}>
                        <label style={labelStyle}>ID</label>
                        <input
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            style={inputStyle}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </form>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            marginTop: '30px',
                            textAlign: 'center',
                            color: '#ef4444',
                            fontSize: '10px',
                            letterSpacing: '2px',
                            fontWeight: '700'
                        }}
                    >
                        {error}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default LoginPage;
