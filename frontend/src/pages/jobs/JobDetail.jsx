import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import {
    Printer, FileText, ShieldCheck,
    CheckCircle2, PenTool, Clock, Package,
    User, Smartphone, MapPin, Hash, History, X,
    ChevronRight, Shield, Car, Briefcase, Activity
} from 'lucide-react';
import JobWorkflow from './JobWorkflow';
import PrintHeader from '../../components/PrintHeader';
import SignaturePad from '../../components/SignaturePad';
import { useState, useEffect } from 'react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioGrid,
    PortfolioButton,
    PortfolioBackButton,
    PortfolioDetailBox,
    PortfolioStats
} from '../../components/PortfolioComponents';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            const res = await api.get(`/api/job-cards/api/jobs/${id}/`);
            setJob(res.data);
        } catch (err) {
            console.error('Error fetching job', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await api.get(`/api/job-cards/api/jobs/?vin=${job.vin}`);
            setHistory(res.data.filter(h => h.id !== job.id));
            setShowHistory(true);
        } catch (err) {
            console.error('Error fetching history', err);
        }
    };

    const advanceWorkflow = async () => {
        try {
            const res = await api.post(`/api/job-cards/api/jobs/${id}/advance_status/`);
            await fetchJob();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to advance workflow');
        }
    };

    const generateInvoice = async () => {
        try {
            const res = await api.post(`/api/job-cards/api/jobs/${id}/create_invoice/`);
            alert(`Invoice ${res.data.invoice_number} generated!`);
            await fetchJob();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to generate invoice');
        }
    };

    const handleWorkshopPrint = () => {
        const printWindow = window.open('', '_blank');
        const content = `
            <html>
                <head>
                    <title>WORKSHOP COPY - ${job.job_card_number}</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a1a; }
                        .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
                        .job-no { font-size: 24px; font-weight: 800; }
                        .workshop-label { background: #000; color: #fff; padding: 5px 15px; font-size: 12px; font-weight: 900; }
                        .section { margin-bottom: 30px; }
                        .section-title { font-size: 14px; font-weight: 900; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px; }
                        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                        .item label { font-size: 10px; color: #666; text-transform: uppercase; display: block; }
                        .item value { font-size: 16px; font-weight: 700; }
                        .description { white-space: pre-wrap; background: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #eee; }
                        @media print { .no-print { display: none; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div>
                            <div class="job-no">JOB #${job.job_card_number}</div>
                            <div style="font-size: 14px; margin-top: 5px;">ELITE SHINE WORKSHOP COPY</div>
                        </div>
                        <div class="workshop-label">PRODUCTION ONLY</div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Vehicle Technical Data</div>
                        <div class="grid">
                            <div class="item"><label>Make / Model</label><value>${job.brand} ${job.model} (${job.year})</value></div>
                            <div class="item"><label>Plate Number</label><value>${job.plate_emirate} ${job.plate_code} ${job.registration_number}</value></div>
                            <div class="item"><label>VIN / Chassis</label><value>${job.vin}</value></div>
                            <div class="item"><label>Odometer</label><value>${job.kilometers} KM</value></div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Production Details</div>
                        <div class="grid">
                            <div class="item"><label>Customer Name</label><value>${job.customer_name}</value></div>
                            <div class="item"><label>Assigned Bay</label><value>${job.assigned_bay || 'N/A'}</value></div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Scope of Work</div>
                        <div class="description">${job.job_description}</div>
                    </div>

                    <div style="margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 20px; font-size: 10px; color: #999;">
                        Generated on ${new Date().toLocaleString()} | Secure Internal Document | No Financial Content
                    </div>

                    <script>window.print();</script>
                </body>
            </html>
        `;
        printWindow.document.write(content);
        printWindow.document.close();
    };

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)', letterSpacing: '2px', fontWeight: '800', textAlign: 'center', marginTop: '100px' }}>DECODING ASSET DOSSIER...</div></PortfolioPage>;
    if (!job) return <PortfolioPage><div style={{ color: 'var(--cream)', textAlign: 'center', marginTop: '100px' }}>ARCHIVE NOT FOUND</div></PortfolioPage>;

    return (
        <PortfolioPage breadcrumb={`Operations / Job Dossier / ${job.job_card_number}`}>
            <PortfolioBackButton onClick={() => navigate('/job-cards/board')} />
            <PrintHeader title={`Job Card: ${job.job_card_number}`} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px' }}>
                <PortfolioTitle subtitle={`Authorized to ${job.title ? job.title + ' ' : ''}${job.customer_name} • ${job.brand} ${job.model}`}>
                    TECHNICAL DOSSIER
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <PortfolioButton
                        variant="secondary"
                        onClick={() => {
                            const link = `${window.location.protocol}//${window.location.host}/portal/${job.portal_token}`;
                            navigator.clipboard.writeText(link);
                            alert('Customer Portal Link copied!');
                        }}
                    >
                        <ShieldCheck size={16} /> SHARE PORTAL
                    </PortfolioButton>
                    <PortfolioButton
                        variant="secondary"
                        onClick={fetchHistory}
                    >
                        <History size={16} /> HISTORY
                    </PortfolioButton>
                    <PortfolioButton
                        variant="secondary"
                        onClick={handleWorkshopPrint}
                    >
                        <Hash size={16} /> WORKSHOP COPY
                    </PortfolioButton>
                    <PortfolioButton
                        variant="secondary"
                        onClick={() => window.open(`/job-cards/${job.id}/print`, '_blank')}
                    >
                        <Printer size={16} /> CLIENT COPY
                    </PortfolioButton>

                    {job.invoice ? (
                        <PortfolioButton variant="primary" onClick={() => navigate(`/invoices/${job.invoice.id}`)}>
                            <FileText size={16} /> VIEW INVOICE
                        </PortfolioButton>
                    ) : (
                        job.status === 'READY' && (
                            <PortfolioButton variant="primary" onClick={generateInvoice}>
                                GENERATE INVOICE
                            </PortfolioButton>
                        )
                    )}
                </div>
            </div>

            {/* Industrial Workflow Mission Control */}
            <div style={{ marginBottom: '60px' }}>
                <JobWorkflow
                    currentStatus={job.status}
                    onStatusChange={advanceWorkflow}
                    jobData={job}
                />
            </div>

            <PortfolioGrid columns="2fr 1fr">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                    {/* Primary Operations Card */}
                    <PortfolioCard>
                        <div style={cardHeaderStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gold)' }}>
                                <Briefcase size={18} />
                                <span style={cardTitleStyle}>OPERATIONS COMMAND</span>
                            </div>
                            {job.is_released ? (
                                <span style={badgeStyleSuccess}>RELEASED</span>
                            ) : (
                                <span style={badgeStyleWarning}>HELD FOR CLEARANCE</span>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
                            <PortfolioDetailBox label="Service Specifications">
                                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', lineHeight: '1.7', color: 'var(--cream)', whiteSpace: 'pre-line' }}>
                                    {job.job_description || 'No service parameters defined.'}
                                </div>
                            </PortfolioDetailBox>
                            {job.initial_inspection_notes && (
                                <PortfolioDetailBox label="Advisor Intelligence">
                                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '14px', lineHeight: '1.6', color: 'rgba(232, 230, 227, 0.6)', fontStyle: 'italic' }}>
                                        "{job.initial_inspection_notes}"
                                    </div>
                                </PortfolioDetailBox>
                            )}
                        </div>
                    </PortfolioCard>

                    <PortfolioGrid columns="1fr 1fr" gap="30px">
                        {/* Asset Parameters */}
                        <PortfolioCard>
                            <div style={cardHeaderStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gold)' }}>
                                    <Car size={18} />
                                    <span style={cardTitleStyle}>ASSET PARAMETERS</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <PortfolioInfoItem label="Registration" value={`${job.plate_emirate || ''} ${job.plate_code || ''} ${job.registration_number || ''}`} />
                                <PortfolioInfoItem label="Identification (VIN)" value={job.vin} />
                                <PortfolioInfoItem label="Operational Odometer" value={`${job.kilometers} KM`} />
                            </div>
                        </PortfolioCard>

                        {/* Custody & Logistics */}
                        <PortfolioCard>
                            <div style={cardHeaderStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gold)' }}>
                                    <User size={18} />
                                    <span style={cardTitleStyle}>ASSET CUSTODY</span>
                                </div>
                            </div>
                            {job.assigned_technician ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <PortfolioInfoItem label="Technical Lead" value={job.assigned_technician} />
                                    <PortfolioInfoItem label="Production Unit" value={job.assigned_bay || 'Unassigned'} />
                                    <PortfolioInfoItem
                                        label="Projected Delivery"
                                        value={job.estimated_timeline ? new Date(job.estimated_timeline).toLocaleString() : 'Scheduling...'}
                                        highlight={!!job.estimated_timeline}
                                    />
                                </div>
                            ) : (
                                <div style={{ color: 'rgba(232, 230, 227, 0.2)', fontSize: '13px', fontStyle: 'italic', padding: '10px', border: '1px dashed rgba(232, 230, 227, 0.1)', borderRadius: '8px' }}>
                                    Tech assignment pending...
                                </div>
                            )}
                        </PortfolioCard>
                    </PortfolioGrid>

                    {/* Authentication Card */}
                    <PortfolioCard>
                        <div style={cardHeaderStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gold)' }}>
                                <PenTool size={18} />
                                <span style={cardTitleStyle}>CLIENT AUTHENTICATION</span>
                            </div>
                        </div>
                        {job.signature_data ? (
                            <div style={signatureDisplayBox}>
                                <div style={{ position: 'relative' }}>
                                    <img src={job.signature_data} alt="Customer Signature" style={{ maxHeight: '100px', filter: 'contrast(1.2) invert(0.1)', opacity: 0.8 }} />
                                    <div style={{
                                        position: 'absolute', bottom: -20, left: 0, right: 0,
                                        fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase'
                                    }}>
                                        Digitally Verified
                                    </div>
                                </div>
                                <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.4)', marginTop: '30px', fontWeight: '500' }}>
                                    Timestamp: {new Date(job.updated_at).toLocaleString()}
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '25px', padding: '30px', background: 'rgba(0,0,0,0.2)', borderRadius: '16px' }}>
                                <p style={{ color: 'rgba(232, 230, 227, 0.5)', fontSize: '13px', textAlign: 'center', maxWidth: '400px', fontFamily: 'var(--font-serif)' }}>
                                    Asset reception signature is required to initiate technical operations.
                                </p>
                                <SignaturePad
                                    onSave={async (data) => {
                                        try {
                                            await api.patch(`/api/job-cards/api/jobs/${id}/`, { signature_data: data });
                                            setJob({ ...job, signature_data: data });
                                        } catch (err) {
                                            alert('Authentication failure');
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </PortfolioCard>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                    {/* Commercial Summary */}
                    <PortfolioCard style={{ borderLeft: '2px solid var(--gold)', background: 'linear-gradient(180deg, rgba(176,141,87,0.05) 0%, rgba(20,20,20,0) 100%)' }}>
                        <div style={cardHeaderStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gold)' }}>
                                <Shield size={18} />
                                <span style={cardTitleStyle}>COMMERCIAL SUMMARY</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={summaryRow}><span style={{ opacity: 0.5 }}>Net Valuation</span> <span>AED {parseFloat(job.total_amount).toLocaleString()}</span></div>
                            <div style={summaryRow}><span style={{ opacity: 0.5 }}>Taxation (5%)</span> <span>AED {parseFloat(job.vat_amount).toLocaleString()}</span></div>
                            <div style={{ ...summaryRow, borderTop: '1px solid rgba(232, 230, 227, 0.1)', paddingTop: '20px', marginTop: '10px' }}>
                                <span style={{ fontWeight: '600', color: 'var(--cream)', fontSize: '12px', letterSpacing: '1px' }}>TOTAL CONTRACT</span>
                                <span style={{ fontSize: '24px', fontWeight: '400', color: 'var(--gold)', fontFamily: 'var(--font-serif)' }}>AED {parseFloat(job.net_amount).toLocaleString()}</span>
                            </div>
                        </div>
                    </PortfolioCard>

                    {/* Quality Protocols */}
                    <PortfolioCard>
                        <div style={cardHeaderStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gold)' }}>
                                <Activity size={18} />
                                <span style={cardTitleStyle}>QUALITY PROTOCOLS</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <QCItem label="Pre-Operation Validation" checked={job.pre_work_head_sign_off} />
                            <QCItem label="Technical Execution OK" checked={job.post_work_head_sign_off} />
                            <QCItem label="Quality Assurance Check" checked={job.qc_sign_off} />
                            <QCItem label="Operational Clearance" checked={job.floor_incharge_sign_off} />
                        </div>
                    </PortfolioCard>

                    <div style={{ textAlign: 'center', padding: '20px', borderRadius: '20px', background: 'rgba(232, 230, 227, 0.01)', border: '1px solid rgba(232, 230, 227, 0.05)' }}>
                        <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(232, 230, 227, 0.3)', marginBottom: '5px', fontWeight: '800' }}>Registry Blockchain Hash</div>
                        <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(232, 230, 227, 0.2)' }}>
                            {job.portal_token?.substring(0, 16).toUpperCase()}...-PORTAL-AUTH
                        </div>
                    </div>
                </div>
            </PortfolioGrid>

            {/* History Modal */}
            {showHistory && (
                <div style={modalOverlayStyle}>
                    <PortfolioCard style={{ width: '90%', maxWidth: '800px', background: '#0a0a0a', border: '1px solid var(--gold)', boxShadow: '0 20px 80px rgba(0,0,0,0.8)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                            <h2 style={{ color: 'var(--gold)', margin: 0, fontFamily: 'var(--font-serif)', fontSize: '24px' }}>Asset Service Archive</h2>
                            <button onClick={() => setShowHistory(false)} style={closeBtnStyle}><X size={20} /></button>
                        </div>
                        <div style={{ maxHeight: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {history.length === 0 ? (
                                <div style={{ color: 'rgba(232, 230, 227, 0.3)', textAlign: 'center', padding: '60px', fontFamily: 'var(--font-serif)' }}>
                                    NO RECORDED SERVICE HISTORY FOR THIS IDENTIFICATION.
                                </div>
                            ) : history.map(h => (
                                <div key={h.id} style={historyItemStyle} onClick={() => { setShowHistory(false); navigate(`/jobs/${h.id}`); }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '15px', fontWeight: '400', color: 'var(--cream)', fontFamily: 'var(--font-serif)', marginBottom: '5px' }}>
                                                {h.job_card_number} — {new Date(h.date).toLocaleDateString()}
                                            </div>
                                            <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.4)', textTransform: 'uppercase' }}>
                                                {h.job_description?.substring(0, 80)}...
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ color: 'var(--gold)', fontWeight: '800', fontSize: '14px' }}>AED {h.net_amount}</div>
                                            <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.3)', textTransform: 'uppercase', marginTop: '4px' }}>{h.status_display}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </PortfolioCard>
                </div>
            )}
        </PortfolioPage>
    );
};

// --- Sub-components & Styles ---

const PortfolioInfoItem = ({ label, value, highlight }) => (
    <div>
        <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', fontWeight: '800' }}>{label}</div>
        <div style={{ fontSize: '15px', fontWeight: highlight ? '700' : '400', color: highlight ? 'var(--gold)' : 'var(--cream)', fontFamily: 'var(--font-serif)' }}>{value || 'N/A'}</div>
    </div>
);

const QCItem = ({ label, checked }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '4px',
            border: `1px solid ${checked ? 'var(--gold)' : 'rgba(232, 230, 227, 0.1)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: checked ? 'var(--gold)' : 'transparent',
            transition: 'all 0.3s'
        }}>
            {checked && <CheckCircle2 size={12} color="#000" />}
        </div>
        <span style={{ fontSize: '13px', fontWeight: '400', color: checked ? 'var(--cream)' : 'rgba(232, 230, 227, 0.3)', fontFamily: 'var(--font-serif)' }}>{label}</span>
    </div>
);

const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '1px solid rgba(232, 230, 227, 0.05)',
    paddingBottom: '15px'
};

const cardTitleStyle = {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontWeight: '800'
};

const badgeStyleSuccess = {
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: '800',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    letterSpacing: '1px'
};

const badgeStyleWarning = {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#f43f5e',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: '800',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    letterSpacing: '1px'
};

const summaryRow = { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)' };

const signatureDisplayBox = {
    textAlign: 'center',
    background: '#fff',
    padding: '30px',
    borderRadius: '12px',
    border: '1px solid rgba(232, 230, 227, 0.1)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '150px'
};

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
};

const closeBtnStyle = {
    background: 'none',
    border: 'none',
    color: 'rgba(232, 230, 227, 0.5)',
    cursor: 'pointer',
    transition: 'color 0.2s'
};

const historyItemStyle = {
    padding: '25px',
    background: 'rgba(232, 230, 227, 0.03)',
    border: '1px solid rgba(232, 230, 227, 0.08)',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginBottom: '5px'
};

export default JobDetail;
