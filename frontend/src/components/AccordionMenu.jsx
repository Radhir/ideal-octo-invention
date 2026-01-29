import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccordionItem = ({ item, isOpen, onClick }) => {
    const navigate = useNavigate();

    return (
        <div style={{ marginBottom: '16px' }}>
            <motion.button
                initial={false}
                onClick={onClick}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 24px',
                    borderRadius: '16px',
                    background: isOpen ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    border: isOpen ? '1px solid rgba(176, 141, 87, 0.5)' : '1px solid rgba(255, 255, 255, 0.05)',
                    color: isOpen ? '#fff' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: isOpen ? '700' : '500',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                    outline: 'none',
                    boxShadow: isOpen ? '0 10px 30px rgba(0,0,0,0.3)' : 'none'
                }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                whileTap={{ scale: 0.98 }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        color: isOpen ? '#b08d57' : 'inherit',
                        transition: 'color 0.3s'
                    }}>
                        {item.icon}
                    </div>
                    <span>{item.title}</span>
                </div>

                <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isOpen ? '#b08d57' : 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isOpen ? '#000' : 'inherit',
                    marginTop: '2px' // optical alignment
                }}>
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                </div>
            </motion.button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: "auto", marginTop: 12 },
                            collapsed: { opacity: 0, height: 0, marginTop: 0 }
                        }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            padding: '8px'
                        }}>
                            {item.subItems && item.subItems.map((sub, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(sub.path);
                                    }}
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        color: '#cbd5e1',
                                        fontSize: '13px',
                                        marginBottom: idx === item.subItems.length - 1 ? 0 : '4px',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.color = '#fff';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#cbd5e1';
                                    }}
                                >
                                    <span>{sub.label}</span>
                                    <ChevronRight size={14} color="#64748b" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AccordionMenu = ({ items }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div style={{ width: '100%', maxWidth: '400px' }}>
            {items.map((item) => (
                <AccordionItem
                    key={item.id}
                    item={item}
                    isOpen={expanded === item.id}
                    onClick={() => setExpanded(expanded === item.id ? false : item.id)}
                />
            ))}
        </div>
    );
};

export default AccordionMenu;
