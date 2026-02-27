import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioButton,
    PortfolioSelect,
    PortfolioInput,
    PortfolioBackButton
} from '../../components/PortfolioComponents';
import { Search, Download, Filter, FileText } from 'lucide-react';

const FinalWorkshopDiary = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filters matching the legacy screen
    const [filters, setFilters] = useState({
        customerName: '',
        reviseDate: '',
        fromDate: '2023-01-01',
        branchName: 'ELITE SHINE CAR POLISH SERVICES LLC(BRANCH)',
        vehicleBrand: '',
        plateNo: '',
        status: '',
        salesMan: '',
        leadSource: '',
        committedDate: '',
        driverName: '',
        toDate: new Date().toISOString().split('T')[0],
        advisor: '',
        vehicleModel: '',
        vinNo: '',
        jobCategory: 'ALL',
        orderType: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/job-cards/api/jobs/');
            setJobs(res.data);
        } catch (err) {
            console.error('Error fetching jobs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        // Direct download from backend
        window.location.href = 'http://localhost:8000/api/job-cards/export/excel/';
    };

    const handleSearch = () => {
        fetchData();
    };

    return (
        <PortfolioPage breadcrumb="ADVISOR / FINAL WORKSHOP DIARY">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
                <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-end' }}>
                    <PortfolioBackButton onClick={() => navigate('/portfolio')} />
                    <PortfolioTitle subtitle="Advanced tabular operational tracker with legacy filter parity.">
                        WORKSHOP DIARY REPORT
                    </PortfolioTitle>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton onClick={handleSearch} variant="gold">
                        <Search size={16} style={{ marginRight: '8px' }} /> SEARCH
                    </PortfolioButton>
                    <PortfolioButton onClick={handleExport} variant="secondary">
                        <Download size={16} style={{ marginRight: '8px' }} /> EXPORT EXCEL
                    </PortfolioButton>
                </div>
            </div>

            <PortfolioCard style={{ padding: '25px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', color: 'var(--gold)' }}>
                    <Filter size={16} />
                    <span style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>Legacy Report Filters</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '40px' }}>
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <PortfolioInput label="Customer Name" value={filters.customerName} onChange={e => setFilters({ ...filters, customerName: e.target.value })} style={{ margin: 0 }} />
                        <PortfolioInput label="Revise Date" type="date" value={filters.reviseDate} onChange={e => setFilters({ ...filters, reviseDate: e.target.value })} style={{ margin: 0 }} />
                        <PortfolioInput label="From Date *" type="date" value={filters.fromDate} onChange={e => setFilters({ ...filters, fromDate: e.target.value })} style={{ margin: 0 }} />
                        <PortfolioSelect label="Branch Name" value={filters.branchName} onChange={e => setFilters({ ...filters, branchName: e.target.value })} style={{ margin: 0 }}>
                            <option value="ELITE SHINE CAR POLISH SERVICES LLC(BRANCH)">ELITE SHINE CAR POLISH SERVICES LLC(BRANCH)</option>
                        </PortfolioSelect>
                        <PortfolioInput label="Vehicle Brand" value={filters.vehicleBrand} onChange={e => setFilters({ ...filters, vehicleBrand: e.target.value })} style={{ margin: 0 }} />
                        <PortfolioInput label="Plate No" value={filters.plateNo} onChange={e => setFilters({ ...filters, plateNo: e.target.value })} style={{ margin: 0 }} />
                        <PortfolioSelect label="Status" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} style={{ margin: 0 }}>
                            <option value="">--Select--</option>
                            <option value="RECEIVED">Reception</option>
                            <option value="IN_PROGRESS">WIP</option>
                            <option value="READY">Ready</option>
                            <option value="INVOICED">Invoiced</option>
                            <option value="CLOSED">Closed</option>
                        </PortfolioSelect>
                        <PortfolioInput label="Sales Man" value={filters.salesMan} onChange={e => setFilters({ ...filters, salesMan: e.target.value })} style={{ margin: 0 }} />
                        <PortfolioSelect label="Lead Source" value={filters.leadSource} onChange={e => setFilters({ ...filters, leadSource: e.target.value })} style={{ margin: 0 }}>
                            <option value="">--Select--</option>
                        </PortfolioSelect>
                    </div>

                    {/* Right Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <PortfolioInput label="Committed Date" type="date" value={filters.committedDate} onChange={e => setFilters({ ...filters, committedDate: e.target.value })} style={{ margin: 0 }} />
                        <PortfolioInput label="Driver Name" value={filters.driverName} onChange={e => setFilters({ ...filters, driverName: e.target.value })} style={{ margin: 0 }} />
                        <PortfolioInput label="To Date *" type="date" value={filters.toDate} onChange={e => setFilters({ ...filters, toDate: e.target.value })} style={{ margin: 0 }} />
                        <PortfolioSelect label="Advisor" value={filters.advisor} onChange={e => setFilters({ ...filters, advisor: e.target.value })} style={{ margin: 0 }}>
                            <option value="">--Select--</option>
                            <option value="Ravit Adhir">Ravit Adhir</option>
                        </PortfolioSelect>
                        <PortfolioInput label="Vehicle Model" value={filters.vehicleModel} onChange={e => setFilters({ ...filters, vehicleModel: e.target.value })} style={{ margin: 0 }} />
                        <PortfolioInput label="Vin No" value={filters.vinNo} onChange={e => setFilters({ ...filters, vinNo: e.target.value })} style={{ margin: 0 }} />
                        <PortfolioSelect label="Job Category" value={filters.jobCategory} onChange={e => setFilters({ ...filters, jobCategory: e.target.value })} style={{ margin: 0 }}>
                            <option value="ALL">ALL</option>
                            <option value="Regular">Regular</option>
                        </PortfolioSelect>
                        <PortfolioSelect label="Order Type" value={filters.orderType} onChange={e => setFilters({ ...filters, orderType: e.target.value })} style={{ margin: 0 }}>
                            <option value="">--Select--</option>
                        </PortfolioSelect>
                    </div>
                </div>
            </PortfolioCard>

            <PortfolioCard style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '20px 25px', borderBottom: '1px solid rgba(232, 230, 227, 0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={16} color="var(--gold)" />
                    <span style={{ color: 'var(--cream)', fontSize: '14px', fontWeight: '600', letterSpacing: '1px' }}>DATA GRID</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(232, 230, 227, 0.05)', borderBottom: '1px solid rgba(232, 230, 227, 0.1)' }}>
                                <th style={thStyle}>S.No</th>
                                <th style={thStyle}>Branch Name</th>
                                <th style={thStyle}>Job<br />Card<br />No</th>
                                <th style={thStyle}>Date</th>
                                <th style={thStyle}>Customer Name</th>
                                <th style={thStyle}>Advisor<br />Name</th>
                                <th style={thStyle}>Plate No</th>
                                <th style={thStyle}>Remarks</th>
                                <th style={thStyle}>Insurance</th>
                                <th style={thStyle}>Job<br />Category</th>
                                <th style={thStyle}>Sales<br />Man</th>
                                <th style={thStyle}>Driver<br />Name</th>
                                <th style={thStyle}>Lead<br />Source</th>
                                <th style={thStyle}>Order<br />Type</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Total<br />Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="16" style={{ textAlign: 'center', padding: '40px', color: 'rgba(232, 230, 227, 0.5)' }}>SYNCING WITH SERVER...</td></tr>
                            ) : jobs.length === 0 ? (
                                <tr><td colSpan="16" style={{ textAlign: 'center', padding: '40px', color: 'rgba(232, 230, 227, 0.5)' }}>NO RECORDS FOUND FOR CURRENT FILTERS</td></tr>
                            ) : jobs.map((job, idx) => (
                                <tr key={job.id || idx} style={{ borderBottom: '1px solid rgba(232, 230, 227, 0.05)', transition: 'background 0.2s', cursor: 'pointer' }} onClick={() => navigate(`/job-cards/${job.id}`)}>
                                    <td style={tdStyle}>{idx + 1}</td>
                                    <td style={{ ...tdStyle, fontSize: '10px' }}>ELITE SHINE CAR POLISH<br />SERVICES LLC(BRANCH)</td>
                                    <td style={{ ...tdStyle, color: 'var(--gold)', fontWeight: '700' }}>{job.job_card_number}</td>
                                    <td style={tdStyle}>{job.date ? new Date(job.date).toLocaleDateString('en-GB') : ''}</td>
                                    <td style={{ ...tdStyle, fontWeight: '600' }}>{job.customer_name || '--'}</td>
                                    <td style={tdStyle}>{job.advisor_name || 'Ravit Adhir'}</td>
                                    <td style={{ ...tdStyle, letterSpacing: '1px' }}>{job.registration_number || '--'}</td>
                                    <td style={tdStyle}>{job.job_description || ''}</td>
                                    <td style={tdStyle}></td>
                                    <td style={tdStyle}>Regular</td>
                                    <td style={tdStyle}>RAVIT</td>
                                    <td style={tdStyle}>--Select--</td>
                                    <td style={tdStyle}></td>
                                    <td style={tdStyle}></td>
                                    <td style={tdStyle}>
                                        <StatusBadge status={job.status} />
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'var(--font-serif)', fontSize: '14px', color: 'var(--cream)' }}>
                                        {Number(job.net_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

const StatusBadge = ({ status }) => {
    let color = 'rgba(232, 230, 227, 0.5)';
    let label = status;
    if (status === 'INVOICED') { color = '#8b5cf6'; label = 'Invoiced'; }
    if (status === 'READY') { color = '#10b981'; label = 'Ready'; }
    if (status === 'IN_PROGRESS') { color = '#3b82f6'; label = 'In Progress'; }
    if (status === 'RECEIVED') { color = '#b08d57'; label = 'Reception'; }

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: color,
            fontSize: '10px',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            border: `1px solid ${color}40`,
            padding: '2px 8px',
            borderRadius: '12px'
        }}>
            {label}
        </div>
    );
};

const thStyle = {
    padding: '15px 10px',
    fontSize: '9px',
    fontWeight: '800',
    color: 'var(--gold)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    whiteSpace: 'nowrap'
};

const tdStyle = {
    padding: '15px 10px',
    fontSize: '11px',
    color: 'rgba(232, 230, 227, 0.9)',
    whiteSpace: 'nowrap'
};

export default FinalWorkshopDiary;
