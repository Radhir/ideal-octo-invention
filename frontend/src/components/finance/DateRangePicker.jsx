import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

const DateRangePicker = ({ startDate, endDate, onStartChange, onEndChange, onApply }) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            background: 'var(--bg-glass)',
            padding: '10px 20px',
            borderRadius: '12px',
            border: '1.5px solid var(--gold-border)',
            animation: 'fadeIn 0.4s ease-out'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="var(--gold)" />
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Range:</span>
            </div>

            <input
                type="date"
                value={startDate}
                onChange={(e) => onStartChange(e.target.value)}
                style={{
                    background: 'rgba(0,0,0,0.05)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    outline: 'none'
                }}
            />

            <ArrowRight size={14} color="var(--text-secondary)" />

            <input
                type="date"
                value={endDate}
                onChange={(e) => onEndChange(e.target.value)}
                style={{
                    background: 'rgba(0,0,0,0.05)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    outline: 'none'
                }}
            />

            <button
                onClick={onApply}
                className="btn-primary"
                style={{
                    padding: '6px 15px',
                    fontSize: '12px',
                    fontWeight: '800',
                    borderRadius: '8px'
                }}
            >
                UPDATE LEDGER
            </button>
        </div>
    );
};

export default DateRangePicker;
