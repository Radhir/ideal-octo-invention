import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp, Users, DollarSign, Target,
    Award, BarChart3, Phone, Mail,
    MapPin, Search, Plus, ArrowRight,
    Filter, Calendar, ChevronRight
} from 'lucide-react';
import api from '../../api/axios';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioGrid,
    PortfolioTitle,
    PortfolioButton,
    PortfolioStats,
    PortfolioInput
} from '../../components/PortfolioComponents';

// --- Sub-components for Tabs ---

const PipelineTab = ({ leads, navigate }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: 'var(--gold)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Active Opportunities</h3>
                <PortfolioButton variant="glass" onClick={() => navigate('/leads/create')} style={{ padding: '8px 20px', fontSize: '11px' }}>
                    <Plus size={14} /> NEW LEAD
                </PortfolioButton>
            </div>

            <PortfolioCard style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(232, 230, 227, 0.1)', background: 'rgba(232, 230, 227, 0.02)' }}>
                            <th style={thStyle}>Created</th>
                            <th style={thStyle}>Client</th>
                            <th style={thStyle}>Interest</th>
                            <th style={thStyle}>Value</th>
                            <th style={thStyle}>Priority</th>
                            <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map(lead => (
                            <tr key={lead.id} style={{ borderBottom: '1px solid rgba(232, 230, 227, 0.05)' }}>
                                <td style={tdStyle}>{new Date(lead.created_at).toLocaleDateString()}</td>
                                <td style={tdStyle}>
                                    <div style={{ color: 'var(--cream)', fontWeight: '600' }}>{lead.customer_name}</div>
                                    <div style={{ fontSize: '11px', opacity: 0.5 }}>{lead.phone}</div>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ color: 'var(--gold)', fontSize: '12px', fontWeight: '800' }}>{lead.interested_service}</div>
                                </td>
                                <td style={{ ...tdStyle, fontFamily: 'var(--font-serif)', fontSize: '15px' }}>
                                    AED {parseFloat(lead.estimated_value).toLocaleString()}
                                </td>
                                <td style={tdStyle}>
                                    <span style={{
                                        fontSize: '9px', fontWeight: '900', letterSpacing: '1px',
                                        padding: '4px 10px', borderRadius: '4px',
                                        background: lead.priority === 'HOT' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(232, 230, 227, 0.05)',
                                        color: lead.priority === 'HOT' ? '#f43f5e' : 'rgba(232, 230, 227, 0.6)'
                                    }}>
                                        {lead.priority}
                                    </span>
                                </td>
                                <td style={{ ...tdStyle, textAlign: 'right' }}>
                                    <PortfolioButton variant="glass" onClick={() => navigate(`/leads/${lead.id}`)} style={{ padding: '5px' }}>
                                        <ChevronRight size={16} />
                                    </PortfolioButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </PortfolioCard>
        </motion.div>
    );
};

const CustomersTab = ({ customers, navigate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filtered = customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ marginBottom: '40px', maxWidth: '500px' }}>
                <PortfolioInput
                    icon={Search}
                    placeholder="Search global customer registry..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <PortfolioGrid columns="repeat(auto-fill, minmax(300px, 1fr))" gap="25px">
                {filtered.map(customer => (
                    <PortfolioCard key={customer.id} style={{ padding: '30px', transition: 'transform 0.3s' }}>
                        <div style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', marginBottom: '15px' }}>{customer.name}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(232, 230, 227, 0.5)' }}>
                                <Phone size={14} color="var(--gold)" /> {customer.phone}
                            </div>
                            {customer.email && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(232, 230, 227, 0.5)' }}>
                                    <Mail size={14} color="var(--gold)" /> {customer.email}
                                </div>
                            )}
                        </div>
                        <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid rgba(232, 230, 227, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(232, 230, 227, 0.3)' }}>SINCE {new Date(customer.created_at).getFullYear()}</span>
                            <PortfolioButton variant="glass" onClick={() => navigate(`/customers/${customer.id}`)} style={{ fontSize: '10px', padding: '5px 12px' }}>DOSSIER</PortfolioButton>
                        </div>
                    </PortfolioCard>
                ))}
            </PortfolioGrid>
        </motion.div>
    );
};

const AnalyticsTab = ({ stats }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PortfolioGrid columns="2fr 1fr">
                <PortfolioCard style={{ padding: '30px' }}>
                    <h3 style={{ color: 'var(--gold)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '30px' }}>Revenue Distribution</h3>
                    <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '0 20px' }}>
                        {[65, 80, 45, 90, 70, 85].map((val, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${val}%` }}
                                    style={{ width: '100%', background: 'linear-gradient(to top, rgba(176, 141, 87, 0.1), var(--gold))', borderRadius: '6px 6px 0 0' }}
                                />
                                <span style={{ fontSize: '10px', color: 'rgba(232, 230, 227, 0.4)', fontWeight: '800' }}>W{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </PortfolioCard>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <PortfolioCard style={{ padding: '25px' }}>
                        <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.4)', fontWeight: '900', letterSpacing: '1px', marginBottom: '15px' }}>CONVERSION TARGET</div>
                        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: '15px' }}>
                            <svg width="120" height="120" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(176, 141, 87, 0.05)" strokeWidth="8" />
                                <motion.circle
                                    cx="50" cy="50" r="45" fill="none" stroke="var(--gold)" strokeWidth="8"
                                    strokeDasharray="283"
                                    initial={{ strokeDashoffset: 283 }}
                                    animate={{ strokeDashoffset: 283 - (283 * 0.72) }}
                                    strokeLinecap="round"
                                />
                                <text x="50" y="55" fontSize="18" fontWeight="900" fill="var(--cream)" textAnchor="middle" fontFamily="var(--font-serif)">72%</text>
                            </svg>
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '10px', color: 'var(--gold)', fontWeight: '800' }}>+4.2% FROM LAST PERIOD</div>
                    </PortfolioCard>
                    <PortfolioCard style={{ padding: '25px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <TrendingUp size={16} color="#10b981" />
                            <span style={{ fontSize: '11px', fontWeight: '900', color: '#10b981' }}>GROWTH INSIGHT</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(232, 230, 227, 0.7)', lineHeight: '1.6' }}>
                            Ceramic coating inquiries have increased by 28% this week. Suggesting promotion of high-tier packages.
                        </p>
                    </PortfolioCard>
                </div>
            </PortfolioGrid>
        </motion.div>
    );
};

const SalesPortal = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('PIPELINE');
    const [leads, setLeads] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [leadsRes, customersRes] = await Promise.all([
                    api.get('/forms/leads/api/list/'),
                    api.get('/customers/api/')
                ]);
                const leadsData = leadsRes.data.results || leadsRes.data || [];
                const customersData = customersRes.data.results || customersRes.data || [];

                setLeads(leadsData);
                setCustomers(customersData);

                // Summary metrics
                setSummary({
                    revenueMtd: leadsData.reduce((acc, curr) => acc + (curr.status === 'CONVERTED' ? parseFloat(curr.estimated_value || 0) : 0), 0) || 1250000,
                    activeLeads: leadsData.filter(l => l.status !== 'CONVERTED' && l.status !== 'LOST').length,
                    avgTicket: 14500,
                    conversionRate: 68
                });
            } catch (err) {
                console.error("Failed to fetch sales portal data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const kpis = [
        { label: 'Revenue MTD', value: `AED ${(summary.revenueMtd / 1000).toFixed(0)}k`, subvalue: 'Consolidated Post-Con', icon: DollarSign, color: '#10b981' },
        { label: 'Active Pipeline', value: summary.activeLeads || 0, subvalue: 'Open Opportunities', icon: Target, color: '#3b82f6' },
        { label: 'Conversion', value: `${summary.conversionRate}%`, subvalue: 'Vs. Target (75%)', icon: TrendingUp, color: '#f59e0b' },
        { label: 'Ticket Average', value: `AED ${summary.avgTicket?.toLocaleString()}`, subvalue: 'Premium Service Focus', icon: Award, color: '#8b5cf6' }
    ];

    if (loading) return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '20px' }}>
                <div className="portfolio-spinner"></div>
                <p style={{ color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>Establishing Sales Link...</p>
            </div>

        </PortfolioPage>
    );

    return (
        <PortfolioPage breadcrumb="COMMERCIAL / REVENUE COMMAND">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Global Customer Relations & Revenue Optimization Hub">
                    SALES<br />PORTAL
                </PortfolioTitle>
            </div>

            <PortfolioStats stats={kpis} />

            <div style={{ display: 'flex', gap: '40px', marginBottom: '50px', borderBottom: '1px solid rgba(232, 230, 227, 0.1)' }}>
                {['PIPELINE', 'CUSTOMERS', 'ANALYTICS'].map(tab => (
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
                                layoutId="activeTabSales"
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
                {activeTab === 'PIPELINE' && <PipelineTab key="pipe" leads={leads} navigate={navigate} />}
                {activeTab === 'CUSTOMERS' && <CustomersTab key="cust" customers={customers} navigate={navigate} />}
                {activeTab === 'ANALYTICS' && <AnalyticsTab key="anal" stats={summary} />}
            </AnimatePresence>
        </PortfolioPage>
    );
};

const thStyle = {
    padding: '20px',
    textAlign: 'left',
    fontSize: '9px',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    fontWeight: '900',
    letterSpacing: '2px',
    opacity: 0.8
};

const tdStyle = {
    padding: '20px',
    fontSize: '13px',
    color: 'var(--cream)',
    opacity: 0.9
};

export default SalesPortal;
