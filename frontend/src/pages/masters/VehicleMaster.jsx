import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Car, Search, Filter, Download, MoreVertical,
    Calendar, Hash, User, Activity, Shield, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioGrid,
    PortfolioStats,
    PortfolioInput,
    PortfolioSelect
} from '../../components/PortfolioComponents';

const VehicleMaster = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBrand, setFilterBrand] = useState('All');

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                // Fetch from new registry first
                const [registryRes, jobRes] = await Promise.all([
                    api.get('/forms/masters/api/vehicles/'),
                    api.get('/forms/job-cards/api/jobs/')
                ]);

                const registryVehicles = registryRes.data;
                const jobCards = jobRes.data;

                const vehicleMap = new Map();

                // 1. Populate from real registry
                registryVehicles.forEach(v => {
                    vehicleMap.set(v.vin || v.registration_number || `REG-${v.id}`, {
                        ...v,
                        registration: v.registration_number,
                        lastKms: 0,
                        lastService: v.created_at,
                        customer: v.customer_name || 'REGISTERED',
                        jobCount: 0,
                        isFromRegistry: true
                    });
                });

                // 2. Supplement/Update with Job Card data
                jobCards.forEach(job => {
                    const vehicleId = job.vin || job.registration_number || `V-${job.id}`;
                    if (!vehicleMap.has(vehicleId)) {
                        vehicleMap.set(vehicleId, {
                            id: vehicleId,
                            vin: job.vin,
                            registration: job.registration_number,
                            plate_emirate: job.plate_emirate,
                            plate_code: job.plate_code,
                            brand: job.brand,
                            model: job.model,
                            year: job.year,
                            color: job.color,
                            lastKms: job.kilometers,
                            lastService: job.date,
                            customer: job.customer_name,
                            jobCount: 1
                        });
                    } else {
                        const existing = vehicleMap.get(vehicleId);
                        existing.jobCount += 1;
                        if (new Date(job.date) > new Date(existing.lastService)) {
                            existing.lastService = job.date;
                            existing.lastKms = job.kilometers;
                            existing.customer = job.customer_name;
                        }
                    }
                });

                setVehicles(Array.from(vehicleMap.values()));
            } catch (error) {
                console.error('Error fetching vehicle master data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    const brands = ['All', ...new Set(vehicles.map(v => v.brand).filter(Boolean))];

    const filteredVehicles = vehicles.filter(v => {
        const matchesSearch =
            (v.brand?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (v.model?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (v.registration?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (v.vin?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (v.customer?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesBrand = filterBrand === 'All' || v.brand === filterBrand;

        return matchesSearch && matchesBrand;
    });

    const stats = [
        { label: 'Total Registry Nodes', value: vehicles.length, color: 'var(--gold)' },
        { label: 'Active Service Nodes', value: vehicles.reduce((acc, v) => acc + v.jobCount, 0), color: 'var(--blue)' },
        { label: 'Brands Managed', value: brands.length - 1, color: 'var(--purple)' }
    ];

    return (
        <PortfolioPage breadcrumb="SYSTEM REGISTRY / VEHICLE MASTER">
            <PortfolioTitle subtitle="Manage and track every vehicle node across the Elite Shine production ecosystem. High-fidelity registry control for operational excellence.">
                Vehicle Master
            </PortfolioTitle>

            <PortfolioStats stats={stats} />

            {/* Premium Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px', marginBottom: '60px' }}>
                <PortfolioInput
                    placeholder="Search by Brand, Model, VIN, registration..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ background: 'rgba(232, 230, 227, 0.03)', border: '1px solid rgba(232, 230, 227, 0.1)' }}
                />
                <PortfolioSelect
                    value={filterBrand}
                    onChange={(e) => setFilterBrand(e.target.value)}
                    style={{ background: 'rgba(232, 230, 227, 0.03)', border: '1px solid rgba(232, 230, 227, 0.1)' }}
                >
                    {brands.map(b => <option key={b} value={b}>{b === 'All' ? 'All Brands' : b}</option>)}
                </PortfolioSelect>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => navigate('/masters/vehicles/config')}
                        style={{
                            flex: 1,
                            background: 'rgba(232, 230, 227, 0.05)',
                            color: 'var(--gold)',
                            border: '1px solid rgba(232, 230, 227, 0.1)',
                            borderRadius: '10px',
                            fontWeight: '700',
                            fontSize: '11px',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <Layers size={14} /> Config Registry
                    </button>
                    <button
                        onClick={() => navigate('/masters/vehicles/create')}
                        style={{
                            flex: 1,
                            background: 'var(--gold)',
                            color: '#0a0a0a',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: '700',
                            fontSize: '11px',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <Car size={14} /> Add Node
                    </button>
                </div>
            </div>

            {/* List Display */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <AnimatePresence>
                    {filteredVehicles.map((vehicle, idx) => (
                        <motion.div
                            key={vehicle.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                        >
                            <PortfolioCard>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '15px',
                                            background: 'rgba(232, 230, 227, 0.05)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '1px solid rgba(232, 230, 227, 0.1)'
                                        }}>
                                            <Car size={24} color="var(--gold)" strokeWidth={1} />
                                        </div>

                                        <div>
                                            <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', marginBottom: '5px' }}>
                                                {vehicle.brand} {vehicle.model}
                                            </h3>
                                            <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: 'rgba(232, 230, 227, 0.5)', letterSpacing: '1px' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Hash size={12} /> {vehicle.vin || 'NO VIN'}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={12} /> {vehicle.year}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><User size={12} /> {vehicle.customer}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--cream)' }}>{vehicle.registration}</div>
                                            <div style={{ fontSize: '10px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
                                                {vehicle.plate_emirate} {vehicle.plate_code}
                                            </div>
                                        </div>

                                        <div style={{ width: '1px', height: '40px', background: 'rgba(232, 230, 227, 0.1)' }}></div>

                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}>{vehicle.jobCount}</div>
                                            <div style={{ fontSize: '9px', color: 'rgba(232, 230, 227, 0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Jobs</div>
                                        </div>

                                        <ArrowRight size={20} color="rgba(232, 230, 227, 0.3)" />
                                    </div>
                                </div>
                            </PortfolioCard>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredVehicles.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '100px 0', color: 'rgba(232, 230, 227, 0.3)' }}>
                        <Car size={48} style={{ marginBottom: '20px', opacity: 0.2 }} />
                        <div style={{ fontSize: '18px', fontFamily: 'var(--font-serif)' }}>No neural matches found in registry</div>
                    </div>
                )}
            </div>

            <footer style={{ marginTop: '100px', paddingBottom: '40px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(232, 230, 227, 0.05)', paddingTop: '40px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.3)', letterSpacing: '2px' }}>
                    ELITE SHINE OPERATIONAL REGISTRY v4.0
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <Shield size={16} color="rgba(232, 230, 227, 0.2)" />
                    <Activity size={16} color="rgba(232, 230, 227, 0.2)" />
                </div>
            </footer>
        </PortfolioPage>
    );
};

export default VehicleMaster;
