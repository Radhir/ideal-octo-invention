import {
    PortfolioPage, PortfolioTitle, PortfolioButton,
    PortfolioInput, PortfolioSelect, PortfolioTextarea
} from '../../components/PortfolioComponents';

const VEHICLE_PANELS = [
    'Front Bumper', 'Hood', 'Grille', 'Front Windshield',
    'Roof', 'Rear Windshield', 'Trunk/Tailgate', 'Rear Bumper',
    'Driver Front Door', 'Driver Rear Door', 'Driver Front Fender', 'Driver Rear Quarter',
    'Passenger Front Door', 'Passenger Rear Door', 'Passenger Front Fender', 'Passenger Rear Quarter'
];

const PLATE_EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah', 'Umm Al Quwain', 'Ras Al Khaimah'];
const PLATE_CATEGORIES = ['Private', 'Public', 'Commercial', 'Export', 'Trade'];

const JobCardBuilder = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Core State
    const [formData, setFormData] = useState({
        title: 'Mr',
        customer_name: '',
        phone: '',
        address: '',
        registration_number: '',
        plate_emirate: 'Dubai',
        plate_category: 'Private',
        vin: '',
        brand: '',
        model: '',
        year: new Date().getFullYear().toString(),
        color: '',
        kilometers: '',
        job_description: '',
        service_advisor: '',
        date: new Date().toISOString().split('T')[0],
        status: 'RECEPTION'
    });

    const [selectedServices, setSelectedServices] = useState([]);
    const [inspectionPhotos, setInspectionPhotos] = useState({}); // { panelName: { file: File, preview: string } }
    const [searchQuery, setSearchQuery] = useState('');
    const [availableServices, setAvailableServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [showServiceDropdown, setShowServiceDropdown] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Load Initial Data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [servicesRes, usersRes] = await Promise.all([
                    api.get('/forms/job-cards/api/services/'),
                    api.get('/api/auth/users/')
                ]);
                setAvailableServices(servicesRes.data);
                setUsers(usersRes.data);
            } catch (err) {
                console.error('Error loading builder data', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Search Logic
    useEffect(() => {
        if (!searchQuery) {
            setFilteredServices([]);
            return;
        }
        const filtered = availableServices.filter(s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 10);
        setFilteredServices(filtered);
    }, [searchQuery, availableServices]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addService = (service) => {
        if (selectedServices.find(s => s.id === service.id)) return;
        setSelectedServices(prev => [...prev, {
            ...service,
            qty: 1,
            discount: 0
        }]);
        setSearchQuery('');
        setShowServiceDropdown(false);
    };

    const removeService = (id) => {
        setSelectedServices(prev => prev.filter(s => s.id !== id));
    };

    const handlePhotoUpload = (panel, file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setInspectionPhotos(prev => ({
                ...prev,
                [panel]: { file, preview: reader.result }
            }));
        };
        if (file) reader.readAsDataURL(file);
    };

    const calculateSubtotal = () => {
        return selectedServices.reduce((sum, s) => sum + (parseFloat(s.price) * s.qty), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const currentSubtotal = calculateSubtotal();
            const vat = currentSubtotal * 0.05;
            const net = currentSubtotal + vat;
            const jcNum = `JC-${Date.now().toString().slice(-6)}`;

            const payload = {
                ...formData,
                job_card_number: jcNum,
                total_amount: currentSubtotal.toFixed(2),
                vat_amount: vat.toFixed(2),
                net_amount: net.toFixed(2),
                job_description: formData.job_description + '\n\nSelected Services:\n' +
                    selectedServices.map(s => `- ${s.name} (AED ${s.price})`).join('\n')
            };

            const res = await api.post('/forms/job-cards/api/jobs/', payload);
            const jobId = res.data.id;

            // Upload Photos
            const photoPromises = Object.entries(inspectionPhotos).map(([panel, data]) => {
                const photoFormData = new FormData();
                photoFormData.append('job_card', jobId);
                photoFormData.append('image', data.file);
                photoFormData.append('panel_name', panel);
                photoFormData.append('caption', `Inspection: ${panel}`);
                return api.post('/forms/job-cards/api/photos/', photoFormData);
            });

            await Promise.all(photoPromises);

            alert('Job Card Created and Synced to Workshop Diary!');
            navigate(`/job-cards/${jobId}`);
        } catch (err) {
            console.error('Error saving job card', err);
            alert('Failed to save. Check console for details.');
        } finally {
            setIsSaving(false);
        }
    };

    const [showPreview, setShowPreview] = useState(false);

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)' }}>INITIALIZING COMMAND CENTER...</div></PortfolioPage>;

    return (
        <PortfolioPage breadcrumb="Operations / Job Cards / Create">
            {showPreview && (
                <div style={modalOverlayStyle}>
                    <div style={ticketModalStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ color: 'var(--gold)', margin: 0, fontFamily: 'var(--font-serif)' }}>LIVE TICKET PREVIEW</h2>
                            <button onClick={() => setShowPreview(false)} style={closeBtnStyle}><X size={20} /></button>
                        </div>

                        <div style={ticketBodyStyle}>
                            <div style={ticketHeaderStyle}>
                                <div style={signatureLineStyle}></div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '24px', fontFamily: 'var(--font-serif)' }}>ELITE SHINE</h3>
                                    <p style={{ margin: 0, fontSize: '10px', opacity: 0.6, fontWeight: '700' }}>PREMIUM AUTO DETAILING</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '18px', fontWeight: '900' }}>#{`JC-NEW`}</div>
                                    <div style={{ fontSize: '10px' }}>{formData.date}</div>
                                </div>
                            </div>

                            <div style={ticketSectionGrid}>
                                <div>
                                    <div style={ticketLabel}>CLIENT</div>
                                    <div style={ticketValue}>{formData.title} {formData.customer_name}</div>
                                    <div style={ticketValue}>{formData.phone}</div>
                                </div>
                                <div>
                                    <div style={ticketLabel}>VEHICLE</div>
                                    <div style={ticketValue}>{formData.brand} {formData.model} ({formData.year})</div>
                                    <div style={ticketValue}>{formData.plate_emirate} {formData.plate_code} {formData.registration_number}</div>
                                </div>
                            </div>

                            <div style={{ marginTop: '20px' }}>
                                <div style={ticketLabel}>SERVICE COMMANDS</div>
                                {selectedServices.map(s => (
                                    <div key={s.id} style={ticketServiceRow}>
                                        <span>{s.name}</span>
                                        <span style={{ fontWeight: '700' }}>AED {s.price}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={ticketFooterStyle}>
                                <div style={{ flex: 1 }}>
                                    <div style={ticketLabel}>ADVISOR NOTES</div>
                                    <div style={{ fontSize: '11px', lineHeight: '1.4' }}>{formData.job_description || 'No additional notes.'}</div>
                                </div>
                                <div style={{ width: '150px', textAlign: 'right' }}>
                                    <div style={summaryRow}><span style={summaryLabel}>VAT (5%)</span> <span>AED {(calculateSubtotal() * 0.05).toFixed(2)}</span></div>
                                    <div style={{ ...summaryRow, color: 'var(--gold)', fontWeight: '900', fontSize: '16px' }}>
                                        <span>TOTAL</span> <span>AED {(calculateSubtotal() * 1.05).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                            <PortfolioButton onClick={handleSubmit} style={{ flex: 1 }}>
                                {isSaving ? 'Processing...' : 'CONFIRM & SYNC'}
                            </PortfolioButton>
                            <PortfolioButton variant="secondary" onClick={() => setShowPreview(false)}>
                                BACK
                            </PortfolioButton>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Initialize vehicle intake and capture technical inspection details.">
                    BUILD JOB
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                    <PortfolioButton onClick={() => setShowPreview(true)} variant="secondary">
                        <Printer size={18} style={{ marginRight: '10px' }} /> PREVIEW TICKET
                    </PortfolioButton>
                    <PortfolioButton onClick={handleSubmit} variant="gold">
                        {isSaving ? 'SYNCING...' : <><Save size={18} style={{ marginRight: '10px' }} /> INITIALIZE FLOW</>}
                    </PortfolioButton>
                </div>
            </div>

            <div style={gridStyle}>
                {/* Left Column: Form & Services */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div style={glassCardStyle}>
                        <div style={sectionHeaderStyle}><User size={18} color="var(--gold)" /> <span>RECEPTION INFO</span></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                            <PortfolioSelect label="Salutation" name="title" value={formData.title} onChange={handleInputChange}>
                                <option value="Mr">Mr.</option>
                                <option value="Mrs">Mrs.</option>
                                <option value="Ms">Ms.</option>
                                <option value="Dr">Dr.</option>
                            </PortfolioSelect>
                            <PortfolioInput label="Customer Full Name" name="customer_name" placeholder="Contact Name" value={formData.customer_name} onChange={handleInputChange} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <PortfolioInput label="Contact Number" name="phone" placeholder="+971..." value={formData.phone} onChange={handleInputChange} required />
                            <PortfolioInput label="Digital Address" name="address" placeholder="Location/Emirate" value={formData.address} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div style={glassCardStyle}>
                        <div style={sectionHeaderStyle}><Car size={18} color="var(--gold)" /> <span>ASSET LOGISTICS</span></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                            <PortfolioSelect label="Emirate" name="plate_emirate" value={formData.plate_emirate} onChange={handleInputChange}>
                                {PLATE_EMIRATES.map(e => <option key={e} value={e}>{e}</option>)}
                            </PortfolioSelect>
                            <PortfolioSelect label="Category" name="plate_category" value={formData.plate_category} onChange={handleInputChange}>
                                {PLATE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </PortfolioSelect>
                            <PortfolioInput label="Plate Code" name="plate_code" placeholder="A" value={formData.plate_code} onChange={handleInputChange} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <PortfolioInput label="Plate Number" name="registration_number" placeholder="123456" value={formData.registration_number} onChange={handleInputChange} />
                            <PortfolioInput label="VIN / Chassis" name="vin" placeholder="VIN-EX-..." value={formData.vin} onChange={handleInputChange} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                            <PortfolioInput label="Brand" name="brand" placeholder="Make" value={formData.brand} onChange={handleInputChange} />
                            <PortfolioInput label="Model" name="model" placeholder="Class" value={formData.model} onChange={handleInputChange} />
                            <PortfolioInput label="Year" name="year" placeholder="2025" value={formData.year} onChange={handleInputChange} />
                            <PortfolioInput label="Color" name="color" placeholder="Finish" value={formData.color} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div style={glassCardStyle}>
                        <div style={sectionHeaderStyle}><ClipboardCheck size={18} color="var(--gold)" /> <span>SERVICE COMMANDS</span></div>
                        <div style={searchContainerStyle}>
                            <Search size={18} style={searchIconStyle} />
                            <input
                                type="text"
                                placeholder="Search premium services catalog..."
                                style={searchInputStyle}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setShowServiceDropdown(true)}
                            />
                            {showServiceDropdown && filteredServices.length > 0 && (
                                <div style={dropdownStyle}>
                                    {filteredServices.map(s => (
                                        <div key={s.id} style={dropdownItemStyle} onClick={() => addService(s)}>
                                            <div>
                                                <div style={{ fontWeight: '600', color: 'var(--cream)' }}>{s.name}</div>
                                                <div style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '1px' }}>{s.category_name}</div>
                                            </div>
                                            <div style={{ fontWeight: '800', color: '#fff' }}>AED {s.price}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={selectedListStyle}>
                            {selectedServices.map(s => (
                                <div key={s.id} style={selectedItemStyle}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--cream)' }}>{s.name}</div>
                                        <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.4)' }}>{s.category_name}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ fontWeight: '800', color: '#fff' }}>AED {s.price}</div>
                                        <button onClick={() => removeService(s.id)} style={trashBtnStyle}><X size={14} /></button>
                                    </div>
                                </div>
                            ))}
                            {selectedServices.length === 0 && <div style={emptyStateStyle}>No services selected. Utilize the search interface above.</div>}
                        </div>

                        <div style={summaryBoxStyle}>
                            <div style={summaryRow}><span style={summaryLabel}>Subtotal</span> <span>AED {calculateSubtotal().toFixed(2)}</span></div>
                            <div style={summaryRow}><span style={summaryLabel}>VAT (5%)</span> <span>AED {(calculateSubtotal() * 0.05).toFixed(2)}</span></div>
                            <div style={{ ...summaryRow, borderTop: '1px solid rgba(232, 230, 227, 0.1)', paddingTop: '15px', marginTop: '15px' }}>
                                <span style={{ ...summaryLabel, fontSize: '14px', color: 'var(--cream)' }}>Projected Total</span>
                                <span style={{ fontSize: '24px', fontWeight: '900', color: '#10b981', fontFamily: 'var(--font-serif)' }}>AED {(calculateSubtotal() * 1.05).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Inspection Gallery */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div style={glassCardStyle}>
                        <div style={sectionHeaderStyle}><Camera size={18} color="var(--gold)" /> <span>VISUAL INSPECTION (16 PANELS)</span></div>
                        <div style={inspectionGridStyle}>
                            {VEHICLE_PANELS.map(panel => (
                                <div key={panel} style={{
                                    ...panelCardStyle,
                                    borderColor: inspectionPhotos[panel] ? 'var(--gold)' : 'rgba(232, 230, 227, 0.1)'
                                }} onClick={() => {
                                    fileInputRef.current.panel = panel;
                                    fileInputRef.current.click();
                                }}>
                                    {inspectionPhotos[panel] ? (
                                        <img src={inspectionPhotos[panel].preview} alt={panel} style={panelImgStyle} />
                                    ) : (
                                        <div style={panelPlaceholderStyle}>
                                            <Camera size={16} />
                                            <span>{panel.toUpperCase()}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={(e) => handlePhotoUpload(fileInputRef.current.panel, e.target.files[0])}
                        />

                        <div style={{ marginTop: '40px' }}>
                            <PortfolioTextarea
                                label="INTERNAL ADVISOR NOTES"
                                name="job_description"
                                value={formData.job_description}
                                onChange={handleInputChange}
                                style={{ minHeight: '150px' }}
                                placeholder="Capture panel damages, pre-existing issues, and critical customer mandates..."
                            />
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <PortfolioSelect label="COMMANDING ADVISOR" name="service_advisor" value={formData.service_advisor} onChange={handleInputChange}>
                                <option value="">Select Professional Advisor...</option>
                                {users.filter(u => u.hr_profile).map(u => (
                                    <option key={u.hr_profile.id || u.id} value={u.hr_profile.id || u.id}>{u.full_name || u.first_name || u.username}</option>
                                ))}
                            </PortfolioSelect>
                        </div>
                    </div>
                </div>
            </div>
        </PortfolioPage>
    );
};

// Styles
const gridStyle = { display: 'grid', gridTemplateColumns: 'minmax(500px, 1.2fr) 1fr', gap: '40px', maxWidth: '1600px' };
const glassCardStyle = {
    padding: '35px',
    background: 'rgba(232, 230, 227, 0.03)',
    border: '1px solid rgba(232, 230, 227, 0.1)',
    borderRadius: '24px'
};
const sectionHeaderStyle = { display: 'flex', alignItems: 'center', gap: '15px', fontSize: '11px', fontWeight: '900', color: 'rgba(232, 230, 227, 0.5)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '30px' };
const searchContainerStyle = { position: 'relative', marginBottom: '25px' };
const searchInputStyle = { width: '100%', padding: '16px 16px 16px 48px', background: 'rgba(232, 230, 227, 0.05)', border: '1px solid rgba(232, 230, 227, 0.2)', borderRadius: '16px', color: '#fff', fontSize: '15px', outline: 'none' };
const searchIconStyle = { position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)' };
const dropdownStyle = { position: 'absolute', top: '100%', left: 0, width: '100%', background: '#0a0a0a', border: '1px solid rgba(232, 230, 227, 0.2)', borderRadius: '16px', marginTop: '10px', zIndex: 100, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' };
const dropdownItemStyle = { padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: '1px solid rgba(232, 230, 227, 0.05)' };
const selectedListStyle = { display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '120px' };
const selectedItemStyle = { padding: '15px 22px', background: 'rgba(232, 230, 227, 0.03)', border: '1px solid rgba(232, 230, 227, 0.08)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const emptyStateStyle = { textAlign: 'center', padding: '60px', color: 'rgba(232, 230, 227, 0.2)', fontSize: '14px' };
const summaryBoxStyle = { background: 'rgba(16, 185, 129, 0.03)', padding: '25px', borderRadius: '20px', marginTop: '30px', border: '1px solid rgba(16, 185, 129, 0.1)' };
const summaryRow = { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'rgba(232, 230, 227, 0.6)', marginBottom: '10px' };
const summaryLabel = { fontWeight: '500' };
const inspectionGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' };
const panelCardStyle = { aspectRatio: '1', borderRadius: '16px', background: 'rgba(232, 230, 227, 0.02)', border: '1.5px solid rgba(232, 230, 227, 0.1)', cursor: 'pointer', overflow: 'hidden', position: 'relative', transition: 'all 0.3s' };
const panelImgStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const panelPlaceholderStyle = { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'rgba(232, 230, 227, 0.3)', fontSize: '9px', fontWeight: '900', textAlign: 'center', padding: '10px' };
const trashBtnStyle = { background: 'rgba(244, 63, 94, 0.1)', border: 'none', color: '#f43f5e', padding: '8px', cursor: 'pointer', borderRadius: '8px' };

// Ticket Preview Styles
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '40px' };
const ticketModalStyle = { background: '#0a0a0a', border: '1px solid rgba(232, 230, 227, 0.1)', borderRadius: '30px', width: '100%', maxWidth: '700px', padding: '40px', boxShadow: '0 40px 100px rgba(0,0,0,0.8)' };
const closeBtnStyle = { background: 'rgba(232, 230, 227, 0.05)', border: 'none', color: 'var(--cream)', cursor: 'pointer', padding: '10px', borderRadius: '50%' };
const ticketBodyStyle = { background: '#fff', color: '#000', borderRadius: '20px', padding: '40px', position: 'relative', overflow: 'hidden', marginTop: '20px' };
const ticketHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'start', borderBottom: '2px solid #eee', paddingBottom: '30px', marginBottom: '30px' };
const signatureLineStyle = { position: 'absolute', top: 0, left: '0', width: '6px', height: '100%', background: '#b08d57' };
const ticketSectionGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' };
const ticketLabel = { fontSize: '10px', fontWeight: '900', color: '#999', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' };
const ticketValue = { fontSize: '14px', fontWeight: '700', color: '#222' };
const ticketServiceRow = { display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '12px 0', borderBottom: '1px solid #f0f0f0' };
const ticketFooterStyle = { marginTop: '30px', display: 'flex', gap: '30px', borderTop: '2px solid #eee', paddingTop: '30px' };

export default JobCardBuilder;
