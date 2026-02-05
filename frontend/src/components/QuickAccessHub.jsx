import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, Rocket, Shield, Settings, Briefcase, Building,
    ClipboardList, FileText, Calendar, X, MapPin, Clock, Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../context/PermissionContext';
import EliteCommandTerminal from './EliteCommandTerminal';

const QuickAccessHub = () => {
    const { user } = useAuth();
    const { hasPermission, isAdmin } = usePermissions();
    const [isOpen, setIsOpen] = useState(false);
    const [terminalOpen, setTerminalOpen] = useState(false);
    const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 });
    const clickCountRef = useRef(0);
    const lastClickTime = useRef(0);
    const navigate = useNavigate();
    const constraintsRef = useRef(null);

    const isElite = user && ['radhir', 'ruchika', 'afsar'].includes(user.username.toLowerCase());

    const handleHubClick = () => {
        const now = Date.now();
        if (now - lastClickTime.current < 500) {
            clickCountRef.current += 1;
        } else {
            clickCountRef.current = 1;
        }
        lastClickTime.current = now;

        if (clickCountRef.current >= 5) {
            setTerminalOpen(true);
            clickCountRef.current = 0;
            setIsOpen(false);
        } else {
            setIsOpen(!isOpen);
        }
    };

    const modules = [
        { name: 'Job Cards', icon: ClipboardList, path: '/job-cards', color: '#b08d57', permission: 'job_cards' },
        { name: 'Invoices', icon: FileText, path: '/invoices', color: '#3b82f6', permission: 'job_cards' },
        { name: 'Schedule', icon: Calendar, path: '/scheduling', color: '#f59e0b', permission: 'calendar' },
        { name: 'Live Map', icon: MapPin, path: '/pick-drop', color: '#10b981', permission: 'logistics' },
        { name: 'Attendance', icon: Clock, path: '/hr/attendance', color: '#3b82f6', permission: 'attendance' },
        { name: 'Workshop', icon: Settings, path: '/workshop', color: '#f97316', permission: 'job_cards' },
        { name: 'HR Hub', icon: Briefcase, path: '/hr/hub', color: '#10b981', permission: 'hr' },
        { name: 'Chat', icon: MessageSquare, path: '/chat', color: '#8b5cf6', permission: 'all' },
        { name: 'Access Control', icon: Shield, path: '/hr/access', color: '#ef4444', permission: 'settings' },
        { name: 'Branch Mgr', icon: Building, path: '/admin/branches', color: '#8b5cf6', permission: 'settings' },
    ];

    // Filter modules based on permissions
    const filteredModules = modules.filter(mod => {
        if (!mod.permission) return true;
        if (mod.permission === 'all' && isAdmin()) return true;
        return hasPermission(mod.permission);
    });

    return (
        <>
            <style>{`
                .quick-hub-constraints {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                    z-index: 9999;
                }
                .quick-hub-toggle {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    z-index: 10000;
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    border: none;
                    background: linear-gradient(135deg, #b08d57 0%, #8a6d43 100%);
                    color: white;
                    cursor: grab;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 20px rgba(176, 141, 87, 0.4);
                    pointer-events: auto;
                    touch-action: none;
                }
                .quick-hub-toggle:active {
                    cursor: grabbing;
                }
                .quick-hub-panel {
                    position: fixed;
                    bottom: 100px;
                    right: 30px;
                    z-index: 9998;
                    width: 320px;
                    background: rgba(15, 23, 42, 0.95);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(176, 141, 87, 0.3);
                    border-radius: 20px;
                    padding: 20px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                    pointer-events: auto;
                }
                .quick-hub-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid rgba(176, 141, 87, 0.2);
                }
                .quick-hub-title {
                    font-weight: 900;
                    letter-spacing: 2px;
                    font-size: 12px;
                    color: #b08d57;
                    text-transform: uppercase;
                }
                .quick-hub-close {
                    background: none;
                    border: none;
                    color: rgba(255, 255, 255, 0.5);
                    cursor: pointer;
                    padding: 4px;
                    display: flex;
                    transition: color 0.2s;
                }
                .quick-hub-close:hover {
                    color: white;
                }
                .quick-hub-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }
                .quick-hub-item {
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.2s ease;
                }
                .quick-hub-item:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateY(-2px);
                    border-color: rgba(176, 141, 87, 0.3);
                }
                .quick-hub-item span {
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    color: white;
                    text-align: center;
                }
                @media (max-width: 768px) {
                    .quick-hub-toggle {
                        bottom: 20px;
                        right: 20px;
                        width: 52px;
                        height: 52px;
                    }
                    .quick-hub-panel {
                        bottom: 85px;
                        right: 15px;
                        left: 15px;
                        width: auto;
                    }
                }
            `}</style>

            <EliteCommandTerminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />

            {/* Drag constraints container */}
            <div className="quick-hub-constraints" ref={constraintsRef} />

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="quick-hub-panel"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="quick-hub-header">
                            <span className="quick-hub-title">Quick Access</span>
                            <button className="quick-hub-close" onClick={() => setIsOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="quick-hub-grid">
                            {filteredModules.map(mod => (
                                <div
                                    key={mod.name}
                                    className="quick-hub-item"
                                    onClick={() => {
                                        navigate(mod.path);
                                        setIsOpen(false);
                                    }}
                                >
                                    <mod.icon size={24} color={mod.color} />
                                    <span>{mod.name}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Draggable Toggle Button */}
            <motion.button
                className="quick-hub-toggle"
                drag
                dragConstraints={constraintsRef}
                dragElastic={0.1}
                dragMomentum={false}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onTap={handleHubClick}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
        </>
    );
};

export default QuickAccessHub;
