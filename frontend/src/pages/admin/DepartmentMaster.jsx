import React, { useState, useEffect } from 'react';
import {
    Plus, Building, Users, DollarSign,
    Search, ChevronRight, ArrowLeft,
    Briefcase, User, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import PageLoader from '../../components/PageLoader.jsx';

const DepartmentMaster = () => {
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        head: '',
        income_account: '',
        expense_account: '',
        monthly_sales_target: 0,
        monthly_expense_budget: 0
    });
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [deptRes, empRes, accRes] = await Promise.all([
                api.get('/hr/api/departments/'),
                api.get('/hr/api/employees/'),
                api.get('/finance/api/accounts/')
            ]);
            setDepartments(deptRes.data.results || deptRes.data);
            setEmployees(empRes.data.results || empRes.data);
            setAccounts(accRes.data.results || accRes.data);
        } catch (err) {
            console.error("Failed to fetch initial data", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/hr/api/departments/');
            setDepartments(res.data.results || res.data);
        } catch (err) {
            console.error("Failed to fetch departments", err);
        }
    };

    const handleOpen = (dept = null) => {
        if (dept) {
            setFormData({
                name: dept.name,
                description: dept.description || '',
                head: dept.head || '',
                income_account: dept.income_account || '',
                expense_account: dept.expense_account || '',
                monthly_sales_target: dept.monthly_sales_target || 0,
                monthly_expense_budget: dept.monthly_expense_budget || 0
            });
            setIsEdit(true);
            setEditId(dept.id);
        } else {
            setFormData({
                name: '', description: '', head: '',
                income_account: '', expense_account: '',
                monthly_sales_target: 0, monthly_expense_budget: 0
            });
            setIsEdit(false);
            setEditId(null);
        }
        setShowForm(true);
        setSelectedDepartment(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                head: formData.head === '' ? null : formData.head,
                income_account: formData.income_account === '' ? null : formData.income_account,
                expense_account: formData.expense_account === '' ? null : formData.expense_account,
            };

            if (isEdit) {
                await api.put(`/hr/api/departments/${editId}/`, payload);
            } else {
                await api.post('/hr/api/departments/', payload);
            }
            fetchDepartments();
            setShowForm(false);
        } catch (err) {
            console.error("Error saving department", err);
            alert("Error saving department: " + JSON.stringify(err.response?.data || err.message));
        }
    };

    const getEmployeeName = (id) => {
        const emp = employees.find(e => e.id === id);
        return emp ? emp.full_name : 'N/A';
    };

    const getAccountName = (id) => {
        const acc = accounts.find(a => a.id === id);
        return acc ? `${acc.code} - ${acc.name}` : 'N/A';
    };

    if (loading) return <PageLoader />;

    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen text-white">
            {!showForm && !selectedDepartment ? (
                <>
                    <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-3 mb-2"
                            >
                                <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                    <Layers className="text-purple-400" size={24} />
                                </div>
                                <span className="text-[10px] uppercase tracking-[3px] font-bold text-purple-400">Organizational Structure</span>
                            </motion.div>
                            <h1 className="text-4xl font-extrabold tracking-tight">Department Masters</h1>
                            <p className="text-white/40 mt-2 font-medium">Define operational units and cost centers.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleOpen()}
                                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20"
                            >
                                <Plus size={16} />
                                New Department
                            </button>
                        </div>
                    </header>

                    {/* Department Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {departments.map((dept, idx) => (
                                <motion.div
                                    key={dept.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => handleOpen(dept)}
                                    className="group bg-white/5 border border-white/10 hover:border-purple-500/30 rounded-[30px] p-8 hover:bg-white/[0.08] transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="flex flex-col h-full">
                                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
                                            <Briefcase className="text-purple-400" size={28} />
                                        </div>

                                        <h3 className="text-xl font-bold tracking-tight mb-2 text-white">{dept.name}</h3>
                                        {dept.description && (
                                            <p className="text-xs text-white/40 line-clamp-2 mb-6 h-8">{dept.description}</p>
                                        )}

                                        <div className="mt-auto space-y-3">
                                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                                <User size={14} className="text-white/40" />
                                                <div>
                                                    <div className="text-[9px] uppercase tracking-wider text-white/30 font-bold">Head of Dept</div>
                                                    <div className="text-xs font-bold text-white/80">{getEmployeeName(dept.head)}</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                                    <div className="text-[9px] uppercase tracking-wider text-white/30 font-bold mb-1">Target</div>
                                                    <div className="text-xs font-bold text-green-400">AED {dept.monthly_sales_target?.toLocaleString() || '0'}</div>
                                                </div>
                                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                                    <div className="text-[9px] uppercase tracking-wider text-white/30 font-bold mb-1">Budget</div>
                                                    <div className="text-xs font-bold text-red-400">AED {dept.monthly_expense_budget?.toLocaleString() || '0'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {departments.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-white/20 text-lg">No departments defined yet.</p>
                        </div>
                    )}
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
                        {isEdit ? 'Edit Department' : 'Create Department'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Department Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 font-medium transition-all text-white"
                                placeholder="e.g. Sales, Operations, HR"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 font-medium transition-all resize-none text-white"
                                placeholder="Department function and scope..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Head of Department</label>
                            <select
                                value={formData.head}
                                onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 font-medium transition-all text-white [&>option]:bg-black"
                            >
                                <option value="">-- Select Employee --</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.employee_id})</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Income Account
                                </label>
                                <select
                                    value={formData.income_account}
                                    onChange={(e) => setFormData({ ...formData, income_account: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 font-medium transition-all text-white [&>option]:bg-black"
                                >
                                    <option value="">-- Default Revenue --</option>
                                    {accounts.filter(a => a.category === 'REVENUE' || a.category === 'INCOME').map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Expense Account
                                </label>
                                <select
                                    value={formData.expense_account}
                                    onChange={(e) => setFormData({ ...formData, expense_account: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 font-medium transition-all text-white [&>option]:bg-black"
                                >
                                    <option value="">-- Default Expense --</option>
                                    {accounts.filter(a => a.category === 'EXPENSE').map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Monthly Sales Target</label>
                                <input
                                    type="number"
                                    value={formData.monthly_sales_target}
                                    onChange={(e) => setFormData({ ...formData, monthly_sales_target: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 font-medium transition-all text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Monthly Expense Budget</label>
                                <input
                                    type="number"
                                    value={formData.monthly_expense_budget}
                                    onChange={(e) => setFormData({ ...formData, monthly_expense_budget: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 font-medium transition-all text-white"
                                />
                            </div>
                        </div>

                        <div className="pt-8">
                            <button
                                type="submit"
                                className="w-full py-4 bg-purple-600 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-purple-500 transition-all shadow-xl shadow-purple-600/20"
                            >
                                {isEdit ? 'Update Department' : 'Create Department'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}
        </div>
    );
};

export default DepartmentMaster;
