import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Save, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioButton,
    PortfolioCard,
    PortfolioBackButton,
    PortfolioInput,
    PortfolioSelect,
    PortfolioTextarea
} from '../../components/PortfolioComponents';

const StockMovementEntry = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [items, setItems] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        item: location.state?.itemId || '',
        type: location.state?.type || 'IN',
        quantity: '',
        job_card: location.state?.jobCardId || '',
        reason: location.state?.jobCardId ? `Consumption for Job #${location.state.jobCardId}` : '',
        recorded_by: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [itemRes, jobRes] = await Promise.all([
                api.get('/forms/stock/api/items/'),
                api.get('/api/job-cards/api/jobs/')
            ]);
            setItems(itemRes.data);
            setJobs(jobRes.data);
        } catch (err) {
            console.error('Error fetching data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            await api.post('/forms/stock/api/movements/', formData);
            alert('Inventory Movement Recorded Successfully.');
            navigate('/stock');
        } catch (err) {
            console.error(err);
            alert('Failed to record movement. Check item selection & quantity.');
        }
    };

    if (loading) return (
        <PortfolioPage breadcrumb="Operations / Logistics / LEDGER">
            <div style={{ color: 'var(--cream)', padding: '100px', textAlign: 'center', opacity: 0.5 }}>SYNCING SUPPLY CHAIN LEDGER...</div>
        </PortfolioPage>
    );

    return (
        <PortfolioPage breadcrumb="Operations / Logistics / Ledger Entry">
            <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', marginBottom: '60px' }}>
                <PortfolioBackButton onClick={() => navigate('/stock')} />
                <PortfolioTitle subtitle="Record a material transaction to the workshop's permanent industrial ledger.">
                    Logistics Movement
                </PortfolioTitle>
            </div>

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <form onSubmit={handleSubmit}>
                    <PortfolioCard style={{ padding: '60px' }}>
                        <div style={{ marginBottom: '50px' }}>
                            <div style={sectionHeader}>1. TARGET ASSET</div>
                            <PortfolioSelect
                                label="SELECT INVENTORY ITEM"
                                name="item"
                                value={formData.item}
                                onChange={handleChange}
                                required
                                options={[
                                    { value: '', label: 'Select Item to Adjust...' },
                                    ...items.map(item => ({
                                        value: item.id,
                                        label: `${item.name.toUpperCase()} (${item.current_stock} ${item.unit} AVAILABLE)`
                                    }))
                                ]}
                            />
                        </div>

                        <div style={{ marginBottom: '50px' }}>
                            <div style={sectionHeader}>2. TRANSACTION PARAMETERS</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px', alignItems: 'flex-end' }}>
                                <div>
                                    <label style={labelTag}>MOVEMENT TYPE</label>
                                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                        <PortfolioButton
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'IN' })}
                                            variant={formData.type === 'IN' ? 'primary' : 'secondary'}
                                            style={{
                                                flex: 1,
                                                height: '60px',
                                                border: formData.type === 'IN' ? '1px solid #10b981' : '1px solid rgba(232, 230, 227, 0.1)',
                                                background: formData.type === 'IN' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                                color: formData.type === 'IN' ? '#10b981' : 'rgba(232, 230, 227, 0.4)'
                                            }}
                                        >
                                            <ArrowUpCircle size={18} /> RESTOCK
                                        </PortfolioButton>
                                        <PortfolioButton
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'OUT' })}
                                            variant={formData.type === 'OUT' ? 'primary' : 'secondary'}
                                            style={{
                                                flex: 1,
                                                height: '60px',
                                                border: formData.type === 'OUT' ? '1px solid #f43f5e' : '1px solid rgba(232, 230, 227, 0.1)',
                                                background: formData.type === 'OUT' ? 'rgba(244, 63, 94, 0.1)' : 'transparent',
                                                color: formData.type === 'OUT' ? '#f43f5e' : 'rgba(232, 230, 227, 0.4)'
                                            }}
                                        >
                                            <ArrowDownCircle size={18} /> CONSUMPTION
                                        </PortfolioButton>
                                    </div>
                                </div>
                                <PortfolioInput
                                    label="QUANTITY"
                                    name="quantity"
                                    type="number"
                                    step="0.01"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {formData.type === 'OUT' && (
                            <div style={{ marginBottom: '50px' }}>
                                <div style={sectionHeader}>3. ASSIGNMENT</div>
                                <PortfolioSelect
                                    label="LINK TO ACTIVE JOB CARD"
                                    name="job_card"
                                    value={formData.job_card}
                                    onChange={handleChange}
                                    options={[
                                        { value: '', label: 'Select job for material assignment...' },
                                        ...jobs.map(job => ({
                                            value: job.id,
                                            label: `${job.job_card_number} — ${job.customer_name} (${job.registration_number})`
                                        }))
                                    ]}
                                />
                            </div>
                        )}

                        <div style={{ marginBottom: '60px' }}>
                            <div style={sectionHeader}>{formData.type === 'OUT' ? '4. AUDIT TRAIL' : '3. AUDIT TRAIL'}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
                                <PortfolioTextarea
                                    label="LEGER NARRATIVE"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Explanation for this adjustment..."
                                />
                                <PortfolioInput
                                    label="AUTHORIZED BY"
                                    name="recorded_by"
                                    value={formData.recorded_by}
                                    onChange={handleChange}
                                    required
                                    placeholder="Officer Name"
                                />
                            </div>
                        </div>

                        <PortfolioButton
                            type="submit"
                            variant="primary"
                            style={{ width: '100%', height: '70px', fontSize: '14px' }}
                        >
                            <Save size={20} /> SYNCHRONIZE LEDGER
                        </PortfolioButton>
                    </PortfolioCard>
                </form>
            </div>
        </PortfolioPage>
    );
};

const sectionHeader = {
    fontSize: '11px',
    fontWeight: '900',
    color: 'var(--gold)',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: '30px',
    opacity: 0.8,
    borderBottom: '1px solid rgba(176, 141, 87, 0.2)',
    paddingBottom: '10px'
};

const labelTag = {
    fontSize: '13px',
    color: 'rgba(232, 230, 227, 0.6)',
    marginBottom: '10px',
    display: 'block',
    letterSpacing: '1px'
};

export default StockMovementEntry;
