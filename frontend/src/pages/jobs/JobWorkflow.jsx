import React from 'react';
import {
    CheckCircle2,
    Circle,
    ClipboardCheck,
    Clock,
    User,
    Camera,
    FileText,
    ShieldCheck,
    CreditCard,
    Truck,
    ArrowRightCircle
} from 'lucide-react';
import GlassCard from '../../components/GlassCard';

const steps = [
    { id: 'RECEPTION', label: 'Step 1: Reception', icon: Camera, color: '#3b82f6' },
    { id: 'ESTIMATION_ASSIGNMENT', label: 'Step 2: Estimation & Assignment', icon: FileText, color: '#f59e0b' },
    { id: 'WIP_QC', label: 'Step 3: WIP & QC', icon: Clock, color: '#10b981' },
    { id: 'INVOICING_DELIVERY', label: 'Step 4: Invoicing & Delivery', icon: CreditCard, color: '#b08d57' },
    { id: 'CLOSED', label: 'Step 5: Closed', icon: CheckCircle2, color: '#2dd4bf' },
];

const JobWorkflow = ({ currentStatus, onStatusChange, jobData }) => {
    const currentIndex = steps.findIndex(s => s.id === currentStatus);

    return (
        <GlassCard style={{ padding: '30px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', position: 'relative' }}>
                {/* Progress Line */}
                <div style={{
                    position: 'absolute',
                    top: '24px',
                    left: '40px',
                    right: '40px',
                    height: '2px',
                    background: 'var(--border-color)',
                    zIndex: 0
                }} />

                {steps.map((step, idx) => {
                    const Icon = step.icon;
                    const isActive = idx === currentIndex;
                    const isCompleted = idx < currentIndex;

                    return (
                        <div key={step.id} style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', flex: 1 }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: isCompleted ? step.color : isActive ? 'var(--bg-primary)' : 'var(--input-bg)',
                                border: `2px solid ${isActive || isCompleted ? step.color : 'var(--border-color)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                boxShadow: isActive ? `0 0 20px ${step.color}44` : 'none'
                            }}>
                                {isCompleted ? <CheckCircle2 size={24} color="#fff" /> : <Icon size={24} color={isActive ? step.color : 'var(--text-muted)'} />}
                            </div>
                            <div style={{
                                fontSize: '10px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                                textAlign: 'center'
                            }}>
                                {step.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Step Content / Actions */}
            <div style={{ background: 'var(--input-bg)', borderRadius: '15px', padding: '25px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '800', color: steps[currentIndex]?.color }}>
                            {steps[currentIndex]?.label} - Active
                        </h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0, maxWidth: '500px' }}>
                            {getStepDescription(currentStatus)}
                        </p>
                    </div>
                    {currentIndex < steps.length - 1 && (
                        <button
                            onClick={() => {
                                // Blocking check removed as per "Software Remarks"
                                // if (currentStatus === 'RECEPTION' && (!jobData.checklists || jobData.checklists.length === 0)) {
                                //     alert('Error: Vehicle Intake Checklist is missing. You must complete the checklist before proceeding to Estimation.');
                                //     return;
                                // }
                                onStatusChange(steps[currentIndex + 1].id);
                            }}
                            style={{
                                background: steps[currentIndex + 1].color,
                                color: '#fff',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = `0 0 20px ${steps[currentIndex + 1].color}44`; }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            Advance to {steps[currentIndex + 1].label.split(': ')[1]} <ArrowRightCircle size={18} />
                        </button>
                    )}
                </div>

                {/* Step Secondary Info */}
                <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                    {getStepBadges(currentStatus, jobData)}
                </div>
            </div>
        </GlassCard>
    );
};

const getStepDescription = (status) => {
    switch (status) {
        case 'RECEPTION': return 'Initial vehicle walkthrough, photography of existing damages, and collection of customer keys.';
        case 'ESTIMATION_ASSIGNMENT': return 'Assessing vehicle components for quote and assigning to a technician/bay.';
        case 'WIP_QC': return 'Work is in progress and final quality checks being performed to ensure "Elite Shine" standards.';
        case 'INVOICING_DELIVERY': return 'Final bill preparation and handing over vehicle to the customer.';
        case 'CLOSED': return 'Job Card is officially closed and archived.';
        default: return 'Job processing complete.';
    }
};

const getStepBadges = (status, jobData) => {
    if (!jobData) return null;

    let badges = [];

    switch (status) {
        case 'RECEPTION':
            badges = [
                { label: 'Vehicle', value: jobData.brand && jobData.model ? `${jobData.brand} ${jobData.model}` : 'Not Set', ok: !!(jobData.brand) },
                { label: 'Reg. No.', value: jobData.registration_number || 'Not Set', ok: !!(jobData.registration_number) },
                { label: 'Inspection', value: jobData.initial_inspection_notes ? 'Noted' : 'Pending', ok: !!(jobData.initial_inspection_notes) },
                { label: 'Advisor', value: jobData.service_advisor || 'Unassigned', ok: !!(jobData.service_advisor) },
            ];
            break;
        case 'ESTIMATION_ASSIGNMENT':
            badges = [
                { label: 'Subtotal (Net)', value: jobData.total_amount ? `AED ${jobData.total_amount}` : 'Pending', ok: parseFloat(jobData.total_amount) > 0 },
                { label: 'Grand Total', value: jobData.net_amount ? `AED ${jobData.net_amount}` : 'Pending', ok: parseFloat(jobData.net_amount) > 0 },
                { label: 'Technician', value: jobData.assigned_technician || 'Unassigned', ok: !!(jobData.assigned_technician) },
                { label: 'Timeline', value: jobData.estimated_timeline ? new Date(jobData.estimated_timeline).toLocaleDateString() : 'Not Set', ok: !!(jobData.estimated_timeline) },
            ];
            break;
        case 'WIP_QC':
            badges = [
                { label: 'Main Status', value: 'WIP/QC', ok: true },
                { label: 'QC Cleared', value: jobData.qc_sign_off ? 'Yes' : 'Pending', ok: jobData.qc_sign_off },
                { label: 'Pre-Work OK', value: jobData.pre_work_head_sign_off ? 'Approved' : 'Pending', ok: jobData.pre_work_head_sign_off },
                { label: 'Bay', value: jobData.assigned_bay || 'Unassigned', ok: !!(jobData.assigned_bay) },
            ];
            break;
        case 'INVOICING_DELIVERY':
            badges = [
                { label: 'Grand Total', value: `AED ${jobData.net_amount}`, ok: true },
                { label: 'Payment', value: jobData.invoice?.is_paid ? 'Paid' : 'Unpaid', ok: jobData.invoice?.is_paid },
                { label: 'Deliverable', value: 'Ready', ok: true },
                { label: 'Signature', value: jobData.signature_data ? 'Signed' : 'Pending', ok: !!(jobData.signature_data) },
            ];
            break;
        default:
            badges = [
                { label: 'Status', value: jobData.status_display || jobData.status || 'Unknown', ok: true },
                { label: 'Job #', value: jobData.job_card_number || 'N/A', ok: true },
                { label: 'Customer', value: jobData.customer_name || 'N/A', ok: true },
                { label: 'Vehicle', value: `${jobData.brand || ''} ${jobData.model || ''}`.trim() || 'N/A', ok: true },
            ];
    }

    return badges.map((b, i) => (
        <div key={i} style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '3px' }}>{b.label}</div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: b.ok ? '#10b981' : '#ef4444' }}>{b.value}</div>
        </div>
    ));
};

export default JobWorkflow;
