import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioTitle,
    PortfolioInput,
    PortfolioSelect,
    PortfolioButton,
    PortfolioBackButton
} from '../../components/PortfolioComponents';

const LeaveForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        employee_name: '',
        position: '',
        leave_type: 'ANNUAL',
        leave_period_from: new Date().toISOString().split('T')[0],
        leave_period_to: new Date().toISOString().split('T')[0],
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/forms/leaves/api/applications/', formData);
            alert('Leave Application Submitted');
            navigate('/leaves');
        } catch (err) {
            console.error('Error submitting leave', err);
            alert('Failed to submit application.');
        }
    };

    return (
        <PortfolioPage breadcrumb="Workforce Logistics / Leave Application">
            <PortfolioBackButton onClick={() => navigate('/leaves')} />

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <PortfolioTitle
                    subtitle="Submit a formal request for time off"
                    align="center"
                >
                    New Application
                </PortfolioTitle>

                <PortfolioCard style={{ marginTop: '40px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <PortfolioInput
                            name="employee_name"
                            label="Employee Name"
                            value={formData.employee_name}
                            onChange={handleChange}
                            required
                        />
                        <PortfolioInput
                            name="position"
                            label="Position / Role"
                            value={formData.position}
                            onChange={handleChange}
                            required
                        />

                        <PortfolioSelect
                            name="leave_type"
                            label="Reason for Leave"
                            value={formData.leave_type}
                            onChange={handleChange}
                            options={[
                                { value: 'ANNUAL', label: 'Annual Leave' },
                                { value: 'SICK', label: 'Sick Leave' },
                                { value: 'EMERGENCY', label: 'Emergency Leave' },
                                { value: 'UNPAID', label: 'Unpaid Leave' }
                            ]}
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <PortfolioInput
                                name="leave_period_from"
                                type="date"
                                label="Start Date"
                                value={formData.leave_period_from}
                                onChange={handleChange}
                                required
                            />
                            <PortfolioInput
                                name="leave_period_to"
                                type="date"
                                label="End Date"
                                value={formData.leave_period_to}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(232, 230, 227, 0.05)', borderRadius: '12px', border: '1px dashed rgba(232, 230, 227, 0.2)' }}>
                            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', textAlign: 'center', lineHeight: '1.5' }}>
                                By submitting this request, you acknowledge that approval is subject to operational requirements and manager discretion.
                            </p>
                        </div>

                        <PortfolioButton type="submit" variant="gold" style={{ width: '100%', justifyContent: 'center', height: '50px', marginTop: '10px' }}>
                            <Save size={18} style={{ marginRight: '10px' }} /> Submit Application
                        </PortfolioButton>
                    </form>
                </PortfolioCard>
            </div>
        </PortfolioPage>
    );
};

export default LeaveForm;
