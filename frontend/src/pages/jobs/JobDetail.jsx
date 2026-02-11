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
    Printer,
    AlertCircle
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
        { key: 'ESTIMATION_ASSIGNMENT', label: 'Estimation & Assignment', icon: <FileText size={18} /> },
        { key: 'WIP_QC', label: 'Work In Progress & QC', icon: <Clock size={18} /> },
        { key: 'INVOICING_DELIVERY', label: 'Invoicing & Delivery', icon: <Package size={18} /> },
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

    const _currentStepIndex = steps.findIndex(s => s.key === job.status);

    return (
        <div style={{ padding: '30px 20px' }}>
            <PrintHeader title={`Job Card: ${job.job_card_number}`} />
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button
                        onClick={() => navigate('/job-cards')}
                        style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-primary)', transition: 'all 0.3s' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', margin: 0, color: 'var(--text-primary)' }}>{job.customer_name}</h1>
                        <p style={{ color: 'var(--gold)', fontSize: '14px', margin: 0, fontWeight: '700' }}>#{job.job_card_number}</p>
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
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--bg-glass)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '10px 20px', borderRadius: '12px', fontWeight: '700', transition: 'all 0.3s' }}
                    >
                        <ShieldCheck size={18} color="var(--gold)" /> Share Portal
                    </button>
                    <button
                        onClick={() => window.open(`/forms/utils/generate-pdf/JobCard/${id}/`, '_blank')}
                        className="glass-card"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--bg-glass)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '10px 20px', borderRadius: '12px', fontWeight: '700', transition: 'all 0.3s' }}
                    >
                        <Printer size={18} /> Res. Job Card
                    </button>

                    {/* Invoice Actions */}
                    {job.invoice ? (
                        <>
                            <button
                                onClick={() => navigate(`/invoices/${job.invoice.id}`)}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--gold)', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: '900', transition: 'all 0.3s' }}
                            >
                                <FileText size={18} /> View Invoice
                            </button>
                            <button
                                onClick={() => window.open(`/forms/utils/generate-pdf/Invoice/${job.invoice.id}/`, '_blank')}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px 20px', borderRadius: '12px', fontWeight: '700', transition: 'all 0.3s' }}
                            >
                                <Printer size={18} /> Print Invoice
                            </button>
                        </>
                    ) : (
                        job.status === 'INVOICING_DELIVERY' && (
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
                        <div style={{ color: 'var(--text-primary)', fontSize: '15px', lineHeight: '1.6', background: 'var(--input-bg)', padding: '20px', borderRadius: '15px', border: '1px solid var(--border-color)', transition: 'all 0.3s' }}>
                            {job.job_description}
                        </div>
                    </GlassCard>

                    {/* Customer Authorization Section */}
                    <GlassCard style={{ padding: '30px', marginBottom: '30px', border: '1px solid rgba(176, 141, 87, 0.2)' }}>
                        <h3 style={sectionTitleStyle}>Customer Authorization</h3>
                        {job.signature_data ? (
                            <div style={{ textAlign: 'center', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                <img src={job.signature_data} alt="Customer Signature" style={{ maxHeight: '150px' }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '10px' }}>Digitally signed on {new Date(job.updated_at).toLocaleDateString()}</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center' }}>Vehicle reception signature required to proceed with works.</p>
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
                            <span style={{ color: 'var(--text-secondary)' }}>Subtotal (Net)</span>
                            <span style={{ color: 'var(--text-primary)' }}>AED {job.total_amount}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>VAT (5%)</span>
                            <span style={{ color: 'var(--text-primary)' }}>AED {job.vat_amount}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-color)', fontWeight: '800', fontSize: '1.2rem', color: 'var(--gold)' }}>
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
            {/* Checklist Enforcement Warning */}
            {job.status === 'RECEPTION' && (!job.checklists || job.checklists.length === 0) && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid #ef4444',
                    borderRadius: '12px',
                    padding: '15px 20px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '15px'
                }}>
                    <button
                        onClick={() => navigate(`/checklists/new?job_card=${job.id}`)}
                        className="btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <ClipboardList size={18} /> CHECKLIST
                    </button>
                    <button
                        onClick={() => setAdvanceModal(true)}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <ArrowRight size={18} /> NEXT STEP
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <AlertCircle color="#ef4444" size={24} />
                        <div>
                            <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '15px' }}>Action Required: Intake Checklist Missing</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Vehicle cannot proceed to Estimation until the Service Advisor checklist is completed.</div>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(`/service-advisor/form?jobId=${job.id}`)}
                        style={{
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Complete Checklist
                    </button>
                </div>
            )}
        </div>
    );
};

const InfoItem = ({ label, value }) => (
    <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{value}</div>
    </div>
);

const QCItem = ({ label, checked }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '4px',
            border: '2px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: checked ? 'var(--gold)' : 'transparent',
            borderColor: checked ? 'var(--gold)' : 'var(--border-color)',
            transition: 'all 0.3s'
        }}>
            {checked && <CheckCircle2 size={12} color="#000" />}
        </div>
        <span style={{ fontSize: '13px', color: checked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{label}</span>
    </div>
);

const sectionTitleStyle = {
    fontSize: '12px',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    marginBottom: '20px',
    fontWeight: '800',
    letterSpacing: '1px'
};

export default JobDetail;
