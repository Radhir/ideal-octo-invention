import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { UserPlus, Save, Shield, LayoutGrid, RotateCcw, MapPin, Globe, CreditCard } from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioCard,
    PortfolioGrid,
    PortfolioInput,
    PortfolioSelect,
    PortfolioTextarea,
    PortfolioButton,
    PortfolioBackButton
} from '../../components/PortfolioComponents';

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

    const [profileImage, setProfileImage] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== undefined) {
                submitData.append(key, formData[key]);
            }
        });

        if (profileImage) {
            submitData.append('profile_image', profileImage);
        }

        try {
            await api.patch(`/hr/api/employees/${id}/`, submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/hr');
        } catch (err) {
            console.error(err);
            alert('Failed to update employee.');
        }
    };

    if (loading) return (
        <PortfolioPage>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--gold)' }}>
                Syncing with Archive...
            </div>
        </PortfolioPage>
    );

    return (
        <PortfolioPage breadcrumb="Human Capital / Edit Profile">
            <PortfolioBackButton onClick={() => navigate('/hr')} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioTitle
                    subtitle={`Modifying active personnel record for ${formData.full_name || '...'} | ID: ${formData.employee_id || '...'}`}
                >
                    Update Dossier
                </PortfolioTitle>
                <div style={{
                    padding: '10px 20px',
                    background: 'rgba(232, 230, 227, 0.05)',
                    borderRadius: '50px',
                    border: '1px solid rgba(232, 230, 227, 0.1)',
                    fontSize: '11px',
                    color: 'var(--gold)',
                    fontWeight: '800',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                }}>
                    Status: Active
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <PortfolioGrid columns="1fr 1fr">

                    {/* Reuse similar structure to Registration */}
                    <PortfolioCard>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', color: 'var(--gold)' }}>
                            <UserPlus size={18} />
                            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>Identity Portfolio</span>
                        </div>

                        <PortfolioGrid columns="1fr 2fr">
                            <PortfolioInput
                                label="Employee ID"
                                name="employee_id"
                                value={formData.employee_id}
                                onChange={handleChange}
                                required
                            />
                            <PortfolioInput
                                label="Full Legal Name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                            />
                        </PortfolioGrid>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '10px',
                                color: 'var(--gold)',
                                fontSize: '11px',
                                fontWeight: '800',
                                letterSpacing: '1px',
                                textTransform: 'uppercase'
                            }}>
                                Profile Photograph
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    background: 'rgba(232, 230, 227, 0.05)',
                                    border: '1px solid rgba(232, 230, 227, 0.1)',
                                    borderRadius: '8px',
                                    color: 'var(--cream)',
                                    fontSize: '13px'
                                }}
                            />
                            {formData.profile_image && !profileImage && (
                                <div style={{ marginTop: '10px', fontSize: '11px', color: 'gray' }}>
                                    Current: <a href={formData.profile_image} target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>View Image</a>
                                </div>
                            )}
                        </div>

                        <PortfolioGrid columns="1fr 1fr">
                            <PortfolioSelect
                                label="Gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </PortfolioSelect>

                            <PortfolioInput
                                label="Nationality"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                            />
                        </PortfolioGrid>

                        <PortfolioGrid columns="1fr 1fr">
                            <PortfolioInput
                                label="Date of Birth"
                                name="dob"
                                type="date"
                                value={formData.dob}
                                onChange={handleChange}
                            />
                            <PortfolioSelect
                                label="Marital Status"
                                name="marital_status"
                                value={formData.marital_status}
                                onChange={handleChange}
                            >
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                            </PortfolioSelect>
                        </PortfolioGrid>

                        <PortfolioInput
                            label="Security PIN (Access Control)"
                            name="pin_code"
                            type="number"
                            value={formData.pin_code}
                            onChange={handleChange}
                            required
                        />
                    </PortfolioCard>

                    {/* section 2: professional */}
                    <PortfolioCard>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', color: 'var(--gold)' }}>
                            <LayoutGrid size={18} />
                            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>Deployment Protocols</span>
                        </div>

                        <PortfolioSelect
                            label="Department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                        >
                            <option value="">Select Department</option>
                            {['Cyber Security', 'IT & Development', 'Engineering', 'HR & Admin', 'Sales', 'Executive Office', 'Operations', 'Finance'].map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </PortfolioSelect>

                        <PortfolioGrid columns="1fr 1fr">
                            <PortfolioInput
                                label="Position / Role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            />
                            <PortfolioInput
                                label="Reporting Manager"
                                name="manager"
                                value={formData.manager}
                                onChange={handleChange}
                            />
                        </PortfolioGrid>

                        <PortfolioGrid columns="1fr 1fr">
                            <PortfolioInput
                                label="Joining Date"
                                name="date_joined"
                                type="date"
                                value={formData.date_joined}
                                onChange={handleChange}
                            />
                            <PortfolioInput
                                label="Work Email"
                                name="workEmail"
                                type="email"
                                value={formData.workEmail}
                                onChange={handleChange}
                            />
                        </PortfolioGrid>

                        <PortfolioGrid columns="1fr 1fr">
                            <PortfolioSelect
                                label="Compensation Model"
                                name="salary_type"
                                value={formData.salary_type}
                                onChange={handleChange}
                            >
                                <option value="MONTHLY">Monthly Salary</option>
                                <option value="DAILY">Daily Rate</option>
                                <option value="HOURLY">Hourly Rate</option>
                            </PortfolioSelect>
                            <PortfolioInput
                                label="Base Rate (AED)"
                                name="basic_salary"
                                type="number"
                                value={formData.basic_salary}
                                onChange={handleChange}
                            />
                        </PortfolioGrid>
                    </PortfolioCard>
                    {/* section 3: locations */}
                    <PortfolioCard>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', color: 'var(--gold)' }}>
                            <MapPin size={18} />
                            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>UAE Assignment</span>
                        </div>

                        <PortfolioInput
                            label="Residential Address"
                            name="uae_address"
                            value={formData.uae_address}
                            onChange={handleChange}
                        />
                        <PortfolioInput
                            label="Primary Mobile"
                            name="uae_mobile"
                            value={formData.uae_mobile}
                            onChange={handleChange}
                        />

                        <div style={{
                            background: 'rgba(232, 230, 227, 0.05)',
                            padding: '20px',
                            borderRadius: '12px',
                            border: '1px solid rgba(232, 230, 227, 0.1)',
                            marginTop: '20px'
                        }}>
                            <div style={{ fontSize: '10px', color: 'var(--gold)', marginBottom: '15px', fontWeight: '900', textTransform: 'uppercase' }}>Emergency Local Contact</div>
                            <PortfolioGrid columns="1fr 1fr">
                                <PortfolioInput placeholder="Contact Name" name="uae_emer_name" value={formData.uae_emer_name} onChange={handleChange} style={{ marginBottom: 0 }} />
                                <PortfolioInput placeholder="Relation" name="uae_emer_relation" value={formData.uae_emer_relation} onChange={handleChange} style={{ marginBottom: 0 }} />
                            </PortfolioGrid>
                            <PortfolioInput placeholder="Contact Mobile" name="uae_emer_phone" value={formData.uae_emer_phone} onChange={handleChange} style={{ marginBottom: 0, marginTop: '15px' }} />
                        </div>
                    </PortfolioCard>

                    <PortfolioCard>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', color: 'rgba(255, 255, 255, 0.5)' }}>
                            <Globe size={18} />
                            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>Home Country Repository</span>
                        </div>

                        <PortfolioInput
                            label="Country of Origin"
                            name="home_country"
                            value={formData.home_country}
                            onChange={handleChange}
                        />
                        <PortfolioInput
                            label="Permanent Address"
                            name="home_address"
                            value={formData.home_address}
                            onChange={handleChange}
                        />

                        <div style={{
                            background: 'rgba(232, 230, 227, 0.02)',
                            padding: '20px',
                            borderRadius: '12px',
                            border: '1px solid rgba(232, 230, 227, 0.05)',
                            marginTop: '20px'
                        }}>
                            <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '15px', fontWeight: '900', textTransform: 'uppercase' }}>Global Emergency Node</div>
                            <PortfolioGrid columns="1fr 1fr">
                                <PortfolioInput placeholder="Home Contact Name" name="home_emer_name" value={formData.home_emer_name} onChange={handleChange} style={{ marginBottom: 0 }} />
                                <PortfolioInput placeholder="Relation" name="home_emer_relation" value={formData.home_emer_relation} onChange={handleChange} style={{ marginBottom: 0 }} />
                            </PortfolioGrid>
                            <PortfolioInput placeholder="International Mobile" name="home_emer_phone" value={formData.home_emer_phone} onChange={handleChange} style={{ marginBottom: 0, marginTop: '15px' }} />
                        </div>
                    </PortfolioCard>
                </PortfolioGrid>

                {/* section 4: compliance & skills */}
                <PortfolioCard style={{ marginTop: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', color: 'var(--gold)' }}>
                        <Shield size={18} />
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>Compliance & Competencies</span>
                    </div>

                    <PortfolioGrid columns="repeat(4, 1fr)">
                        <PortfolioInput label="Passport Number" name="passport_no" value={formData.passport_no} onChange={handleChange} />
                        <PortfolioInput label="Passport Expiry" name="passport_expiry" type="date" value={formData.passport_expiry} onChange={handleChange} />
                        <PortfolioInput label="Visa UID" name="visa_uid" value={formData.visa_uid} onChange={handleChange} />
                        <PortfolioInput label="Visa Expiry" name="visa_expiry" type="date" value={formData.visa_expiry} onChange={handleChange} />
                    </PortfolioGrid>

                    <PortfolioTextarea
                        label="Skill Set Synopsis"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="List operational capabilities..."
                        rows={4}
                    />
                </PortfolioCard>


                <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                    <PortfolioButton variant="secondary" onClick={() => navigate('/hr')} type="button">
                        <RotateCcw size={18} style={{ marginRight: '8px' }} />
                        Discard Changes
                    </PortfolioButton>
                    <PortfolioButton variant="gold" type="submit" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px 50px' }}>
                        <Save size={20} /> UPDATE ARCHIVE RECORD
                    </PortfolioButton>
                </div>
            </form>
        </PortfolioPage>
    );
};

export default EmployeeEdit;
