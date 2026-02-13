import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [error, setError] = useState('');
    const [videoEnded, setVideoEnded] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const videoRef = useRef(null);
    const loginTimeoutRef = useRef(null);

    // Auto-login after 3 seconds when both fields are filled
    useEffect(() => {
        // Clear any existing timeout
        if (loginTimeoutRef.current) {
            clearTimeout(loginTimeoutRef.current);
        }

        // If both fields are filled and not already authenticating
        if (username && password && !isAuthenticating) {
            setCountdown(3);

            // Countdown timer
            const countdownInterval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownInterval);
                        return null;
                    }
                    return prev - 1;
                });
            }, 1000);

            // Auto submit after 3 seconds
            loginTimeoutRef.current = setTimeout(() => {
                handleLogin();
            }, 3000);

            return () => {
                clearInterval(countdownInterval);
                clearTimeout(loginTimeoutRef.current);
            };
        } else {
            setCountdown(null);
        }
    }, [username, password, isAuthenticating]);

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        if (!username || !password) return;

        setIsAuthenticating(true);
        setError('');
        setCountdown(null);

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

            {/* Minimal Login Container */}
            <div
                className="animate-fade-in"
                style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    maxWidth: '400px',
                    width: '100%',
                    animationDuration: '1.2s'
                }}
            >
                {/* Logo - No border */}
                <div
                    className="animate-slide-up"
                    style={{ marginBottom: '60px', animationDelay: '0.2s' }}
                >
                    <img
                        src="/elite_shine_logo.png"
                        alt="Elite Shine Group"
                        style={{
                            width: '200px',
                            height: 'auto',
                            filter: 'drop-shadow(0 0 30px rgba(176, 141, 87, 0.3))'
                        }}
                    />
                </div>

                {/* Login Form - Minimal Design */}
                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                    {/* Username Input - Bottom Border Only */}
                    <div
                        className="animate-slide-up"
                        style={{
                            marginBottom: '40px',
                            animationDelay: '0.3s'
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                color: '#fff',
                                fontSize: '16px',
                                padding: '12px 0',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                                fontFamily: 'Outfit, sans-serif',
                                letterSpacing: '0.5px'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderBottomColor = '#b08d57';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.2)';
                            }}
                        />
                    </div>

                    {/* Password Input - Bottom Border Only */}
                    <div
                        className="animate-slide-up"
                        style={{
                            marginBottom: '50px',
                            animationDelay: '0.4s'
                        }}
                    >
                        <input
                            type="password"
                            placeholder="Access ID"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                color: '#fff',
                                fontSize: '16px',
                                padding: '12px 0',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                                fontFamily: 'Outfit, sans-serif',
                                letterSpacing: '0.5px'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderBottomColor = '#b08d57';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.2)';
                            }}
                        />
                    </div>

                    {/* Auto-Login Countdown Indicator */}
                    {countdown !== null && !isAuthenticating && (
                        <div
                            className="animate-fade-in"
                            style={{
                                textAlign: 'center',
                                marginTop: '40px',
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '14px',
                                fontWeight: '300',
                                letterSpacing: '2px',
                                fontFamily: 'Outfit, sans-serif'
                            }}
                        >
                            AUTHENTICATING IN {countdown}s...
                        </div>
                    )}

                    {/* Authenticating State */}
                    {isAuthenticating && (
                        <div
                            className="animate-fade-in"
                            style={{
                                textAlign: 'center',
                                marginTop: '40px',
                                color: '#b08d57',
                                fontSize: '14px',
                                fontWeight: '500',
                                letterSpacing: '2px',
                                fontFamily: 'Outfit, sans-serif'
                            }}
                        >
                            VERIFYING CREDENTIALS...
                        </div>
                    )}
                </form>

                {/* Error Message */}
                {error && (
                    <div
                        className="animate-slide-up"
                        style={{
                            marginTop: '30px',
                            color: '#ef4444',
                            fontSize: '11px',
                            letterSpacing: '2px',
                            fontWeight: '700'
                        }}
                    >
                        {error}
                    </div>
                )}
            </div>

            {/* Bottom Brand Line */}
            <div style={{
                position: 'fixed',
                bottom: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'rgba(255, 255, 255, 0.3)',
                fontSize: '10px',
                letterSpacing: '5px',
                fontWeight: '300',
                zIndex: 2,
                whiteSpace: 'nowrap'
            }}>
                ELITE SHINE GROUP OF COMPANIES
            </div>
        </div>
    );
};

export default LoginPage;
