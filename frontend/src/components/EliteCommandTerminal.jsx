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

                <style>{`
                    .terminal-overlay {
                        position: fixed;
                        inset: 0;
                        background: rgba(0, 0, 0, 0.4);
                        backdrop-filter: blur(4px);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 10001;
                        pointer-events: auto;
                    }
                    .terminal-window {
                        width: 700px;
                        height: 450px;
                        background: #050505;
                        border: 1px solid #b08d57;
                        border-radius: 12px;
                        display: flex;
                        flex-direction: column;
                        box-shadow: 0 0 50px rgba(176,141,87,0.2), 0 20px 60px rgba(0,0,0,0.8);
                        overflow: hidden;
                        font-family: 'JetBrains Mono', 'Fira Code', monospace;
                    }
                    .terminal-header {
                        padding: 10px 15px;
                        background: #111;
                        border-bottom: 1px solid rgba(176,141,87,0.2);
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        color: #b08d57;
                        font-size: 11px;
                        font-weight: 800;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                    }
                    .header-left {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    .terminal-icon {
                        animation: pulse 2s infinite;
                    }
                    @keyframes pulse {
                        0% { opacity: 0.5; }
                        50% { opacity: 1; }
                        100% { opacity: 0.5; }
                    }
                    .close-btn {
                        cursor: pointer;
                        opacity: 0.6;
                    }
                    .close-btn:hover {
                        opacity: 1;
                        color: #ff4444;
                    }
                    .terminal-body {
                        flex: 1;
                        padding: 20px;
                        overflow-y: auto;
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                    }
                    .terminal-line {
                        font-size: 13px;
                        line-height: 1.5;
                        word-break: break-all;
                    }
                    .line-info { color: #8492a6; }
                    .line-success { color: #10b981; }
                    .line-error { color: #ff5f56; }
                    .line-cmd { color: #b08d57; font-weight: 800; }
                    
                    .terminal-footer {
                        padding: 15px 20px;
                        background: #0a0a0a;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        border-top: 1px solid rgba(255,255,255,0.05);
                    }
                    .prompt-icon {
                        color: #b08d57;
                    }
                    .terminal-footer input {
                        flex: 1;
                        background: transparent;
                        border: none;
                        outline: none;
                        color: #fff;
                        font-family: inherit;
                        font-size: 14px;
                    }
                    
                    .terminal-body::-webkit-scrollbar { width: 4px; }
                    .terminal-body::-webkit-scrollbar-track { background: transparent; }
                    .terminal-body::-webkit-scrollbar-thumb { background: rgba(176,141,87,0.2); border-radius: 10px; }
                `}</style>
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
