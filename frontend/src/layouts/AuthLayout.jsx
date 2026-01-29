import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="auth-layout" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent'
        }}>
            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '450px', padding: '20px' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
