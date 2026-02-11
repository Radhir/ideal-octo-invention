import React, { useState } from 'react';

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
                    background: isOpen ? 'var(--input-bg)' : 'transparent',
                    border: '1.5px solid var(--gold-border)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: isOpen ? '900' : '800',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                    outline: 'none',
                    boxShadow: isOpen ? '0 10px 25px rgba(0,0,0,0.1)' : 'none'
                }}
                whileHover={{ scale: 1.02, backgroundColor: 'var(--input-bg)' }}
                whileTap={{ scale: 0.98 }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        color: isOpen ? 'var(--gold)' : 'var(--text-muted)',
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
                    background: isOpen ? 'var(--gold)' : 'var(--input-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isOpen ? '#000' : 'var(--text-muted)',
                    marginTop: '2px', // optical alignment
                    border: '1.5px solid var(--gold-border)'
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
                            background: 'var(--bg-secondary)',
                            borderRadius: '16px',
                            border: '1.5px solid var(--border-color)',
                            padding: '10px',
                            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)'
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
                                        padding: '12px 18px',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        color: 'var(--text-primary)',
                                        fontSize: '14px',
                                        fontWeight: '900',
                                        marginBottom: idx === item.subItems.length - 1 ? 0 : '6px',
                                        transition: 'all 0.2s',
                                        borderBottom: '1px solid var(--gold-border)'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = 'var(--gold-glow)';
                                        e.currentTarget.style.color = 'var(--text-primary)';
                                        e.currentTarget.style.paddingLeft = '22px';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                        e.currentTarget.style.paddingLeft = '18px';
                                    }}
                                >
                                    <span>{sub.label}</span>
                                    <ChevronRight size={14} color="var(--gold)" />
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
