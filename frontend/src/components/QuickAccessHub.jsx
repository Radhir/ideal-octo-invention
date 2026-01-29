import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, X, ClipboardList, FileText, Calendar,
    MessageSquare, Gamepad2, Rocket, Trophy, Shield, Settings, Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const QuickAccessHub = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('shortcuts');
    const [activeGame, setActiveGame] = useState('tictactoe');
    const navigate = useNavigate();

    const isElite = user && ['radhir', 'ruchika', 'afsar'].includes(user.username.toLowerCase());

    const modules = [
        { name: 'Job Cards', icon: ClipboardList, path: '/job-cards', color: '#b08d57' },
        { name: 'Invoices', icon: FileText, path: '/invoices', color: '#3b82f6' },
        { name: 'Schedule', icon: Calendar, path: '/scheduling', color: '#f59e0b' },
        { name: 'Workshop', icon: Settings, path: '/workshop', color: '#f97316' },
        { name: 'HR Hub', icon: Briefcase, path: '/hr/hub', color: '#10b981' },
        { name: 'Chat', icon: MessageSquare, path: '/chat', color: '#8b5cf6' },
    ];

    if (isElite) {
        modules.push({ name: 'Access Control', icon: Shield, path: '/hr/access', color: '#ef4444' });
    }

    return (
        <div style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 9999 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        style={{
                            width: '350px',
                            background: 'rgba(15, 23, 42, 0.9)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(176, 141, 87, 0.3)',
                            borderRadius: '24px',
                            padding: '24px',
                            marginBottom: '20px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            color: '#fff',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Video Reveal Accent */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: -1,
                            opacity: 0.15
                        }}>
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            >
                                <source src="/sample.mp4" type="video/mp4" />
                            </video>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div style={{ fontWeight: '900', letterSpacing: '2px', fontSize: '14px', color: '#b08d57' }}>QUICK ACCESS HUB</div>
                            <X size={20} style={{ cursor: 'pointer', opacity: 0.5 }} onClick={() => setIsOpen(false)} />
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                            {['shortcuts', 'games'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        background: activeTab === tab ? 'rgba(176,141,87,0.2)' : 'rgba(255,255,255,0.05)',
                                        border: `1px solid ${activeTab === tab ? '#b08d57' : 'rgba(255,255,255,0.1)'}`,
                                        borderRadius: '12px',
                                        color: activeTab === tab ? '#b08d57' : '#fff',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'shortcuts' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                {modules.map(mod => (
                                    <motion.div
                                        key={mod.name}
                                        whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
                                        onClick={() => {
                                            navigate(mod.path);
                                            setIsOpen(false);
                                        }}
                                        style={{
                                            padding: '20px',
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '12px',
                                            border: '1px solid rgba(255,255,255,0.05)'
                                        }}
                                    >
                                        <mod.icon size={26} color={mod.color} />
                                        <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '1px' }}>{mod.name}</span>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'games' && (
                            <div>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                                    <button
                                        onClick={() => setActiveGame('tictactoe')}
                                        style={{ flex: 1, padding: '6px', fontSize: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: activeGame === 'tictactoe' ? '#b08d57' : 'transparent', color: '#fff' }}
                                    >
                                        TIC-TAC-TOE
                                    </button>
                                    <button
                                        onClick={() => setActiveGame('clicker')}
                                        style={{ flex: 1, padding: '6px', fontSize: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: activeGame === 'clicker' ? '#b08d57' : 'transparent', color: '#fff' }}
                                    >
                                        ELITE CLICKER
                                    </button>
                                </div>
                                {activeGame === 'tictactoe' ? <TicTacToe /> : <EliteClicker />}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #b08d57 0%, #8a6d43 100%)',
                    border: 'none',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 10px 30px rgba(176,141,87,0.4)',
                    cursor: 'pointer'
                }}
            >
                {isOpen ? <X size={28} /> : <Rocket size={28} />}
            </motion.button>
        </div>
    );
};

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const winner = calculateWinner(board);

    const handleClick = (i) => {
        if (winner || board[i]) return;
        const newBoard = board.slice();
        newBoard[i] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        setIsXNext(!isXNext);
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px' }}>
                {winner ? (
                    <div style={{ color: '#b08d57', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Trophy size={16} /> Winner: {winner}
                    </div>
                ) : `Next Player: ${isXNext ? 'X' : 'O'}`}
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                width: '180px',
                margin: '0 auto'
            }}>
                {board.map((val, i) => (
                    <div
                        key={i}
                        onClick={() => handleClick(i)}
                        style={{
                            width: '56px',
                            height: '56px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            fontWeight: '900',
                            color: val === 'X' ? '#b08d57' : '#3b82f6',
                            cursor: 'pointer'
                        }}
                    >
                        {val}
                    </div>
                ))}
            </div>
            <button
                onClick={resetGame}
                style={{
                    marginTop: '20px',
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer'
                }}
            >
                RESET GAME
            </button>
        </div>
    );
};

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

const EliteClicker = () => {
    const [score, setScore] = useState(0);
    const [multiplier, setMultiplier] = useState(1);

    const handleClick = () => {
        setScore(prev => prev + (1 * multiplier));
    };

    const buyMultiplier = () => {
        const cost = Math.floor(10 * Math.pow(1.5, multiplier - 1));
        if (score >= cost) {
            setScore(prev => prev - cost);
            setMultiplier(prev => prev + 1);
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '10px' }}>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#b08d57', marginBottom: '5px' }}>{score}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Shine Points</div>

            <motion.div
                whileTap={{ scale: 0.95 }}
                onClick={handleClick}
                style={{
                    width: '120px',
                    height: '120px',
                    margin: '0 auto 20px',
                    background: 'radial-gradient(circle, #b08d57 0%, #8a6d43 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 0 30px rgba(176,141,87,0.3)',
                    border: '4px solid rgba(255,255,255,0.1)'
                }}
            >
                <Rocket size={40} color="#fff" />
            </motion.div>

            <button
                onClick={buyMultiplier}
                disabled={score < Math.floor(10 * Math.pow(1.5, multiplier - 1))}
                style={{
                    width: '100%',
                    padding: '12px',
                    background: score >= Math.floor(10 * Math.pow(1.5, multiplier - 1)) ? 'rgba(176,141,87,0.2)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                    cursor: score >= Math.floor(10 * Math.pow(1.5, multiplier - 1)) ? 'pointer' : 'not-allowed',
                    opacity: score >= Math.floor(10 * Math.pow(1.5, multiplier - 1)) ? 1 : 0.5
                }}
            >
                UPGRADE POLISH (Cost: {Math.floor(10 * Math.pow(1.5, multiplier - 1))})
                <br />
                <span style={{ fontSize: '9px', opacity: 0.7 }}>Current Multiplier: x{multiplier}</span>
            </button>
        </div>
    );
};

export default QuickAccessHub;
