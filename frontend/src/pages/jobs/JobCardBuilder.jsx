import {
    PortfolioPage, PortfolioTitle, PortfolioButton,
    PortfolioInput, PortfolioSelect, PortfolioTextarea
} from '../../components/PortfolioComponents';
import {
    Save, Hash, Printer, User,
    Smartphone, MapPin, Search, X,
    Camera, ClipboardCheck, Car, History,
    CheckCircle2, Plus, Trash2, ArrowRight,
    Briefcase, FolderOpen, MessageSquare, Eye, Wrench
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

    // Core State aligned with Legacy Form
    const [formData, setFormData] = useState({
        title: 'Mr',
        customer_name: '',
        phone: '',
        address: '',
        email: '',
        corporate_customer: false,
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
        vehicle_engine: '',
        cylinders: '',
        job_category: 'Regular',
        remark: '',
        driver_name: '',
        coupon_no: '',
        order_type: '',
        status: 'RECEIVED',
        estimation_no: '',
        lpo_no: '',
        redo_job: false,
        due_date_out: '',
        discount: '0',
        sales_man: '',
        lead_source: '',
        customer_approval: 'Yes',
        charger_type: '',
        checklist_remark: '',
        trn: '',
        next_service_date: '',
        promo_no: '',
        sub_status: 'All',
        priority: '',

        supervisor: '',
        technician: '',
        estimated_completion_time: '',
        print_types: 'Proforma Invoice',
        request_discount: false,
        whatsapp_msg: '',
        brought_name_id: '',
        mulkiya_name_id: '',
        receiver_date: '',
        receiver_time: '',
        delivery_date: '',
        delivery_time: '',
        print_customer_signature: true,
        print_car_image: true,
        send_sms: false,
        advance_amount: '0.00',

        job_description: '',
        service_advisor: '',
        date: new Date().toISOString().split('T')[0],
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
    const [vehicleMap, setVehicleMap] = useState(VEHICLE_DATA);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Fetch Core Data in Parallel
                const [servicesRes, usersRes, branchesRes, brandsRes, modelsRes, typesRes] = await Promise.all([
                    api.get('/api/masters/services/'),
                    api.get('/api/auth/users/'),
                    api.get('/api/locations/branches/'),
                    api.get('/api/masters/brands/').catch(() => ({ data: [] })),
                    api.get('/api/masters/models/').catch(() => ({ data: [] })),
                    api.get('/api/masters/types/').catch(() => ({ data: [] }))
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

                    if (!dynamicMap['Other']) dynamicMap['Other'] = ['Other'];
                    setVehicleMap(dynamicMap);
                }

                if (servicesRes.data.length > 0) {
                    setAvailableServices(servicesRes.data);
                    const categories = [...new Set(servicesRes.data.map(s => s.category_name))].filter(Boolean);
                    setServiceCategories(categories);
                } else {
                    const fallbackServices = [];
                    Object.entries(SERVICES_CATALOG).forEach(([cat, services]) => {
                        services.forEach((s) => {
                            fallbackServices.push({ id: Math.random() * 100000, name: s.name, price: s.price, category_name: cat });
                        });
                    });
                    setAvailableServices(fallbackServices);
                    setServiceCategories(Object.keys(SERVICES_CATALOG));
                }

                setUsers(usersRes.data);
                setBranches(branchesRes.data);

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
                console.error('Error loading builder data', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [location.state]);

    useEffect(() => {
        if (!selectedCategory) {
            setFilteredServicesByCategory([]);
            return;
        }
        const filtered = availableServices.filter(s => s.category_name === selectedCategory);
        setFilteredServicesByCategory(filtered);
    }, [selectedCategory, availableServices]);

    const handleInputChange = (e) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addService = (service) => {
        if (selectedServices.find(s => s.id === service.id)) return;
        setSelectedServices(prev => [...prev, { ...service, qty: 1, discount: 0 }]);
    };

    const removeService = (id) => {
        setSelectedServices(prev => prev.filter(s => s.id !== id));
    };

    const [activeCameraPanel, setActiveCameraPanel] = useState(null);
    const [activePanelForChoice, setActivePanelForChoice] = useState(null);
    const [uploadPanel, setUploadPanel] = useState(null);
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
        setInspectionPhotos(prev => ({ ...prev, [panel]: { ...prev[panel], comment } }));
    };

    const deletePhoto = (panel) => {
        setInspectionPhotos(prev => {
            const next = { ...prev };
            delete next[panel];
            return next;
        });
    };

    const startCamera = async (panel) => {
        setActiveCameraPanel(panel);
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('MediaDevices API not supported in this browser environment.');
            }
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
            });
            setStream(mediaStream);
            if (videoRef.current) videoRef.current.srcObject = mediaStream;
        } catch (err) {
            console.error('Camera access failure:', err);
            alert(`SECURITY/ENVIRONMENT ERROR: ${err.message || 'Could not access camera'}`);
            setActiveCameraPanel(null);
        }
    };

    const stopCamera = () => {
        if (stream) { stream.getTracks().forEach(track => track.stop()); setStream(null); }
        setActiveCameraPanel(null);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current && activeCameraPanel) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
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

            // Append all the legacy unmapped fields to job description so they are not lost
            const legacyDump = `
[LEGACY FIELDS RECORD]
Corporate Customer: ${formData.corporate_customer}
Email: ${formData.email}
Engine: ${formData.vehicle_engine}
Cylinders: ${formData.cylinders}
Remark: ${formData.remark}
Order Type: ${formData.order_type}
Estimation No: ${formData.estimation_no}
LPO No: ${formData.lpo_no}
Redo Job: ${formData.redo_job}
Due Date Out: ${formData.due_date_out}
Cust Approval: ${formData.customer_approval}
Charger Type: ${formData.charger_type}
CheckList Remark: ${formData.checklist_remark}
TRN: ${formData.trn}
Priority: ${formData.priority}
            `.trim();

            const payload = {
                title: formData.title,
                customer_name: formData.customer_name,
                phone: formData.phone,
                address: formData.address,
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
                job_card_number: jcNum,
                date: formData.date,
                status: 'RECEIVED',
                branch: parseInt(formData.branch_id) || (branches.length > 0 ? branches[0].id : 1),
                service_advisor: formData.service_advisor ? parseInt(formData.service_advisor) : null,
                total_amount: currentSubtotal.toFixed(2),
                vat_amount: vat.toFixed(2),
                net_amount: net.toFixed(2),
                job_description: formData.job_description + '\n\nSelected Services:\n' +
                    selectedServices.map(s => `- ${s.name} (AED ${s.price})`).join('\n') + '\n\n' + legacyDump
            };

            const res = await api.post('/api/job-cards/api/jobs/', payload);
            const jobId = res.data.id;

            const photoPromises = Object.entries(inspectionPhotos).map(([panel, data]) => {
                const photoFormData = new FormData();
                photoFormData.append('job_card', jobId);
                photoFormData.append('image', data.file);
                photoFormData.append('panel_name', panel);
                photoFormData.append('caption', data.comment || `Inspection: ${panel}`);
                return api.post('/api/job-cards/api/photos/', photoFormData);
            });

            if (photoPromises.length > 0) {
                await Promise.allSettled(photoPromises);
            }

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

    if (loading) return <PortfolioPage><div style={{ color: 'var(--cream)', textAlign: 'center', marginTop: '100px', fontWeight: '800', letterSpacing: '2px' }}>INITIALIZING COMMAND CENTER...</div></PortfolioPage>;

    return (
        <PortfolioPage breadcrumb="Operations / Job Cards / Create">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                <PortfolioTitle subtitle="Legacy-aligned vehicle intake and operational details.">
                    BUILD JOB CARD
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <PortfolioButton variant="secondary" onClick={() => window.print()}>
                        <Printer size={18} style={{ marginRight: '10px' }} /> PRINT
                    </PortfolioButton>
                    <PortfolioButton onClick={handleSubmit} variant="gold">
                        {isSaving ? 'SYNCING...' : <><Save size={18} style={{ marginRight: '10px' }} /> SAVE & PRINT</>}
                    </PortfolioButton>
                </div>
            </div>

            {/* Top Section: Vehicle & Customer Details Legacy Map */}
            <div style={glassCardStyle}>
                <div style={sectionHeaderStyle}><User size={18} color="var(--gold)" /> <span>VEHICLE & CUSTOMER DETAILS</span></div>
                <div style={threeColumnGrid}>
                    {/* Left Column Legacy */}
                    <div style={columnStack}>
                        <PortfolioSelect label="Branch Name" name="branch_id" value={formData.branch_id} onChange={handleInputChange}>
                            {branches.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </PortfolioSelect>
                        <PortfolioInput label="Job Card Date" type="date" name="date" value={formData.date} onChange={handleInputChange} />
                        <label style={checkboxLabelStyle}>
                            <input type="checkbox" name="corporate_customer" checked={formData.corporate_customer} onChange={handleInputChange} />
                            Corporate Customer
                        </label>
                        <PortfolioInput label="Email" name="email" value={formData.email} onChange={handleInputChange} />
                        <PortfolioSelect label="Emirates" name="plate_emirate" value={formData.plate_emirate} onChange={handleInputChange}>
                            {PLATE_EMIRATES.map(e => <option key={e} value={e}>{e}</option>)}
                        </PortfolioSelect>
                        <PortfolioInput label="Vehicle Engine" name="vehicle_engine" value={formData.vehicle_engine} onChange={handleInputChange} />
                        <PortfolioInput label="Cylinders" name="cylinders" value={formData.cylinders} onChange={handleInputChange} />
                        <PortfolioSelect label="Job Category" name="job_category" value={formData.job_category} onChange={handleInputChange}>
                            <option value="Regular">Regular</option>
                            <option value="VIP">VIP</option>
                        </PortfolioSelect>
                        <PortfolioInput label="Remark" name="remark" value={formData.remark} onChange={handleInputChange} />
                        <PortfolioInput label="Driver Name" name="driver_name" value={formData.driver_name} onChange={handleInputChange} />
                        <PortfolioInput label="Coupon No" name="coupon_no" value={formData.coupon_no} onChange={handleInputChange} />
                        <PortfolioSelect label="Order Type" name="order_type" value={formData.order_type} onChange={handleInputChange}>
                            <option value="">--Select--</option>
                        </PortfolioSelect>
                        <PortfolioSelect label="Status" name="status" value={formData.status} onChange={handleInputChange}>
                            <option value="RECEIVED">Received</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="READY">Ready</option>
                            <option value="INVOICED">Invoiced</option>
                        </PortfolioSelect>
                    </div>

                    {/* Middle Column Legacy */}
                    <div style={columnStack}>
                        <PortfolioInput label="Estimation No" name="estimation_no" value={formData.estimation_no} onChange={handleInputChange} />
                        <PortfolioInput label="Cust. Contact No" name="phone" value={formData.phone} onChange={handleInputChange} />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <PortfolioInput label="Plate Code" name="plate_code" value={formData.plate_code} onChange={handleInputChange} style={{ width: '80px' }} />
                            <PortfolioInput label="Plate No." name="registration_number" value={formData.registration_number} onChange={handleInputChange} style={{ flex: 1 }} />
                        </div>
                        <PortfolioSelect label="Vehicle Brand" name="brand" value={formData.brand} onChange={handleInputChange}>
                            <option value="">--Select--</option>
                            {Object.keys(vehicleMap).map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </PortfolioSelect>
                        <PortfolioInput label="Vehicle Year" name="year" value={formData.year} onChange={handleInputChange} />
                        <PortfolioInput label="KM's In" name="kilometers" value={formData.kilometers} onChange={handleInputChange} />
                        <PortfolioInput label="LPO No" name="lpo_no" value={formData.lpo_no} onChange={handleInputChange} />
                        <label style={checkboxLabelStyle}>
                            <input type="checkbox" name="redo_job" checked={formData.redo_job} onChange={handleInputChange} />
                            Re-Do Job
                        </label>
                        <PortfolioInput label="Due Date Out" type="date" name="due_date_out" value={formData.due_date_out} onChange={handleInputChange} />
                        <PortfolioSelect label="Discount" name="discount" value={formData.discount} onChange={handleInputChange}>
                            <option value="0">-Select-</option>
                            <option value="10">10%</option>
                        </PortfolioSelect>
                        <PortfolioInput label="Sales Man" name="sales_man" value={formData.sales_man} onChange={handleInputChange} />
                        <PortfolioSelect label="Lead Source" name="lead_source" value={formData.lead_source} onChange={handleInputChange}>
                            <option value="">-Select-</option>
                        </PortfolioSelect>
                    </div>

                    {/* Right Column Legacy */}
                    <div style={columnStack}>
                        <PortfolioInput label="Job CardNo" value="Auto Generated" disabled style={{ background: 'rgba(255,255,255,0.05)' }} />
                        <PortfolioSelect label="Cust. Approval" name="customer_approval" value={formData.customer_approval} onChange={handleInputChange}>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </PortfolioSelect>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <PortfolioSelect name="title" value={formData.title} onChange={handleInputChange} style={{ width: '80px' }}>
                                <option value="Mr">Mr.</option>
                                <option value="Mrs">Mrs.</option>
                                <option value="Ms">Ms.</option>
                            </PortfolioSelect>
                            <PortfolioInput label="Cust. Name" name="customer_name" value={formData.customer_name} onChange={handleInputChange} style={{ flex: 1 }} />
                        </div>
                        <PortfolioInput label="Vehicle VIN No." name="vin" value={formData.vin} onChange={handleInputChange} />
                        <PortfolioSelect label="Vehicle Model" name="model" value={formData.model} onChange={handleInputChange} disabled={!formData.brand}>
                            <option value="">--Select--</option>
                            {formData.brand && vehicleMap[formData.brand]?.map(model => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </PortfolioSelect>
                        <PortfolioInput label="Colour" name="color" value={formData.color} onChange={handleInputChange} />
                        <PortfolioSelect label="Charger Type" name="charger_type" value={formData.charger_type} onChange={handleInputChange}>
                            <option value="">-Select-</option>
                        </PortfolioSelect>
                        <PortfolioInput label="Check List Remark" name="checklist_remark" value={formData.checklist_remark} onChange={handleInputChange} />
                        <PortfolioInput label="TRN" name="trn" value={formData.trn} onChange={handleInputChange} />
                        <PortfolioInput label="Next Service Reminder Date" type="date" name="next_service_date" value={formData.next_service_date} onChange={handleInputChange} />
                        <PortfolioInput label="Promo No" name="promo_no" value={formData.promo_no} onChange={handleInputChange} />
                        <PortfolioSelect label="Sub Status" name="sub_status" value={formData.sub_status} onChange={handleInputChange}>
                            <option value="All">All</option>
                        </PortfolioSelect>
                        <PortfolioSelect label="Priority" name="priority" value={formData.priority} onChange={handleInputChange}>
                            <option value="">-Select-</option>
                        </PortfolioSelect>
                    </div>
                </div>
            </div>

            {/* Middle Section: Job Description & Services */}
            <div style={gridStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div style={glassCardStyle}>
                        <div style={sectionHeaderStyle}><ClipboardCheck size={18} color="var(--gold)" /> <span>JOB DESCRIPTION & SERVICES</span></div>
                        <PortfolioTextarea
                            label="Job Description Notes"
                            name="job_description"
                            value={formData.job_description}
                            onChange={handleInputChange}
                            style={{ minHeight: '80px', marginBottom: '20px' }}
                        />

                        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                            <PortfolioSelect value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ flex: 1 }}>
                                <option value="" disabled>Select Service Category...</option>
                                {serviceCategories.map(c => <option key={c} value={c}>{c}</option>)}
                            </PortfolioSelect>
                            <PortfolioSelect value="" onChange={(e) => {
                                const val = e.target.value;
                                const service = availableServices.find(s => String(s.id) === String(val));
                                if (service) addService(service);
                            }} disabled={!selectedCategory} style={{ flex: 1 }}>
                                <option value="" disabled>Select Specific Package...</option>
                                {filteredServicesByCategory.map(s => <option key={s.id} value={s.id}>{s.name} - AED {s.price}</option>)}
                            </PortfolioSelect>
                        </div>

                        <div style={selectedListStyle}>
                            {selectedServices.map(s => (
                                <div key={s.id} style={selectedItemStyle}>
                                    <div>
                                        <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--cream)' }}>{s.name}</div>
                                        <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.4)' }}>{s.category_name}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ fontWeight: '800', color: '#fff' }}>AED {s.price}</div>
                                        <button onClick={() => removeService(s.id)} style={trashBtnStyle}><Trash2 size={12} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={glassCardStyle}>
                    <div style={sectionHeaderStyle}><Camera size={18} color="var(--gold)" /> <span>VISUAL INSPECTION</span></div>
                    <div style={inspectionGridStyle}>
                        {VEHICLE_PANELS.map(panel => (
                            <div key={panel} style={{
                                ...panelCardStyle,
                                borderColor: inspectionPhotos[panel] ? 'var(--gold)' : 'rgba(232, 230, 227, 0.1)'
                            }} onClick={() => setActivePanelForChoice(panel)}>
                                {inspectionPhotos[panel] ? (
                                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                        <img src={inspectionPhotos[panel].preview} alt={panel} style={panelImgStyle} />
                                    </div>
                                ) : (
                                    <div style={panelPlaceholderStyle}>
                                        <Camera size={12} />
                                        <span style={{ fontSize: '8px' }}>{panel.toUpperCase().substring(0, 8)}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section: Delivery & Tech Details Legacy Map */}
            <div style={glassCardStyle}>
                <div style={sectionHeaderStyle}><Wrench size={18} color="var(--gold)" /> <span>DELIVERY & TECH DETAILS</span></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                    <div style={columnStack}>
                        <PortfolioSelect label="Advisor" name="service_advisor" value={formData.service_advisor} onChange={handleInputChange}>
                            <option value="">-Select-</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                        </PortfolioSelect>
                        <PortfolioInput label="Job Completion" type="datetime-local" name="job_completion" />
                        <PortfolioInput label="Discount Remarks" name="discount_remarks" />
                        <PortfolioInput label="VAT Amount" value={(calculateSubtotal() * 0.05).toFixed(2)} disabled />
                        <PortfolioInput label="Receiver Date" type="date" name="receiver_date" value={formData.receiver_date} onChange={handleInputChange} />
                        <PortfolioInput label="Delivery Time" type="time" name="delivery_time" value={formData.delivery_time} onChange={handleInputChange} />
                        <label style={checkboxLabelStyle}><input type="checkbox" checked={formData.print_customer_signature} /> Print Customer Signature</label>
                        <label style={checkboxLabelStyle}><input type="checkbox" checked={formData.print_car_image} /> Print Car Image</label>
                    </div>

                    <div style={columnStack}>
                        <PortfolioSelect label="Supervisor" name="supervisor" value={formData.supervisor} onChange={handleInputChange}>
                            <option value="">-Select-</option>
                        </PortfolioSelect>
                        <PortfolioInput label="Estimated Completion Time" type="time" name="estimated_completion_time" value={formData.estimated_completion_time} onChange={handleInputChange} />
                        <PortfolioInput label="Gross Amount" value={calculateSubtotal().toFixed(2)} disabled />
                        <PortfolioSelect label="Print Types" name="print_types" value={formData.print_types} onChange={handleInputChange}>
                            <option value="Proforma Invoice">Proforma Invoice</option>
                        </PortfolioSelect>
                        <label style={checkboxLabelStyle}><input type="checkbox" /> Request Discount</label>
                        <PortfolioInput label="Total Amount" value={(calculateSubtotal() * 1.05).toFixed(2)} disabled />
                        <PortfolioInput label="Advance Amount" name="advance_amount" value={formData.advance_amount} onChange={handleInputChange} />
                        <PortfolioInput label="Brought Name ID" name="brought_name_id" value={formData.brought_name_id} onChange={handleInputChange} />
                        <PortfolioInput label="Receiver Time" type="time" name="receiver_time" value={formData.receiver_time} onChange={handleInputChange} />
                    </div>

                    <div style={columnStack}>
                        <PortfolioSelect label="Technician" name="technician" value={formData.technician} onChange={handleInputChange}>
                            <option value="">-Select-</option>
                        </PortfolioSelect>
                        <PortfolioInput label="Amount" value={(calculateSubtotal() * 1.05).toFixed(2)} disabled />
                        <PortfolioInput label="Discount Amount" value={formData.discount} disabled />
                        <PortfolioSelect label="Print for Department" name="print_department">
                            <option value="All">All</option>
                        </PortfolioSelect>
                        <PortfolioTextarea label="Whatsapp Msg" name="whatsapp_msg" value={formData.whatsapp_msg} onChange={handleInputChange} style={{ minHeight: '80px' }} />
                        <PortfolioInput label="Balance Amount" value={(calculateSubtotal() * 1.05 - parseFloat(formData.advance_amount || 0)).toFixed(2)} disabled />
                        <PortfolioInput label="Mulkiya Name ID" name="mulkiya_name_id" value={formData.mulkiya_name_id} onChange={handleInputChange} />
                        <PortfolioInput label="Delivery Date" type="date" name="delivery_date" value={formData.delivery_date} onChange={handleInputChange} />
                    </div>

                    <div style={{ ...columnStack, gap: '15px', justifyContent: 'flex-start', paddingTop: '20px' }}>
                        <label style={checkboxLabelStyle}>
                            <input type="checkbox" checked={formData.send_sms} name="send_sms" onChange={handleInputChange} /> Send SMS
                        </label>
                        <PortfolioButton variant="gold" onClick={handleSubmit}>Save & Print</PortfolioButton>
                        <PortfolioButton variant="secondary" onClick={handleSubmit}>Save & Print With Email</PortfolioButton>
                        <PortfolioButton variant="danger" onClick={() => window.location.reload()}>Reset</PortfolioButton>
                        <PortfolioButton variant="secondary">Receipt Voucher</PortfolioButton>
                        <PortfolioButton variant="secondary">Request Of Parts</PortfolioButton>
                    </div>
                </div>
            </div>

            {/* Hidden Photo Interactions untouched to preserve functionality */}
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }}
                onChange={(e) => {
                    if (uploadPanel && e.target.files[0]) {
                        handlePhotoUpload(uploadPanel, e.target.files[0]);
                        setUploadPanel(null);
                    }
                }}
            />
            {activePanelForChoice && typeof activePanelForChoice === 'string' && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...ticketModalStyle, maxWidth: '450px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
                            <h2 style={{ color: 'var(--gold)', margin: 0, fontSize: '18px', letterSpacing: '1px' }}>
                                {inspectionPhotos[activePanelForChoice] ? 'PHOTO COMMANDS' : 'SELECT SOURCE'}
                            </h2>
                            <button onClick={() => setActivePanelForChoice(null)} style={closeBtnStyle}><X size={20} /></button>
                        </div>
                        {inspectionPhotos[activePanelForChoice] ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <img src={inspectionPhotos[activePanelForChoice].preview} style={{ width: '100%', borderRadius: '15px' }} />
                                <PortfolioButton variant="secondary" onClick={() => {
                                    setUploadPanel(activePanelForChoice);
                                    setTimeout(() => { if (fileInputRef.current) fileInputRef.current.click(); }, 100);
                                    setActivePanelForChoice(null);
                                }}>REPLACE</PortfolioButton>
                                <PortfolioButton onClick={() => setActivePanelForChoice(null)}>CONFIRM DETAILS</PortfolioButton>
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
                        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                        <PortfolioButton onClick={capturePhoto} style={{ marginTop: '20px' }}>CAPTURE SCAN</PortfolioButton>
                    </div>
                </div>
            )}
        </PortfolioPage>
    );
};

// Styles
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' };
const threeColumnGrid = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)', gap: '30px' };
const columnStack = { display: 'flex', flexDirection: 'column', gap: '8px' };
const checkboxLabelStyle = { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'rgba(232,230,227,0.7)', padding: '5px 0' };

const glassCardStyle = {
    padding: '30px',
    background: 'rgba(232, 230, 227, 0.03)',
    border: '1px solid rgba(232, 230, 227, 0.1)',
    borderRadius: '16px',
    marginBottom: '40px'
};

const sectionHeaderStyle = {
    display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px',
    fontWeight: '900', color: 'rgba(232, 230, 227, 0.5)',
    textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '25px'
};

const selectedListStyle = { display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '80px' };
const selectedItemStyle = { padding: '12px 18px', background: 'rgba(232, 230, 227, 0.03)', border: '1px solid rgba(232, 230, 227, 0.08)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };

const inspectionGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' };
const panelCardStyle = { aspectRatio: '1', borderRadius: '12px', background: 'rgba(232, 230, 227, 0.02)', border: '1.5px solid rgba(232, 230, 227, 0.1)', cursor: 'pointer', overflow: 'hidden', position: 'relative' };
const panelImgStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const panelPlaceholderStyle = { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'rgba(232, 230, 227, 0.3)' };
const trashBtnStyle = { background: 'rgba(244, 63, 94, 0.1)', border: 'none', color: '#f43f5e', padding: '6px', cursor: 'pointer', borderRadius: '8px' };

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '40px' };
const ticketModalStyle = { background: '#0a0a0a', border: '1px solid rgba(232, 230, 227, 0.1)', borderRadius: '20px', width: '100%', padding: '40px' };
const closeBtnStyle = { background: 'transparent', border: 'none', color: 'var(--cream)', cursor: 'pointer' };

export default JobCardBuilder;
