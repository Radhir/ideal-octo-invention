import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    BarChart3, TrendingUp, Users, Globe, Building2,
    DollarSign, Activity, AlertCircle, Shield, Check,
    ArrowUpRight, FileText, AlertTriangle, UserPlus
} from 'lucide-react';
import api from '../../api/axios';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioGrid,
    PortfolioTitle,
    PortfolioButton,
    PortfolioStats
} from '../../components/PortfolioComponents';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';

// --- Sub-components for Tabs ---

const ConsoleTab = ({ stats }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Branch Performance */}
            <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: 'var(--gold)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '25px' }}>Division Performance</h3>
                <PortfolioGrid columns={3} gap="25px">
                    {stats.branches?.map((branch, i) => (
                        <PortfolioCard key={i} style={{ padding: '25px', position: 'relative', overflow: 'hidden' }}>
                            {branch.status === 'Exceeding' && <div style={{ position: 'absolute', top: 0, right: 0, padding: '5px 10px', background: '#10b981', color: '#000', fontSize: '9px', fontWeight: '900', borderBottomLeftRadius: '10px' }}>TOP PERFORMER</div>}

                            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--cream)', marginBottom: '5px' }}>{branch.name}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px' }}>
                                <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--gold)' }}>AED {(branch.revenue / 1000).toFixed(0)}k</div>
                                <div style={{ color: branch.growth.startsWith('+') ? '#10b981' : '#f43f5e', fontWeight: '700', fontSize: '12px' }}>{branch.growth}</div>
                            </div>

                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '10px' }}>
                                <div style={{
                                    width: branch.status === 'Exceeding' ? '100%' : branch.status === 'On Target' ? '85%' : '60%',
                                    height: '100%',
                                    background: branch.status === 'Behind' ? '#f43f5e' : 'var(--gold)',
                                    borderRadius: '3px'
                                }}></div>
                            </div>
                            <div style={{ fontSize: '10px', color: 'rgba(232,230,227,0.5)', textAlign: 'right' }}>
                                {branch.status.toUpperCase()}
                            </div>
                        </PortfolioCard>
                    ))}
                </PortfolioGrid>
            </div>

            <PortfolioCard style={{ padding: '25px', borderLeft: '4px solid #f43f5e' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                    <AlertCircle size={24} color="#f43f5e" />
                    <div>
                        <h3 style={{ margin: 0, color: 'var(--cream)', fontSize: '16px' }}>Operational Alerts</h3>
                        <p style={{ color: 'rgba(232,230,227,0.6)', fontSize: '13px', margin: '5px 0 15px' }}>
                            AMD Center is currently trending 5% below revenue targets due to staff shortages.
                        </p>
                        <PortfolioButton variant="glass" style={{ fontSize: '11px', padding: '6px 15px' }}>View Details</PortfolioButton>
                    </div>
                </div>
            </PortfolioCard>
        </motion.div>
    );
};

const GovernanceTab = ({ employees, onSelect }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PortfolioGrid columns="repeat(auto-fill, minmax(280px, 1fr))" gap="20px">
                {employees.map(emp => (
                    <PortfolioCard
                        key={emp.id}
                        onClick={() => onSelect(emp)}
                        style={{ padding: '25px', cursor: 'pointer', transition: 'all 0.3s' }}
                    >
                        <div style={{ fontSize: '18px', color: 'var(--cream)', fontWeight: '600', marginBottom: '5px' }}>{emp.full_name}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(232,230,227,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>{emp.designation || 'EMPLOYEE'}</div>
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                            <PortfolioButton variant="glass" style={{ padding: '8px 15px', fontSize: '10px' }}>Manage Access</PortfolioButton>
                        </div>
                    </PortfolioCard>
                ))}
            </PortfolioGrid>
        </motion.div>
    );
};

const ComplianceTab = ({ slaStats, violations, trends }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PortfolioGrid columns="2fr 1fr">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <PortfolioCard>
                        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <BarChart3 size={18} color="var(--gold)" />
                            <h3 style={{ margin: 0, color: 'var(--cream)', fontSize: '16px', fontWeight: '500' }}>Compliance Trend</h3>
                        </div>
                        <div style={{ height: '250px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trends}>
                                    <XAxis dataKey="month" stroke="rgba(232,230,227,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                                        cursor={{ fill: 'rgba(176,141,87,0.1)' }}
                                    />
                                    <Bar dataKey="compliance" radius={[4, 4, 0, 0]}>
                                        {trends?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.compliance >= 95 ? '#10b981' : entry.compliance >= 90 ? '#f59e0b' : '#ef4444'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </PortfolioCard>
                </div>
                <div>
                    <PortfolioCard>
                        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <AlertTriangle size={18} color="#ef4444" />
                            <h3 style={{ margin: 0, color: 'var(--cream)', fontSize: '16px', fontWeight: '500' }}>Recent Violations</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {violations.length > 0 ? violations.map(v => (
                                <div key={v.id} style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ color: 'var(--cream)', fontWeight: '500', fontSize: '12px' }}>{v.violation_type}</span>
                                        <span style={{ color: '#ef4444', fontWeight: '600', fontSize: '12px' }}>-{v.service_credit_amount} AED</span>
                                    </div>
                                    <div style={{ color: 'rgba(232, 230, 227, 0.5)', fontSize: '10px' }}>{new Date(v.violation_date).toLocaleDateString()}</div>
                                </div>
                            )) : (
                                <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.4)', fontSize: '12px' }}>No violations</div>
                            )}
                        </div>
                    </PortfolioCard>
                </div>
            </PortfolioGrid>
        </motion.div>
    );
};

const ActionsTab = ({ navigate }) => {
    const actions = [
        {
            title: "Personnel Onboarding",
            description: "Register new employees, assign roles, and initialize security PINs.",
            icon: UserPlus,
            link: "/hr/register",
            status: "READY"
        },
        {
            title: "Compliance Audit",
            description: "Review expiring documents and generate SLA compliance reports.",
            icon: Shield,
            link: "/sla/dashboard",
            status: "PENDING"
        },
        {
            title: "Financial Settlement",
            description: "Review and approve group-wide payroll and salary disbursements.",
            icon: DollarSign,
            link: "/hr/payroll",
            status: "PERIODIC"
        },
        {
            title: "Budget Forecasting",
            description: "Set departmental fiscal limits and strategic capital allocations.",
            icon: PieChart,
            link: "/finance/budget",
            status: "STRATEGIC"
        },
        {
            title: "System Governance",
            description: "Adjust global module permissions and access control lists.",
            icon: Activity,
            link: "/hr/access",
            status: "CRITICAL"
        }
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ marginBottom: '40px' }}>
                <h3 style={{ color: 'var(--gold)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '25px' }}>Critical Action Center</h3>
                <PortfolioGrid columns="repeat(auto-fill, minmax(350px, 1fr))" gap="25px">
                    {actions.map((action, i) => (
                        <PortfolioCard
                            key={i}
                            onClick={() => navigate(action.link)}
                            style={{ padding: '30px', cursor: 'pointer', transition: 'all 0.3s' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                                <div style={{
                                    width: '50px', height: '50px', borderRadius: '15px',
                                    background: 'rgba(176, 141, 87, 0.1)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <action.icon size={24} color="var(--gold)" />
                                </div>
                                <span style={{
                                    fontSize: '10px', fontWeight: '900', letterSpacing: '1px',
                                    padding: '5px 12px', borderRadius: '20px',
                                    background: action.status === 'READY' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(176, 141, 87, 0.1)',
                                    color: action.status === 'READY' ? '#10b981' : 'var(--gold)'
                                }}>
                                    {action.status}
                                </span>
                            </div>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: 'var(--cream)', fontWeight: '600' }}>{action.title}</h3>
                            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(232, 230, 227, 0.5)', lineHeight: '1.6' }}>{action.description}</p>
                            <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', fontSize: '11px', fontWeight: '800' }}>
                                EXECUTE ACTION <ArrowUpRight size={14} />
                            </div>
                        </PortfolioCard>
                    ))}
                </PortfolioGrid>
            </div>

            <PortfolioCard style={{ padding: '35px', background: 'rgba(176,141,87,0.03)', border: '1px dashed rgba(176,141,87,0.2)' }}>
                <div style={{ color: 'var(--gold)', fontSize: '12px', fontWeight: '900', letterSpacing: '2px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={16} /> ACTION BLUEPRINTS (HOW TO PERFORM)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                    <div>
                        <div style={{ color: 'var(--cream)', fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>Personnel Induction</div>
                        <p style={{ color: 'rgba(232,230,227,0.5)', fontSize: '12px', lineHeight: '1.6' }}>
                            1. Select "Personnel Onboarding" above.<br />
                            2. Input primary legal data (Passport/Visa/ID).<br />
                            3. Assign Departmental Node and reporting line.<br />
                            4. Initialize Security PIN for mobile access.<br />
                            5. Submit to commit to Master Database.
                        </p>
                    </div>
                    <div>
                        <div style={{ color: 'var(--cream)', fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>Compliance Governance</div>
                        <p style={{ color: 'rgba(232,230,227,0.5)', fontSize: '12px', lineHeight: '1.6' }}>
                            1. Access "Compliance Audit" to view live SLA pulses.<br />
                            2. Identify "Violation Clusters" (red markers).<br />
                            3. Select specific agreement to view detail.<br />
                            4. Execute "Generate Report" for stakeholder dissemination.<br />
                            5. Verify service credit adjustment in Finance module.
                        </p>
                    </div>
                </div>
            </PortfolioCard>
        </motion.div>
    );
};

const ManagementPortal = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('CONSOLE');
    const [stats, setStats] = useState({});
    const [employees, setEmployees] = useState([]);
    const [slaStats, setSlaStats] = useState({});
    const [violations, setViolations] = useState([]);
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [mgmtRes, hrRes, slaSumRes, slaViolRes] = await Promise.all([
                    api.get('/dashboard/api/management/stats/'),
                    api.get('/api/hr/employees/'),
                    api.get('/api/contracts/sla/agreements/summary/'),
                    api.get('/api/contracts/sla/violations/')
                ]);
                setStats(mgmtRes.data);
                setEmployees(hrRes.data);
                setSlaStats(slaSumRes.data);
                setViolations(Array.isArray(slaViolRes.data) ? slaViolRes.data.slice(0, 5) : (slaViolRes.data.results || []).slice(0, 5));
                setTrends(slaSumRes.data.monthly_trends || []);
            } catch (err) {
                console.error("Failed to fetch management console data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const mgmtKpis = [
        { label: 'Group Revenue', value: 'AED 2.45M', subvalue: 'Consolidated MTD', icon: Globe, color: '#10b981' },
        { label: 'Active Branches', value: stats.branches?.length || 0, subvalue: 'Fully Operational', icon: Building2, color: '#3b82f6' },
        { label: 'Total Staff', value: stats.activeEmployeeCount || 0, subvalue: 'Across Divisions', icon: Users, color: '#f59e0b' },
        { label: 'Compliance', value: `${slaStats.overall_compliance || 0}%`, subvalue: 'SLA Adherence', icon: Shield, color: '#8b5cf6' }
    ];

    if (loading) return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '20px' }}>
                <div className="portfolio-spinner"></div>
                <p style={{ color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>Establishing Secure Console Link...</p>
            </div>
        </PortfolioPage>
    );

    return (
        <PortfolioPage breadcrumb="EXECUTIVE / MANAGEMENT">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Global Operations Oversight & Governance Control">
                    MANAGEMENT<br />CONSOLE
                </PortfolioTitle>
            </div>

            <PortfolioStats stats={mgmtKpis} />

            <div style={{ display: 'flex', gap: '40px', marginBottom: '50px', borderBottom: '1px solid rgba(232, 230, 227, 0.1)' }}>
                {['CONSOLE', 'ACTIONS', 'GOVERNANCE', 'COMPLIANCE'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '15px 0',
                            background: 'transparent',
                            border: 'none',
                            color: activeTab === tab ? 'var(--gold)' : 'rgba(232, 230, 227, 0.4)',
                            fontSize: '11px',
                            fontWeight: '900',
                            letterSpacing: '2px',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'all 0.3s'
                        }}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTabMgmt"
                                style={{
                                    position: 'absolute',
                                    bottom: '-1px',
                                    left: 0,
                                    right: 0,
                                    height: '2px',
                                    background: 'var(--gold)'
                                }}
                            />
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'CONSOLE' && <ConsoleTab stats={stats} />}
                {activeTab === 'ACTIONS' && <ActionsTab navigate={navigate} />}
                {activeTab === 'GOVERNANCE' && <GovernanceTab employees={employees} onSelect={(emp) => navigate(`/hr/access`)} />}
                {activeTab === 'COMPLIANCE' && <ComplianceTab slaStats={slaStats} violations={violations} trends={trends} />}
            </AnimatePresence>

        </PortfolioPage>
    );
};

export default ManagementPortal;
