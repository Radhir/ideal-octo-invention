import {
    PortfolioPage, PortfolioTitle, PortfolioButton,
    PortfolioInput, PortfolioSelect, PortfolioTextarea
} from '../../components/PortfolioComponents';
import {
    Save, Hash, Printer, User,
    Smartphone, MapPin, Search, X,
    Camera, ClipboardCheck, Car, History,
    CheckCircle2, Plus, Trash2, ArrowRight,
    Briefcase, FolderOpen, MessageSquare, Eye
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { VEHICLE_DATA } from '../../constants/vehicleData';
import { SERVICES_CATALOG } from '../../constants/services';

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
    const location = useLocation();
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
        plate_code: '',
        vin: '',
        brand: '',
        model: '',
        year: new Date().getFullYear().toString(),
        color: '',
        kilometers: '',
        job_description: '',
        service_advisor: '',
        date: new Date().toISOString().split('T')[0],
        status: 'RECEIVED',
        branch_id: ''
    });

    const [selectedServices, setSelectedServices] = useState([]);
    const [inspectionPhotos, setInspectionPhotos] = useState({}); // { panelName: { file: File, preview: string } }
    const [availableServices, setAvailableServices] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    // Service Selection State
    const [selectedCategory, setSelectedCategory] = useState('');
    const [serviceCategories, setServiceCategories] = useState([]);
    const [filteredServicesByCategory, setFilteredServicesByCategory] = useState([]);

    const [branches, setBranches] = useState([]);

    // Load Initial Data
    const [vehicleMap, setVehicleMap] = useState(VEHICLE_DATA);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Fetch Core Data in Parallel
                const [servicesRes, usersRes, branchesRes, brandsRes, modelsRes] = await Promise.all([
                    api.get('/forms/job-cards/api/services/'),
                    api.get('/api/auth/users/'),
                    api.get('/api/locations/branches/'),
                    api.get('/forms/masters/api/brands/').catch(() => ({ data: [] })),
                    api.get('/forms/masters/api/models/').catch(() => ({ data: [] }))
                ]);

                // Process Dynamic Registry
                if (brandsRes.data.length > 0) {
                    const dynamicMap = {};
                    const brands = brandsRes.data;
                    const models = modelsRes.data;

                    brands.forEach(brand => {
                        const brandModels = models
                            .filter(m => m.brand === brand.id || m.brand_name === brand.name)
                            .map(m => m.name);
                        dynamicMap[brand.name] = brandModels;
                    });

                    // Merge with static data to ensure no loss if API is partial, 
                    // or just use dynamic if comprehensive. For now, prefer dynamic but keep 'Other'.
                    if (!dynamicMap['Other']) dynamicMap['Other'] = ['Other'];
                    setVehicleMap(dynamicMap);
                }

                if (servicesRes.data.length > 0) {
                    setAvailableServices(servicesRes.data);
                    const categories = [...new Set(servicesRes.data.map(s => s.category_name))].filter(Boolean);
                    setServiceCategories(categories);
                } else {
                    console.log('API Service catalog empty, falling back to local constants');
                    // Transform SERVICES_CATALOG to match API structure
                    const fallbackServices = [];
                    Object.entries(SERVICES_CATALOG).forEach(([cat, services]) => {
                        services.forEach((s, idx) => {
                            fallbackServices.push({
                                id: Math.random() * 100000, // Temp ID for fallback
                                name: s.name,
                                price: s.price,
                                category_name: cat
                            });
                        });
                    });
                    setAvailableServices(fallbackServices);
                    setServiceCategories(Object.keys(SERVICES_CATALOG));
                }

                setUsers(usersRes.data);
                setBranches(branchesRes.data);

                // Populate from location state if available (transition from Lead)
                if (location.state) {
                    const s = location.state;
                    setFormData(prev => ({
                        ...prev,
                        customer_name: s.customer_name || prev.customer_name,
                        phone: s.phone_number || prev.phone,
                        vin: s.vin || prev.vin,
                        brand: s.brand || prev.brand,
                        model: s.model || prev.model,
                        job_description: s.service ? `CONVERTED FROM LEAD: Interested in ${s.service}` : prev.job_description,
                        branch_id: branchesRes.data.length > 0 ? branchesRes.data[0].id : prev.branch_id
                    }));
                } else if (branchesRes.data.length > 0) {
                    setFormData(prev => ({ ...prev, branch_id: branchesRes.data[0].id }));
                }
            } catch (err) {
                console.error('Error loading builder data, using local catalog', err);
                // ── FALLBACK: Load services from local constants ──
                const fallbackServices = [];
                Object.entries(SERVICES_CATALOG).forEach(([cat, services]) => {
                    services.forEach((s) => {
                        fallbackServices.push({
                            id: `local-${cat}-${s.name}`,
                            name: s.name,
                            price: s.price,
                            category_name: cat
                        });
                    });
                });
                setAvailableServices(fallbackServices);
                setServiceCategories(Object.keys(SERVICES_CATALOG));
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [location.state]);

    // Category Selection Logic
    useEffect(() => {
        if (!selectedCategory) {
            setFilteredServicesByCategory([]);
            return;
        }
        const filtered = availableServices.filter(s => s.category_name === selectedCategory);
        setFilteredServicesByCategory(filtered);
    }, [selectedCategory, availableServices]);

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
    };

    const removeService = (id) => {
        setSelectedServices(prev => prev.filter(s => s.id !== id));
    };

    const [activeCameraPanel, setActiveCameraPanel] = useState(null);
    const [activePanelForChoice, setActivePanelForChoice] = useState(null); // Panel waiting for source choice
    const [uploadPanel, setUploadPanel] = useState(null); // Explicit track for file upload
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);

    const handlePhotoUpload = (panel, file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setInspectionPhotos(prev => ({
                ...prev,
                [panel]: { file, preview: reader.result, comment: '' }
            }));
        };
        if (file) reader.readAsDataURL(file);
    };

    const updatePhotoComment = (panel, comment) => {
        setInspectionPhotos(prev => ({
            ...prev,
            [panel]: { ...prev[panel], comment }
        }));
    };

    const deletePhoto = (panel) => {
        setInspectionPhotos(prev => {
            const next = { ...prev };
            delete next[panel];
            return next;
        });
    };

    const startCamera = async (panel) => {
        console.log('Initializing camera for panel:', panel);
        setActiveCameraPanel(panel);
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('MediaDevices API not supported in this browser environment.');
            }
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error('Camera access failure:', err);
            alert(`SECURITY/ENVIRONMENT ERROR: ${err.message || 'Could not access camera'}`);
            setActiveCameraPanel(null);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setActiveCameraPanel(null);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current && activeCameraPanel) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');

            // Draw video frame to canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert to Blob/File
            canvas.toBlob((blob) => {
                const file = new File([blob], `${activeCameraPanel}.jpg`, { type: 'image/jpeg' });
                handlePhotoUpload(activeCameraPanel, file);
                stopCamera();
            }, 'image/jpeg', 0.9);
        }
    };

    const calculateSubtotal = () => {
        return selectedServices.reduce((sum, s) => sum + (parseFloat(s.price) * s.qty), 0);
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.customer_name || !formData.phone) {
            alert('CRITICAL DATA MISSING: Please ensure Client Name and Phone Number are populated.');
            return;
        }

        setIsSaving(true);
        try {
            const currentSubtotal = calculateSubtotal();
            const vat = currentSubtotal * 0.05;
            const net = currentSubtotal + vat;
            const jcNum = `JC-${Date.now().toString().slice(-6)}`;

            const payload = {
                // Reception Info
                title: formData.title,
                customer_name: formData.customer_name,
                phone: formData.phone,
                address: formData.address,

                // Vehicle Details
                registration_number: formData.registration_number,
                plate_emirate: formData.plate_emirate,
                plate_category: formData.plate_category,
                plate_code: formData.plate_code || '',
                vin: formData.vin,
                brand: formData.brand,
                model: formData.model,
                year: parseInt(formData.year) || new Date().getFullYear(),
                color: formData.color,
                kilometers: parseInt(formData.kilometers) || 0,

                // System Info
                job_card_number: jcNum,
                date: formData.date,
                status: 'RECEIVED',
                branch: parseInt(formData.branch_id) || (branches.length > 0 ? branches[0].id : 1),
                service_advisor: formData.service_advisor ? parseInt(formData.service_advisor) : null,

                // Financials
                total_amount: currentSubtotal.toFixed(2),
                vat_amount: vat.toFixed(2),
                net_amount: net.toFixed(2),

                // Descriptions
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
                photoFormData.append('caption', data.comment || `Inspection: ${panel}`);
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

    const fetchHistory = async () => {
        if (!formData.vin && !formData.phone) {
            alert('Enter VIN or Phone to fetch history');
            return;
        }
        try {
            const res = await api.get(`/forms/job-cards/api/jobs/?q=${formData.vin || formData.phone}`);
            setHistory(res.data.filter(j => j.id)); // Ensure we don't show current being built if it existed
            setShowHistory(true);
        } catch (err) {
            console.error('Error fetching history', err);
        }
    };

    const [showPreview, setShowPreview] = useState(false);

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)', textAlign: 'center', marginTop: '100px', fontWeight: '800', letterSpacing: '2px' }}>INITIALIZING COMMAND CENTER...</div></PortfolioPage>;

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
                                    <div style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '1px' }}>ELITE SHINE</div>
                                    <p style={{ margin: 0, fontSize: '10px', opacity: 0.6, fontWeight: '700', letterSpacing: '1px' }}>PREMIUM AUTO DETAILING</p>
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
                            <PortfolioButton variant="secondary" onClick={() => window.print()} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <Printer size={16} /> PRINT
                            </PortfolioButton>
                            <PortfolioButton variant="secondary" onClick={() => setShowPreview(false)}>
                                BACK
                            </PortfolioButton>
                        </div>
                    </div>
                </div>
            )}

            {activePanelForChoice && typeof activePanelForChoice === 'string' && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...ticketModalStyle, maxWidth: '450px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
                            <h2 style={{ color: 'var(--gold)', margin: 0, fontSize: '18px', letterSpacing: '1px', fontFamily: 'var(--font-serif)' }}>
                                {inspectionPhotos[activePanelForChoice] ? 'PHOTO COMMANDS' : 'SELECT SOURCE'}
                            </h2>
                            <button onClick={() => setActivePanelForChoice(null)} style={closeBtnStyle}><X size={20} /></button>
                        </div>

                        {inspectionPhotos[activePanelForChoice] ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <img src={inspectionPhotos[activePanelForChoice].preview} style={{ width: '100%', borderRadius: '15px', maxHeight: '200px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />

                                <div style={{ textAlign: 'left' }}>
                                    <label style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>ADD PANEL COMMENT</label>
                                    <textarea
                                        value={inspectionPhotos[activePanelForChoice].comment}
                                        onChange={(e) => updatePhotoComment(activePanelForChoice, e.target.value)}
                                        placeholder="Note defects, scratches, or customer preferences..."
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '15px', color: '#fff', fontSize: '14px', minHeight: '80px', resize: 'none' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <PortfolioButton variant="secondary" onClick={() => {
                                        setUploadPanel(activePanelForChoice);
                                        setTimeout(() => { if (fileInputRef.current) fileInputRef.current.click(); }, 100);
                                        setActivePanelForChoice(null);
                                    }}>
                                        REPLACE
                                    </PortfolioButton>
                                    <PortfolioButton variant="secondary" onClick={() => {
                                        deletePhoto(activePanelForChoice);
                                        setActivePanelForChoice(null);
                                    }} style={{ color: '#ef4444', borderColor: '#ef4444' }}>
                                        DELETE
                                    </PortfolioButton>
                                </div>

                                <PortfolioButton onClick={() => setActivePanelForChoice(null)}>
                                    CONFIRM DETAILS
                                </PortfolioButton>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <PortfolioButton onClick={() => { startCamera(activePanelForChoice); setActivePanelForChoice(null); }} style={{ width: '100%' }}>
                                    <Camera size={20} style={{ marginRight: '10px' }} /> OPEN CAMERA
                                </PortfolioButton>
                                <PortfolioButton variant="secondary" onClick={() => {
                                    setUploadPanel(activePanelForChoice);
                                    setTimeout(() => { if (fileInputRef.current) fileInputRef.current.click(); }, 100);
                                    setActivePanelForChoice(null);
                                }} style={{ width: '100%' }}>
                                    <FolderOpen size={20} style={{ marginRight: '10px' }} /> ADD FROM FOLDER
                                </PortfolioButton>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeCameraPanel && typeof activeCameraPanel === 'string' && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...ticketModalStyle, maxWidth: '600px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ color: 'var(--gold)', margin: 0, letterSpacing: '1px' }}>
                                CAMERA: {activeCameraPanel.toUpperCase()}
                            </h2>
                            <button onClick={stopCamera} style={closeBtnStyle}><X size={20} /></button>
                        </div>
                        <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', background: '#000', marginBottom: '20px' }}>
                            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <PortfolioButton onClick={capturePhoto} style={{ flex: 1 }}>
                                <Camera size={18} style={{ marginRight: '10px' }} /> CAPTURE SCAN
                            </PortfolioButton>
                            <PortfolioButton variant="secondary" onClick={stopCamera}>
                                CANCEL
                            </PortfolioButton>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Initialize vehicle intake and capture technical inspection details.">
                    BUILD JOB
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <PortfolioButton onClick={fetchHistory} variant="secondary">
                        <History size={18} style={{ marginRight: '10px' }} /> HISTORY
                    </PortfolioButton>
                    <PortfolioButton onClick={() => setShowPreview(true)} variant="secondary">
                        <Printer size={18} style={{ marginRight: '10px' }} /> PREVIEW
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
                            <PortfolioSelect label="Brand" name="brand" value={formData.brand} onChange={handleInputChange}>
                                <option value="">Select Make</option>
                                {Object.keys(vehicleMap).map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </PortfolioSelect>
                            <PortfolioSelect
                                label="Model"
                                name="model"
                                value={formData.model}
                                onChange={handleInputChange}
                                disabled={!formData.brand}
                            >
                                <option value="">Select Model</option>
                                {formData.brand && vehicleMap[formData.brand]?.map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </PortfolioSelect>
                            <PortfolioInput label="Year" name="year" placeholder="2025" value={formData.year} onChange={handleInputChange} />
                            <PortfolioInput label="Color" name="color" placeholder="Finish" value={formData.color} onChange={handleInputChange} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginTop: '15px' }}>
                            <PortfolioInput label="Current Odometer (KM)" name="kilometers" placeholder="e.g. 45000" type="number" value={formData.kilometers} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div style={glassCardStyle}>
                        <div style={sectionHeaderStyle}><ClipboardCheck size={18} color="var(--gold)" /> <span>SERVICE COMMANDS</span></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '25px', width: '100%' }}>
                            <PortfolioSelect
                                label="SERVICE TYPE"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                style={{ width: '100%' }}
                            >
                                <option value="" disabled>Select Category...</option>
                                {serviceCategories.map(c => <option key={c} value={c}>{c}</option>)}
                            </PortfolioSelect>

                            <PortfolioSelect
                                label="SPECIFIC PACKAGE"
                                value=""
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const service = availableServices.find(s => String(s.id) === String(val));
                                    if (service) addService(service);
                                }}
                                disabled={!selectedCategory}
                                style={{ width: '100%' }}
                            >
                                <option value="" disabled>Select Package...</option>
                                {filteredServicesByCategory.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} - AED {s.price}
                                    </option>
                                ))}
                            </PortfolioSelect>
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
                                        <button onClick={() => removeService(s.id)} style={trashBtnStyle}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                            {selectedServices.length === 0 && <div style={emptyStateStyle}>No services selected. Choose a category and package above.</div>}
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
                                }} onClick={() => setActivePanelForChoice(panel)}>
                                    {inspectionPhotos[panel] ? (
                                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                            <img src={inspectionPhotos[panel].preview} alt={panel} style={panelImgStyle} />
                                            {inspectionPhotos[panel].comment && (
                                                <div style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'var(--gold)', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <MessageSquare size={10} color="#000" />
                                                </div>
                                            )}
                                        </div>
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
                            onChange={(e) => {
                                if (uploadPanel && e.target.files[0]) {
                                    handlePhotoUpload(uploadPanel, e.target.files[0]);
                                    setUploadPanel(null); // Clear after upload
                                }
                            }}
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

            {showHistory && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...ticketModalStyle, maxWidth: '800px', background: 'var(--bg-dark)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                            <h2 style={{ color: 'var(--gold)', margin: 0 }}>SERVICE HISTORY ARCHIVE</h2>
                            <button onClick={() => setShowHistory(false)} style={closeBtnStyle}><X size={20} /></button>
                        </div>
                        <div style={{ maxHeight: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {history.length === 0 ? (
                                <div style={{ color: 'rgba(232, 230, 227, 0.4)', textAlign: 'center', padding: '40px' }}>
                                    NO PRIOR SERVICE RECORDS FOUND FOR THIS ASSET.
                                </div>
                            ) : history.map(h => (
                                <div key={h.id} style={{ ...glassCardStyle, padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--cream)' }}>#{h.job_card_number} — {new Date(h.date).toLocaleDateString()}</div>
                                        <div style={{ fontSize: '11px', color: 'rgba(232,230,227,0.5)' }}>{h.job_description?.substring(0, 100)}...</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: 'var(--gold)', fontWeight: '900' }}>AED {h.net_amount}</div>
                                        <div style={{ fontSize: '10px', opacity: 0.6 }}>{h.status_display}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
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
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '40px' };
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
