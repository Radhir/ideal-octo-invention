import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
    CheckCircle, Clock, AlertCircle,
    Camera, ArrowLeft, Check, ChevronRight
} from 'lucide-react';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioGrid,
    PortfolioTitle,
    PortfolioButton,
    PortfolioBackButton
} from '../../components/PortfolioComponents';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [photos, setPhotos] = useState([]);
    const [activePhotoTab, setActivePhotoTab] = useState('All');

    const STAGES = [
        'RECEPTION', 'ESTIMATION', 'WORK_ASSIGNMENT',
        'WIP', 'QC', 'INVOICING', 'DELIVERY', 'CLOSED'
    ];

    useEffect(() => {
        loadJobDetails();
    }, [id]);

    const loadJobDetails = async () => {
        try {
            const [jobRes, photosRes] = await Promise.all([
                api.get(`/customer-portal/my-jobs/${id}/`),
                api.get(`/customer-portal/my-jobs/${id}/photos/`)
            ]);
            setJob(jobRes.data);
            setPhotos(photosRes.data);
        } catch (err) {
            console.error('Error loading job details:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveEstimate = async () => {
        if (window.confirm('Are you sure you want to approve this estimate?')) {
            try {
                await api.post(`/customer-portal/my-jobs/${id}/approve_estimate/`);
                setJob({ ...job, status: 'WORK_ASSIGNMENT', current_status_display: 'Work Assignment' });
                alert('Estimate approved successfully!');
            } catch (err) {
                alert('Error approving estimate');
            }
        }
    };

    if (loading) return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '20px' }}>
                <div className="spinner"></div>
                <p style={{ color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>Loading Job Details...</p>
            </div>

        </PortfolioPage>
    );

    if (!job) return (
        <PortfolioPage>
            <div style={{ padding: '50px', textAlign: 'center', color: '#f43f5e' }}>Job not found</div>
        </PortfolioPage>
    );

    const currentStageIndex = STAGES.indexOf(job.status);

    return (
        <PortfolioPage breadcrumb={`SERVICE TRACKING // ${job.job_number}`}>
            <PortfolioBackButton onClick={() => navigate(-1)} />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
                <PortfolioTitle
                    subtitle={`${job.vehicle_details?.make} ${job.vehicle_details?.model} // ${job.vehicle_details?.license_plate?.toUpperCase()}`}
                >
                    Diagnostic<br />Archive
                </PortfolioTitle>
                <div style={{
                    textAlign: 'right',
                    padding: '25px 35px',
                    background: 'rgba(176,141,87,0.03)',
                    borderRadius: '24px',
                    border: '1px solid rgba(176,141,87,0.1)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                }}>
                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '3px', marginBottom: '8px' }}>VALUATION ESTIMATE</div>
                    <div style={{
                        fontSize: '56px', fontWeight: '100', color: 'var(--cream)',
                        fontFamily: 'var(--font-serif)', lineHeight: 1, display: 'flex',
                        alignItems: 'baseline', gap: '12px', justifyContent: 'flex-end',
                        textShadow: '0 0 30px rgba(176,141,87,0.3)'
                    }}>
                        <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--gold)', letterSpacing: '2px' }}>AED</span>
                        {parseFloat(job.total_estimated_cost || 0).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Custom Holographic Stepper */}
            <PortfolioCard style={{ padding: '70px 50px', marginBottom: '60px', overflowX: 'auto', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(176,141,87,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '1000px', position: 'relative' }}>
                    {/* Background Trace Line */}
                    <div style={{ position: 'absolute', top: '24px', left: '25px', right: '25px', height: '1px', background: 'rgba(255,255,255,0.05)', zIndex: 0 }}></div>

                    {/* Active Progress Vector */}
                    <div style={{
                        position: 'absolute', top: '24px', left: '25px',
                        width: `calc(${(currentStageIndex / (STAGES.length - 1)) * 100}% - 50px)`,
                        height: '2px', background: 'var(--gold)', zIndex: 0, transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 0 20px rgba(176,141,87,0.5)'
                    }}></div>

                    {STAGES.map((stage, index) => {
                        const isCompleted = index < currentStageIndex;
                        const isActive = index === currentStageIndex;
                        const isPending = index > currentStageIndex;
                        const statusColor = isCompleted ? '#10b981' : (isActive ? 'var(--gold)' : 'rgba(255,255,255,0.05)');

                        return (
                            <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative', width: '120px' }}>
                                <div style={{
                                    width: '54px', height: '54px', borderRadius: '16px',
                                    background: isActive ? 'var(--gold)' : (isCompleted ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)'),
                                    border: `1px solid ${isActive ? 'var(--gold)' : (isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.08)')}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: isActive ? '0 15px 30px rgba(176,141,87,0.3)' : 'none',
                                    transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                                    marginBottom: '20px',
                                    cursor: 'default'
                                }}>
                                    {isCompleted ? <Check size={22} color="#10b981" strokeWidth={3} /> :
                                        isActive ? <Clock size={22} color="#000" strokeWidth={2.5} /> :
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>}
                                </div>
                                <div style={{
                                    fontSize: '10px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase',
                                    color: isActive ? 'var(--gold)' : (isCompleted ? '#10b981' : 'rgba(232, 230, 227, 0.2)'),
                                    textAlign: 'center', transition: 'all 0.5s ease'
                                }}>
                                    {stage.replace('_', ' ')}
                                </div>
                                {isActive && (
                                    <div className="status-pulse active" style={{
                                        background: 'var(--gold)',
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '25px',
                                        width: '10px',
                                        height: '10px',
                                        boxShadow: '0 0 15px var(--gold)'
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </PortfolioCard>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '40px' }}>
                {/* Left Column */}
                <div>
                    {/* Services */}
                    <div style={{ marginBottom: '60px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                            <div style={{ width: '32px', height: '1px', background: 'var(--gold)', opacity: 0.5 }}></div>
                            <h3 style={{ fontSize: '10px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '900', margin: 0 }}>REQUESTED SERVICES</h3>
                        </div>
                        <PortfolioGrid columns={2} gap="25px">
                            {job.services?.map((service, index) => (
                                <PortfolioCard
                                    key={index}
                                    style={{
                                        padding: '30px',
                                        border: '1px solid rgba(255,255,255,0.04)',
                                        background: 'rgba(255,255,255,0.01)',
                                        transition: 'transform 0.3s'
                                    }}
                                    className="workflow-card"
                                >
                                    <div style={{ fontSize: '20px', fontWeight: '400', color: 'var(--cream)', marginBottom: '12px', fontFamily: 'var(--font-serif)', letterSpacing: '0.5px' }}>{service.name}</div>
                                    <div style={{ color: 'var(--gold)', fontSize: '14px', fontWeight: '900', letterSpacing: '1px' }}>
                                        <span style={{ fontSize: '11px', opacity: 0.5, marginRight: '6px' }}>AED</span>
                                        {parseFloat(service.price).toLocaleString()}
                                    </div>
                                </PortfolioCard>
                            ))}
                        </PortfolioGrid>
                        {!job.services?.length && <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', letterSpacing: '1px', padding: '40px', background: 'rgba(0,0,0,0.1)', borderRadius: '20px', textAlign: 'center' }}>NO SPECIFIC SERVICES LISTED.</div>}
                    </div>

                    {/* Photos */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <Camera size={20} color="var(--gold)" />
                                <h3 style={{ fontSize: '16px', color: 'var(--cream)', fontWeight: '300', margin: 0, fontFamily: 'var(--font-serif)', letterSpacing: '1px' }}>Progress Gallery</h3>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '5px', borderRadius: '20px' }}>
                                {['All', 'Before', 'During', 'After'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActivePhotoTab(tab)}
                                        style={{
                                            background: activePhotoTab === tab ? 'var(--gold)' : 'transparent',
                                            border: 'none',
                                            color: activeTab === tab ? '#000' : 'rgba(255,255,255,0.4)',
                                            padding: '6px 16px', borderRadius: '15px', fontSize: '10px', cursor: 'pointer', fontWeight: '900', letterSpacing: '1px',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        {tab.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <PortfolioGrid columns={3} gap="20px">
                            {photos
                                .filter(photo => activePhotoTab === 'All' || photo.stage?.toUpperCase() === activePhotoTab.toUpperCase())
                                .map((photo) => (
                                    <div key={photo.id} style={{
                                        position: 'relative', borderRadius: '20px', overflow: 'hidden', aspectRatio: '4/3',
                                        border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                                    }}>
                                        <img
                                            src={photo.thumbnail_url || photo.image}
                                            alt={photo.description}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                            className="hover-scale"
                                        />
                                        <div style={{
                                            position: 'absolute', bottom: 0, left: 0, right: 0,
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
                                            padding: '25px 20px 15px', color: 'var(--cream)', fontSize: '11px', fontWeight: '300',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {photo.description}
                                        </div>
                                    </div>
                                ))}
                        </PortfolioGrid>
                        {photos.length === 0 && <div style={{ padding: '60px', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '11px', letterSpacing: '2px', fontWeight: '900' }}>NO DIAGNOSTIC IMAGERY DETECTED.</div>}
                    </div>
                </div>

                {/* Right Column - Status Actions */}
                <div>
                    <PortfolioCard
                        style={{
                            padding: '40px',
                            position: 'sticky',
                            top: '30px',
                            borderTop: '1px solid var(--gold)',
                            background: 'rgba(176,141,87,0.02)',
                            borderRadius: '24px'
                        }}
                        className="workflow-card"
                    >
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <div style={{ fontSize: '9px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px', fontWeight: '900' }}>CURRENT STANDING</div>
                            <div style={{
                                display: 'inline-flex', padding: '10px 25px', borderRadius: '20px',
                                background: 'rgba(176,141,87,0.1)', color: 'var(--gold)', border: '1px solid rgba(176,141,87,0.2)',
                                fontSize: '18px', fontWeight: '100', fontFamily: 'var(--font-serif)', letterSpacing: '1px',
                                alignItems: 'center', gap: '10px'
                            }}>
                                <div className="status-pulse active" style={{ background: 'var(--gold)', width: '8px', height: '8px' }} />
                                {job.current_status_display.toUpperCase()}
                            </div>
                        </div>

                        {job.status === 'ESTIMATION' && (
                            <div style={{ textAlign: 'center', marginBottom: '40px', padding: '30px', background: 'rgba(176,141,87,0.05)', borderRadius: '16px', border: '1px solid rgba(176,141,87,0.1)' }}>
                                <AlertCircle size={32} color="var(--gold)" style={{ marginBottom: '15px', opacity: 0.5 }} />
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', marginBottom: '25px', fontWeight: '300' }}>
                                    Executive estimate prepared. Review and authorize to initiate workshop logistics.
                                </p>
                                <PortfolioButton onClick={handleApproveEstimate} variant="gold" style={{ width: '100%', height: '54px', fontSize: '11px' }}>
                                    AUTHORIZE WORK ORDERS
                                </PortfolioButton>
                            </div>
                        )}

                        {job.estimated_completion && (
                            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Clock size={24} color="var(--gold)" style={{ opacity: 0.5 }} />
                                <div>
                                    <div style={{ fontSize: '9px', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px' }}>ESTIMATED HANDOVER</div>
                                    <div style={{ color: 'var(--cream)', fontSize: '14px', marginTop: '4px', fontWeight: '300' }}>
                                        {typeof job.estimated_completion === 'string' ? new Date(job.estimated_completion).toLocaleDateString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : job.estimated_completion}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '9px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px', fontWeight: '900' }}>LOGISTICS SUPPORT</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircle size={20} color="var(--gold)" opacity={0.5} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '15px', color: 'var(--cream)', fontWeight: '400', fontFamily: 'var(--font-serif)' }}>
                                        {job.assigned_advisor?.name || 'Lead Technical Advisor'}
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                                        Primary Point of Contact
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PortfolioCard>
                </div>
            </div>
        </PortfolioPage>
    );
};

export default JobDetail;
