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
    ArrowRightCircle,
    ChevronRight
} from 'lucide-react';

const steps = [
    { id: 'RECEPTION', label: '01 | Reception', icon: Camera, color: '#b08d57' },
    { id: 'ESTIMATION_ASSIGNMENT', label: '02 | Estimation', icon: FileText, color: '#b08d57' },
    { id: 'WIP_QC', label: '03 | Production', icon: Clock, color: '#b08d57' },
    { id: 'INVOICING_DELIVERY', label: '04 | Invoicing', icon: CreditCard, color: '#b08d57' },
    { id: 'CLOSED', label: '05 | Archive', icon: CheckCircle2, color: '#10b981' },
];

const JobWorkflow = ({ currentStatus, onStatusChange, jobData }) => {
    const currentIndex = steps.findIndex(s => s.id === currentStatus);

    return (
        <div style={{ marginBottom: '40px' }}>
            {/* Minimalist Progress Line */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', position: 'relative', padding: '0 20px' }}>
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '60px',
                    right: '60px',
                    height: '1px',
                    background: 'rgba(232, 230, 227, 0.05)',
                    zIndex: 0
                }} />

                {steps.map((step, idx) => {
                    const Icon = step.icon;
                    const isActive = idx === currentIndex;
                    const isCompleted = idx < currentIndex;

                    return (
                        <div key={step.id} style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', flex: 1 }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: isCompleted ? 'var(--gold)' : isActive ? 'transparent' : 'rgba(232, 230, 227, 0.02)',
                                border: `1px solid ${isActive || isCompleted ? 'var(--gold)' : 'rgba(232, 230, 227, 0.1)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: isActive ? `0 0 25px rgba(176, 141, 87, 0.15)` : 'none'
                            }}>
                                {isCompleted ? <CheckCircle2 size={18} color="#000" /> : <Icon size={18} color={isActive ? 'var(--gold)' : 'rgba(232, 230, 227, 0.3)'} />}
                            </div>
                            <div style={{
                                fontSize: '10px',
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                letterSpacing: '1.5px',
                                color: isActive ? 'var(--cream)' : 'rgba(232, 230, 227, 0.3)',
                                textAlign: 'center',
                                fontFamily: 'var(--font-sans)'
                            }}>
                                {step.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tactical Control Panel */}
            <div style={{
                background: 'rgba(232, 230, 227, 0.02)',
                borderRadius: '24px',
                padding: '35px',
                border: '1px solid rgba(232, 230, 227, 0.05)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                            <h4 style={{ margin: 0, fontSize: '24px', fontWeight: '400', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>
                                {steps[currentIndex]?.label.split(' | ')[1]} Phase
                            </h4>
                            <span style={{
                                padding: '4px 12px',
                                background: 'rgba(176, 141, 87, 0.1)',
                                color: 'var(--gold)',
                                border: '1px solid rgba(176, 141, 87, 0.2)',
                                borderRadius: '30px',
                                fontSize: '9px',
                                fontWeight: '900',
                                letterSpacing: '1px'
                            }}>IN COMMAND</span>
                        </div>
                        <p style={{ color: 'rgba(232, 230, 227, 0.4)', fontSize: '14px', margin: 0, maxWidth: '600px', lineHeight: '1.6' }}>
                            {getStepDescription(currentStatus)}
                        </p>
                    </div>
                    {currentIndex < steps.length - 1 && (
                        <button
                            onClick={() => onStatusChange(steps[currentIndex + 1].id)}
                            style={{
                                background: 'var(--gold)',
                                color: '#000',
                                border: 'none',
                                padding: '16px 32px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: '1.5px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'brightness(1)'; }}
                        >
                            Transition to {steps[currentIndex + 1].label.split('| ')[1]} <ChevronRight size={18} />
                        </button>
                    )}
                </div>

                {/* Tactical Metrics Grid */}
                <div style={{ marginTop: '35px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                    {getStepBadges(currentStatus, jobData)}
                </div>
            </div>
        </div>
    );
};

const getStepDescription = (status) => {
    switch (status) {
        case 'RECEPTION': return 'Formal asset reception, high-precision technical walkthrough, and dossier initialization.';
        case 'ESTIMATION_ASSIGNMENT': return 'Financial architecture design, labor estimation, and technical resource allocation.';
        case 'WIP_QC': return 'Technical execution phase accompanied by continuous quality surveillance and multi-point inspections.';
        case 'INVOICING_DELIVERY': return 'Dossier finalization, commercial settlement, and premium asset redelivery.';
        case 'CLOSED': return 'Operational ledger closed and asset journey archived in the secure history vault.';
        default: return 'Operation in progress.';
    }
};

const getStepBadges = (status, jobData) => {
    if (!jobData) return null;

    let badges = [];

    switch (status) {
        case 'RECEPTION':
            badges = [
                { label: 'Vehicle Asset', value: jobData.brand && jobData.model ? `${jobData.brand} ${jobData.model}` : 'Not Specified', ok: !!(jobData.brand) },
                { label: 'Registry ID', value: jobData.registration_number || 'Pending', ok: !!(jobData.registration_number) },
                { label: 'Intelligence', value: jobData.initial_inspection_notes ? 'Authenticated' : 'Pending Notes', ok: !!(jobData.initial_inspection_notes) },
                { label: 'Commanding Advisor', value: jobData.service_advisor || 'Unassigned', ok: !!(jobData.service_advisor) },
            ];
            break;
        case 'ESTIMATION_ASSIGNMENT':
            badges = [
                { label: 'Project Valuation', value: jobData.net_amount ? `AED ${jobData.net_amount}` : 'In Calculation', ok: parseFloat(jobData.net_amount) > 0 },
                { label: 'Operational Lead', value: jobData.assigned_technician || 'Allocation Pending', ok: !!(jobData.assigned_technician) },
                { label: 'Milestone Date', value: jobData.estimated_timeline ? new Date(jobData.estimated_timeline).toLocaleDateString() : 'Not Scheduled', ok: !!(jobData.estimated_timeline) },
                { label: 'Service Bay', value: jobData.assigned_bay || 'Awaiting Slot', ok: !!(jobData.assigned_bay) },
            ];
            break;
        case 'WIP_QC':
            badges = [
                { label: 'Execution Mode', value: 'Live Production', ok: true },
                { label: 'Surveillance OK', value: jobData.qc_sign_off ? 'Gold Standard' : 'In Surveillance', ok: jobData.qc_sign_off },
                { label: 'Clearance Status', value: jobData.is_released ? 'Released' : 'Held for Review', ok: jobData.is_released },
                { label: 'QC Authorization', value: jobData.floor_incharge_sign_off ? 'Valid' : 'Awaiting Sign-off', ok: jobData.floor_incharge_sign_off },
            ];
            break;
        case 'INVOICING_DELIVERY':
            badges = [
                { label: 'Commercial Total', value: `AED ${jobData.net_amount}`, ok: true },
                { label: 'Settlement', value: jobData.invoice?.is_paid ? 'Settled' : 'Outstanding', ok: jobData.invoice?.is_paid },
                { label: 'Release Status', value: 'Ready for Handover', ok: true },
                { label: 'Authentication', value: jobData.signature_data ? 'Digital ID Verified' : 'Awaiting Sign-off', ok: !!(jobData.signature_data) },
            ];
            break;
        default:
            badges = [
                { label: 'Operational Status', value: jobData.status_display || 'Processed', ok: true },
                { label: 'Job ID', value: jobData.job_card_number || 'N/A', ok: true },
                { label: 'Client Name', value: jobData.customer_name || 'N/A', ok: true },
                { label: 'Vehicle', value: `${jobData.brand || ''} ${jobData.model || ''}`.trim() || 'N/A', ok: true },
            ];
    }

    return badges.map((b, i) => (
        <div key={i} style={{
            background: 'rgba(232, 230, 227, 0.01)',
            padding: '15px 20px',
            borderRadius: '16px',
            border: '1px solid rgba(232, 230, 227, 0.05)'
        }}>
            <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.4)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px', fontWeight: '800' }}>{b.label}</div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: b.ok ? '#10b981' : 'rgba(232, 230, 227, 0.3)', fontFamily: 'var(--font-sans)' }}>{b.value}</div>
        </div>
    ));
};

export default JobWorkflow;

