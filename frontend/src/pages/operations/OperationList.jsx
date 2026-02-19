import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Search, User, Clock, CheckCircle2,
    Printer, Target, AlertCircle, Activity
} from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioStats,
    PortfolioGrid,
    PortfolioCard,
    PortfolioButton,
    PortfolioSectionTitle
} from '../../components/PortfolioComponents';

const OperationList = () => {
    const navigate = useNavigate();
    const [operations, setOperations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOperations();
    }, []);

    const fetchOperations = async () => {
        try {
            const res = await api.get('/forms/operations/api/list/');
            setOperations(res.data);
        } catch (err) {
            console.error('Error fetching operations', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredOps = operations.filter(o =>
        o.operation_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.assigned_to_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.jc_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusTheme = (status) => {
        switch (status) {
            case 'COMPLETED': return { color: '#10b981', label: 'COMPLETED' };
            case 'IN_PROGRESS': return { color: '#3b82f6', label: 'IN PRODUCTION' };
            case 'ON_HOLD': return { color: '#f59e0b', label: 'ON HOLD' };
            default: return { color: '#94a3b8', label: 'SCHEDULED' };
        }
    };

    if (loading) return (
        <PortfolioPage breadcrumb="Operations / Production / Real-time">
            <div style={{ color: 'var(--cream)', padding: '100px', textAlign: 'center', letterSpacing: '2px', fontWeight: '800' }}>
                RECOVERING PRODUCTION TELEMETRY...
            </div>
        </PortfolioPage>
    );

    const stats = [
        { value: operations.filter(o => o.status === 'IN_PROGRESS').length, label: 'ACTIVE UNITS', color: '#3b82f6' },
        { value: operations.filter(o => o.status === 'COMPLETED').length, label: 'DISPATCHED TODAY', color: '#10b981' },
        { value: `${Math.round(operations.reduce((sum, o) => sum + (o.progress_percentage || 0), 0) / (operations.length || 1))}%`, label: 'AGGREGATE EFFICIENCY', color: 'var(--gold)' }
    ];

    return (
        <PortfolioPage breadcrumb="Operations / Intelligence / Production Board">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="A strategic overview of active production cycles and operative performance.">
                    Operations Board
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton onClick={() => window.print()} variant="secondary">
                        <Printer size={18} style={{ marginRight: '10px' }} /> PRINT BOARD
                    </PortfolioButton>
                    <PortfolioButton onClick={() => navigate('/operations/create')} variant="primary">
                        <Plus size={18} style={{ marginRight: '10px' }} /> LOG ACTIVITY
                    </PortfolioButton>
                </div>
            </div>

            <PortfolioStats stats={stats} />

            <div style={{ marginBottom: '60px', position: 'relative', maxWidth: '800px' }}>
                <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(232, 230, 227, 0.2)' }} size={20} />
                <input
                    type="text"
                    placeholder="Search production data (Operation, JC#, Lead Operative)..."
                    style={{
                        padding: '18px 20px 18px 55px',
                        fontSize: '15px',
                        borderRadius: '16px',
                        background: 'rgba(232, 230, 227, 0.02)',
                        border: '1px solid rgba(232, 230, 227, 0.05)',
                        color: 'var(--cream)',
                        width: '100%',
                        outline: 'none',
                        letterSpacing: '0.5px'
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <PortfolioSectionTitle>Live Production Streams</PortfolioSectionTitle>

            <PortfolioGrid columns="repeat(auto-fill, minmax(420px, 1fr))">
                {filteredOps.map((op) => {
                    const theme = getStatusTheme(op.status);
                    return (
                        <PortfolioCard key={op.id} style={{ padding: '35px', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                                <div>
                                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', marginBottom: '5px' }}>{op.jc_number || 'INTERNAL_TASK'}</div>
                                    <h3 style={{ fontSize: '22px', fontWeight: '300', color: 'var(--cream)', fontFamily: 'var(--font-serif)', margin: 0 }}>{op.operation_name}</h3>
                                </div>
                                <span style={{
                                    fontSize: '9px', fontWeight: '900', color: theme.color,
                                    background: `${theme.color}05`, padding: '6px 14px', borderRadius: '30px',
                                    border: `1px solid ${theme.color}15`, letterSpacing: '1px'
                                }}>{theme.label}</span>
                            </div>

                            <div style={{ margin: '30px 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <div style={{ fontSize: '10px', color: 'rgba(232, 230, 227, 0.3)', fontWeight: '800', letterSpacing: '1px' }}>PRODUCTION PROGRESS</div>
                                    <div style={{ fontSize: '12px', color: 'var(--cream)', fontWeight: '800' }}>{op.progress_percentage}%</div>
                                </div>
                                <div style={{ height: '4px', background: 'rgba(232, 230, 227, 0.03)', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ width: `${op.progress_percentage}%`, height: '100%', background: theme.color, transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                                <div>
                                    <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.3)', fontWeight: '800', letterSpacing: '1px', marginBottom: '5px' }}>LEAD OPERATIVE</div>
                                    <div style={{ fontSize: '14px', color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <User size={14} color="var(--gold)" /> {op.assigned_to_name}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.3)', fontWeight: '800', letterSpacing: '1px', marginBottom: '5px' }}>COMPLETION ETA</div>
                                    <div style={{ fontSize: '14px', color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Clock size={14} color="var(--gold)" /> {op.estimated_completion ? new Date(op.estimated_completion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ASAP'}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid rgba(232, 230, 227, 0.03)', paddingTop: '30px' }}>
                                <PortfolioButton
                                    onClick={async () => {
                                        const newProgress = prompt('Update Production Percentage:', op.progress_percentage);
                                        if (newProgress === null) return;
                                        const val = parseInt(newProgress, 10);
                                        if (isNaN(val) || val < 0 || val > 100) { alert('Invalid input'); return; }
                                        try {
                                            await api.patch(`/forms/operations/api/list/${op.id}/`, { progress_percentage: val });
                                            fetchOperations();
                                        } catch (err) { alert('Sync Failed'); }
                                    }}
                                    variant="secondary"
                                    style={{ flex: 1, height: '44px', fontSize: '11px', padding: 0 }}
                                >
                                    UPDATE SENSORS
                                </PortfolioButton>
                                {op.status !== 'COMPLETED' && (
                                    <PortfolioButton
                                        onClick={async () => {
                                            if (!window.confirm('Mark operation as completed?')) return;
                                            try {
                                                await api.patch(`/forms/operations/api/list/${op.id}/`, { status: 'COMPLETED', progress_percentage: 100 });
                                                fetchOperations();
                                            } catch (err) { alert('Sync Failed'); }
                                        }}
                                        variant="gold"
                                        style={{ width: '60px', height: '44px', padding: 0 }}
                                    >
                                        <CheckCircle2 size={18} />
                                    </PortfolioButton>
                                )}
                            </div>
                        </PortfolioCard>
                    );
                })}
            </PortfolioGrid>

            {filteredOps.length === 0 && (
                <div style={{ textAlign: 'center', padding: '100px', color: 'rgba(232, 230, 227, 0.2)', background: 'rgba(232, 230, 227, 0.01)', borderRadius: '32px', border: '1px dashed rgba(232, 230, 227, 0.05)' }}>
                    <Activity size={40} style={{ margin: '0 auto 15px auto', opacity: 0.5 }} />
                    <p style={{ letterSpacing: '1px' }}>NO ACTIVE PRODUCTION SIGNALS DETECTED.</p>
                </div>
            )}


        </PortfolioPage>
    );
};

export default OperationList;
