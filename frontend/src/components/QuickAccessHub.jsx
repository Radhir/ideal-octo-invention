import React, { useState, useRef } from 'react';
import {
    MessageSquare, Rocket, Shield, Settings, Briefcase, Building,
    ClipboardList, FileText, Calendar, X, MapPin, Clock, Menu, Users, Zap, ShoppingCart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../context/PermissionContext';
import EliteCommandTerminal from './EliteCommandTerminal';

const QuickAccessHub = () => {
    const { hasPermission } = usePermissions();
    const [isOpen, setIsOpen] = useState(false);
    const [terminalOpen, setTerminalOpen] = useState(false);
    const [buttonPos] = useState({ x: 0, y: 0 });
    const clickCountRef = useRef(0);
    const lastClickTime = useRef(0);
    const navigate = useNavigate();
    const constraintsRef = useRef(null);

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
        { name: 'Treasury', icon: Briefcase, path: '/finance', color: 'var(--gold)', permission: 'finance' },
        { name: 'Workshop Diary', icon: Calendar, path: '/workshop-diary', color: 'var(--gold)', permission: 'finance' },
        { name: 'Invoices', icon: FileText, path: '/invoices', color: '#3b82f6', permission: 'job_cards' },
        { name: 'Schedule', icon: Calendar, path: '/scheduling', color: '#f59e0b', permission: 'calendar' },
        { name: 'Live Map', icon: MapPin, path: '/pick-drop', color: '#10b981', permission: 'logistics' },
        { name: 'Attendance', icon: Clock, path: '/hr/attendance', color: '#3b82f6', permission: 'attendance' },
        { name: 'Workshop', icon: Settings, path: '/workshop', color: '#f97316', permission: 'job_cards' },
        { name: 'HR Hub', icon: Briefcase, path: '/hr/hub', color: '#10b981', permission: 'hr' },
        { name: 'Chat', icon: MessageSquare, path: '/chat', color: '#8b5cf6', permission: 'all' },
        { name: 'Access Control', icon: Shield, path: '/hr/access', color: '#ef4444', permission: 'settings' },
        { name: 'Branch Mgr', icon: Building, path: '/admin/branches', color: '#8b5cf6', permission: 'settings' },
        { name: 'Purchase Entry', icon: ShoppingCart, path: '/logistics/purchase', color: 'var(--gold)', permission: 'finance' },
        { name: 'Project Board', icon: Rocket, path: '/projects', color: '#8b5cf6', permission: 'job_cards' },
        { name: 'Leads Registry', icon: Users, path: '/leads', color: '#ec4899', permission: 'job_cards' },
        { name: 'Capture Lead', icon: Zap, path: '/leads/create', color: '#ef4444', permission: 'job_cards' },
    ];

    // Filter modules based on permissions
    const filteredModules = modules.filter(mod => {
        if (!mod.permission) return true;
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
                    width: 340px;
                    background: rgba(5, 5, 5, 0.98);
                    backdrop-filter: blur(40px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: var(--radius-xl);
                    padding: 24px;
                    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.9);
                    pointer-events: auto;
                }
                .quick-hub-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    padding-bottom: 18px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }
                .quick-hub-title {
                    font-weight: 800;
                    letter-spacing: 2px;
                    font-size: 11px;
                    color: var(--gold);
                    text-transform: uppercase;
                }
                .quick-hub-close {
                    background: rgba(255,255,255,0.05);
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 50%;
                    display: flex;
                }
                .quick-hub-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }
                .quick-hub-item {
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .quick-hub-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    transform: translateY(-4px);
                    border-color: rgba(255, 255, 255, 0.2);
                }
                .quick-hub-item span {
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    color: #fff;
                    text-align: center;
                    text-transform: uppercase;
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

            {isOpen && (
                <div className="quick-hub-panel animate-slide-up" style={{ animationDuration: '0.2s' }}>
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
                </div>
            )}

            <button
                className="quick-hub-toggle"
                onClick={handleHubClick}
                style={{ x: buttonPos.x, y: buttonPos.y }}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </>
    );
};

export default QuickAccessHub;
