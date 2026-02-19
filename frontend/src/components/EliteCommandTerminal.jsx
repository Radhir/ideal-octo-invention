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

    const handleCommand = (cmd) => {
        const cleanCmd = cmd.trim().toLowerCase();
        if (!cleanCmd) return;

        const newLog = { type: 'cmd', text: `> ${cmd}` };
        setHistory(prev => [...prev, newLog]);

        let response = { type: 'error', text: `COMMAND NOT RECOGNIZED: "${cleanCmd}"` };

        if (cleanCmd === 'help') {
            response = { type: 'info', text: 'AVAILABLE COMMANDS: HELP, STATUS, LOGS, CLEAR, EXIT, ACCESS, SYSTEM' };
        } else if (cleanCmd === 'status') {
            response = { type: 'info', text: 'SYSTEM STATUS: ALL CORE MODULES OPERATIONAL. LATENCY: 14ms.' };
        } else if (cleanCmd === 'clear') {
            setHistory([]);
            setInput('');
            return;
        } else if (cleanCmd === 'exit') {
            onClose();
            setInput('');
            return;
        } else if (cleanCmd === 'logs') {
            response = { type: 'info', text: 'FETCHING RECENT ACCESS LOGS... [RADHIR: OK] [RUCHIKA: OK] [AFSAR: OK]' };
        } else if (cleanCmd === 'access') {
            response = { type: 'success', text: `USER: ${user?.username.toUpperCase()} | LEVEL: ${['radhir', 'ruchika', 'afsar'].includes(user?.username.toLowerCase()) ? 'ELITE-ALPHA' : 'STANDARD-OPERATIVE'}` };
        } else if (cleanCmd === 'system') {
            response = { type: 'info', text: 'VERSION: Elite Shine ERP Pre-Alpha 9 | ARCH: Django/React | DB: PostgreSQL' };
        }

        setTimeout(() => {
            setHistory(prev => [...prev, response]);
        }, 100);

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
