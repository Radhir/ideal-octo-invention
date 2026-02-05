import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import PrintHeader from '../../components/PrintHeader';
import { ArrowLeft, User, Phone, Mail, Award, Calendar, Truck, ClipboardList, CheckCircle2, Printer } from 'lucide-react';

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
        // Logic to simulate transfer to Service Advisor and creation of Job Card
        const confirmTransfer = window.confirm(`Confirm transfer to Service Advisor for "${lead.interested_service}"?`);
        if (confirmTransfer) {
            try {
                // Here we would typically hit an endpoint to create a job card from lead
                // For demonstration, we'll navigate to Job Card create with pre-filled state
                navigate('/job-cards/create', {
                    state: {
                        customer_name: lead.customer_name,
                        phone_number: lead.phone,
                        car_type: '',
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

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
    if (!lead) return <div style={{ padding: '50px', textAlign: 'center' }}>Lead Not Found</div>;

    return (
        <div style={{ padding: '30px 20px' }}>
            <PrintHeader title="Lead Detail" />
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button
                        onClick={() => navigate('/leads')}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '12px', cursor: 'pointer', color: '#fff' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', margin: 0 }}>Lead Detail</h1>
                        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>ID: #{lead.id} | Source: {lead.source}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => window.print()}
                        className="glass-card"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '10px 20px', borderRadius: '10px' }}
                    >
                        <Printer size={18} /> Print Estimate
                    </button>
                    <button onClick={schedulePickAndDrop} className="glass-card" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Truck size={18} /> Pick & Drop
                    </button>
                    <button onClick={convertToJobCard} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ClipboardList size={18} /> Convert to Job Card
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <GlassCard style={{ padding: '30px' }}>
                    <h3 style={{ color: '#b08d57', marginBottom: '20px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={18} /> Customer Information
                    </h3>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{lead.customer_name}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '40px' }}>
                            <div>
                                <label style={labelStyle}>Phone</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Phone size={14} color="#94a3b8" /> {lead.phone}
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Email</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Mail size={14} color="#94a3b8" /> {lead.email || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard style={{ padding: '30px' }}>
                    <h3 style={{ color: '#b08d57', marginBottom: '20px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Award size={18} /> Interest & Notes
                    </h3>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        <div>
                            <label style={labelStyle}>Interested Service</label>
                            <div style={{ fontWeight: '700', color: '#10b981' }}>{lead.interested_service}</div>
                        </div>
                        <div>
                            <label style={labelStyle}>Status</label>
                            <span style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '11px',
                                fontWeight: '800',
                                background: lead.status === 'NEW' ? '#3b82f622' : '#f59e0b22',
                                color: lead.status === 'NEW' ? '#3b82f6' : '#f59e0b',
                                textTransform: 'uppercase'
                            }}>{lead.status}</span>
                        </div>
                        <div>
                            <label style={labelStyle}>Admin Notes</label>
                            <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8', lineHeight: '1.5' }}>
                                {lead.notes || 'No notes available.'}
                            </p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            <div style={{ marginTop: '30px' }}>
                <GlassCard style={{ padding: '30px' }}>
                    <h3 style={{ color: '#b08d57', marginBottom: '20px', fontSize: '1.1rem' }}>Workflow Timeline</h3>
                    <div style={{ display: 'flex', gap: '40px' }}>
                        <TimelineStep done icon={<CheckCircle2 size={16} />} title="Lead Captured" subtitle={new Date(lead.created_at).toLocaleString()} />
                        <TimelineStep icon={<User size={16} />} title="Assigned to Advisor" subtitle="Pending Confirmation" />
                        <TimelineStep icon={<ClipboardList size={16} />} title="Job Card Created" subtitle="Not Started" />
                        <TimelineStep icon={<Truck size={16} />} title="Pick & Drop" subtitle="Not Scheduled" />
                    </div>
                </GlassCard>
            </div>
            <style>{`
                @media print {
                    body { background: #fff !important; color: #000 !important; }
                    .glass-card { border: 1px solid #eee !important; box-shadow: none !important; background: #fff !important; color: #000 !important; }
                    button, header > div:last-child { display: none !important; }
                    h1 { color: #b08d57 !important; }
                }
            `}</style>
        </div>
    );
};

const TimelineStep = ({ icon, title, subtitle, done }) => (
    <div style={{ display: 'flex', gap: '15px', opacity: done ? 1 : 0.4 }}>
        <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: done ? '#b08d57' : 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: done ? '#000' : '#94a3b8'
        }}>
            {icon}
        </div>
        <div>
            <div style={{ fontSize: '14px', fontWeight: '700' }}>{title}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{subtitle}</div>
        </div>
    </div>
);

const labelStyle = {
    display: 'block',
    fontSize: '11px',
    color: '#94a3b8',
    marginBottom: '5px',
    textTransform: 'uppercase',
    fontWeight: '600'
};

export default LeadDetail;
