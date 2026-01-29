import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { Plus, Search, Activity, User, Clock, CheckCircle2, Printer, Target, AlertCircle, BarChart3 } from 'lucide-react';
import PrintHeader from '../../components/PrintHeader';

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
            const res = await axios.get('/forms/operations/api/list/');
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

    const getStatusStyle = (status) => {
        switch (status) {
            case 'COMPLETED': return { color: '#10b981', label: 'Completed' };
            case 'IN_PROGRESS': return { color: '#3b82f6', label: 'In Production' };
            case 'ON_HOLD': return { color: '#f59e0b', label: 'On Hold' };
            default: return { color: '#94a3b8', label: 'Scheduled' };
        }
    };

    return (
        <div style={{ padding: '30px 20px', animation: 'fadeIn 0.5s ease-out' }}>
            <PrintHeader title="Operations Board" />
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Production Hub</div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>Operations Board</h1>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => window.print()} className="glass-card" style={actionButtonStyle}>
                        <Printer size={18} /> Print Board
                    </button>
                    <button onClick={() => navigate('/operations/create')} className="btn-primary" style={{ ...actionButtonStyle, background: '#b08d57' }}>
                        <Plus size={18} /> Log Activity
                    </button>
                </div>
            </header>

            <div style={{ marginBottom: '30px', position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#b08d57' }} size={20} />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by operation, JC#, or employee..."
                    style={{ padding: '18px 20px 18px 55px', fontSize: '16px', borderRadius: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '100%' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '25px' }}>
                {loading ? (
                    <p style={{ textAlign: 'center', gridColumn: '1/-1', padding: '50px', color: '#94a3b8' }}>Synchronizing Production Data...</p>
                ) : filteredOps.length === 0 ? (
                    <p style={{ textAlign: 'center', gridColumn: '1/-1', padding: '50px', color: '#94a3b8' }}>No active production logs.</p>
                ) : (
                    filteredOps.map((op) => {
                        const sStyle = getStatusStyle(op.status);
                        return (
                            <GlassCard key={op.id} style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: sStyle.color }}></div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#b08d57', fontWeight: '900', letterSpacing: '1px', marginBottom: '5px' }}>{op.jc_number || 'INTERNAL_TASK'}</div>
                                        <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#fff', margin: 0 }}>{op.operation_name}</h3>
                                    </div>
                                    <span style={{
                                        fontSize: '10px', fontWeight: '900', color: sStyle.color,
                                        background: `${sStyle.color}15`, padding: '6px 12px', borderRadius: '8px',
                                        textTransform: 'uppercase'
                                    }}>{sStyle.label}</span>
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800' }}>PROGRESS</div>
                                        <div style={{ fontSize: '11px', color: '#fff', fontWeight: '900' }}>{op.progress_percentage}%</div>
                                    </div>
                                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                                        <div style={{ width: `${op.progress_percentage}%`, height: '100%', background: sStyle.color, borderRadius: '3px', transition: 'width 0.5s' }}></div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                                        <User size={14} color="#b08d57" />
                                        <span style={{ color: '#fff' }}>{op.assigned_to_name}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                                        <Clock size={14} color="#b08d57" />
                                        <span style={{ color: '#fff' }}>ETA: {op.estimated_completion ? new Date(op.estimated_completion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={async () => {
                                            const newProgress = prompt('Enter new progress percentage (0-100):', op.progress_percentage);
                                            if (newProgress === null) return;
                                            const val = parseInt(newProgress, 10);
                                            if (isNaN(val) || val < 0 || val > 100) { alert('Invalid percentage'); return; }
                                            try {
                                                await axios.patch(`/forms/operations/api/list/${op.id}/`, { progress_percentage: val });
                                                fetchOperations();
                                            } catch (err) { alert('Failed to update progress'); }
                                        }}
                                        style={{
                                            flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                            color: '#fff', padding: '12px', borderRadius: '10px', fontSize: '12px',
                                            fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                        }}
                                    >
                                        <Target size={14} /> Update Progress
                                    </button>
                                    {op.status !== 'COMPLETED' && (
                                        <button
                                            onClick={async () => {
                                                if (!window.confirm('Mark this operation as completed?')) return;
                                                try {
                                                    await axios.patch(`/forms/operations/api/list/${op.id}/`, { status: 'COMPLETED', progress_percentage: 100 });
                                                    fetchOperations();
                                                } catch (err) { alert('Failed to complete operation'); }
                                            }}
                                            style={{
                                                background: 'rgba(16, 185, 129, 0.15)', color: '#10b981',
                                                border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px 15px',
                                                borderRadius: '10px', cursor: 'pointer'
                                            }}
                                        >
                                            <CheckCircle2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </GlassCard>
                        );
                    })
                )}
            </div>
        </div>
    );
};

const actionButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 25px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '900',
    cursor: 'pointer',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff'
};

export default OperationList;
