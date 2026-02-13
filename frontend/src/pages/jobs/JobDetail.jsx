import {
    PortfolioPage, PortfolioTitle, PortfolioButton,
    PortfolioStats, PortfolioGrid, PortfolioCard,
    PortfolioDetailBox
} from '../../components/PortfolioComponents';
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
            await fetchJob();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to advance workflow');
        }
    };

    const generateInvoice = async () => {
        try {
            const res = await api.post(`/forms/job-cards/api/jobs/${id}/create_invoice/`);
            alert(`Invoice ${res.data.invoice_number} generated!`);
            await fetchJob();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to generate invoice');
        }
    };

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)' }}>RETRIEVING ASSET DOSSIER...</div></PortfolioPage>;
    if (!job) return <PortfolioPage>Job Not Found</PortfolioPage>;

    return (
        <PortfolioPage breadcrumb={`Operations / Job Cards / ${job.job_card_number}`}>
            <PrintHeader title={`Job Card: ${job.job_card_number}`} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle subtitle={`Registered to ${job.customer_name} • ${job.brand} ${job.model}`}>
                    JOB DOSSIER
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                    <PortfolioButton
                        variant="secondary"
                        onClick={() => {
                            const link = `${window.location.host}/portal/${job.portal_token}`;
                            navigator.clipboard.writeText(link);
                            alert('Customer Portal Link copied!');
                        }}
                    >
                        <ShieldCheck size={18} style={{ marginRight: '10px' }} /> SHARE PORTAL
                    </PortfolioButton>
                    <PortfolioButton
                        variant="secondary"
                        onClick={() => window.open(`/forms/utils/generate-pdf/JobCard/${id}/`, '_blank')}
                    >
                        <Printer size={18} style={{ marginRight: '10px' }} /> JOB TICKET
                    </PortfolioButton>

                    {job.invoice ? (
                        <PortfolioButton variant="gold" onClick={() => navigate(`/invoices/${job.invoice.id}`)}>
                            <FileText size={18} style={{ marginRight: '10px' }} /> VIEW INVOICE
                        </PortfolioButton>
                    ) : (
                        job.status === 'INVOICING_DELIVERY' && (
                            <PortfolioButton variant="gold" onClick={generateInvoice}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div style={glassCardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h3 style={sectionTitleStyle}>OPERATIONAL STATUS: {job.status_display.toUpperCase()}</h3>
                            {job.is_released ? (
                                <span style={badgeStyleSuccess}>RELEASED FOR PRODUCTION</span>
                            ) : (
                                <span style={badgeStyleWarning}>PENDING MANAGEMENT CLEARANCE</span>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            <PortfolioDetailBox label="PRIMARY COMPLAINTS / SERVICES">
                                {job.job_description || 'No complaints logged.'}
                            </PortfolioDetailBox>
                            <PortfolioDetailBox label="INTERNAL ADVISOR INTELLIGENCE">
                                {job.initial_inspection_notes || 'No internal intelligence available.'}
                            </PortfolioDetailBox>
                        </div>
                    </div>

                    <div style={glassCardStyle}>
                        <h3 style={sectionTitleStyle}>CUSTOMER AUTHORIZATION</h3>
                        {job.signature_data ? (
                            <div style={signatureDisplayBox}>
                                <img src={job.signature_data} alt="Customer Signature" style={{ maxHeight: '180px', filter: 'contrast(1.2)' }} />
                                <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.4)', marginTop: '15px', fontWeight: '800' }}>
                                    DIGITALLY AUTHENTICATED ON {new Date(job.updated_at).toLocaleDateString().toUpperCase()}
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '25px', padding: '40px' }}>
                                <p style={{ color: 'rgba(232, 230, 227, 0.5)', fontSize: '14px', textAlign: 'center', maxWidth: '400px' }}>
                                    Vehicle reception signature is mandatory to initiate the production workflow.
                                </p>
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
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        <div style={glassCardStyle}>
                            <h4 style={sectionTitleStyle}>ASSET ATTRIBUTES</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <InfoItem label="Registration" value={job.registration_number} />
                                <InfoItem label="Vin / Chassis" value={job.vin} />
                                <InfoItem label="Total Odometer" value={`${job.kilometers} KM`} />
                            </div>
                        </div>

                        <div style={glassCardStyle}>
                            <h4 style={sectionTitleStyle}>PRODUCTION ASSIGNMENT</h4>
                            {job.assigned_technician ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <InfoItem label="Assigned Technician" value={job.assigned_technician} />
                                    <InfoItem label="Workshop Bay" value={job.assigned_bay} />
                                    <InfoItem label="Production Deadline" value={job.estimated_timeline ? new Date(job.estimated_timeline).toLocaleString() : 'PENDING'} />
                                </div>
                            ) : (
                                <div style={{ color: 'rgba(232, 218, 206, 0.3)', fontSize: '13px', fontStyle: 'italic', padding: '10px' }}>
                                    Awaiting technical allocation...
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ ...glassCardStyle, background: 'rgba(176, 141, 87, 0.05)', borderColor: 'rgba(176, 141, 87, 0.2)' }}>
                        <h4 style={sectionTitleStyle}>FINANCIAL COMMAND</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={summaryRow}><span style={{ opacity: 0.6 }}>Subtotal (Net)</span> <span>AED {job.total_amount}</span></div>
                            <div style={summaryRow}><span style={{ opacity: 0.6 }}>VAT (5%)</span> <span>AED {job.vat_amount}</span></div>
                            <div style={{ ...summaryRow, borderTop: '1px solid rgba(232, 230, 227, 0.1)', paddingTop: '15px', marginTop: '10px' }}>
                                <span style={{ fontWeight: '800', color: 'var(--cream)' }}>GRAND TOTAL</span>
                                <span style={{ fontSize: '26px', fontWeight: '900', color: '#10b981', fontFamily: 'var(--font-serif)' }}>AED {job.net_amount}</span>
                            </div>
                        </div>
                    </div>

                    <div style={glassCardStyle}>
                        <h4 style={sectionTitleStyle}>QUALITY CONTROL</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <QCItem label="Pre-work Approval" checked={job.pre_work_head_sign_off} />
                            <QCItem label="Post-work Sign-off" checked={job.post_work_head_sign_off} />
                            <QCItem label="QC Final Inspection" checked={job.qc_sign_off} />
                            <QCItem label="Operations Head Release" checked={job.floor_incharge_sign_off} />
                        </div>
                    </div>
                </div>
            </PortfolioGrid>
        </PortfolioPage>
    );
};

const InfoItem = ({ label, value }) => (
    <div style={{ marginBottom: '5px' }}>
        <div style={{ fontSize: '10px', color: 'rgba(232, 230, 227, 0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--cream)' }}>{value || 'N/A'}</div>
    </div>
);

const QCItem = ({ label, checked }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '6px',
            border: `2px solid ${checked ? '#b08d57' : 'rgba(232, 230, 227, 0.1)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: checked ? '#b08d57' : 'transparent',
            transition: 'all 0.3s'
        }}>
            {checked && <CheckCircle2 size={14} color="#000" />}
        </div>
        <span style={{ fontSize: '13px', fontWeight: '600', color: checked ? 'var(--cream)' : 'rgba(232, 230, 227, 0.3)' }}>{label}</span>
    </div>
);

const glassCardStyle = {
    padding: '35px',
    background: 'rgba(232, 230, 227, 0.03)',
    border: '1px solid rgba(232, 230, 227, 0.1)',
    borderRadius: '24px'
};

const sectionTitleStyle = {
    fontSize: '11px',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    marginBottom: '30px',
    fontWeight: '900',
    letterSpacing: '2px'
};

const badgeStyleSuccess = { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '6px 16px', borderRadius: '30px', fontSize: '10px', fontWeight: '900', border: '1px solid rgba(16, 185, 129, 0.2)', letterSpacing: '1px' };
const badgeStyleWarning = { background: 'rgba(239, 68, 68, 0.1)', color: '#f43f5e', padding: '6px 16px', borderRadius: '30px', fontSize: '10px', fontWeight: '900', border: '1px solid rgba(239, 68, 68, 0.2)', letterSpacing: '1px' };
const summaryRow = { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'rgba(232, 230, 227, 0.6)' };
const signatureDisplayBox = { textAlign: 'center', background: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid rgba(232, 230, 227, 0.1)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)' };

export default JobDetail;
