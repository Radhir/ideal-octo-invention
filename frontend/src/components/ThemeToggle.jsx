import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div
            onClick={toggleTheme}
            style={{
                width: '64px',
                height: '32px',
                borderRadius: '16px',
                background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(176, 141, 87, 0.1)',
                border: '1px solid rgba(176, 141, 87, 0.2)',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--gold)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(176, 141, 87, 0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(176, 141, 87, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {/* Toggle Handle */}
            <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-mute) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: theme === 'dark' ? 'translateX(0)' : 'translateX(32px)',
                transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                zIndex: 2,
            }}>
                {theme === 'dark' ? (
                    <Moon size={14} color="#000" fill="#000" />
                ) : (
                    <Sun size={14} color="#000" fill="#000" />
                )}
            </div>

            {/* Icons in Background */}
            <div style={{
                position: 'absolute',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 8px',
                opacity: 0.3,
            }}>
                <Moon size={14} color="var(--gold)" />
                <Sun size={14} color="var(--gold)" />
            </div>
        </div>
    );
};

export default ThemeToggle;
