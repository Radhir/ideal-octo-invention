import React, { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronUp } from "lucide-react";

/**
 * Floating Dock Component
 * Adapts the provided design to standard CSS/Inline styles and Lucide React.
 * Uses framer-motion for animations.
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
            <AnimatePresence>
                {open && (
                    <motion.div
                        layoutId="nav"
                        style={{
                            position: 'absolute',
                            bottom: '100%',
                            marginBottom: '16px',
                            left: '50%',
                            transform: 'translateX(-50%)', // Center horizontally
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            alignItems: 'center',
                            background: 'rgba(10, 12, 16, 0.8)',
                            backdropFilter: 'blur(12px)',
                            padding: '12px',
                            borderRadius: '24px',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        {items.map((item, idx) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{
                                    opacity: 0,
                                    y: 10,
                                    transition: { delay: idx * 0.05 },
                                }}
                                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
                            >
                                <Link
                                    to={item.href}
                                    key={item.title}
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
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    display: 'flex',
                    height: '56px',
                    width: '56px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    background: '#b08d57', // Accent color for main button
                    color: '#000',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(176, 141, 87, 0.4)'
                }}
            >
                <ChevronUp size={28} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
            </button>
            <style>{`
        @media (min-width: 768px) {
            .mobile-dock { display: none !important; }
        }
      `}</style>
        </div>
    );
};

const FloatingDockDesktop = ({ items, style }) => {
    let mouseX = useMotionValue(Infinity);
    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="desktop-dock"
            style={{
                margin: '0 auto',
                height: '64px',
                alignItems: 'flex-end',
                gap: '16px',
                borderRadius: '24px',
                background: 'rgba(10, 12, 16, 0.4)', // Glassmorphism base
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '0 16px 12px 16px',
                display: 'flex',
                boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.3)',
                ...style
            }}
        >
            {items.map((item) => (
                <IconContainer mouseX={mouseX} key={item.title} {...item} />
            ))}
            <style>{`
        @media (max-width: 767px) {
            .desktop-dock { display: none !important; }
        }
      `}</style>
        </motion.div>
    );
};

function IconContainer({ mouseX, title, icon, href }) {
    let ref = useRef(null);

    let distance = useTransform(mouseX, (val) => {
        let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

    let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
    let heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

    let width = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 });
    let height = useSpring(heightTransform, { mass: 0.1, stiffness: 150, damping: 12 });

    let widthIcon = useSpring(widthTransformIcon, { mass: 0.1, stiffness: 150, damping: 12 });
    let heightIcon = useSpring(heightTransformIcon, { mass: 0.1, stiffness: 150, damping: 12 });

    const [hovered, setHovered] = useState(false);

    return (
        <Link to={href}>
            <motion.div
                ref={ref}
                style={{ width, height }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="dock-icon-container"
            >
                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, x: "-50%" }}
                            animate={{ opacity: 1, y: -10, x: "-50%" }}
                            exit={{ opacity: 0, y: 2, x: "-50%" }}
                            style={{
                                position: 'absolute',
                                top: '-35px',
                                left: '50%',
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
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.div
                    style={{ width: widthIcon, height: heightIcon, display: 'flex', alignItems: 'center', justifyContent: 'center', color: hovered ? '#fff' : '#94a3b8' }}
                >
                    {icon}
                </motion.div>
            </motion.div>
            <style>{`
        .dock-icon-container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 9999px; /* full/circle */
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: background 0.2s;
        }
        .dock-icon-container:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(176, 141, 87, 0.3);
        }
      `}</style>
        </Link>
    );
}

export default FloatingDock;
