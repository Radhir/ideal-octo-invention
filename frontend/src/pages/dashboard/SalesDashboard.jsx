import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp, Users, DollarSign, Target,
    Award, PieChart, Phone, Calendar,
    ShieldCheck, Car, Filter
} from 'lucide-react';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioGrid,
    PortfolioTitle,
    PortfolioButton,
    PortfolioInput
} from '../../components/PortfolioComponents';

const SalesDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pipeline'); // pipeline, performance, warranty
    const [stats, setStats] = useState({
        leads: [],
        recentSales: [],
        metrics: {
            totalRevenue: 0,
            conversionRate: 0,
            activeLeads: 0,
            avgTicket: 0
        },
        targets: {
            monthly: 1000000,
            current: 650000
        }
    });

    useEffect(() => {
        fetchSalesData();
    }, []);

    const fetchSalesData = async () => {
        try {
            const [leadsRes, jobsRes] = await Promise.all([
                api.get('/forms/leads/api/list/'),
                api.get('/forms/job-cards/api/jobs/')
            ]);

            const leads = leadsRes.data;
            const closedJobs = jobsRes.data.filter(j => j.status === 'CLOSED');

            // Mocking aggregated data for demonstration
            setStats({
                leads: leads.filter(l => l.status !== 'CONVERTED' && l.status !== 'LOST').slice(0, 5),
                recentSales: closedJobs.slice(0, 5),
                metrics: {
                    totalRevenue: closedJobs.reduce((acc, curr) => acc + parseFloat(curr.total_amount || 0), 0),
                    conversionRate: 68,
                    activeLeads: leads.length,
                    avgTicket: 12500
                },
                targets: {
                    monthly: 1000000,
                    current: closedJobs.reduce((acc, curr) => acc + parseFloat(curr.total_amount || 0), 0)
                }
            });
        } catch (err) {
            console.error("Sales data fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '20px' }}>
                <div className="spinner"></div>
                <p style={{ color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>Loading Sales Data...</p>
            </div>

        </PortfolioPage>
    );

    return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <PortfolioTitle subtitle="Elite Pro & Shine Sales">
                    Revenue Command
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton
                        variant="glass"
                        onClick={() => navigate('/warranty/create')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <ShieldCheck size={18} /> Sell Warranty
                    </PortfolioButton>
                    <PortfolioButton
                        onClick={() => navigate('/leads/new')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Target size={18} /> New Lead
                    </PortfolioButton>
                </div>
            </div>

            {/* KPI STRIP */}
            <PortfolioGrid columns={4} gap="20px" style={{ marginBottom: '30px' }}>
                <SalesKPI
                    icon={DollarSign}
                    label="Revenue MTD"
                    value={`AED ${stats.metrics.totalRevenue.toLocaleString()}`}
                    subvalue={`${Math.round((stats.metrics.totalRevenue / stats.targets.monthly) * 100)}% of Target`}
                    color="#10b981"
                />
                <SalesKPI
                    icon={TrendingUp}
                    label="Conversion Rate"
                    value={`${stats.metrics.conversionRate}%`}
                    subvalue="+4% vs Last Month"
                    color="#f59e0b"
                />
                <SalesKPI
                    icon={Users}
                    label="Active Pipeline"
                    value={stats.metrics.activeLeads}
                    subvalue="Hot Leads: 12"
                    color="#3b82f6"
                />
                <SalesKPI
                    icon={Award}
                    label="Avg Ticket"
                    value={`AED ${stats.metrics.avgTicket.toLocaleString()}`}
                    subvalue="Premium Services"
                    color="#8b5cf6"
                />
            </PortfolioGrid>

            {/* MAIN DASHBOARD */}
            <PortfolioGrid columns={3} gap="25px">

                {/* LEFT: LEADS PIPELINE */}
                <div style={{ gridColumn: 'span 2' }}>
                    <PortfolioCard style={{ padding: '25px', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Target size={18} color="#f43f5e" /> Active Opportunities
                            </h3>
                            <button onClick={() => navigate('/leads')} style={{ background: 'none', border: 'none', color: 'rgba(232,230,227,0.4)', fontSize: '11px', cursor: 'pointer', fontWeight: '700' }}>VIEW ALL</button>
                        </div>

                        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '10px', marginBottom: '15px', fontWeight: '800', fontSize: '11px', color: 'rgba(232,230,227,0.4)', textTransform: 'uppercase' }}>
                            <div style={{ flex: 2 }}>Client</div>
                            <div style={{ flex: 2 }}>Interest</div>
                            <div style={{ flex: 1, textAlign: 'right' }}>Value</div>
                            <div style={{ flex: 1, textAlign: 'right' }}>Status</div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {stats.leads.length === 0 ? <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>No active leads</div> :
                                stats.leads.map(lead => (
                                    <div key={lead.id} onClick={() => navigate(`/leads/${lead.id}`)} className="sales-row">
                                        <div style={{ flex: 2 }}>
                                            <div style={{ color: '#fff', fontWeight: '700', fontSize: '13px' }}>{lead.customer_name}</div>
                                            <div style={{ color: 'rgba(232,230,227,0.5)', fontSize: '11px' }}>{lead.phone_number}</div>
                                        </div>
                                        <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '12px', color: 'var(--gold)' }}>{lead.interested_service}</span>
                                        </div>
                                        <div style={{ flex: 1, textAlign: 'right', fontWeight: '700', color: '#fff' }}>
                                            {lead.estimated_value ? `AED ${lead.estimated_value}` : '-'}
                                        </div>
                                        <div style={{ flex: 1, textAlign: 'right' }}>
                                            <span style={{
                                                fontSize: '10px', padding: '3px 8px', borderRadius: '4px',
                                                background: lead.priority === 'HOT' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255,255,255,0.1)',
                                                color: lead.priority === 'HOT' ? '#f43f5e' : 'rgba(232,230,227,0.6)',
                                                fontWeight: '800'
                                            }}>
                                                {lead.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </PortfolioCard>
                </div>

                {/* RIGHT: RECENT WINS & TARGETS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                    <PortfolioCard style={{ padding: '25px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Award size={18} color="var(--gold)" /> Recent Closures
                            </h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {stats.recentSales.map(sale => (
                                <div key={sale.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                                    <div>
                                        <div style={{ color: '#fff', fontSize: '13px', fontWeight: '700' }}>{sale.vehicle_details?.model || 'Vehicle'}</div>
                                        <div style={{ color: 'rgba(232,230,227,0.5)', fontSize: '11px' }}>{sale.job_card_number}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: '#10b981', fontWeight: '800', fontSize: '13px' }}>AED {sale.total_amount}</div>
                                        <div style={{ fontSize: '9px', color: 'rgba(232,230,227,0.3)' }}>{new Date(sale.created_at).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </PortfolioCard>

                    <PortfolioCard style={{ padding: '20px', background: 'linear-gradient(145deg, rgba(176,141,87,0.1) 0%, rgba(0,0,0,0) 100%)', border: '1px solid rgba(176,141,87,0.2)' }}>
                        <div style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Monthly Target Progress</div>
                        <div style={{ height: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', overflow: 'hidden', marginBottom: '10px' }}>
                            <div style={{ width: `${Math.min((stats.metrics.totalRevenue / stats.targets.monthly) * 100, 100)}%`, height: '100%', background: 'var(--gold)' }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#fff' }}>
                            <span>{Math.round((stats.metrics.totalRevenue / stats.targets.monthly) * 100)}% Achieved</span>
                            <span>Goal: AED {(stats.targets.monthly / 1000000).toFixed(1)}M</span>
                        </div>
                    </PortfolioCard>

                </div>

            </PortfolioGrid>

        </PortfolioPage>
    );
};

const SalesKPI = ({ icon: Icon, label, value, subvalue, color }) => (
    <PortfolioCard style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', borderLeft: `4px solid ${color}` }}>
        <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
            <Icon size={22} />
        </div>
        <div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--cream)', fontFamily: 'var(--font-serif)', lineHeight: 1, marginBottom: '4px' }}>{value}</div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(232,230,227,0.6)', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontSize: '10px', color: color, marginTop: '2px', fontWeight: '600' }}>{subvalue}</div>
        </div>
    </PortfolioCard>
);

export default SalesDashboard;
