import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Download, Filter, FileText, PieChart } from 'lucide-react';
import {
    PortfolioPage, PortfolioTitle, PortfolioCard,
    PortfolioButton, PortfolioGrid, PortfolioSelect
} from '../../components/PortfolioComponents';

const HRReports = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);

    const [filters, setFilters] = useState({
        month: new Date().getMonth() + 1, // 1-12
        year: new Date().getFullYear(),
        department: ''
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        fetchReport();
    }, [filters]);

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/hr/api/departments/');
            setDepartments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchReport = async () => {
        setLoading(true);
        try {
            const params = {
                month: filters.month,
                year: filters.year,
                department: filters.department
            };
            const res = await api.get('/reports/api/payroll-performance/', { params });
            setStats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleExport = (type) => {
        const query = `?type=${type}&month=${filters.month}&year=${filters.year}&department=${filters.department}`;
        window.open(`/reports/api/payroll/export/${query}`, '_blank');
    };

    return (
        <PortfolioPage breadcrumb="HR Management / Reports">
            <PortfolioTitle subtitle="Analytical overview of human capital metrics and payroll info.">
                HR Reporting Console
            </PortfolioTitle>

            <PortfolioCard style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <PortfolioSelect label="Year" name="year" value={filters.year} onChange={handleFilterChange}>
                            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </PortfolioSelect>
                    </div>
                    <div style={{ flex: 1 }}>
                        <PortfolioSelect label="Month" name="month" value={filters.month} onChange={handleFilterChange}>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                            ))}
                        </PortfolioSelect>
                    </div>
                    <div style={{ flex: 1 }}>
                        <PortfolioSelect label="Department" name="department" value={filters.department} onChange={handleFilterChange}>
                            <option value="">All Departments</option>
                            {departments.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </PortfolioSelect>
                    </div>
                    <PortfolioButton onClick={fetchReport} disabled={loading}>
                        <Filter size={16} style={{ marginRight: '8px' }} /> Refresh
                    </PortfolioButton>
                </div>
            </PortfolioCard>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px', color: 'var(--cream)', opacity: 0.5 }}>Analyzing Data...</div>
            ) : stats ? (
                <>
                    <PortfolioGrid columns="repeat(4, 1fr)" style={{ marginBottom: '40px' }}>
                        <StatCard label="Total Net Salary" value={`AED ${parseFloat(stats.summary.total_net_salary || 0).toLocaleString()}`} />
                        <StatCard label="Total Deductions" value={`AED ${parseFloat(stats.summary.total_deductions || 0).toLocaleString()}`} />
                        <StatCard label="Total Overtime" value={`AED ${parseFloat(stats.summary.total_ot_amount || 0).toLocaleString()}`} />
                        <StatCard label="Employee Count" value={stats.summary.employee_count} />
                    </PortfolioGrid>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                        <PortfolioCard title="Departmental Breakdown">
                            {stats.department_breakdown.map((dept) => (
                                <div key={dept.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div>
                                        <div style={{ color: 'var(--cream)', fontSize: '16px' }}>{dept.name}</div>
                                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{dept.headcount} Employees</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: 'var(--gold)', fontSize: '16px', fontWeight: 'bold' }}>AED {parseFloat(dept.total_cost || 0).toLocaleString()}</div>
                                    </div>
                                </div>
                            ))}
                        </PortfolioCard>

                        <PortfolioCard title="Quick Actions">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <ActionButton label="Download Salary Slip Archive" icon={<Download size={16} />} onClick={() => handleExport('slips')} />
                                <ActionButton label="Export Overtime Sheet" icon={<FileText size={16} />} onClick={() => handleExport('overtime')} />
                                <ActionButton label="Bank Transfer List" icon={<FileText size={16} />} onClick={() => handleExport('bank')} />
                            </div>
                        </PortfolioCard>
                    </div>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '50px', color: 'var(--cream)', opacity: 0.5 }}>No data found for selected period.</div>
            )}
        </PortfolioPage>
    );
};

const StatCard = ({ label, value }) => (
    <PortfolioCard style={{ textAlign: 'center', padding: '30px' }}>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
        <div style={{ fontSize: '24px', color: 'var(--gold)', fontWeight: 'bold', marginTop: '10px' }}>{value}</div>
    </PortfolioCard>
);

const ActionButton = ({ label, icon, onClick }) => (
    <button style={{
        display: 'flex', alignItems: 'center', gap: '15px', padding: '15px',
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px', color: 'var(--cream)', cursor: 'pointer',
        transition: 'all 0.2s'
    }}
        onClick={onClick}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
    >
        {icon}
        {label}
    </button>
);

export default HRReports;
