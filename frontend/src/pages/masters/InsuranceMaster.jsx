import React, { useState, useEffect } from 'react';
import {
    Plus, Shield, Phone, Mail,
    Search, ChevronRight, ArrowLeft,
    CheckCircle, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import PageLoader from '../../components/PageLoader.jsx';

const InsuranceMaster = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contact_person: '',
        phone: '',
        email: '',
        trn: '',
        payment_terms: '',
        is_active: true
    });
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const res = await api.get('/masters/api/insurance-companies/');
            setCompanies(res.data.results || res.data);
        } catch (err) {
            console.error("Failed to fetch insurance companies", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (company = null) => {
        if (company) {
            setFormData({
                name: company.name,
                address: company.address || '',
                contact_person: company.contact_person || '',
                phone: company.phone || '',
                email: company.email || '',
                trn: company.trn || '',
                payment_terms: company.payment_terms || '',
                is_active: company.is_active
            });
            setIsEdit(true);
            setEditId(company.id);
        } else {
            setFormData({
                name: '', address: '', contact_person: '',
                phone: '', email: '', trn: '',
                payment_terms: '', is_active: true
            });
            setIsEdit(false);
            setEditId(null);
        }
        setShowForm(true);
        setSelectedCompany(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await api.put(`/masters/api/insurance-companies/${editId}/`, formData);
            } else {
                await api.post('/masters/api/insurance-companies/', formData);
            }
            fetchCompanies();
            setShowForm(false);
        } catch (err) {
            console.error("Error saving insurance company", err);
            alert("Error saving insurance company: " + JSON.stringify(err.response?.data || err.message));
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen text-white">
            {!showForm && !selectedCompany ? (
                <>
                    <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-3 mb-2"
                            >
                                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                    <Shield className="text-blue-400" size={24} />
                                </div>
                                <span className="text-[10px] uppercase tracking-[3px] font-bold text-blue-400">Claims & Partners</span>
                            </motion.div>
                            <h1 className="text-4xl font-extrabold tracking-tight">Insurance Companies</h1>
                            <p className="text-white/40 mt-2 font-medium">Manage insurance partners and billing terms.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleOpen()}
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                            >
                                <Plus size={16} />
                                Add Partner
                            </button>
                        </div>
                    </header>

                    {/* Company Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {companies.map((comp, idx) => (
                                <motion.div
                                    key={comp.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => handleOpen(comp)}
                                    className="group bg-white/5 border border-white/10 hover:border-blue-500/30 rounded-[30px] p-8 hover:bg-white/[0.08] transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                                <Shield className="text-blue-400" size={24} />
                                            </div>
                                            {comp.is_active ? (
                                                <div className="px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20 text-[10px] font-bold uppercase tracking-wider text-green-400">
                                                    Active
                                                </div>
                                            ) : (
                                                <div className="px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20 text-[10px] font-bold uppercase tracking-wider text-red-400">
                                                    Inactive
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-bold tracking-tight mb-2 text-white">{comp.name}</h3>
                                        <div className="text-xs text-white/40 mb-6">{comp.address}</div>

                                        <div className="mt-auto space-y-3">
                                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                                <Phone size={14} className="text-white/40" />
                                                <div className="text-xs font-bold text-white/80">{comp.phone || 'N/A'}</div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                                <Mail size={14} className="text-white/40" />
                                                <div className="text-xs font-bold text-white/80 truncate">{comp.email || 'N/A'}</div>
                                            </div>
                                            {comp.payment_terms && (
                                                <div className="flex items-center gap-2 px-1">
                                                    <FileText size={12} className="text-blue-400" />
                                                    <div className="text-[10px] font-mono text-blue-400">{comp.payment_terms}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {companies.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-white/20 text-lg">No insurance companies registered.</p>
                        </div>
                    )}
                </>
            ) : showForm ? (
                <div className="max-w-3xl mx-auto">
                    <button
                        onClick={() => setShowForm(false)}
                        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-10"
                    >
                        <ArrowLeft size={16} /> Cancel
                    </button>

                    <h2 className="text-3xl font-extrabold tracking-tighter mb-8">
                        {isEdit ? 'Update Partner' : 'Register Insurance Partner'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Company Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 font-medium transition-all text-white"
                                    placeholder="e.g. AXA Insurance"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">TRN / Tax ID</label>
                                <input
                                    type="text"
                                    value={formData.trn}
                                    onChange={(e) => setFormData({ ...formData, trn: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 font-medium transition-all text-white"
                                    placeholder="Tax Registration Number"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Address</label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                rows={2}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 font-medium transition-all resize-none text-white"
                                placeholder="Headquarters Address..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Contact Person</label>
                                <input
                                    type="text"
                                    value={formData.contact_person}
                                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 font-medium transition-all text-white"
                                    placeholder="Account Manager"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Phone</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 font-medium transition-all text-white"
                                    placeholder="+971..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 font-medium transition-all text-white"
                                    placeholder="claims@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Payment Terms</label>
                            <input
                                type="text"
                                value={formData.payment_terms}
                                onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 font-medium transition-all text-white"
                                placeholder="e.g. 30 Days Credit, LPO Required"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all ${formData.is_active ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}
                            >
                                {formData.is_active ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-red-400" />}
                                {formData.is_active ? 'Active Partner' : 'Inactive'}
                            </button>
                        </div>

                        <div className="pt-8">
                            <button
                                type="submit"
                                className="w-full py-4 bg-blue-600 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
                            >
                                {isEdit ? 'Update Details' : 'Register Company'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}
        </div>
    );
};

export default InsuranceMaster;
