import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';
import { Clock, Calendar, Home } from 'lucide-react';
import UserDropdown from '../components/UserDropdown';
import BottomNav from '../components/BottomNav';
import QuickAccessHub from '../components/QuickAccessHub';
import BranchSwitcher from '../components/BranchSwitcher';

import './AppLayout.css';

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

    const getPageTitle = () => {
        const path = window.location.pathname;
        if (path === '/') return 'MISSION CONTROL';

        const segments = path.split('/').filter(Boolean);
        if (segments.length === 0) return 'DASHBOARD';

        // Custom name mapping if needed
        const mapping = {
            'job-cards': 'WORKSHOP JOBS',
            'job-board': 'PRODUCTION BOARD',
            'pick-drop': 'LOGISTICS HUB',
            'ppf': 'PPF PROTECTION',
            'ceramic': 'CERAMIC COATING',
            'finance': 'TREASURY',
            'hr': 'WORKFORCE HUB'
        };

        const lastSegment = segments[segments.length - 1];
        return mapping[lastSegment] || lastSegment.replace(/-/g, ' ').toUpperCase();
    };

    return (
        <div className="app-container">
            {/* Global Executive Header */}
            <header className="app-header">
                <div className="header-left">
                    <BranchSwitcher />
                </div>

                <div className="header-center">
                    <h1 className="header-page-title">
                        {getPageTitle()}
                    </h1>
                </div>

                <div className="header-right">
                    {/* Home Button */}
                    <div
                        className="header-home-btn"
                        onClick={() => navigate('/')}
                    >
                        <Home size={18} />
                    </div>
                </div>
            </header>

            <main className="app-main">
                <Outlet />
            </main>

            {/* Premium Status Bar - Bottom Right */}
            <div className="app-status-bar">
                {/* Live Clock & Calendar */}
                <div className="status-clock-group">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={14} color="#b08d57" />
                        <span className="status-text">
                            {formatDate(currentTime)}
                        </span>
                    </div>
                    <div className="status-separator"></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={14} color="#b08d57" />
                        <span className="status-time">
                            {formatTime(currentTime)}
                        </span>
                    </div>
                </div>

                <div className="status-user-group">
                    <UserDropdown />
                </div>
            </div>

            <BottomNav />
            <QuickAccessHub />
        </div>
    );
};

export default AppLayout;
