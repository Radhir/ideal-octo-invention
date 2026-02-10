import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, ExternalLink } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

const NotificationBell = () => {
    const { user } = useAuth();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            {/* Bell Icon */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '10px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(176, 141, 87, 0.2)',
                    color: unreadCount > 0 ? '#b08d57' : '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#b08d57';
                    e.currentTarget.style.background = 'rgba(176, 141, 87, 0.05)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(176, 141, 87, 0.2)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                }}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: '#ef4444',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: '900',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #000'
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '55px',
                    right: '0',
                    width: '320px',
                    background: 'rgba(15, 15, 20, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(176, 141, 87, 0.25)',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.7)',
                    zIndex: 1000,
                    overflow: 'hidden',
                    animation: 'slideIn 0.2s ease-out'
                }}>
                    <div style={{
                        padding: '15px 20px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'rgba(176, 141, 87, 0.03)'
                    }}>
                        <span style={{ fontWeight: '800', fontSize: '14px', letterSpacing: '1px', color: '#b08d57' }}>ALERTS</span>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#64748b',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                <Check size={12} /> Clear All
                            </button>
                        )}
                    </div>

                    <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#475569' }}>
                                <Bell size={32} style={{ opacity: 0.1, marginBottom: '10px' }} />
                                <p style={{ fontSize: '13px' }}>No active alerts in sector.</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    style={{
                                        padding: '15px 20px',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                                        background: n.is_read ? 'transparent' : 'rgba(176, 141, 87, 0.05)',
                                        transition: 'background 0.2s',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                        <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: n.is_read ? '#94a3b8' : '#fff' }}>
                                            {n.title}
                                        </h4>
                                        <span style={{ fontSize: '10px', color: '#475569' }}>
                                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                                        {n.message}
                                    </p>
                                    {!n.is_read && (
                                        <div
                                            onClick={() => markAsRead(n.id)}
                                            style={{
                                                marginTop: '8px',
                                                fontSize: '11px',
                                                color: '#b08d57',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            <Check size={12} /> Mark as seen
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideIn {
                    from { transform: translateY(-10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default NotificationBell;
