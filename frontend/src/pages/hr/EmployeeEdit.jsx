import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { UserPlus, ArrowLeft, Save, Shield, DollarSign, Calendar } from 'lucide-react';

const EmployeeEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        employee_id: '',
        full_name: '',
        nationality: '',
        gender: 'Male',
        dob: '',
        marital_status: 'Single',
        department: '',
        role: '',
        pin_code: '',
        manager: '',
        date_joined: '',
        salary_type: 'MONTHLY',
        basic_salary: '0.00',
        workEmail: '',
        uae_address: '',
        uae_mobile: '',
        uae_emer_name: '',
        uae_emer_relation: '',
        uae_emer_phone: '',
        home_country: '',
        home_address: '',
        home_mobile: '',
        home_emer_name: '',
        home_emer_relation: '',
        home_emer_phone: '',
        passport_no: '',
        passport_expiry: '',
        visa_uid: '',
        visa_expiry: '',
        skills: ''
    });

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const res = await api.get(`/hr/api/employees/${id}/`);
                const data = res.data;
                // Map API keys to form keys if needed, but since they match in Registration mostly:
                setFormData({
                    ...data,
                    fullName: data.full_name // for consistency with reg form if used
                });
            } catch (err) {
                console.error('Error fetching employee', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/hr/api/employees/${id}/`, formData);
            alert('Personnel Record Updated Successfully.');
            navigate('/hr');
        } catch (err) {
            console.error(err);
            alert('Failed to update employee.');
        }
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center', color: 'var(--gold)' }}>Syncing with Archive...</div>;

    return (
        <div style={{ padding: '40px 30px', background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        onClick={() => navigate('/hr')}
                        style={{ background: 'var(--input-bg)', border: '1.5px solid var(--gold-border)', padding: '12px', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <ArrowLeft size={20} color="var(--gold)" />
                    </button>
                    <div>
                        <div style={{ color: 'var(--gold)', fontWeight: '900', letterSpacing: '4px', fontSize: '10px', marginBottom: '5px', textTransform: 'uppercase' }}>Human Capital Management</div>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>EDIT PROFILE</h1>
                        <p style={{ color: 'var(--gold)', fontSize: '12px', fontWeight: '800', margin: '5px 0 0 0' }}>{formData.full_name} | {formData.employee_id}</p>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>

                    {/* Reuse similar structure to Registration */}
                    <GlassCard style={{ padding: '40px', border: '1.5px solid var(--gold-border)', background: 'var(--input-bg)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', borderBottom: '1.5px solid var(--gold-border)', paddingBottom: '20px' }}>
                            <UserPlus size={24} color="var(--gold)" />
                            <h3 style={{ fontFamily: 'Outfit, sans-serif', margin: 0, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Personal Identity Portfolio</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
                            <FormGroup label="Employee ID" name="employee_id" value={formData.employee_id} onChange={handleChange} required />
                            <FormGroup label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} required />
                            <FormGroup label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} />
                            <FormGroup label="Gender" name="gender" type="select" options={['Male', 'Female']} value={formData.gender} onChange={handleChange} />
                            <FormGroup label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                            <FormGroup label="Marital Status" name="marital_status" type="select" options={['Single', 'Married', 'Divorced']} value={formData.marital_status} onChange={handleChange} />
                            <FormGroup label="Security PIN" name="pin_code" type="number" value={formData.pin_code} onChange={handleChange} required />
                        </div>
                    </GlassCard>

                    <GlassCard style={{ padding: '40px', border: '1.5px solid var(--gold-border)', background: 'var(--input-bg)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', borderBottom: '1.5px solid var(--gold-border)', paddingBottom: '20px' }}>
                            <Shield size={24} color="var(--gold)" />
                            <h3 style={{ fontFamily: 'Outfit, sans-serif', margin: 0, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Professional Deployment</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
                            <FormGroup label="Department" name="department" value={formData.department} onChange={handleChange} />
                            <FormGroup label="Position / Role" name="role" value={formData.role} onChange={handleChange} />
                            <FormGroup label="Reporting Manager" name="manager" value={formData.manager} onChange={handleChange} />
                            <FormGroup label="Joining Date" name="date_joined" type="date" value={formData.date_joined} onChange={handleChange} />
                            <FormGroup label="Salary Type" name="salary_type" type="select" options={['MONTHLY', 'DAILY', 'HOURLY']} value={formData.salary_type} onChange={handleChange} />
                            <FormGroup label="Base Rate / Salary (AED)" name="basic_salary" type="number" value={formData.basic_salary} onChange={handleChange} />
                        </div>
                    </GlassCard>

                    <button type="submit" className="glass-card" style={{ height: '80px', fontSize: '1.25rem', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', background: 'var(--gold)', color: '#000', border: '1.5px solid var(--gold-border)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '2px' }}>
                        <Save size={28} /> UPDATE ARCHIVE RECORD
                    </button>
                </div>
            </form>
        </div>
    );
};

const FormGroup = ({ label, name, value, onChange, type = 'text', options = [], required = false, placeholder = '' }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label className="form-label" style={{ color: 'var(--gold)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '900' }}>{label}</label>
        {type === 'select' ? (
            <select name={name} className="form-control" value={value || ''} onChange={onChange} required={required} style={{ background: 'var(--input-bg)', border: '1.5px solid var(--gold-border)', color: 'var(--text-primary)', fontWeight: '900', height: '45px' }}>
                {options.map(opt => <option key={opt} value={opt} style={{ background: 'var(--bg-primary)' }}>{opt}</option>)}
            </select>
        ) : (
            <input
                name={name}
                type={type}
                className="form-control"
                value={value || ''}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                style={{ background: 'var(--input-bg)', border: '1.5px solid var(--gold-border)', color: 'var(--text-primary)', fontWeight: '900', height: '45px' }}
            />
        )}
    </div>
);

export default EmployeeEdit;
