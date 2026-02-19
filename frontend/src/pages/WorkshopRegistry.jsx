import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search, Filter, MoreHorizontal, ChevronRight,
    Clock, CheckCircle2, AlertCircle, Activity
} from 'lucide-react';
import api from '../api/axios';

const WorkshopRegistry = () => {
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const filters = [
        { label: 'ALL', value: 'ALL' },
        { label: 'PENDING', value: 'RECEIVED' },
        { label: 'IN PROGRESS', value: 'IN_PROGRESS' },
        { label: 'READY', value: 'READY' },
        { label: 'DELIVERED', value: 'CLOSED' }
    ];

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const res = await api.get('/forms/job-cards/api/jobs/');
                setJobs(res.data);
            } catch (err) {
                console.error('Error fetching workshop jobs', err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'RECEIVED': return '#FFC700';
            case 'IN_PROGRESS': return '#00D1FF';
            case 'READY': return '#00FFA3';
            case 'CLOSED': return '#888';
            default: return '#fff';
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesFilter = activeFilter === 'ALL' || job.status === activeFilter;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = job.job_card_number?.toLowerCase().includes(searchLower) ||
            job.registration_number?.toLowerCase().includes(searchLower) ||
            job.customer_name?.toLowerCase().includes(searchLower);
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="workshop-registry">


            <header className="registry-header">
                <h1 className="registry-title">Workshop Registry</h1>
                <p className="registry-subtitle">Track the lifecycle of every vehicle in the facility.</p>
            </header>

            <div className="filter-bar-container">
                <div className="filter-capsule">
                    {filters.map(f => (
                        <button
                            key={f.value}
                            className={`filter-btn ${activeFilter === f.value ? 'active' : ''}`}
                            onClick={() => setActiveFilter(f.value)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="registry-search">
                    <Search size={16} opacity={0.4} />
                    <input
                        type="text"
                        placeholder="Search vehicle or plate..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Initialising Lifecycle Radar...</div>
            ) : (
                <div className="registry-grid">
                    {filteredJobs.map(job => (
                        <motion.div
                            key={job.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="vehicle-card"
                        >
                            <div className="card-header">
                                <div className="plate-badge">{job.registration_number || 'N/A'}</div>
                                <MoreHorizontal size={20} opacity={0.4} cursor="pointer" />
                            </div>
                            <div className="vehicle-model">{job.brand} {job.model}</div>
                            <div className="vehicle-meta">
                                <div className="status-chip" style={{
                                    background: `${getStatusColor(job.status)}15`,
                                    color: getStatusColor(job.status),
                                    border: `1px solid ${getStatusColor(job.status)}30`
                                }}>
                                    <Activity size={12} />
                                    {job.status_display || job.status}
                                </div>
                                <div className="time-info">
                                    <Clock size={12} />
                                    {new Date(job.date).toLocaleDateString()}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {filteredJobs.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', opacity: 0.3 }}>
                            No active vehicle sessions found for the current query.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default WorkshopRegistry;
