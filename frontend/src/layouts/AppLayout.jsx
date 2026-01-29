import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';
import { Clock, Calendar, Home } from 'lucide-react';
import UserDropdown from '../components/UserDropdown';
import BottomNav from '../components/BottomNav';
import QuickAccessHub from '../components/QuickAccessHub';

// AppLayout: Stable Executive Framework
const AppLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="app-container" style={{ minHeight: '100vh', paddingBottom: '100px', position: 'relative' }}>
            {/* Global Executive Header */}
            <header style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                padding: '20px 40px',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '20px',
                zIndex: 1000,
                pointerEvents: 'none'
            }}>
                {/* Live Clock & Calendar */}
                <div style={{
                    pointerEvents: 'auto',
                    background: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(10px)',
                    padding: '8px 20px',
                    borderRadius: '50px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={15} color="#b08d57" />
                        <span style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px' }}>
                            {formatDate(currentTime)}
                        </span>
                    </div>
                    <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.2)' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={15} color="#b08d57" />
                        <span style={{ color: '#fff', fontSize: '13px', fontWeight: '800', fontVariantNumeric: 'tabular-nums' }}>
                            {formatTime(currentTime)}
                        </span>
                    </div>
                </div>

                {/* Home Button */}
                <div
                    onClick={() => navigate('/')}
                    style={{
                        pointerEvents: 'auto',
                        cursor: 'pointer',
                        padding: '10px',
                        background: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '50%',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        color: '#b08d57'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.borderColor = '#b08d57';
                        e.currentTarget.style.color = '#fff';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.color = '#b08d57';
                    }}
                >
                    <Home size={20} />
                </div>

                <div style={{ pointerEvents: 'auto' }}>
                    <UserDropdown />
                </div>
            </header>

            <main style={{ paddingTop: '80px' }}>
                <Outlet />
            </main>
            <BottomNav />
            <QuickAccessHub />
        </div>
    );
};

export default AppLayout;
