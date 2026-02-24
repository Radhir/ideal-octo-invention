import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    User, Phone, Mail, MapPin, History,
    DollarSign, Briefcase, ExternalLink,
    Clock, ShieldCheck, FileText, ChevronRight,
    TrendingUp, Award
} from 'lucide-react';
import api from '../../api/axios';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioGrid,
    PortfolioTitle,
    PortfolioButton,
    PortfolioBackButton,
    PortfolioStats
} from '../../components/PortfolioComponents';

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [custRes, jobsRes] = await Promise.all([
                    api.get(`/api/customers/${id}/`),
                    api.get(`/api/job-cards/api/jobs/?customer_id=${id}`)
                ]);
                setCustomer(custRes.data);
                setJobs(jobsRes.data.results || jobsRes.data || []);
            } catch (err) {
                console.error("Failed to fetch customer dossier", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const stats = [
        { label: 'Lifetime Value', value: `AED ${(jobs.reduce((acc, j) => acc + parseFloat(j.net_amount || 0), 0) / 1000).toFixed(1)}k`, subvalue: 'Revenue Realized', icon: DollarSign, color: 'var(--gold)' },
        { label: 'Service Cycles', value: jobs.length, subvalue: 'Completed Job Cards', icon: History, color: '#3b82f6' },
        { label: 'Advocacy Level', value: jobs.length > 5 ? 'PLATINUM' : 'GOLD', subvalue: 'Loyalty Tier', icon: Award, color: '#10b981' }
    ];

    if (loading) return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div className="portfolio-spinner"></div>
            </div>
        </PortfolioPage>
    );

    if (!customer) return (
        <PortfolioPage>
            <div style={{ textAlign: 'center', padding: '100px', color: 'var(--cream)' }}>ARCHIVE NOT FOUND</div>
        </PortfolioPage>
    );

    return (
        <PortfolioPage breadcrumb="COMMERCIAL / CLIENT REGISTRY / DOSSIER">
            <PortfolioBackButton onClick={() => navigate('/sales')} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                <PortfolioTitle subtitle={`Client Since ${new Date(customer.created_at).getFullYear()} • Primary Identification: #${customer.id}`}>
                    {customer.name}
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <PortfolioButton variant="glass" onClick={() => window.print()}>
                        <FileText size={16} /> EXPORT PROFILE
                    </PortfolioButton>
                </div>
            </div>

            <PortfolioStats stats={stats} />

            <PortfolioGrid columns="1fr 2fr">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <PortfolioCard style={{ padding: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', color: 'var(--gold)' }}>
                            <User size={16} />
                            <span style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '2px' }}>CORE IDENTITY</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <InfoItem label="Contact Primary" value={customer.phone} icon={Phone} />
                            <InfoItem label="Digital Address" value={customer.email || 'NO_RECORDED_EMAIL'} icon={Mail} />
                            <InfoItem label="Operational Base" value={customer.address || 'HEADQUARTERS'} icon={MapPin} />
                        </div>
                    </PortfolioCard>

                    <PortfolioCard style={{ padding: '30px', background: 'rgba(176, 141, 87, 0.03)', border: '1px dashed rgba(176, 141, 87, 0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <ShieldCheck size={16} color="var(--gold)" />
                            <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--gold)', letterSpacing: '1px' }}>VETTING STATUS</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', lineHeight: '1.6' }}>
                            Verified client with clear credit history and high satisfaction index. Eligible for priority scheduling.
                        </p>
                    </PortfolioCard>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <PortfolioCard style={{ padding: '35px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gold)' }}>
                                <Briefcase size={16} />
                                <span style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '2px' }}>SERVICE ARCHIVE</span>
                            </div>
                            <span style={{ fontSize: '10px', color: 'rgba(232, 230, 227, 0.3)', fontWeight: '800' }}>TOTAL {jobs.length} RECORDS</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {jobs.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(232, 230, 227, 0.2)', fontFamily: 'var(--font-serif)' }}>
                                    NO TECHNICAL DEPLOYMENTS RECORDED FOR THIS CLIENT.
                                </div>
                            ) : jobs.map(job => (
                                <div
                                    key={job.id}
                                    onClick={() => navigate(`/jobs/${job.id}`)}
                                    style={jobItemStyle}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1.5px', marginBottom: '5px' }}>{job.job_card_number}</div>
                                            <div style={{ fontSize: '16px', color: 'var(--cream)', fontWeight: '400', fontFamily: 'var(--font-serif)' }}>{job.brand} {job.model}</div>
                                            <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.4)', marginTop: '4px' }}>{new Date(job.date).toLocaleDateString()} • {job.job_description?.substring(0, 60)}...</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '18px', color: 'var(--cream)', fontWeight: '300' }}>AED {parseFloat(job.net_amount).toLocaleString()}</div>
                                            <div style={{ fontSize: '9px', fontWeight: '900', letterSpacing: '1px', marginTop: '6px', color: '#10b981' }}>{job.status_display?.toUpperCase()}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </PortfolioCard>
                </div>
            </PortfolioGrid>

        </PortfolioPage>
    );
};

const InfoItem = ({ label, value, icon: Icon }) => (
    <div>
        <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.3)', fontWeight: '900', letterSpacing: '1.5px', marginBottom: '8px', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {Icon && <Icon size={14} color="rgba(176, 141, 87, 0.5)" />}
            <div style={{ fontSize: '15px', color: 'var(--cream)', fontWeight: '400', fontFamily: 'var(--font-serif)' }}>{value}</div>
        </div>
    </div>
);

const jobItemStyle = {
    padding: '20px 25px',
    background: 'rgba(232, 230, 227, 0.02)',
    border: '1px solid rgba(232, 230, 227, 0.05)',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    '&:hover': {
        background: 'rgba(232, 230, 227, 0.05)',
        borderColor: 'var(--gold)'
    }
};

export default CustomerDetail;
