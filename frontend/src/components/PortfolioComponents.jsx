import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

/**
 * Portfolio Page Wrapper
 * Provides the dark minimal container for all portfolio-style pages
 */
export const PortfolioPage = ({ children, breadcrumb = '' }) => {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'transparent',
            padding: '60px 80px',
            position: 'relative'
        }}>
            {breadcrumb && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '40px'
                }}>
                    <div style={{
                        fontSize: '13px',
                        color: 'var(--cream)',
                        fontWeight: '300',
                        letterSpacing: '1px'
                    }}>
                        {breadcrumb}
                    </div>
                    <ArrowRight size={32} color="var(--cream)" strokeWidth={1} />
                </div>
            )}
            {children}
        </div>
    );
};

/**
 * Portfolio Title
 * Oversized serif typography for main page titles
 */
export const PortfolioTitle = ({ children, subtitle }) => {
    return (
        <>
            <h1 style={{
                fontSize: 'clamp(4rem, 12vw, 10rem)',
                fontFamily: 'var(--font-serif)',
                fontWeight: '600',
                color: 'var(--cream)',
                lineHeight: '0.9',
                marginBottom: subtitle ? '40px' : '100px',
                letterSpacing: '-0.02em'
            }}>
                {children}
            </h1>
            {subtitle && (
                <p style={{
                    color: 'rgba(232, 230, 227, 0.7)',
                    fontSize: '18px',
                    marginBottom: '100px',
                    maxWidth: '600px'
                }}>
                    {subtitle}
                </p>
            )}
        </>
    );
};

/**
 * Portfolio Section Title
 * Smaller serif titles for sections within pages
 */
export const PortfolioSectionTitle = ({ children }) => {
    return (
        <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontFamily: 'var(--font-serif)',
            fontWeight: '500',
            color: 'var(--cream)',
            marginBottom: '60px',
            letterSpacing: '-0.01em'
        }}>
            {children}
        </h2>
    );
};

/**
 * Portfolio Button
 * Primary pill-shaped button
 */
export const PortfolioButton = ({ children, onClick, variant = 'primary', style = {} }) => {
    const baseStyle = {
        padding: '18px 40px',
        border: 'none',
        borderRadius: '50px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        letterSpacing: '0.5px',
        transition: 'all 0.3s',
        ...style
    };

    const variants = {
        primary: {
            background: 'var(--cream)',
            color: '#0a0a0a',
        },
        secondary: {
            background: 'transparent',
            color: 'var(--cream)',
            border: '1.5px solid var(--cream)',
        },
        gold: {
            background: 'var(--gold)',
            color: '#0a0a0a',
        }
    };

    return (
        <button
            onClick={onClick}
            style={{ ...baseStyle, ...variants[variant] }}
        >
            {children}
        </button>
    );
};

/**
 * Portfolio Back Button
 */
export const PortfolioBackButton = ({ onClick, label = 'Back' }) => {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '15px 40px',
                background: 'transparent',
                border: '1.5px solid var(--cream)',
                borderRadius: '50px',
                color: 'var(--cream)',
                fontSize: '14px',
                cursor: 'pointer',
                marginBottom: '60px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}
        >
            <ArrowLeft size={18} /> {label}
        </button>
    );
};

/**
 * Portfolio Card
 * Minimal card for list items with hover effect
 */
export const PortfolioCard = ({ children, onClick, borderColor = 'rgba(232, 230, 227, 0.2)' }) => {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '30px',
                background: 'transparent',
                border: `1.5px solid ${borderColor}`,
                borderRadius: '20px',
                color: 'var(--cream)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                textAlign: 'left',
                width: '100%'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(232, 230, 227, 0.03)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
            {children}
        </button>
    );
};

/**
 * Portfolio Grid
 * Responsive grid for cards
 */
export const PortfolioGrid = ({ children, columns = 'repeat(auto-fill, minmax(280px, 1fr))' }) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: columns,
            gap: '20px',
            maxWidth: '1400px'
        }}>
            {children}
        </div>
    );
};

/**
 * Portfolio Stats
 * Large number display for key metrics
 */
export const PortfolioStats = ({ stats }) => {
    return (
        <div style={{ display: 'flex', gap: '60px', marginBottom: '80px', flexWrap: 'wrap' }}>
            {stats && stats.map((stat, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                    {stat.icon && (
                        <div style={{ marginTop: '5px', opacity: 0.8 }}>
                            {typeof stat.icon === 'function' || (typeof stat.icon === 'object' && stat.icon !== null) ? (
                                React.createElement(stat.icon, { size: 32, color: stat.color || 'var(--gold)', strokeWidth: 1 })
                            ) : (
                                stat.icon
                            )}
                        </div>
                    )}
                    <div>
                        <div style={{
                            fontSize: '48px',
                            fontFamily: 'var(--font-serif)',
                            color: stat.color || 'var(--cream)',
                            fontWeight: '300',
                            lineHeight: '1'
                        }}>
                            {stat.value}
                        </div>
                        <div style={{
                            fontSize: '11px',
                            color: 'rgba(232, 230, 227, 0.6)',
                            letterSpacing: '2px',
                            marginTop: '8px',
                            fontWeight: '800',
                            textTransform: 'uppercase'
                        }}>
                            {stat.label}
                        </div>
                        {stat.subvalue && (
                            <div style={{
                                fontSize: '11px',
                                color: 'rgba(232, 230, 227, 0.3)',
                                marginTop: '4px',
                                letterSpacing: '0.5px'
                            }}>
                                {stat.subvalue}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

/**
 * Portfolio Input
 * Styled form input that handles text, select, and textarea
 */
export const PortfolioInput = ({ label, type = 'text', options = [], ...props }) => {
    const inputStyle = {
        width: '100%',
        padding: '15px 20px',
        background: 'rgba(232, 230, 227, 0.03)',
        border: '1px solid rgba(232, 230, 227, 0.1)', // Subtle base border
        borderRadius: '12px',
        color: 'var(--cream)',
        fontSize: '14px',
        fontFamily: 'inherit',
        outline: 'none',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box',
        ...props.style
    };

    const renderInput = () => {
        if (type === 'select') {
            return (
                <div style={{ position: 'relative', width: '100%' }}>
                    <select
                        {...props}
                        style={{
                            ...inputStyle,
                            background: '#0a0a0a',
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            cursor: 'pointer',
                            paddingRight: '45px',
                            border: '1px solid rgba(232, 230, 227, 0.2)', // Single crisp border
                            outline: 'none'
                        }}
                    >
                        {options.length > 0 ? options.map((opt, idx) => (
                            <option key={idx} value={opt.value !== undefined ? opt.value : opt} style={{ background: '#0a0a0a', color: 'var(--cream)' }}>
                                {opt.label !== undefined ? opt.label : opt}
                            </option>
                        )) : props.children}
                    </select>
                    <div style={{
                        position: 'absolute',
                        right: '18px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: 'var(--gold)',
                        opacity: 0.8,
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            );
        }

        if (type === 'textarea') {
            return (
                <textarea
                    {...props}
                    style={{ ...inputStyle, resize: 'vertical' }}
                />
            );
        }

        return (
            <input
                {...props}
                type={type}
                style={inputStyle}
            />
        );
    };

    return (
        <div style={{ marginBottom: '30px' }}>
            {label && (
                <label style={{
                    display: 'block',
                    color: 'rgba(232, 230, 227, 0.6)',
                    fontSize: '13px',
                    marginBottom: '10px',
                    letterSpacing: '1px'
                }}>
                    {label}
                </label>
            )}
            {renderInput()}
        </div>
    );
};

// Kept for backward compatibility or direct use
export const PortfolioSelect = (props) => <PortfolioInput {...props} type="select" />;
export const PortfolioTextarea = (props) => <PortfolioInput {...props} type="textarea" />;

/**
 * Portfolio Detail Box
 * Info display box
 */
export const PortfolioDetailBox = ({ label, value, icon }) => {
    return (
        <div style={{
            padding: '25px 30px',
            background: 'rgba(232, 230, 227, 0.03)',
            border: '1px solid rgba(232, 230, 227, 0.1)',
            borderRadius: '15px'
        }}>
            {icon && (
                <div style={{ marginBottom: '10px', opacity: 0.6 }}>
                    {icon}
                </div>
            )}
            <div style={{
                fontSize: '13px',
                color: 'rgba(232, 230, 227, 0.6)',
                marginBottom: '8px',
                letterSpacing: '1px'
            }}>
                {label}
            </div>
            <div style={{ fontSize: '16px', color: 'var(--cream)', lineHeight: '1.6' }}>
                {value}
            </div>
        </div>
    );
};

export default {
    PortfolioPage,
    PortfolioTitle,
    PortfolioSectionTitle,
    PortfolioButton,
    PortfolioBackButton,
    PortfolioCard,
    PortfolioGrid,
    PortfolioStats,
    PortfolioInput,
    PortfolioSelect,
    PortfolioTextarea,
    PortfolioDetailBox
};
