import React from 'react';
import { PortfolioCard } from './PortfolioComponents';

/**
 * GlassCard -> PortfolioCard Alias
 * This component now wraps PortfolioCard to instantly upgrade all legacy pages 
 * to the new Portfolio Design System without requiring manual refactoring of 20+ files.
 */
const GlassCard = ({ children, className = "", style, ...props }) => {
    return (
        <PortfolioCard
            style={{
                // Merge any custom styles passed solely for layout (e.g. padding updates)
                // but rely on PortfolioCard for the background/border theme.
                ...style
            }}
            {...props}
        >
            {children}
        </PortfolioCard>
    );
};

export default GlassCard;
