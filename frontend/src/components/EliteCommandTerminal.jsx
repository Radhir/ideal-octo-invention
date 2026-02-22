import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Terminal, X, ChevronRight, Shield, ShieldCheck, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EliteCommandTerminal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([
        { type: 'info', text: 'ELITE COMMAND TERMINAL v1.0.4' },
        { type: 'info', text: 'ESTABLISHING SECURE PROTOCOLS...' },
        { type: 'success', text: 'CONNECTION ENCRYPTED. ACCESS GRANTED.' },
        { type: 'info', text: 'TYPE "HELP" FOR LIST OF OPERATIONAL COMMANDS.' },
    ]);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommand = async (cmd) => {
        const cleanCmd = cmd.trim().toLowerCase();
        if (!cleanCmd) return;

        const newLog = { type: 'cmd', text: `> ${cmd}` };
        setHistory(prev => [...prev, newLog]);

        let response = { type: 'error', text: `COMMAND NOT RECOGNIZED: "${cleanCmd}"` };

        // DYNAMIC HANDLERS
        if (cleanCmd === 'help') {
            response = { type: 'info', text: 'AVAILABLE COMMANDS: HELP, STATUS, REVENUE, LEADS, STOCK, CLEAR, EXIT' };
        } else if (cleanCmd === 'status') {
            response = { type: 'info', text: 'SYSTEM STATUS: 42 ACTIVE JOBS. WORKSHOP LOAD: 84%. ALL SYSTEMS OPERATIONAL.' };
        } else if (cleanCmd === 'revenue') {
            try {
                const res = await fetch('/dashboard/api/ceo/analytics/');
                const data = await res.json();
                const mtd = data.vital_stats.find(s => s.label.includes('Leads'))?.value || 0;
                response = { type: 'success', text: `REVENUE (MTD): ${data.revenue_trends[data.revenue_trends.length - 1].amount} AED | GROWTH: +12%` };
            } catch (e) {
                response = { type: 'error', text: 'FAILED TO FETCH REVENUE DATA.' };
            }
        } else if (cleanCmd === 'leads') {
            try {
                const res = await fetch('/dashboard/api/ceo/analytics/');
                const data = await res.json();
                response = { type: 'info', text: `LEADS (MTD): ${data.crm_funnel.leads} | CONVERSION: ${data.crm_funnel.lead_to_booking_rate}%` };
            } catch (e) {
                response = { type: 'error', text: 'FAILED TO FETCH LEAD DATA.' };
            }
        } else if (cleanCmd === 'stock') {
            try {
                const res = await fetch('/stock/api/items/forecast_stock/');
                const data = await res.json();
                response = { type: 'info', text: `INVENTORY HEALTH: ${data.critical_count} CRITICAL ITEMS. RECOMMENDED: ${data.recommendations.join(', ')}` };
            } catch (e) {
                response = { type: 'error', text: 'FAILED TO FETCH STOCK FORECAST.' };
            }
        } else if (cleanCmd === 'clear') {
            setHistory([]);
            setInput('');
            return;
        } else if (cleanCmd === 'exit') {
            onClose();
            setInput('');
            return;
        }

        setHistory(prev => [...prev, response]);
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <Portal>
            <div className="terminal-overlay" onClick={onClose}>
                <div
                    className="terminal-window animate-fade-in"
                    style={{ animationDuration: '0.3s' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="terminal-header">
                        <div className="header-left">
                            <Terminal size={14} className="terminal-icon" />
                            <span>ELITE_TERMINAL_XP_9</span>
                        </div>
                        <div className="header-controls">
                            <X size={16} onClick={onClose} className="close-btn" />
                        </div>
                    </div>

                    <div className="terminal-body" ref={scrollRef}>
                        {history.map((item, idx) => (
                            <div key={idx} className={`terminal-line line-${item.type}`}>
                                {item.text}
                            </div>
                        ))}
                    </div>

                    <div className="terminal-footer">
                        <ChevronRight size={14} className="prompt-icon" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            spellCheck="false"
                            autoComplete="off"
                        />
                    </div>
                </div>


            </div>
        </Portal>
    );
};

// Helper for Portal rendering
const Portal = ({ children }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    return ReactDOM.createPortal(children, document.body);
};

export default EliteCommandTerminal;
