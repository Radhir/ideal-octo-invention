import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Settings,
    Layers,
    HelpCircle,
    Code,
    LogOut,
    ChevronDown,
    MoreHorizontal
} from 'lucide-react';

const UserDropdown = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuVariants = {
        hidden: { opacity: 0, y: 10, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } }
    };

    return (
        <div style={{ position: 'relative', pointerEvents: 'auto' }} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#fff',
                    transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseOut={(e) => !isOpen && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
            >
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #b08d57 0%, #8a6d43 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#fff'
                }}>
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <MoreHorizontal size={20} color="#94a3b8" />
            </button>

            {isOpen && (
                <div
                    className="animate-fade-in"
                    style={{
                        position: 'absolute',
                        bottom: '100%',
                        right: 0,
                        marginBottom: '10px',
                        width: '260px',
                        background: 'rgba(5, 5, 5, 0.95)', /* bg-deep */
                        backdropFilter: 'blur(40px)',
                        WebkitBackdropFilter: 'blur(40px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 'var(--radius-xl)',
                        padding: '12px',
                        boxShadow: '0 -20px 60px rgba(0, 0, 0, 0.8)',
                        zIndex: 1001,
                        overflow: 'hidden',
                        animationDuration: '0.2s'
                    }}
                >
                    {/* Header */}
                    <div style={{ padding: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: '#000'
                            }}>
                                {user?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>{user?.username || 'User'}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.email || 'user@eliteshine.ae'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <MenuItem icon={User} label="View profile" shortcut="⌘P" onClick={() => navigate('/portfolio')} />
                        <MenuItem icon={Settings} label="Settings" shortcut="⌘S" onClick={() => navigate('/settings')} />
                    </div>

                    <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.05)', margin: '8px 0' }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <MenuItem icon={Layers} label="Changelog" />
                        <MenuItem icon={HelpCircle} label="Support" />
                        <MenuItem icon={Code} label="API" />
                    </div>

                    <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.05)', margin: '8px 0' }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <MenuItem icon={LogOut} label="Log out" shortcut="⌥⇧Q" onClick={handleLogout} destructive />
                    </div>

                </div>
            )}
        </div>
    );
};

const MenuItem = ({ icon: Icon, label, shortcut, onClick, destructive }) => {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: destructive ? '#ef4444' : '#e2e8f0',
                fontSize: '13px',
                transition: 'background 0.2s',
                textAlign: 'left'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = destructive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={16} />
                <span>{label}</span>
            </div>
            {shortcut && (
                <span style={{ fontSize: '10px', color: '#64748b', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                    {shortcut}
                </span>
            )}
        </button>
    );
};

export default UserDropdown;
