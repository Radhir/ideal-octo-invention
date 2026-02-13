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
            background: '#0a0a0a',
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
        <div style={{ display: 'flex', gap: '40px', marginBottom: '80px', flexWrap: 'wrap' }}>
            {stats.map((stat, index) => (
                <div key={index}>
                    <div style={{
                        fontSize: '48px',
                        fontFamily: 'var(--font-serif)',
                        color: stat.color || 'var(--cream)',
                        fontWeight: '300'
                    }}>
                        {stat.value}
                    </div>
                    <div style={{
                        fontSize: '13px',
                        color: 'rgba(232, 230, 227, 0.6)',
                        letterSpacing: '1px',
                        marginTop: '5px'
                    }}>
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
    );
};

/**
 * Portfolio Input
 * Styled form input
 */
export const PortfolioInput = ({ label, ...props }) => {
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
            <input
                {...props}
                style={{
                    width: '100%',
                    padding: '15px 20px',
                    background: 'transparent',
                    border: '1px solid rgba(232, 230, 227, 0.3)',
                    borderRadius: '10px',
                    color: 'var(--cream)',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    ...props.style
                }}
            />
        </div>
    );
};

/**
 * Portfolio Select
 * Styled select dropdown
 */
export const PortfolioSelect = ({ label, children, ...props }) => {
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
            <select
                {...props}
                style={{
                    width: '100%',
                    padding: '15px 20px',
                    background: '#0a0a0a',
                    border: '1px solid rgba(232, 230, 227, 0.3)',
                    borderRadius: '10px',
                    color: 'var(--cream)',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    ...props.style
                }}
            >
                {children}
            </select>
        </div>
    );
};

/**
 * Portfolio Textarea
 * Styled textarea
 */
export const PortfolioTextarea = ({ label, ...props }) => {
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
            <textarea
                {...props}
                style={{
                    width: '100%',
                    padding: '15px 20px',
                    background: 'transparent',
                    border: '1px solid rgba(232, 230, 227, 0.3)',
                    borderRadius: '10px',
                    color: 'var(--cream)',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    ...props.style
                }}
            />
        </div>
    );
};

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
