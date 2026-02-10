import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className, ...props }) => {
    return (
        <motion.div
            whileHover={{
                y: -10,
                rotateX: 2,
                rotateY: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(176, 141, 87, 0.3)'
            }}
            className={`glass-card ${className}`}
            style={{
                transformStyle: 'preserve-3d',
                ...props.style
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
