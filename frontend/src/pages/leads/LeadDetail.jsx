import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, User, Phone, Mail, Award, Truck, ClipboardList,
    CheckCircle2, Printer, Calendar, Clock, ArrowRight, Shield, Car
} from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioGrid,
    PortfolioButton,
    PortfolioBackButton
} from '../../components/PortfolioComponents';

const LeadDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLead();
    }, [id]);

    const fetchLead = async () => {
        try {
            const res = await api.get(`/forms/leads/api/list/${id}/`);
            setLead(res.data);
        } catch (err) {
            console.error('Error fetching lead', err);
        } finally {
            setLoading(false);
        }
    };

    const convertToJobCard = async () => {
        const confirmTransfer = window.confirm(`Confirm transfer to Service Advisor for "${lead.interested_service}"?`);
        if (confirmTransfer) {
            try {
                navigate('/job-cards/create', {
                    state: {
                        customer_name: lead.customer_name,
                        phone_number: lead.phone,
                        car_type: lead.vehicle_node?.vehicle_type || '',
                        vin: lead.vehicle_node?.vin || lead.vehicle_node?.registration_number || '',
                        brand: lead.vehicle_node?.brand || '',
                        model: lead.vehicle_node?.model || '',
                        service: lead.interested_service
                    }
                });
            } catch (err) {
                alert('Transition failed');
            }
        }
    };

    const schedulePickAndDrop = () => {
        navigate('/pick-drop/create', {
            state: {
                customer_name: lead.customer_name,
                phone: lead.phone,
                vehicle_details: ''
            }
        });
    };

    if (loading) return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--gold)' }}>
                Retrieving Lead Dossier...
            </div>
        </PortfolioPage>
    );

    if (!lead) return (
        <PortfolioPage>
            <div style={{ padding: '50px', textAlign: 'center', color: 'var(--cream)' }}>Lead Not Found</div>
        </PortfolioPage>
    );

    return (
        <PortfolioPage breadcrumb="SALES PIPELINE // OPPORTUNITY DOSSIER">
            <PortfolioBackButton onClick={() => navigate('/leads')} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
                <PortfolioTitle
                    subtitle={`ASSET ID: #${lead.id} // VECTOR: ${lead.source?.toUpperCase()}`}
                >
                    {lead.customer_name}
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <PortfolioButton variant="glass" onClick={() => window.print()}>
                        <Printer size={16} /> ARCHIVE.print
                    </PortfolioButton>
                    <PortfolioButton variant="gold" onClick={convertToJobCard}>
                        <ClipboardList size={16} /> INITIATEjc.engine
                    </PortfolioButton>
                </div>
            </div>

            <PortfolioGrid columns="2fr 1fr">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <PortfolioCard style={{ padding: '40px', background: 'rgba(0,0,0,0.3)' }}>
                        <div className="telemetry-grid" style={{ zIndex: 0, opacity: 0.05 }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(176,141,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={14} color="var(--gold)" />
                                </div>
                                <span style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>Identity Profile</span>
                            </div>
                            <PortfolioGrid columns="1fr 1fr" gap="40px">
                                <InfoItem label="Legal Name" value={lead.customer_name} large />
                                <InfoItem label="Acquisition Source" value={lead.source} />
                            </PortfolioGrid>
                            <div style={{ margin: '40px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }} />
                            <PortfolioGrid columns="1fr 1fr" gap="40px">
                                <InfoItem label="Communication Vector" value={lead.phone} icon={<Phone size={14} />} />
                                <InfoItem label="Digital Identifier" value={lead.email || 'UNIDENTIFIED'} icon={<Mail size={14} />} />
                            </PortfolioGrid>
                        </div>
                    </PortfolioCard>



                    <PortfolioCard style={{ padding: '40px', background: 'rgba(0,0,0,0.3)' }}>
                        <div className="telemetry-grid" style={{ zIndex: 0, opacity: 0.05 }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(176,141,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Award size={14} color="var(--gold)" />
                                </div>
                                <span style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>Service Intent</span>
                            </div>
                            <PortfolioGrid columns="1fr 1fr" gap="40px">
                                <InfoItem label="Target Operational Node" value={lead.interested_service} highlight />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <label style={{ fontSize: '8px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.5 }}>CLASSIFICATION</label>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '6px 20px',
                                        background: 'rgba(176, 141, 87, 0.08)',
                                        color: 'var(--gold)',
                                        borderRadius: '30px',
                                        fontSize: '10px',
                                        fontWeight: '900',
                                        letterSpacing: '2px',
                                        alignSelf: 'flex-start',
                                        border: '1px solid rgba(176, 141, 87, 0.2)'
                                    }}>
                                        {lead.status?.replace('_', ' ')}
                                    </div>
                                </div>
                            </PortfolioGrid>
                            <div style={{ marginTop: '40px', padding: '30px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <InfoItem label="Strategic Narrative" value={lead.notes || 'No extensive manual logs found for this asset.'} long />
                            </div>
                        </div>
                    </PortfolioCard>

                    {lead.vehicle_details && (
                        <PortfolioCard>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', color: 'var(--gold)' }}>
                                <Car size={18} />
                                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>Vehicle Registry Node</span>
                            </div>
                            <PortfolioGrid columns="1fr 1fr 1fr">
                                <InfoItem label="Vin / Chassis" value={lead.vehicle_details.vin} highlight />
                                <InfoItem label="Registration" value={lead.vehicle_details.registration_number} />
                                <InfoItem label="Brand / Model" value={`${lead.vehicle_details.brand} ${lead.vehicle_details.model}`} />
                            </PortfolioGrid>
                            <div style={{ margin: '20px 0', borderBottom: '1px solid rgba(232, 230, 227, 0.05)' }} />
                            <PortfolioGrid columns="1fr 1fr 1fr">
                                <InfoItem label="Color" value={lead.vehicle_details.color} />
                                <InfoItem label="Year" value={lead.vehicle_details.year} />
                                <InfoItem label="Owner" value={lead.vehicle_details.customer_name || 'N/A'} />
                            </PortfolioGrid>
                        </PortfolioCard>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <PortfolioCard>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', color: 'var(--gold)' }}>
                            <Clock size={18} />
                            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>Timeline</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '17px', top: '10px', bottom: '10px', width: '2px', background: 'rgba(232, 230, 227, 0.1)' }} />

                            <TimelineItem
                                icon={<CheckCircle2 size={16} />}
                                title="Lead Captured"
                                subtitle={new Date(lead.created_at).toLocaleString()}
                                done
                            />
                            <TimelineItem
                                icon={<User size={16} />}
                                title="Advisor Assignment"
                                subtitle="Pending Confirmation"
                                active
                            />
                            <TimelineItem
                                icon={<ClipboardList size={16} />}
                                title="Job Card Creation"
                                subtitle="Not Started"
                            />
                        </div>
                    </PortfolioCard>

                    <PortfolioCard>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', color: 'var(--gold)' }}>
                            <Truck size={18} />
                            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>Logistics</span>
                        </div>
                        <p style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', lineHeight: '1.6', marginBottom: '25px' }}>
                            Schedule vehicle pickup/drop-off services for this client.
                        </p>
                        <PortfolioButton variant="secondary" onClick={schedulePickAndDrop} style={{ width: '100%', justifyContent: 'center' }}>
                            <Truck size={16} style={{ marginRight: '10px' }} /> Schedule Logistics
                        </PortfolioButton>
                    </PortfolioCard>
                </div>
            </PortfolioGrid>

        </PortfolioPage >
    );
};

const InfoItem = ({ label, value, icon, large, highlight, long }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label style={{ fontSize: '8px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.5 }}>{label}</label>
        <div style={{
            fontSize: large ? '32px' : '16px',
            fontFamily: large || highlight ? 'var(--font-serif)' : 'inherit',
            fontWeight: large || highlight ? '300' : '400',
            color: highlight ? 'var(--gold)' : 'var(--cream)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            lineHeight: long ? '1.8' : '1.2'
        }}>
            {icon && <span style={{ opacity: 0.4 }}>{icon}</span>}
            {value}
        </div>
    </div>
);

const TimelineItem = ({ icon, title, subtitle, done, active }) => (
    <div style={{ display: 'flex', gap: '15px', position: 'relative', zIndex: 1 }}>
        <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: done ? 'var(--gold)' : active ? 'rgba(176, 141, 87, 0.2)' : 'var(--bg-primary)',
            border: active ? '1px solid var(--gold)' : done ? 'none' : '1px solid rgba(232, 230, 227, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: done ? '#000' : active ? 'var(--gold)' : 'rgba(232, 230, 227, 0.3)',
            flexShrink: 0
        }}>
            {icon}
        </div>
        <div style={{ opacity: done || active ? 1 : 0.4, paddingTop: '2px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--cream)' }}>{title}</div>
            <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.5)', marginTop: '2px' }}>{subtitle}</div>
        </div>
    </div>
);

export default LeadDetail;
