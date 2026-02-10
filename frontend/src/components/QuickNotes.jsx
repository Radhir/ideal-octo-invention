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
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            border: '1.5px solid var(--gold-border)',
            padding: '25px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '100%',
            boxShadow: '0 15px 45px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold)' }}>
                    <PenLine size={18} />
                    <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>
                        Executive Notepad
                    </span>
                </div>
                <button
                    onClick={clearNote}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        padding: '6px'
                    }}
                    title="Clear Notes"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <textarea
                value={note}
                onChange={handleChange}
                placeholder="Type your quick notes, memos, or reminders here..."
                style={{
                    width: '100%',
                    minHeight: '150px',
                    background: 'var(--input-bg)',
                    border: '1.5px solid var(--gold-border)',
                    borderRadius: '12px',
                    padding: '15px',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    lineHeight: '1.6',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    outline: 'none',
                    fontWeight: '900'
                }}
            />

            <div style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '15px',
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>
                    {note.length} chars • Auto-saved
                </span>
            </div>
        </div>
    );
};

export default QuickNotes;
