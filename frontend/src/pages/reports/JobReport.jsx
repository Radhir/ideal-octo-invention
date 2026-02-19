import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioButton,
    PortfolioSelect,
    PortfolioInput,
    PortfolioGrid,
    PortfolioCard,
    PortfolioStats,
    PortfolioBackButton
} from '../../components/PortfolioComponents';
import { Printer, Filter, Briefcase, Search, Calendar, Landmark, CreditCard, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobReport = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: 'ALL',
        startDate: '',
        endDate: '',
        search: ''
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, jobs]);

    const fetchJobs = async () => {
        try {
            const res = await api.get('/forms/job-cards/api/jobs/');
            setJobs(Array.isArray(res.data) ? res.data : res.data.results || []);
            setLoading(false);
        } catch (err) {
            console.error("Failed to load jobs", err);
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = [...jobs];

        if (filters.status !== 'ALL') {
            result = result.filter(j => j.status === filters.status);
        }

        if (filters.startDate) {
            result = result.filter(j => new Date(j.created_at) >= new Date(filters.startDate));
        }

        if (filters.endDate) {
            result = result.filter(j => new Date(j.created_at) <= new Date(filters.endDate));
        }

        if (filters.search) {
            const term = filters.search.toLowerCase();
            result = result.filter(j =>
                j.job_card_number?.toLowerCase().includes(term) ||
                j.customer_name?.toLowerCase().includes(term) ||
                j.brand?.toLowerCase().includes(term) ||
                j.model?.toLowerCase().includes(term)
            );
        }

        setFilteredJobs(result);
    };

    const handlePrint = () => {
        window.print();
    };

    const totalVolume = filteredJobs.length;
    const totalValue = filteredJobs.reduce((sum, j) => sum + (parseFloat(j.net_amount) || 0), 0);
    const avgValue = totalVolume > 0 ? (totalValue / totalVolume) : 0;

    if (loading) return <PortfolioPage><div style={{ color: 'var(--gold)', letterSpacing: '2px', fontWeight: '900', fontSize: '10px', padding: '100px', textAlign: 'center' }}>DE-ENCRYPTING OPERATION DATA...</div></PortfolioPage>;

    const statsData = [
        { label: "RECORD VOLUME", value: totalVolume, color: "var(--gold)" },
        { label: "CUMULATIVE VALUATION", value: `AED ${totalValue.toLocaleString()}`, color: "#10b981" },
        { label: "AVG CONTRACT VALUE", value: `AED ${Math.round(avgValue).toLocaleString()}`, color: "#3b82f6" },
        { label: "ACTIVE WIP", value: filteredJobs.filter(j => j.status === 'WIP').length, color: "#f59e0b" },
    ];

    return (
        <PortfolioPage breadcrumb="Executive Intelligence / Reports / Job Cards">
            <PortfolioBackButton onClick={() => navigate('/reports')} />

            <div className="no-print">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
                    <PortfolioTitle subtitle="System-wide operational telemetry and job card lifecycle analysis.">
                        Service Operation Dossier
                    </PortfolioTitle>
                    <PortfolioButton onClick={handlePrint} variant="primary">
                        <Printer size={18} style={{ marginRight: '10px' }} /> GENERATE PDF
                    </PortfolioButton>
                </div>

                <PortfolioStats stats={statsData} />

                {/* Refined Filter Command Center */}
                <PortfolioCard style={{ marginTop: '60px', marginBottom: '60px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', color: 'var(--gold)' }}>
                        <Filter size={18} />
                        <span style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>Strategy Filters</span>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr',
                        gap: '20px',
                        alignItems: 'end'
                    }}>
                        <PortfolioInput
                            label="IDENTIFICATION SEARCH"
                            placeholder="Job #, Customer, Chassis..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            style={{ margin: 0 }}
                        />
                        <PortfolioSelect
                            label="LIFECYCLE STATUS"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            style={{ margin: 0 }}
                        >
                            <option value="ALL">ALL STATUSES</option>
                            <option value="NEW">NEW RECEPTION</option>
                            <option value="WIP">TECHNICAL WIP</option>
                            <option value="QC">QUALITY ASSURANCE</option>
                            <option value="READY">READY FOR RELEASE</option>
                            <option value="DELIVERED">ARCHIVED / DELIVERED</option>
                        </PortfolioSelect>
                        <PortfolioInput
                            label="TEMPORAL START"
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            style={{ margin: 0 }}
                        />
                        <PortfolioInput
                            label="TEMPORAL END"
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            style={{ margin: 0 }}
                        />
                    </div>
                </PortfolioCard>
            </div>

            {/* Print Header */}
            <div className="print-only" style={{ display: 'none', marginBottom: '50px' }}>
                <div style={{ borderBottom: '2px solid #000', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '900', letterSpacing: '2px' }}>ELITE SHINE</h1>
                        <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', opacity: 0.6 }}>OPERATIONAL TELEMETRY REPORT: JOB CARDS</p>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '10px', fontWeight: '800' }}>
                        <div>GENERATED: {new Date().toLocaleString().toUpperCase()}</div>
                        <div>RECORDS: {filteredJobs.length} | VALUATION: AED {totalValue.toLocaleString()}</div>
                    </div>
                </div>
            </div>



            <PortfolioCard style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table className="report-table" style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--cream)' }}>
                        <thead>
                            <tr style={{ background: 'rgba(232, 230, 227, 0.02)', borderBottom: '1px solid rgba(232, 230, 227, 0.05)' }}>
                                <th style={thStyle}>IDENTIFIER</th>
                                <th style={thStyle}>TEMPORAL</th>
                                <th style={thStyle}>CLIENT</th>
                                <th style={thStyle}>ASSET DATA</th>
                                <th style={thStyle}>TECHNICAL LEAD</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>VALUATION</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>LIFECYCLE</th>
                                <th style={thStyle}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredJobs.length === 0 ? (
                                <tr><td colSpan="8" style={{ padding: '100px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.2)', letterSpacing: '2px', fontWeight: '800', fontSize: '11px' }}>NO TELEMETRY MATCHES FOUND</td></tr>
                            ) : filteredJobs.map(job => (
                                <tr key={job.id} style={{ borderBottom: '1px solid rgba(232, 230, 227, 0.03)' }}>
                                    <td style={{ ...tdStyle, fontFamily: 'monospace', color: 'var(--gold)', fontWeight: '800' }}>#{job.job_card_number}</td>
                                    <td style={tdStyle}>{new Date(job.created_at).toLocaleDateString()}</td>
                                    <td style={{ ...tdStyle, fontFamily: 'var(--font-serif)', fontSize: '15px' }}>{job.customer_name}</td>
                                    <td style={tdStyle}>{job.brand} {job.model}</td>
                                    <td style={{ ...tdStyle, opacity: 0.6 }}>{job.assigned_technician || 'UNASSIGNED'}</td>
                                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '800' }}>AED {(parseFloat(job.net_amount) || 0).toLocaleString()}</td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            background: 'rgba(232, 230, 227, 0.05)',
                                            border: '1px solid rgba(232, 230, 227, 0.1)',
                                            fontSize: '9px',
                                            fontWeight: '900',
                                            color: job.status === 'WIP' ? 'var(--gold)' : 'var(--cream)',
                                            letterSpacing: '1px'
                                        }}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                                        <button
                                            onClick={() => navigate(`/jobs/${job.id}`)}
                                            style={{ background: 'none', border: 'none', color: 'rgba(232, 230, 227, 0.2)', cursor: 'pointer' }}
                                        >
                                            <ArrowUpRight size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </PortfolioCard>
        </PortfolioPage>
    );
};

const thStyle = {
    padding: '25px 20px',
    textAlign: 'left',
    color: 'var(--gold)',
    fontSize: '10px',
    fontWeight: '900',
    letterSpacing: '2px',
    textTransform: 'uppercase'
};

const tdStyle = {
    padding: '20px',
    fontSize: '13px',
    color: 'var(--cream)',
    fontWeight: '300'
};

export default JobReport;
