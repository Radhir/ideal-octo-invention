import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioGrid,
    PortfolioStats
} from '../components/PortfolioComponents';
import {
    FolderKanban, CheckCircle, Clock, AlertCircle,
    Plus, Search, Calendar, Users,
    Target, BarChart3, ArrowRight, Layout
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
            const res = await api.get('/projects/projects/');
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

    return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
                <PortfolioTitle
                    title="Project Board"
                    subtitle="Visual Workflow Management"
                />

                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ position: 'relative', width: '250px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'rgba(255,255,255,0.4)' }} />
                        <input
                            type="text" placeholder="Search projects..."
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%', padding: '10px 10px 10px 35px', background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                                color: '#fff', fontSize: '13px', outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden', height: '38px' }}>
                        {['BOARD', 'LIST'].map(v => (
                            <button key={v} onClick={() => setView(v)} style={{
                                padding: '0 15px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '12px',
                                background: view === v ? 'var(--gold)' : 'transparent', color: view === v ? '#000' : 'rgba(255,255,255,0.5)',
                                transition: 'all 0.2s'
                            }}>{v}</button>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
                <PortfolioStats label="Active Projects" value={activeJobs.length} icon={FolderKanban} color="#3b82f6" />
                <PortfolioStats label="Completed" value={closedJobs.length} icon={CheckCircle} color="#10b981" />
                <PortfolioStats label="Pipeline Value" value={`AED ${totalValue.toLocaleString()}`} icon={BarChart3} color="#b08d57" />
                <PortfolioStats label="Utilization" value="84%" icon={Target} color="#8b5cf6" />
            </div>

            {view === 'BOARD' ? (
                <div style={{
                    display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '20px',
                    margin: '0 -20px', padding: '0 20px 20px 20px' // Negative margin to allow scroll to edge
                }}>
                    {columns.map(col => {
                        const colJobs = filtered.filter(j => j.status === col.id);
                        return (
                            <div key={col.id} style={{ minWidth: '280px', flexShrink: 0 }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px',
                                    borderBottom: `2px solid ${col.color}`, paddingBottom: '10px'
                                }}>
                                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>{col.label}</span>
                                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#000', background: col.color, padding: '2px 6px', borderRadius: '4px' }}>{colJobs.length}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {colJobs.map(job => (
                                        <div key={job.id} style={{
                                            padding: '15px', background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px',
                                            cursor: 'pointer', transition: 'transform 0.2s', position: 'relative', overflow: 'hidden'
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: col.color }} />
                                            <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '5px', color: '#fff' }}>
                                                {job.job_card_number || `JC-${job.id}`}
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>
                                                {job.customer_name || 'Unknown'} <br />
                                                <span style={{ color: 'var(--gold)' }}>{job.brand || ''} {job.model || ''}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                                                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
                                                    {job.net_amount ? `AED ${parseFloat(job.net_amount).toLocaleString()}` : '-'}
                                                </span>
                                                {job.assigned_technician && (
                                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#fff' }}>
                                                        {job.assigned_technician.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {colJobs.length === 0 && (
                                        <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.1)', fontSize: '12px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                                            No items
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <PortfolioCard style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.03)', textAlign: 'left' }}>
                                <th style={{ padding: '15px' }}>Job Card</th>
                                <th style={{ padding: '15px' }}>Customer</th>
                                <th style={{ padding: '15px' }}>Vehicle</th>
                                <th style={{ padding: '15px' }}>Status</th>
                                <th style={{ padding: '15px' }}>Technician</th>
                                <th style={{ padding: '15px', textAlign: 'right' }}>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeJobs.map(job => {
                                const col = columns.find(c => c.id === job.status) || { color: '#64748b', label: job.status };
                                return (
                                    <tr key={job.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '15px', fontWeight: '600', color: 'var(--gold)' }}>{job.job_card_number || `JC-${job.id}`}</td>
                                        <td style={{ padding: '15px' }}>{job.customer_name || '-'}</td>
                                        <td style={{ padding: '15px', color: 'rgba(255,255,255,0.6)' }}>{job.brand || ''} {job.model || ''}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: '700',
                                                background: `${col.color}20`, color: col.color, border: `1px solid ${col.color}40`,
                                                textTransform: 'uppercase'
                                            }}>{col.label}</span>
                                        </td>
                                        <td style={{ padding: '15px', color: 'rgba(255,255,255,0.6)' }}>{job.assigned_technician || 'Unassigned'}</td>
                                        <td style={{ padding: '15px', textAlign: 'right', fontWeight: '600' }}>
                                            {job.net_amount ? `AED ${parseFloat(job.net_amount).toLocaleString()}` : '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </PortfolioCard>
            )}
        </PortfolioPage>
    );
};

export default ProjectsPage;
