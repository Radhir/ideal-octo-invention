import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import {
    CheckCircle, Clock, FileText, ShieldCheck,
    Car, User, ArrowRight, Download, Printer, ExternalLink
} from 'lucide-react';

const CustomerPortal = () => {
    const { token } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPortalData();
    }, [token]);

    const fetchPortalData = async () => {
        try {
            const res = await axios.get(`/forms/job-cards/api/portal/${token}/`);
            setData(res.data);
        } catch (err) {
            console.error('Error fetching portal data', err);
            setError('The link you followed may be invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={containerStyle}>
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <div className="loader" style={loaderStyle}></div>
                <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Synchronizing vehicle status...</p>
            </div>
        </div>
    );

    if (error || !data) return (
        <div style={containerStyle}>
            <GlassCard style={{ padding: '50px', textAlign: 'center', maxWidth: '500px', margin: '100px auto' }}>
                <h2 style={{ color: '#f43f5e' }}>Link Expired</h2>
                <p style={{ color: '#94a3b8' }}>{error || 'Portal data unavailable.'}</p>
                <button onClick={() => window.location.reload()} style={btnStyle}>Retry</button>
            </GlassCard>
        </div>
    );

    const { job, steps, invoice, warranties } = data;

    return (
        <div style={containerStyle}>
            {/* Header section with brand identity */}
            <header style={headerStyle}>
                <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase' }}>Elite Shine Detailing</div>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '2rem', margin: '5px 0' }}>Client Portal</h1>
                <div style={{ height: '2px', width: '40px', background: '#b08d57', margin: '10px auto' }}></div>
            </header>

            <div style={gridStyle}>
                {/* Status Section */}
                <div style={{ gridColumn: 'span 2' }}>
                    <GlassCard style={{ padding: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h3 style={sectionTitleStyle}>Live Job Tracker</h3>
                            <div style={statusBadgeStyle(job.status)}>
                                {job.status_display}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div style={timelineWrapperStyle}>
                            {steps.map((step, index) => (
                                <div key={step.id} style={stepItemStyle}>
                                    <div style={stepCircleStyle(step.status)}>
                                        {step.status === 'completed' ? <CheckCircle size={16} /> :
                                            step.status === 'active' ? <Clock size={16} className="spin" /> :
                                                index + 1}
                                    </div>
                                    <div style={stepLabelStyle(step.status)}>{step.label}</div>
                                    {index < steps.length - 1 && <div style={stepLineStyle(step.status)}></div>}
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Info Card */}
                <div>
                    <GlassCard style={{ padding: '30px', height: '100%' }}>
                        <h3 style={sectionTitleStyle}>Service Profile</h3>
                        <div style={infoRowStyle}>
                            <Car size={18} color="#b08d57" />
                            <div>
                                <div style={infoLabelStyle}>Vehicle</div>
                                <div style={infoValueStyle}>{job.brand} {job.model}</div>
                                <div style={{ fontSize: '12px', color: '#b08d57', fontWeight: '700' }}>PLATE: {job.registration_number}</div>
                            </div>
                        </div>
                        <div style={infoRowStyle}>
                            <User size={18} color="#b08d57" />
                            <div>
                                <div style={infoLabelStyle}>Service Advisor</div>
                                <div style={infoValueStyle}>{job.service_advisor || 'Assigned Staff'}</div>
                            </div>
                        </div>
                        <div style={infoRowStyle}>
                            <FileText size={18} color="#b08d57" />
                            <div>
                                <div style={infoLabelStyle}>Job Card #</div>
                                <div style={infoValueStyle}>{job.job_card_number}</div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Documents Card */}
                <div>
                    <GlassCard style={{ padding: '30px', height: '100%' }}>
                        <h3 style={sectionTitleStyle}>Documents & Billing</h3>

                        {invoice ? (
                            <div style={docItemStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={docIconStyle('#10b981')}><FileText size={20} /></div>
                                    <div>
                                        <div style={{ fontWeight: '700' }}>Tax Invoice</div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{invoice.number}</div>
                                    </div>
                                </div>
                                <Link to={`/invoices/${invoice.id}`} target="_blank" style={docLinkStyle}>
                                    <ExternalLink size={16} />
                                </Link>
                            </div>
                        ) : (
                            <p style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>Invoice will be available after job completion.</p>
                        )}

                        {warranties.map(warranty => (
                            <div key={warranty.id} style={docItemStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={docIconStyle('#b08d57')}><ShieldCheck size={20} /></div>
                                    <div>
                                        <div style={{ fontWeight: '700' }}>{warranty.type} Warranty</div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{warranty.certificate_id}</div>
                                    </div>
                                </div>
                                <Link to={`/${warranty.type.toLowerCase()}/${warranty.id}`} target="_blank" style={docLinkStyle}>
                                    <ExternalLink size={16} />
                                </Link>
                            </div>
                        ))}
                    </GlassCard>
                </div>
            </div>

            <footer style={footerStyle}>
                <p>© Elite Shine Automotive Refinishing. All rights reserved.</p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '10px' }}>
                    <a href="https://eliteshine.ae" style={{ color: '#b08d57', fontSize: '12px', textDecoration: 'none' }}>Website</a>
                    <a href="tel:+971" style={{ color: '#b08d57', fontSize: '12px', textDecoration: 'none' }}>Call Us</a>
                </div>
            </footer>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .spin { animation: spin 2s linear infinite; }
            `}</style>
        </div>
    );
};

// Styles
const containerStyle = {
    padding: '40px 20px',
    maxWidth: '1000px',
    margin: '0 auto',
    minHeight: '100vh',
    background: '#0a0a0b'
};

const headerStyle = {
    textAlign: 'center',
    marginBottom: '50px'
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '50px'
};

const sectionTitleStyle = {
    fontSize: '12px',
    textTransform: 'uppercase',
    color: '#b08d57',
    letterSpacing: '2px',
    margin: '0 0 20px 0',
    fontWeight: '800'
};

const statusBadgeStyle = (status) => ({
    padding: '6px 15px',
    borderRadius: '30px',
    fontSize: '11px',
    fontWeight: '900',
    background: status === 'CLOSED' ? '#10b981' : '#b08d57',
    color: '#000',
    textTransform: 'uppercase'
});

const timelineWrapperStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px 0 40px 0',
    overflowX: 'auto',
    gap: '10px'
};

const stepItemStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    minWidth: '80px'
};

const stepCircleStyle = (status) => ({
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '900',
    zIndex: 2,
    background: status === 'completed' ? '#10b981' : status === 'active' ? '#b08d57' : '#1e293b',
    color: status === 'pending' ? '#64748b' : '#000',
    transition: 'all 0.3s ease'
});

const stepLabelStyle = (status) => ({
    fontSize: '10px',
    marginTop: '10px',
    textAlign: 'center',
    color: status === 'pending' ? '#64748b' : '#fff',
    fontWeight: status === 'active' ? '800' : '400',
    textTransform: 'uppercase'
});

const stepLineStyle = (status) => ({
    position: 'absolute',
    top: '16px',
    left: '50%',
    width: '100%',
    height: '2px',
    background: status === 'completed' ? '#10b981' : '#1e293b',
    zIndex: 1
});

const infoRowStyle = {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px'
};

const infoLabelStyle = {
    fontSize: '11px',
    color: '#64748b',
    textTransform: 'uppercase'
};

const infoValueStyle = {
    color: '#fff',
    fontWeight: '700',
    fontSize: '15px'
};

const docItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    marginBottom: '10px',
    border: '1px solid rgba(255,255,255,0.05)'
};

const docIconStyle = (color) => ({
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: `${color}22`,
    color: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

const docLinkStyle = {
    color: '#b08d57',
    padding: '8px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)'
};

const btnStyle = {
    margin: '20px 0',
    padding: '12px 30px',
    background: '#b08d57',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '900',
    cursor: 'pointer'
};

const loaderStyle = {
    width: '40px',
    height: '40px',
    border: '3px solid #1e293b',
    borderTop: '3px solid #b08d57',
    borderRadius: '50%',
    margin: '0 auto 20px auto',
    animation: 'spin 1s linear infinite'
};

const footerStyle = {
    textAlign: 'center',
    padding: '40px 0',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    color: '#64748b',
    fontSize: '12px'
};

export default CustomerPortal;
