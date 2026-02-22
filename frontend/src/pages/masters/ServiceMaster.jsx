import React, { useState, useEffect } from 'react';
import {
    Plus, Wrench, DollarSign, Tag,
    Search, ChevronRight, ArrowLeft,
    Layers, PenTool, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import PageLoader from '../../components/PageLoader.jsx';

const ServiceMaster = () => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: 0,
        cost_price: 0,
        department: '',
        income_account: '',
        is_active: true
    });
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [svcRes, catRes, accRes, deptRes] = await Promise.all([
                api.get('/job_cards/api/services/'),
                api.get('/job_cards/api/service-categories/'),
                api.get('/finance/api/accounts/'),
                api.get('/hr/api/departments/')
            ]);
            setServices(svcRes.data.results || svcRes.data);
            setCategories(catRes.data.results || catRes.data);
            setAccounts(accRes.data.results || accRes.data);
            setDepartments(deptRes.data.results || deptRes.data);
        } catch (err) {
            console.error("Failed to fetch initial data", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        try {
            const res = await api.get('/job_cards/api/services/');
            setServices(res.data.results || res.data);
        } catch (err) {
            console.error("Failed to fetch services", err);
        }
    };

    const handleOpen = (svc = null) => {
        if (svc) {
            setFormData({
                name: svc.name,
                category: svc.category || '',
                price: svc.price || 0,
                cost_price: svc.cost_price || 0,
                department: svc.department || '',
                income_account: svc.income_account || '',
                is_active: svc.is_active
            });
            setIsEdit(true);
            setEditId(svc.id);
        } else {
            setFormData({
                name: '', category: '',
                price: 0, cost_price: 0,
                department: '', income_account: '',
                is_active: true
            });
            setIsEdit(false);
            setEditId(null);
        }
        setShowForm(true);
        setSelectedService(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                department: formData.department === '' ? null : formData.department,
                income_account: formData.income_account === '' ? null : formData.income_account,
            };

            if (isEdit) {
                await api.put(`/job_cards/api/services/${editId}/`, payload);
            } else {
                await api.post('/job_cards/api/services/', payload);
            }
            fetchServices();
            setShowForm(false);
        } catch (err) {
            console.error("Error saving service", err);
            alert("Error saving service: " + JSON.stringify(err.response?.data || err.message));
        }
    };

    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id === id);
        return cat ? cat.name : 'Unknown Category';
    };

    if (loading) return <PageLoader />;

    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen text-white">
            {!showForm && !selectedService ? (
                <>
                    <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-3 mb-2"
                            >
                                <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                    <PenTool className="text-yellow-400" size={24} />
                                </div>
                                <span className="text-[10px] uppercase tracking-[3px] font-bold text-yellow-400">Service Catalog</span>
                            </motion.div>
                            <h1 className="text-4xl font-extrabold tracking-tight">Service Masters</h1>
                            <p className="text-white/40 mt-2 font-medium">Standardize service offerings and pricing.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleOpen()}
                                className="flex items-center gap-2 px-5 py-2.5 bg-yellow-600 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-500/20 text-black"
                            >
                                <Plus size={16} />
                                New Service
                            </button>
                        </div>
                    </header>

                    {/* Service Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {services.map((svc, idx) => (
                                <motion.div
                                    key={svc.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => handleOpen(svc)}
                                    className="group bg-white/5 border border-white/10 hover:border-yellow-500/30 rounded-[30px] p-8 hover:bg-white/[0.08] transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                                                <Wrench className="text-yellow-400" size={24} />
                                            </div>
                                            <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/60">
                                                {getCategoryName(svc.category)}
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold tracking-tight mb-4 text-white">{svc.name}</h3>

                                        <div className="mt-auto space-y-3">
                                            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                                <div className="text-[10px] uppercase tracking-wider text-white/30 font-bold">Standard Price</div>
                                                <div className="text-lg font-bold text-yellow-400 font-mono">AED {Number(svc.price).toLocaleString()}</div>
                                            </div>

                                            <div className="flex justify-between items-center px-4">
                                                <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Est. Cost</div>
                                                <div className="text-[11px] font-bold text-white/40 font-mono">AED {Number(svc.cost_price).toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </>
            ) : showForm ? (
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={() => setShowForm(false)}
                        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-10"
                    >
                        <ArrowLeft size={16} /> Cancel
                    </button>

                    <h2 className="text-3xl font-extrabold tracking-tighter mb-8">
                        {isEdit ? 'Edit Service' : 'New Service'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Service Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-yellow-500 font-medium transition-all text-white"
                                placeholder="e.g. Full Body Polish"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-yellow-500 font-medium transition-all text-white [&>option]:bg-black"
                            >
                                <option value="">-- Select Category --</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Selling Price (AED)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-yellow-500 font-medium transition-all text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Est. Cost Price (AED)</label>
                                <input
                                    type="number"
                                    value={formData.cost_price}
                                    onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-yellow-500 font-medium transition-all text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Department</label>
                                <select
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-yellow-500 font-medium transition-all text-white [&>option]:bg-black"
                                >
                                    <option value="">-- Select Department --</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Income Account</label>
                                <select
                                    value={formData.income_account}
                                    onChange={(e) => setFormData({ ...formData, income_account: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-yellow-500 font-medium transition-all text-white [&>option]:bg-black"
                                >
                                    <option value="">-- Default Account --</option>
                                    {accounts.filter(a => a.category === 'REVENUE' || a.category === 'INCOME').map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all ${formData.is_active ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}
                            >
                                {formData.is_active ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-red-400" />}
                                {formData.is_active ? 'Active Service' : 'Inactive'}
                            </button>
                        </div>

                        <div className="pt-8">
                            <button
                                type="submit"
                                className="w-full py-4 bg-yellow-400 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-yellow-300 transition-all shadow-xl shadow-yellow-400/20 text-black"
                            >
                                {isEdit ? 'Update Service' : 'Create Service'}
                            </button>
                        </div>

                    </form>
                </div>
            ) : null}
        </div>
    );
};

export default ServiceMaster;
