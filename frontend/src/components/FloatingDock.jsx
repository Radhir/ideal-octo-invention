import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronUp } from "lucide-react";

/**
 * Floating Dock Component
 * Standard CSS/Inline styles and Lucide React.
 * Removed framer-motion for stability.
 */

export const FloatingDock = ({ items, desktopStyle, mobileStyle }) => {
    return (
        <>
            <FloatingDockDesktop items={items} style={desktopStyle} />
            <FloatingDockMobile items={items} style={mobileStyle} />
        </>
    );
};

const FloatingDockMobile = ({ items, style }) => {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ position: 'relative', display: 'block', ...style }} className="mobile-dock">
            {open && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '100%',
                        marginBottom: '16px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        alignItems: 'center',
                        background: 'rgba(10, 12, 16, 0.8)',
                        backdropFilter: 'blur(12px)',
                        padding: '12px',
                        borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        zIndex: 100
                    }}
                    className="animate-fade-in"
                >
                    {items.map((item, idx) => (
                        <div key={item.title} className="animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                            <Link
                                to={item.href}
                                style={{
                                    display: 'flex',
                                    height: '40px',
                                    width: '40px',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: '#b08d57'
                                }}
                            >
                                <div style={{ width: '20px', height: '20px' }}>{item.icon}</div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
            <button
                onClick={() => setOpen(!open)}
                style={{
                    display: 'flex',
                    height: '56px',
                    width: '56px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    background: '#b08d57',
                    color: '#000',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(176, 141, 87, 0.4)'
                }}
            >
                <ChevronUp size={28} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
            </button>

        </div>
    );
};

const FloatingDockDesktop = ({ items, style }) => {
    return (
        <div
            className="desktop-dock"
            style={{
                margin: '0 auto',
                height: '64px',
                alignItems: 'center',
                gap: '12px',
                borderRadius: '24px',
                background: 'rgba(10, 12, 16, 0.4)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '0 12px',
                display: 'flex',
                boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.3)',
                ...style
            }}
        >
            {items.map((item) => (
                <IconContainer key={item.title} {...item} />
            ))}

        </div>
    );
};

function IconContainer({ title, icon, href }) {
    const location = useLocation();
    const isActive = location.pathname === href || (href !== '/' && location.pathname.startsWith(href));
    const [hovered, setHovered] = useState(false);

    return (
        <Link
            to={href}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ position: 'relative', textDecoration: 'none' }}
        >
            <div
                className={`dock-icon-container ${isActive ? 'active' : ''}`}
                style={{
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    background: isActive ? 'rgba(176, 141, 87, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid',
                    borderColor: isActive ? 'rgba(176, 141, 87, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                    color: isActive ? '#b08d57' : (hovered ? '#fff' : '#94a3b8'),
                    transition: 'all 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
                    transform: hovered ? 'translateY(-4px)' : 'none'
                }}
            >
                <div style={{ width: '22px', height: '22px' }}>{icon}</div>

                {hovered && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '-40px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 'max-content',
                            borderRadius: '6px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(0,0,0,0.8)',
                            padding: '4px 8px',
                            fontSize: '10px',
                            color: '#fff',
                            pointerEvents: 'none',
                            zIndex: 20
                        }}
                    >
                        {title}
                    </div>
                )}

                {isActive && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '2px',
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: '#b08d57',
                            boxShadow: '0 0 10px #b08d57'
                        }}
                    />
                )}
            </div>
        </Link>
    );
}

export default FloatingDock;

