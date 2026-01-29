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
        borderBottom: '2px solid var(--gold)', // 2px solid glow
        boxShadow: '0 4px 15px -2px rgba(176, 141, 87, 0.6)', // Glow effect for the bottom border
        padding: '12px 0',
        color: '#fff',
        fontSize: '18px',
        outline: 'none',
        transition: 'all 0.5s ease',
        textAlign: 'center',
        letterSpacing: '2px',
        fontFamily: 'Outfit, sans-serif'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '10px',
        color: 'var(--gold)',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        marginBottom: '8px',
        opacity: 0.5,
        textAlign: 'center'
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'transparent'
        }}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2.5 }}
                style={{ width: '100%', maxWidth: '900px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '60px', position: 'relative' }}>

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
                            opacity: [0, 0.8, 0.6, 0.9],
                            scale: [0.95, 1, 0.98, 1],
                            filter: ['brightness(1) drop-shadow(0 0 10px rgba(176, 141, 87, 0.3))', 'brightness(1.5) drop-shadow(0 0 25px rgba(176, 141, 87, 0.6))', 'brightness(1.2) drop-shadow(0 0 15px rgba(176, 141, 87, 0.4))', 'brightness(1.5) drop-shadow(0 0 25px rgba(176, 141, 87, 0.6))']
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut"
                        }}
                        src="/elite_shine_logo.png"
                        alt="Elite Shine Logo"
                        style={{
                            width: '650px', // Increased size
                            height: 'auto',
                            position: 'relative',
                            zIndex: 1,
                            filter: 'drop-shadow(0 0 30px rgba(176, 141, 87, 0.5))'
                        }}
                    />
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'row', gap: '40px', alignItems: 'flex-end', justifyContent: 'center', position: 'relative', zIndex: 2, width: '100%' }}>
                    <div className="input-field" style={{ width: '280px', position: 'relative' }}>
                        <label style={labelStyle}>NAME</label>
                        <input
                            type="text"
                            name="username"
                            autoComplete="username"
                            style={inputStyle}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            // Removed focus/blur styles for cleaner look
                            required
                        />
                    </div>

                    <div className="input-field" style={{ width: '280px', position: 'relative' }}>
                        <label style={labelStyle}>ID</label>
                        <input
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            style={inputStyle}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            // Removed focus/blur styles for cleaner look
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
