import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="auth-layout" style={{
            minHeight: '100vh',
            width: '100vw',
            display: 'flex',
            background: '#000',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
