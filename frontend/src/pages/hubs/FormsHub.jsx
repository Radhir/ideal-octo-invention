import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import {
    ClipboardList, ShieldCheck, FileText,
    PenTool, Car, CheckCircle2, FilePlus,
    Search
} from 'lucide-react';

const FormsHub = () => {
    const navigate = useNavigate();

    const forms = [
        {
            title: "Vehicle Inspection",
            description: "Service Advisor Intake & 360° Visual Check",
            icon: Car,
            path: "/service-advisor/form",
            color: "#3b82f6"
        },
        {
            title: "Detailing QC",
            description: "Quality Control Checklist for Detailing",
            icon: CheckCircle2,
            path: "/detailing/checklist",
            color: "#10b981"
        },
        {
            title: "Ceramic Coating QC",
            description: "Compliance Check for Ceramic Packages",
            icon: ShieldCheck,
            path: "/ceramic/checklist",
            color: "#8b5cf6"
        },
        {
            title: "PPF Warranty",
            description: "Warranty Registration & Certificate Issue",
            icon: ShieldCheck,
            path: "/ppf/warranty",
            color: "#f59e0b"
        },
        {
            title: "New Job Card",
            description: "Create standard Job Card for Workshop",
            icon: FilePlus,
            path: "/job-cards/create",
            color: "#ec4899"
        },
        {
            title: "New Lead / Inquiry",
            description: "Register new sales opportunity",
            icon: ClipboardList,
            path: "/leads/create",
            color: "#ef4444"
        }
    ];

    return (
        <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#fff' }}>Forms Hub</h1>
                    <p style={{ color: '#94a3b8', marginTop: '8px' }}>Centralized repository for all operational documents and checklists.</p>
                </div>

                <div style={{ position: 'relative' }}>
                    <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        placeholder="Search forms..."
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            padding: '10px 10px 10px 36px',
                            borderRadius: '8px',
                            color: '#fff',
                            width: '250px',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {forms.map((form, idx) => (
                    <GlassCard key={idx} style={{ padding: '0', cursor: 'pointer', overflow: 'hidden', height: '100%' }}>
                        <div
                            onClick={() => navigate(form.path)}
                            style={{
                                padding: '24px',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: `${form.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '20px',
                                color: form.color
                            }}>
                                <form.icon size={24} />
                            </div>

                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>{form.title}</h3>
                            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', flex: 1 }}>{form.description}</p>

                            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#b08d57', fontSize: '12px', fontWeight: '700' }}>
                                OPEN FORM <span style={{ fontSize: '16px' }}>→</span>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};

export default FormsHub;
