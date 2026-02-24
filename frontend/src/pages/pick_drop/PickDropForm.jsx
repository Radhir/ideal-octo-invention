import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Save, ArrowLeft, Truck, User, MapPin, Calendar, Car, EyeOff, ClipboardList, Info } from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioGrid,
    PortfolioSectionTitle,
    PortfolioInput,
    PortfolioButton,
    PortfolioBackButton
} from '../../components/PortfolioComponents';

const PickDropForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const payload = location.state?.payload || location.state?.jobCard;

    const { user } = useAuth();
    const isManager = user?.role === 'MANAGER' || user?.role === 'ADMIN' || user?.is_superuser;

    const [formData, setFormData] = useState({
        job_card: payload?.id || '',
        customer_name: payload?.customer_name || '',
        phone: payload?.phone || '',
        vehicle_brand: payload?.vehicle_brand || '',
        vehicle_model: payload?.vehicle_model || '',
        license_plate: payload?.license_plate || '',
        pickup_location: '',
        drop_off_location: '',
        scheduled_time: new Date().toISOString().slice(0, 16),
        driver: '',
        status: 'SCHEDULED'
    });

    const [employees, setEmployees] = useState([]);
    const [jobCards, setJobCards] = useState([]);

    const DRIVER_LIST = [
        { name: 'Ashok', vehicle: 'Ford Focus' },
        { name: 'Sahanur', vehicle: 'Nissan Sunny' },
        { name: 'Emad', vehicle: 'Nissan Sunny' },
        { name: 'Akhma Jaan', vehicle: 'Coaster Bus' },
        { name: 'Sittapa', vehicle: 'Hiace' },
        { name: 'Mira Rao', vehicle: 'Hiace' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empRes, jcRes] = await Promise.all([
                    api.get('/api/hr/employees/'),
                    api.get('/api/job-cards/api/jobs/')
                ]);
                setEmployees(empRes.data);
                // Filter for released jobs
                setJobCards(jcRes.data.filter(jc => jc.is_released));
            } catch (err) {
                console.error('Error fetching Logistics metadata', err);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/forms/pick-and-drop/api/trips/', formData);
            alert('Logistics Movement Scheduled Successfully');
            navigate('/pick-drop');
        } catch (err) {
            console.error('Error scheduling trip', err);
            alert('Failed to schedule logistics trip.');
        }
    };

    return (
        <PortfolioPage breadcrumb="LOGISTICS // MOVEMENT CONTROL">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
                <PortfolioTitle subtitle="Industrial-grade scheduling for elite vehicle movement protocols and strategic fleet orchestration.">
                    Dispatch<br />Protocol
                </PortfolioTitle>
                <PortfolioBackButton onClick={() => navigate('/pick-drop')} />
            </header>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        {/* Section 01: Vehicle & Identity */}
                        <PortfolioCard style={{ padding: '50px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(176,141,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                                    <Car size={20} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px' }}>SECTION 01</div>
                                    <div style={{ fontSize: '20px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'var(--font-serif)' }}>Vehicle & Identity</div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                                <PortfolioInput
                                    label="LINKED.protocol"
                                    type="select"
                                    name="job_card"
                                    value={formData.job_card}
                                    onChange={handleChange}
                                >
                                    <option value="">Standby / Unlinked</option>
                                    {jobCards.map(jc => (
                                        <option key={jc.id} value={jc.id}>{jc.jc_number} - {jc.customer_name}</option>
                                    ))}
                                </PortfolioInput>

                                <PortfolioInput
                                    label="CUSTOMER.identity"
                                    name="customer_name"
                                    value={formData.customer_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '25px' }}>
                                <div style={{ position: 'relative' }}>
                                    <PortfolioInput
                                        label="COMMUNICATION.link"
                                        name="phone"
                                        value={!isManager && formData.phone ? formData.phone.replace(/.(?=.{4})/g, '*') : formData.phone}
                                        onChange={handleChange}
                                        required
                                        readOnly={!isManager}
                                        style={!isManager ? { background: 'rgba(255,255,255,0.03)', color: 'rgba(232, 230, 227, 0.3)' } : {}}
                                    />
                                    {!isManager && <EyeOff size={14} style={{ position: 'absolute', right: '15px', top: '48px', opacity: 0.3 }} />}
                                </div>
                                <PortfolioInput label="MANUFACTURER" name="vehicle_brand" value={formData.vehicle_brand} onChange={handleChange} placeholder="e.g. Porsche" required />
                                <PortfolioInput label="MODEL.node" name="vehicle_model" value={formData.vehicle_model} onChange={handleChange} placeholder="e.g. 911 GT3" required />
                            </div>

                            <div style={{ marginTop: '25px' }}>
                                <PortfolioInput label="PLATE.registry" name="license_plate" value={formData.license_plate} onChange={handleChange} placeholder="Dubai A 12345" required />
                            </div>
                        </PortfolioCard>

                        {/* Section 02: Route Configuration */}
                        <PortfolioCard style={{ padding: '50px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(176,141,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px' }}>SECTION 02</div>
                                    <div style={{ fontSize: '20px', color: 'var(--cream)', fontWeight: '300', fontFamily: 'var(--font-serif)' }}>Route Configuration</div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                <PortfolioInput label="PICKUP POINT" name="pickup_location" value={formData.pickup_location} onChange={handleChange} placeholder="Strategic pickup address..." required />
                                <PortfolioInput label="DELIVERY POINT" name="drop_off_location" value={formData.drop_off_location} onChange={handleChange} placeholder="Precise drop-off location..." required />
                            </div>
                        </PortfolioCard>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        {/* Timing Block */}
                        <PortfolioCard style={{ padding: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                                <Calendar size={18} color="var(--gold)" opacity={0.5} />
                                <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px' }}>TIMING PROTOCOL</div>
                            </div>
                            <PortfolioInput label="SCHEDULED TIME" name="scheduled_time" type="datetime-local" value={formData.scheduled_time} onChange={handleChange} required />
                        </PortfolioCard>

                        {/* Assignment Block */}
                        <PortfolioCard style={{ padding: '45px', position: 'relative', overflow: 'hidden' }}>
                            <div className="telemetry-grid" style={{ zIndex: 0, opacity: 0.05 }} />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '35px' }}>
                                    <User size={18} color="var(--gold)" opacity={0.5} />
                                    <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px' }}>OPERATIVE ASSIGNMENT</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {DRIVER_LIST.map(driver => (
                                        <div
                                            key={driver.name}
                                            onClick={() => {
                                                const [brand, ...modelParts] = driver.vehicle.split(' ');
                                                setFormData({
                                                    ...formData,
                                                    driver: driver.name,
                                                    vehicle_brand: brand || '',
                                                    vehicle_model: modelParts.join(' ') || ''
                                                });
                                            }}
                                            style={{
                                                padding: '20px',
                                                background: formData.driver === driver.name ? 'rgba(176,141,87,0.1)' : 'rgba(255,255,255,0.02)',
                                                border: formData.driver === driver.name ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.05)',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontSize: '14px', color: 'var(--cream)', fontWeight: '700' }}>{driver.name}</div>
                                                <div style={{ fontSize: '10px', color: 'rgba(232,230,227,0.4)', marginTop: '4px' }}>{driver.vehicle}</div>
                                            </div>
                                            {formData.driver === driver.name && <div className="status-pulse" />}
                                        </div>
                                    ))}
                                </div>

                                <div style={{ marginTop: '30px' }}>
                                    <PortfolioInput
                                        label="OTHER OPERATIVE"
                                        type="select"
                                        name="driver"
                                        value={DRIVER_LIST.some(d => d.name === formData.driver) ? '' : formData.driver}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Manual...</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.full_name}>{emp.full_name}</option>
                                        ))}
                                    </PortfolioInput>
                                </div>
                            </div>
                        </PortfolioCard>

                        <PortfolioButton type="submit" variant="gold" style={{ width: '100%', height: '80px', fontSize: '15px', fontWeight: '900', letterSpacing: '2px' }}>
                            <Save size={20} /> SYNC.dispatch
                        </PortfolioButton>
                    </div>
                </div>
            </form>
        </PortfolioPage>
    );
};

