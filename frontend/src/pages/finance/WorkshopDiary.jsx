import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioStats,
    PortfolioButton,
    PortfolioCard,
    PortfolioBackButton,
    PortfolioSectionTitle,
    PortfolioSelect,
    PortfolioInput
} from '../../components/PortfolioComponents';
import {
    Calendar, ClipboardList, TrendingUp,
    CheckCircle, Clock, AlertCircle, Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DateRangePicker from '../../components/finance/DateRangePicker';

const WorkshopDiary = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    // Filters
    const [filters, setFilters] = useState({
        startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        advisor: 'ALL',
        status: 'ALL',
        branch: 'ALL',
        plateNo: '',
        search: ''
    });

    // Options
    const [options, setOptions] = useState({
        advisors: [],
        branches: []
    });

    // Fetch Options
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [usersRes, branchesRes] = await Promise.all([
                    api.get('/api/auth/users/').catch(() => ({ data: [] })),
                    api.get('/api/locations/branches/').catch(() => ({ data: [] })) // Ensure this endpoint is active
                ]);

                const users = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data.results || []);
                const branches = Array.isArray(branchesRes.data) ? branchesRes.data : (branchesRes.data.results || []);

                // Filter for advisors or show all users
                const advisors = users.map(u => ({
                    id: u.id,
                    name: u.first_name ? `${u.first_name} ${u.last_name}` : u.username
                }));

                setOptions({
                    advisors,
                    branches: branches.map(b => ({ id: b.id, name: b.name }))
                });

            } catch (err) {
                console.error("Failed to load filter options", err);
            }
        };
        fetchOptions();
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                start_date: filters.startDate,
                end_date: filters.endDate,
                advisor: filters.advisor,
                status: filters.status,
                branch: filters.branch,
                plate_no: filters.plateNo,
                search: filters.search
            }).toString();

            const res = await api.get(`/reports/api/workshop-diary/?${query}`);
            setEntries(res.data.entries);
            setSummary(res.data.summary);
        } catch (err) {
            console.error('Error fetching workshop diary', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <PortfolioPage breadcrumb="FINANCE // WORKSHOP DIARY">
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-end' }}>
                        <PortfolioBackButton onClick={() => navigate('/finance')} />
                        <PortfolioTitle subtitle="A comprehensive operational chronicle of all workshop activities and asset yields.">
                            WORKSHOP DIARY
                        </PortfolioTitle>
                    </div>
                </div>

                {/* Filter Command Center */}
                <PortfolioCard style={{ padding: '25px', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--gold)' }}>
                        <Filter size={16} />
                        <span style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>Operational Filters</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'end' }}>
                        <PortfolioSelect
                            label="Service Advisor"
                            value={filters.advisor}
                            onChange={(e) => setFilters(prev => ({ ...prev, advisor: e.target.value }))}
                            style={{ margin: 0 }}
                        >
                            <option value="ALL">ALL ADVISORS</option>
                            {options.advisors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </PortfolioSelect>

                        <PortfolioSelect
                            label="Branch Location"
                            value={filters.branch}
                            onChange={(e) => setFilters(prev => ({ ...prev, branch: e.target.value }))}
                            style={{ margin: 0 }}
                        >
                            <option value="ALL">ALL BRANCHES</option>
                            {options.branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </PortfolioSelect>

                        <PortfolioSelect
                            label="Job Status"
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            style={{ margin: 0 }}
                        >
                            <option value="ALL">ALL STATUSES</option>
                            <option value="WIP">WORK IN PROGRESS</option>
                            <option value="QC">QUALITY CONTROL</option>
                            <option value="READY">READY FOR DELIVERY</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CLOSED">CLOSED</option>
                        </PortfolioSelect>

                        <PortfolioInput
                            label="Plate No / Vin"
                            placeholder="Enter Number..."
                            value={filters.plateNo}
                            onChange={(e) => setFilters(prev => ({ ...prev, plateNo: e.target.value }))}
                            style={{ margin: 0 }}
                        />

                        <DateRangePicker
                            startDate={filters.startDate}
                            endDate={filters.endDate}
                            onStartChange={(d) => setFilters(prev => ({ ...prev, startDate: d }))}
                            onEndChange={(d) => setFilters(prev => ({ ...prev, endDate: d }))}
                            onApply={fetchData}
                            styled
                        />
                    </div>
                </PortfolioCard>
            </div>

            {loading ? (
                <div style={{ padding: '80px', textAlign: 'center', color: 'var(--cream)', opacity: 0.5 }}>Syncing Operational Data...</div>
            ) : (
                <>
                    <PortfolioStats stats={[
                        { label: 'TOTAL JOBS', value: summary?.total_jobs || 0 },
                        { label: 'TOTAL REVENUE', value: `AED ${(summary?.total_value || 0).toLocaleString()}`, color: 'var(--gold)' },
                        { label: 'ACTIVE WORKFLOW', value: entries.filter(e => e.status !== 'CLOSED').length, color: 'var(--cream)' }
                    ]} />

                    <div style={{ marginTop: '60px' }}>
                        <PortfolioSectionTitle>OPERATIONAL LOG</PortfolioSectionTitle>

                        <div style={{
                            background: 'rgba(232, 230, 227, 0.02)',
                            border: '1.5px solid rgba(232, 230, 227, 0.1)',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            marginTop: '30px'
                        }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(232, 230, 227, 0.05)', borderBottom: '1px solid rgba(232, 230, 227, 0.1)' }}>
                                        <th style={thStyle}>Date</th>
                                        <th style={thStyle}>Token #</th>
                                        <th style={thStyle}>Client / Asset Profile</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={thStyle}>Lead Advisor</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>Revenue Yield</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.map(entry => (
                                        <tr key={entry.id} style={{ borderBottom: '1px solid rgba(232, 230, 227, 0.05)', transition: 'background 0.3s' }}>
                                            <td style={tdStyle}>{new Date(entry.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                            <td style={{ ...tdStyle, color: 'var(--gold)', fontWeight: '700' }}>#{entry.number}</td>
                                            <td style={tdStyle}>
                                                <div style={{ color: 'var(--cream)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{entry.customer}</div>
                                                <div style={{ fontSize: '10px', color: 'rgba(232, 230, 227, 0.5)', marginTop: '4px', letterSpacing: '1px' }}>{entry.asset || '--'}</div>
                                            </td>
                                            <td style={tdStyle}>
                                                <StatusBadge status={entry.status} />
                                            </td>
                                            <td style={{ ...tdStyle, textTransform: 'uppercase', fontSize: '12px' }}>{entry.advisor || '--'}</td>
                                            <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--cream)' }}>
                                                AED {parseFloat(entry.net_amount).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {entries.length === 0 && (
                                        <tr><td colSpan="6" style={{ padding: '80px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.4)', fontSize: '13px', letterSpacing: '1px' }}>NO OPERATIONAL ENTRIES FOUND FOR THIS PERIOD</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </PortfolioPage>
    );
};

const StatusBadge = ({ status }) => {
    const config = {
        'CLOSED': { color: '#10b981', label: 'Closed' },
        'WIP': { color: '#3b82f6', label: 'In Progress' },
        'RECEPTION': { color: 'rgba(232, 230, 227, 0.5)', label: 'Reception' },
        'INVOICING': { color: 'var(--gold)', label: 'Invoicing' },
    };
    const s = config[status] || { color: 'rgba(232, 230, 227, 0.3)', label: status };

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: s.color,
            fontSize: '10px',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            border: `1px solid ${s.color}40`,
            padding: '4px 12px',
            borderRadius: '20px'
        }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></div>
            {s.label}
        </div>
    );
};

const thStyle = {
    padding: '25px 30px',
    textAlign: 'left',
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--gold)',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    opacity: 0.8
};

const tdStyle = {
    padding: '25px 30px',
    fontSize: '13px',
    color: 'var(--cream)',
    opacity: 0.9
};

export default WorkshopDiary;
