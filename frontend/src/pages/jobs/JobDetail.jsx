import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import {
    ArrowLeft,
    ChevronRight,
    CheckCircle2,
    Clock,
    PenTool,
    Wrench,
    ShieldCheck,
    FileText,
    Truck,
    Plus,
    Save,
    Activity,
    Package,
    Printer
} from 'lucide-react';
import JobWorkflow from './JobWorkflow';
import PrintHeader from '../../components/PrintHeader';
import SignaturePad from '../../components/SignaturePad';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    const steps = [
        { key: 'RECEPTION', label: 'Reception', icon: <PenTool size={18} /> },
        { key: 'ESTIMATION', label: 'Estimation', icon: <FileText size={18} /> },
        { key: 'WORK_ASSIGNMENT', label: 'Assignment', icon: <Wrench size={18} /> },
        { key: 'WIP', label: 'WIP', icon: <Clock size={18} /> },
        { key: 'QC', label: 'QC Approval', icon: <ShieldCheck size={18} /> },
        { key: 'INVOICING', label: 'Invoicing', icon: <FileText size={18} /> },
        { key: 'DELIVERY', label: 'Delivery', icon: <Truck size={18} /> },
    ];

    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            const res = await api.get(`/forms/job-cards/api/jobs/${id}/`);
            setJob(res.data);
        } catch (err) {
            console.error('Error fetching job', err);
        } finally {
            setLoading(false);
        }
    };

    const advanceWorkflow = async () => {
        try {
            const res = await api.post(`/forms/job-cards/api/jobs/${id}/advance_status/`);
            alert(`Workflow advanced to ${res.data.display}`);
            // Refetch full job data so all computed fields update
            await fetchJob();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to advance workflow');
        }
    };

    const generateInvoice = async () => {
        try {
            const res = await api.post(`/forms/job-cards/api/jobs/${id}/create_invoice/`);
            alert(`Invoice ${res.data.invoice_number} generated!`);
            // Optionally navigate to invoice detail
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to generate invoice');
        }
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
    if (!job) return <div style={{ padding: '50px', textAlign: 'center' }}>Job Not Found</div>;

    const currentStepIndex = steps.findIndex(s => s.key === job.status);

    return (
        <div style={{ padding: '30px 20px' }}>
            <PrintHeader title={`Job Card: ${job.job_card_number}`} />
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button
                        onClick={() => navigate('/job-cards')}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '12px', cursor: 'pointer', color: '#fff' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', margin: 0 }}>{job.customer_name}</h1>
                        <p style={{ color: '#b08d57', fontSize: '14px', margin: 0, fontWeight: '700' }}>#{job.job_card_number}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => navigate(`/estimates/${id}`)}
                        className="glass-card"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'rgba(176, 141, 87, 0.15)', color: '#fff', border: '1px solid rgba(176, 141, 87, 0.4)', padding: '10px 20px', borderRadius: '12px', fontWeight: '700' }}
                    >
                        <FileText size={18} color="#b08d57" /> Quotation
                    </button>
                    <button
                        onClick={() => {
                            const link = `${window.location.origin}/portal/${job.portal_token}`;
                            navigator.clipboard.writeText(link);
                            alert('Customer Portal Link copied to clipboard!');
                        }}
                        className="glass-card"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '10px 20px', borderRadius: '12px', fontWeight: '700' }}
                    >
                        <ShieldCheck size={18} color="#b08d57" /> Share Portal
                    </button>
                    <button
                        onClick={() => window.open(`/forms/utils/generate-pdf/JobCard/${id}/`, '_blank')}
                        className="glass-card"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '10px 20px', borderRadius: '12px', fontWeight: '700' }}
                    >
                        <Printer size={18} /> Res. Job Card
                    </button>

                    {/* Invoice Actions */}
                    {job.invoice ? (
                        <>
                            <button
                                onClick={() => navigate(`/invoices/${job.invoice.id}`)}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: '#b08d57', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: '900' }}
                            >
                                <FileText size={18} /> View Invoice
                            </button>
                            <button
                                onClick={() => window.open(`/forms/utils/generate-pdf/Invoice/${job.invoice.id}/`, '_blank')}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '10px 20px', borderRadius: '12px', fontWeight: '700' }}
                            >
                                <Printer size={18} /> Print Invoice
                            </button>
                        </>
                    ) : (
                        job.status === 'INVOICING' && (
                            <button onClick={generateInvoice} className="btn-primary" style={{ background: '#b08d57', color: '#000', fontWeight: '900', padding: '10px 25px', borderRadius: '12px' }}>Generate Invoice</button>
                        )
                    )}
                </div>
            </header>

            {/* Industrial Workflow Mission Control */}
            <JobWorkflow
                currentStatus={job.status}
                onStatusChange={advanceWorkflow}
                jobData={job}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                <div className="main-content">
                    <GlassCard style={{ padding: '30px', marginBottom: '30px' }}>
                        <h3 style={sectionTitleStyle}>Job Status: {job.status_display}</h3>
                        <div style={{ color: '#fff', fontSize: '15px', lineHeight: '1.6', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            {job.job_description}
                        </div>
                    </GlassCard>

                    {/* Customer Authorization Section */}
                    <GlassCard style={{ padding: '30px', marginBottom: '30px', border: '1px solid rgba(176, 141, 87, 0.2)' }}>
                        <h3 style={sectionTitleStyle}>Customer Authorization</h3>
                        {job.signature_data ? (
                            <div style={{ textAlign: 'center', background: '#fff', padding: '20px', borderRadius: '12px' }}>
                                <img src={job.signature_data} alt="Customer Signature" style={{ maxHeight: '150px' }} />
                                <p style={{ color: '#64748b', fontSize: '11px', marginTop: '10px' }}>Digitally signed on {new Date(job.updated_at).toLocaleDateString()}</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                                <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>Vehicle reception signature required to proceed with works.</p>
                                <SignaturePad
                                    onSave={async (data) => {
                                        try {
                                            await api.patch(`/forms/job-cards/api/jobs/${id}/`, { signature_data: data });
                                            setJob({ ...job, signature_data: data });
                                            alert('Signature captured successfully!');
                                        } catch (err) {
                                            alert('Failed to save signature');
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </GlassCard>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <GlassCard style={{ padding: '20px' }}>
                            <h4 style={sectionTitleStyle}>Vehicle Details</h4>
                            <InfoItem label="Registration" value={job.registration_number} />
                            <InfoItem label="Brand/Model" value={`${job.brand} ${job.model}`} />
                            <InfoItem label="VIN" value={job.vin} />
                            <InfoItem label="Kilometers" value={job.kilometers} />
                        </GlassCard>

                        <GlassCard style={{ padding: '20px' }}>
                            <h4 style={sectionTitleStyle}>Work Assignment</h4>
                            {job.assigned_technician ? (
                                <>
                                    <InfoItem label="Technician" value={job.assigned_technician} />
                                    <InfoItem label="Bay" value={job.assigned_bay} />
                                    <InfoItem label="Timeline" value={job.estimated_timeline ? new Date(job.estimated_timeline).toLocaleString() : 'N/A'} />
                                </>
                            ) : (
                                <p style={{ color: '#94a3b8', fontSize: '13px' }}>Waiting for assignment...</p>
                            )}
                        </GlassCard>
                    </div>
                </div>

                <div className="sidebar">
                    <GlassCard style={{ padding: '20px', marginBottom: '20px' }}>
                        <h4 style={sectionTitleStyle}>Financial Summary</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ color: '#94a3b8' }}>Subtotal (Net)</span>
                            <span>AED {job.total_amount}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ color: '#94a3b8' }}>VAT (5%)</span>
                            <span>AED {job.vat_amount}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', fontWeight: '800', fontSize: '1.2rem', color: '#b08d57' }}>
                            <span>Grand Total</span>
                            <span>AED {job.net_amount}</span>
                        </div>
                    </GlassCard>

                    <GlassCard style={{ padding: '20px' }}>
                        <h4 style={sectionTitleStyle}>QC Checkpoints</h4>
                        <QCItem label="Pre-work Approval" checked={job.pre_work_head_sign_off} />
                        <QCItem label="Post-work Sign-off" checked={job.post_work_head_sign_off} />
                        <QCItem label="QC Inspector" checked={job.qc_sign_off} />
                        <QCItem label="Floor Incharge" checked={job.floor_incharge_sign_off} />
                    </GlassCard>
                </div>
                <style>{`
                @media print {
                    .sidebar { display: block !important; width: 100% !important; margin-top: 20px !important; }
                    .main-content { margin-bottom: 20px !important; }
                    .glass-card { background: #fff !important; border: 1px solid #eee !important; box-shadow: none !important; color: #000 !important; margin-bottom: 20px !important; }
                    .JobWorkflow, button, nav, header { display: none !important; }
                    body { background: #fff !important; }
                }
            `}</style>
            </div>
        </div>
    );
};

const InfoItem = ({ label, value }) => (
    <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '14px', fontWeight: '600' }}>{value}</div>
    </div>
);

const QCItem = ({ label, checked }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '4px',
            border: '2px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: checked ? '#b08d57' : 'transparent',
            borderColor: checked ? '#b08d57' : 'rgba(255,255,255,0.2)'
        }}>
            {checked && <CheckCircle2 size={12} color="#000" />}
        </div>
        <span style={{ fontSize: '13px', color: checked ? '#fff' : '#94a3b8' }}>{label}</span>
    </div>
);

const sectionTitleStyle = {
    fontSize: '12px',
    textTransform: 'uppercase',
    color: '#b08d57',
    marginBottom: '20px',
    fontWeight: '800',
    letterSpacing: '1px'
};

export default JobDetail;
