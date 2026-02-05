import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import GlassCard from '../components/GlassCard';
import {
    FolderKanban, CheckCircle, Clock, AlertCircle,
    Plus, Search, Calendar, Users,
    Target, BarChart3, ArrowRight
} from 'lucide-react';

const ProjectsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('BOARD');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/forms/job-cards/api/jobs/');
            const data = Array.isArray(res.data) ? res.data : res.data.results || [];
            setJobs(data);
        } catch (err) {
            console.error('Projects fetch failed', err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = jobs.filter(j =>
        !searchTerm || (j.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase())
        || (j.job_card_number || '').toLowerCase().includes(searchTerm.toLowerCase())
        || (j.brand || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Kanban columns based on job statuses
    const columns = [
        { id: 'RECEPTION', label: 'Reception', color: '#3b82f6' },
        { id: 'ESTIMATION', label: 'Estimation', color: '#f59e0b' },
        { id: 'WORK_ASSIGNMENT', label: 'Assignment', color: '#8b5cf6' },
        { id: 'WIP', label: 'In Progress', color: '#10b981' },
        { id: 'QC', label: 'Quality Check', color: '#ef4444' },
        { id: 'INVOICING', label: 'Invoicing', color: '#b08d57' },
        { id: 'DELIVERY', label: 'Delivery', color: '#2dd4bf' },
    ];

    const closedJobs = filtered.filter(j => j.status === 'CLOSED');
    const activeJobs = filtered.filter(j => j.status !== 'CLOSED');
    const totalValue = activeJobs.reduce((s, j) => s + (parseFloat(j.net_amount) || 0), 0);

    if (loading) return <div style={{ color: '#fff', padding: '40px' }}>Loading Project Board...</div>;

    return (
        <div style={{ padding: '30px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <div style={{ fontSize: '10px', color: '#8b5cf6', fontWeight: '800', letterSpacing: '2px' }}>PROJECT MANAGEMENT</div>
                    <h1 style={{ margin: '5px 0 0 0', fontSize: '2.5rem', fontWeight: '900', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>Project Board</h1>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                        {['BOARD', 'LIST'].map(v => (
                            <button key={v} onClick={() => setView(v)} style={{
                                padding: '10px 18px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '12px',
                                background: view === v ? '#8b5cf6' : 'transparent', color: view === v ? '#fff' : '#94a3b8'
                            }}>{v}</button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '25px' }}>
                <MiniStat label="Active Projects" value={activeJobs.length} color="#3b82f6" />
                <MiniStat label="Completed" value={closedJobs.length} color="#10b981" />
                <MiniStat label="Pipeline Value" value={`AED ${totalValue.toLocaleString()}`} color="#b08d57" />
                <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', zIndex: 1 }} />
                    <input
                        type="text" placeholder="Search projects..."
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%', height: '100%', padding: '10px 10px 10px 40px', background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                        }}
                    />
                </div>
            </div>

            {view === 'BOARD' ? (
                /* Kanban Board */
                <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '20px' }}>
                    {columns.map(col => {
                        const colJobs = filtered.filter(j => j.status === col.id);
                        return (
                            <div key={col.id} style={{ minWidth: '260px', flex: 1 }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', padding: '0 5px'
                                }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: col.color }} />
                                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>{col.label}</span>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#475569', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '10px' }}>{colJobs.length}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {colJobs.map(job => (
                                        <GlassCard key={job.id} style={{
                                            padding: '16px', cursor: 'pointer', borderLeft: `3px solid ${col.color}`,
                                            transition: 'transform 0.2s'
                                        }}>
                                            <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '6px', color: '#fff' }}>
                                                {job.job_card_number || `JC-${job.id}`}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                                                {job.customer_name || 'Unknown'} - {job.brand || ''} {job.model || ''}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '11px', color: '#b08d57', fontWeight: '700' }}>
                                                    {job.net_amount ? `AED ${parseFloat(job.net_amount).toLocaleString()}` : '-'}
                                                </span>
                                                {job.assigned_technician && (
                                                    <span style={{ fontSize: '10px', color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '8px' }}>
                                                        {job.assigned_technician}
                                                    </span>
                                                )}
                                            </div>
                                        </GlassCard>
                                    ))}
                                    {colJobs.length === 0 && (
                                        <div style={{ padding: '30px 10px', textAlign: 'center', color: '#333', fontSize: '12px' }}>
                                            No items
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* List View */
                <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.03)', textAlign: 'left' }}>
                                <th style={{ padding: '16px' }}>Job Card</th>
                                <th style={{ padding: '16px' }}>Customer</th>
                                <th style={{ padding: '16px' }}>Vehicle</th>
                                <th style={{ padding: '16px' }}>Status</th>
                                <th style={{ padding: '16px' }}>Technician</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeJobs.map(job => {
                                const col = columns.find(c => c.id === job.status) || { color: '#64748b', label: job.status };
                                return (
                                    <tr key={job.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <td style={{ padding: '14px', fontWeight: '700', color: '#b08d57' }}>{job.job_card_number || `JC-${job.id}`}</td>
                                        <td style={{ padding: '14px' }}>{job.customer_name || '-'}</td>
                                        <td style={{ padding: '14px', color: '#94a3b8' }}>{job.brand || ''} {job.model || ''}</td>
                                        <td style={{ padding: '14px' }}>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                                                background: `${col.color}15`, color: col.color, border: `1px solid ${col.color}30`
                                            }}>{col.label}</span>
                                        </td>
                                        <td style={{ padding: '14px', color: '#94a3b8' }}>{job.assigned_technician || 'Unassigned'}</td>
                                        <td style={{ padding: '14px', textAlign: 'right', fontWeight: '800' }}>
                                            {job.net_amount ? `AED ${parseFloat(job.net_amount).toLocaleString()}` : '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </GlassCard>
            )}
        </div>
    );
};

const MiniStat = ({ label, value, color }) => (
    <GlassCard style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
        <div style={{ fontSize: '20px', fontWeight: '900', color }}>{value}</div>
    </GlassCard>
);

export default ProjectsPage;
