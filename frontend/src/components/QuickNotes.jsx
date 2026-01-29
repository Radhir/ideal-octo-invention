import React, { useState, useEffect } from 'react';
import { Save, Trash2, PenLine } from 'lucide-react';

const QuickNotes = () => {
    const [note, setNote] = useState('');

    useEffect(() => {
        const savedNote = localStorage.getItem('executive_quick_note');
        if (savedNote) {
            setNote(savedNote);
        }
    }, []);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setNote(newValue);
        localStorage.setItem('executive_quick_note', newValue);
    };

    const clearNote = () => {
        if (window.confirm('Clear all notes?')) {
            setNote('');
            localStorage.removeItem('executive_quick_note');
        }
    };

    return (
        <div style={{
            marginTop: '40px',
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxWidth: '100%',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b08d57' }}>
                    <PenLine size={16} />
                    <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        Executive Notepad
                    </span>
                </div>
                <button
                    onClick={clearNote}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        padding: '4px'
                    }}
                    title="Clear Notes"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            <textarea
                value={note}
                onChange={handleChange}
                placeholder="Type your quick notes, memos, or reminders here..."
                style={{
                    width: '100%',
                    minHeight: '120px',
                    background: 'transparent',
                    border: 'none',
                    color: '#e2e8f0',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    outline: 'none'
                }}
            />

            <div style={{
                borderTop: '1px solid rgba(255,255,255,0.05)',
                paddingTop: '10px',
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <span style={{ fontSize: '10px', color: '#475569' }}>
                    {note.length} chars • Auto-saved
                </span>
            </div>
        </div>
    );
};

export default QuickNotes;
