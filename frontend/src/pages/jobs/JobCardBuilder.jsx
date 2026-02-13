import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import {
    Save, ArrowLeft, Plus, X, Camera, Upload,
    Search, ChevronDown, Check, Trash2, Printer,
    FileText, User, Car, ClipboardCheck, Info
} from 'lucide-react';

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
                    api.get('/forms/job_cards/api/services/'),
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

            const res = await api.post('/forms/job_cards/api/jobs/', payload);
            const jobId = res.data.id;

            // Upload Photos
            const photoPromises = Object.entries(inspectionPhotos).map(([panel, data]) => {
                const photoFormData = new FormData();
                photoFormData.append('job_card', jobId);
                photoFormData.append('image', data.file);
                photoFormData.append('panel_name', panel);
                photoFormData.append('caption', `Inspection: ${panel}`);
                return api.post('/forms/job_cards/api/photos/', photoFormData);
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

    // ... (rest of logic)

    return (
        <div className="builder-container" style={containerStyle}>
            {showPreview && (
                <div style={modalOverlayStyle}>
                    <div style={ticketModalStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ color: 'var(--gold)', margin: 0 }}>LIVE TICKET PREVIEW</h2>
                            <button onClick={() => setShowPreview(false)} style={closeBtnStyle}><X size={20} /></button>
                        </div>

                        <div style={ticketBodyStyle}>
                            <div style={ticketHeaderStyle}>
                                <div style={signatureLineStyle}></div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '24px' }}>ELITE SHINE</h3>
                                    <p style={{ margin: 0, fontSize: '10px', opacity: 0.6 }}>PREMIUM AUTO DETAILING</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '18px', fontWeight: '900' }}>#{`JC-${Date.now().toString().slice(-6)}`}</div>
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

                        <button onClick={handleSubmit} disabled={isSaving} style={{ ...saveBtnStyle, width: '100%', marginTop: '20px' }}>
                            {isSaving ? 'Processing...' : 'CONFIRM & SYNC TO WORKSHOP'}
                        </button>
                    </div>
                </div>
            )}

            <header style={headerStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => navigate(-1)} style={backBtnStyle}><ArrowLeft size={18} /></button>
                    <div>
                        <h1 style={titleStyle}>ELITE SHINE</h1>
                        <p style={subtitleStyle}>Premium Job Card Builder</p>
                    </div>
                </div>
                <div style={headerActionStyle}>
                    <button onClick={handleSubmit} disabled={isSaving} style={saveBtnStyle}>
                        {isSaving ? 'Syncing...' : <><Save size={18} /> Sync to Workshop</>}
                    </button>
                    <button onClick={() => setShowPreview(true)} style={draftBtnStyle}><Printer size={18} /> Print Preview</button>
                </div>
            </header>

            <div style={gridStyle}>
                {/* Left Column: Form & Services */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <GlassCard style={glassCardStyle}>
                        <div style={sectionHeaderStyle}><User size={18} color="var(--gold)" /> <span>RECEPTION INFO</span></div>
                        <div style={formGridStyle}>
                            <div className="form-group">
                                <label style={labelStyle}>Title</label>
                                <select name="title" value={formData.title} onChange={handleInputChange} style={inputStyle}>
                                    <option value="Mr">Mr.</option>
                                    <option value="Mrs">Mrs.</option>
                                    <option value="Ms">Ms.</option>
                                    <option value="Dr">Dr.</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Customer Name</label>
                                <input name="customer_name" placeholder="Full Name" value={formData.customer_name} onChange={handleInputChange} style={inputStyle} required />
                            </div>
                            <div className="form-group">
                                <label style={labelStyle}>Contact No.</label>
                                <input name="phone" placeholder="+971..." value={formData.phone} onChange={handleInputChange} style={inputStyle} required />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 3' }}>
                                <label style={labelStyle}>Address</label>
                                <input name="address" placeholder="Location/Emirate" value={formData.address} onChange={handleInputChange} style={inputStyle} />
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard style={glassCardStyle}>
                        <div style={sectionHeaderStyle}><Car size={18} color="var(--gold)" /> <span>ASSET DETAILS</span></div>
                        <div style={formGridStyle}>
                            <div className="form-group">
                                <label style={labelStyle}>Plate Emirate</label>
                                <select name="plate_emirate" value={formData.plate_emirate} onChange={handleInputChange} style={inputStyle}>
                                    {PLATE_EMIRATES.map(e => <option key={e} value={e}>{e}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={labelStyle}>Category</label>
                                <select name="plate_category" value={formData.plate_category} onChange={handleInputChange} style={inputStyle}>
                                    {PLATE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={labelStyle}>Plate Code</label>
                                <input name="plate_code" placeholder="A" value={formData.plate_code} onChange={handleInputChange} style={inputStyle} />
                            </div>
                            <div className="form-group">
                                <label style={labelStyle}>Plate Number</label>
                                <input name="registration_number" placeholder="12345" value={formData.registration_number} onChange={handleInputChange} style={inputStyle} />
                            </div>
                            <div className="form-group">
                                <label style={labelStyle}>Brand</label>
                                <input name="brand" placeholder="Toyota" value={formData.brand} onChange={handleInputChange} style={inputStyle} />
                            </div>
                            <div className="form-group">
                                <label style={labelStyle}>Model</label>
                                <input name="model" placeholder="Camry" value={formData.model} onChange={handleInputChange} style={inputStyle} />
                            </div>
                            <div className="form-group">
                                <label style={labelStyle}>Year</label>
                                <input name="year" placeholder="2025" value={formData.year} onChange={handleInputChange} style={inputStyle} />
                            </div>
                            <div className="form-group">
                                <label style={labelStyle}>Color</label>
                                <input name="color" placeholder="White" value={formData.color} onChange={handleInputChange} style={inputStyle} />
                            </div>
                            <div className="form-group">
                                <label style={labelStyle}>VIN Number</label>
                                <input name="vin" placeholder="Chassis No." value={formData.vin} onChange={handleInputChange} style={inputStyle} />
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard style={{ ...glassCardStyle, flex: 1 }}>
                        <div style={sectionHeaderStyle}><ClipboardCheck size={18} color="var(--gold)" /> <span>SERVICE COMMANDS</span></div>
                        <div style={searchContainerStyle}>
                            <Search size={18} style={searchIconStyle} />
                            <input
                                type="text"
                                placeholder="Search premium services..."
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
                                                <div style={{ fontWeight: '600' }}>{s.name}</div>
                                                <div style={{ fontSize: '10px', color: 'var(--gold)' }}>{s.category_name}</div>
                                            </div>
                                            <div style={{ fontWeight: '800' }}>AED {s.price}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={selectedListStyle}>
                            {selectedServices.map(s => (
                                <div key={s.id} style={selectedItemStyle}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '700', fontSize: '14px' }}>{s.name}</div>
                                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{s.category_name}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ fontWeight: '800', color: 'var(--gold)' }}>AED {s.price}</div>
                                        <button onClick={() => removeService(s.id)} style={trashBtnStyle}><X size={14} /></button>
                                    </div>
                                </div>
                            ))}
                            {selectedServices.length === 0 && <div style={emptyStateStyle}>No services selected. Use search above.</div>}
                        </div>

                        <div style={summaryBoxStyle}>
                            <div style={summaryRow}><span style={summaryLabel}>Subtotal</span> <span>AED {calculateSubtotal().toFixed(2)}</span></div>
                            <div style={summaryRow}><span style={summaryLabel}>VAT (5%)</span> <span>AED {(calculateSubtotal() * 0.05).toFixed(2)}</span></div>
                            <div style={{ ...summaryRow, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', marginTop: '10px' }}>
                                <span style={{ ...summaryLabel, fontSize: '14px', color: '#fff' }}>Total Estimate</span>
                                <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--gold)' }}>AED {(calculateSubtotal() * 1.05).toFixed(2)}</span>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Right Column: Inspection Gallery */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <GlassCard style={{ ...glassCardStyle, height: '100%' }}>
                        <div style={sectionHeaderStyle}><Camera size={18} color="var(--gold)" /> <span>PRE-SERVICE INSPECTION (16 PANELS)</span></div>
                        <div style={inspectionGridStyle}>
                            {VEHICLE_PANELS.map(panel => (
                                <div key={panel} style={panelCardStyle} onClick={() => {
                                    fileInputRef.current.panel = panel;
                                    fileInputRef.current.click();
                                }}>
                                    {inspectionPhotos[panel] ? (
                                        <img src={inspectionPhotos[panel].preview} alt={panel} style={panelImgStyle} />
                                    ) : (
                                        <div style={panelPlaceholderStyle}>
                                            <Camera size={16} />
                                            <span>{panel}</span>
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

                        <div style={{ marginTop: '24px' }}>
                            <label style={labelStyle}>INTERNAL ADVISOR NOTES</label>
                            <textarea
                                name="job_description"
                                value={formData.job_description}
                                onChange={handleInputChange}
                                style={{ ...inputStyle, minHeight: '120px', resize: 'none' }}
                                placeholder="Detail panel damages, existing issues, and high-priority customer requests..."
                            />
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <label style={labelStyle}>COMMAND ADVISOR</label>
                            <select name="service_advisor" value={formData.service_advisor} onChange={handleInputChange} style={inputStyle}>
                                <option value="">Select Advisor...</option>
                                {users.filter(u => u.hr_profile).map(u => (
                                    <option key={u.id} value={u.id}>{u.first_name || u.username}</option>
                                ))}
                            </select>
                        </div>
                    </GlassCard>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .builder-container { animation: fadeIn 0.4s ease-out; }
            `}</style>
        </div>
    );
};

// Styles
const containerStyle = { padding: '24px', height: '100%', overflowY: 'auto', background: 'var(--bg-deep)' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' };
const titleStyle = { margin: 0, fontSize: '28px', fontWeight: '900', letterSpacing: '-1px', color: '#fff' };
const subtitleStyle = { margin: 0, fontSize: '11px', color: 'var(--gold)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'minmax(500px, 1.2fr) 1fr', gap: '24px' };
const glassCardStyle = { padding: '24px', border: '1.5px solid rgba(176,141,87,0.15)', background: 'rgba(255,255,255,0.02)', borderRadius: '24px' };
const sectionHeaderStyle = { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', fontWeight: '900', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' };
const formGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' };
const labelStyle = { display: 'block', fontSize: '9px', fontWeight: '900', color: 'var(--gold)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' };
const inputStyle = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', fontSize: '13px', outline: 'none', transition: 'all 0.2s focus:border-gold' };
const searchContainerStyle = { position: 'relative', marginBottom: '20px' };
const searchInputStyle = { width: '100%', padding: '14px 14px 14px 44px', background: 'rgba(176,141,87,0.08)', border: '1px solid rgba(176,141,87,0.2)', borderRadius: '16px', color: '#fff', fontSize: '14px', outline: 'none' };
const searchIconStyle = { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)' };
const dropdownStyle = { position: 'absolute', top: '100%', left: 0, width: '100%', background: '#1a1a1a', border: '1.5px solid var(--gold-border)', borderRadius: '16px', marginTop: '8px', zIndex: 100, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' };
const dropdownItemStyle = { padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', ':hover': { background: 'rgba(176,141,87,0.1)' } };
const selectedListStyle = { display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '120px' };
const selectedItemStyle = { padding: '12px 18px', background: 'rgba(176,141,87,0.05)', border: '1px solid rgba(176,141,87,0.15)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const emptyStateStyle = { textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.2)', fontSize: '13px' };
const summaryBoxStyle = { background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '16px', marginTop: '24px', border: '1px solid rgba(255,255,255,0.05)' };
const summaryRow = { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' };
const summaryLabel = { fontWeight: '600' };
const inspectionGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' };
const panelCardStyle = { aspectRatio: '1', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', overflow: 'hidden', position: 'relative', transition: 'all 0.2s', ':hover': { borderColor: 'var(--gold)', background: 'rgba(176,141,87,0.05)' } };
const panelImgStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const panelPlaceholderStyle = { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'rgba(255,255,255,0.3)', fontSize: '8px', fontWeight: '900', textAlign: 'center', padding: '5px' };
const draftBtnStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const saveBtnStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '12px', background: 'var(--gold)', border: 'none', color: '#000', fontSize: '13px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 15px rgba(176,141,87,0.3)' };
const headerActionStyle = { display: 'flex', gap: '12px' };
const backBtnStyle = { background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px', borderRadius: '12px', cursor: 'pointer' };
const trashBtnStyle = { background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.4)', padding: '5px', cursor: 'pointer', borderRadius: '6px' };

// Ticket Preview Styles
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' };
const ticketModalStyle = { background: '#111', border: '1.5px solid var(--gold-border)', borderRadius: '24px', width: '100%', maxWidth: '600px', padding: '32px', boxShadow: '0 30px 60px rgba(0,0,0,0.8)', animation: 'fadeIn 0.3s ease-out' };
const closeBtnStyle = { background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' };
const ticketBodyStyle = { background: '#fff', color: '#000', borderRadius: '12px', padding: '24px', position: 'relative', overflow: 'hidden' };
const ticketHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'start', borderBottom: '2px solid #eee', paddingBottom: '20px', marginBottom: '20px' };
const signatureLineStyle = { position: 'absolute', top: 0, left: '20px', width: '4px', height: '100%', background: 'var(--gold)', boxShadow: '0 0 10px rgba(176,141,87,0.5)' }; // Vertical Gold Line
const ticketSectionGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const ticketLabel = { fontSize: '9px', fontWeight: '900', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' };
const ticketValue = { fontSize: '13px', fontWeight: '700', color: '#333' };
const ticketServiceRow = { display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '8px 0', borderBottom: '1px solid #f5f5f5' };
const ticketFooterStyle = { marginTop: '24px', display: 'flex', gap: '20px', borderTop: '2px solid #eee', paddingTop: '20px' };

export default JobCardBuilder;
