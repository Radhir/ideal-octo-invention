import React, { useState, useRef, useEffect } from 'react';
import { useBranch } from '../context/BranchContext';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BranchSwitcher = () => {
    const { branches, currentBranch, switchBranch } = useBranch();
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
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!branches || branches.length === 0) return null;

    return (
        <div style={{ position: 'relative', pointerEvents: 'auto' }} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '50px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#fff',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(176, 141, 87, 0.4)';
                }}
                onMouseOut={(e) => {
                    if (!isOpen) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }
                }}
            >
                <div style={{
                    background: 'linear-gradient(135deg, #b08d57 0%, #8a6d43 100%)',
                    borderRadius: '50%',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <MapPin size={14} color="#fff" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '9px', color: '#b08d57', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: '1' }}>Branch</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{currentBranch?.name || 'Select Branch'}</span>
                </div>
                <ChevronDown size={14} color="#94a3b8" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 5, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, cubicBezier: [0.4, 0, 0.2, 1] }}
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            width: '240px',
                            background: 'rgba(15, 23, 42, 0.95)',
                            backdropFilter: 'blur(25px)',
                            WebkitBackdropFilter: 'blur(25px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            padding: '8px',
                            boxShadow: '0 15px 50px rgba(0, 0, 0, 0.6)',
                            zIndex: 2001,
                            overflow: 'hidden',
                            marginTop: '5px'
                        }}
                    >
                        <div style={{ padding: '8px 12px', fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Switch Location
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {branches.map(branch => (
                                <button
                                    key={branch.id}
                                    onClick={() => {
                                        switchBranch(branch.id);
                                        setIsOpen(false);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '10px',
                                        background: currentBranch?.id === branch.id ? 'rgba(176, 141, 87, 0.1)' : 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: currentBranch?.id === branch.id ? '#b08d57' : '#e2e8f0',
                                        fontSize: '13px',
                                        fontWeight: currentBranch?.id === branch.id ? '700' : '500',
                                        transition: 'all 0.2s',
                                        textAlign: 'left'
                                    }}
                                    onMouseOver={(e) => {
                                        if (currentBranch?.id !== branch.id) {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (currentBranch?.id !== branch.id) {
                                            e.currentTarget.style.background = 'transparent';
                                        }
                                    }}
                                >
                                    <span>{branch.name}</span>
                                    {currentBranch?.id === branch.id && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BranchSwitcher;
