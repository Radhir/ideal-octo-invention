import React from 'react';

const GlassCard = ({ children, className, ...props }) => {
    return (
        <motion.div
            whileHover={{
                y: -10,
                rotateX: 2,
                rotateY: 2,
                backgroundColor: 'var(--bg-glass)',
                borderColor: 'var(--gold-border)'
            }}
            className={`glass-card ${className}`}
            style={{
                transformStyle: 'preserve-3d',
                transition: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease',
                ...props.style
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
