import React, { useRef, useState } from 'react';

const BentoCard = ({ title, label, description, icon: Icon, span = 1, rows = 1, children }) => {
    const cardRef = useRef(null);
    const [glowPos, setGlowPos] = useState({ x: '50%', y: '50%' });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setGlowPos({ x: `${x}px`, y: `${y}px` });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className={`magic-bento-card ${span > 1 ? 'bento-span-2' : ''} ${rows > 1 ? 'bento-row-2' : ''}`}
            style={{
                '--glow-x': glowPos.x,
                '--glow-y': glowPos.y,
                transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)', // Ensure smooth theme transition
            }}
        >
            <div className="magic-bento-card__header">
                <span className="magic-bento-card__label">{label}</span>
                {Icon && <Icon size={24} color="var(--gold)" />}
            </div>

            <div className="magic-bento-card__content">
                <h3 className="magic-bento-card__title" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                {description && <p className="magic-bento-card__description" style={{ color: 'var(--text-secondary)' }}>{description}</p>}
                {children}
            </div>
        </div>
    );
};

export default BentoCard;
