import React, { useState, useEffect, useCallback } from 'react';
import { Check, Star, Shield, Zap } from 'lucide-react';
import api from '../../api/axios';
import {
    PortfolioCard,
    PortfolioGrid,
    PortfolioButton,
    PortfolioSectionTitle
} from '../PortfolioComponents';

const MembershipTab = ({ customerId }) => {
    const [plans, setPlans] = useState([]);
    const [mySubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const loadData = useCallback(async () => {
        try {
            const plansRes = await api.get('/subscriptions/plans/');
            setPlans(plansRes.data.results || plansRes.data);
        } catch (err) {
            console.error("Error loading membership data", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData, customerId]);

    const handleSubscribe = async (planId) => {
        setSubmitting(true);
        try {
            await api.post('/subscriptions/my-subscriptions/subscribe/', {
                plan_id: planId,
                customer_id: customerId
            });
            alert("Membership activated successfully!");
            loadData();
        } catch (err) {
            alert("Failed to subscribe: " + (err.response?.data?.error || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    const getPlanIcon = (name) => {
        if (name.toLowerCase().includes('gold') || name.toLowerCase().includes('premium')) return Zap;
        if (name.toLowerCase().includes('silver') || name.toLowerCase().includes('plus')) return Shield;
        return Star;
    };

    if (loading) return (
        <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.4)', letterSpacing: '2px', fontSize: '11px', fontWeight: '800' }}>
            RETRIEVING PRIVILEGE TIERS...
        </div>
    );

    return (
        <div style={{ padding: '40px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                <PortfolioSectionTitle style={{ marginBottom: '15px' }}>Upgrade Your Ownership Experience</PortfolioSectionTitle>
                <p style={{ color: 'rgba(232, 230, 227, 0.5)', maxWidth: '600px', margin: '0 auto', fontSize: '15px' }}>
                    Join our exclusive membership ecosystem for priority workshop access, bespoke service rates, and strategic maintenance planning.
                </p>
            </div>

            <PortfolioGrid columns="repeat(auto-fit, minmax(360px, 1fr))" gap="40px">
                {plans.map((plan) => {
                    const isCurrent = mySubscription?.plan?.id === plan.id;
                    const PlanIcon = getPlanIcon(plan.name);

                    return (
                        <PortfolioCard
                            key={plan.id}
                            style={{
                                padding: '60px 40px',
                                display: 'flex',
                                flexDirection: 'column',
                                textAlign: 'center',
                                border: isCurrent ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.05)',
                                background: isCurrent ? 'rgba(176, 141, 87, 0.05)' : 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                                position: 'relative'
                            }}
                            className="workflow-card"
                        >
                            {isCurrent && (
                                <div style={{
                                    position: 'absolute', top: '25px', left: '50%', transform: 'translateX(-50%)',
                                    fontSize: '9px', fontWeight: '900', color: '#000', background: 'var(--gold)',
                                    padding: '6px 16px', borderRadius: '30px', letterSpacing: '2px',
                                    boxShadow: '0 10px 20px rgba(176,141,87,0.3)'
                                }}>
                                    ACTIVE PROTOCOL
                                </div>
                            )}

                            <div style={{ marginBottom: '40px' }}>
                                <div style={{
                                    width: '64px', height: '64px', borderRadius: '16px',
                                    background: 'rgba(176, 141, 87, 0.1)', color: 'var(--gold)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px auto',
                                    border: '1px solid rgba(176,141,87,0.2)'
                                }}>
                                    <PlanIcon size={32} strokeWidth={1} />
                                </div>
                                <h3 style={{ fontSize: '26px', fontWeight: '300', fontFamily: 'var(--font-serif)', color: 'var(--cream)', margin: '0 0 15px 0', letterSpacing: '1px' }}>{plan.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '13px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '1px' }}>{plan.currency}</span>
                                    <span style={{ fontSize: '56px', fontWeight: '100', fontFamily: 'var(--font-serif)', color: 'var(--cream)', lineHeight: 1 }}>{parseFloat(plan.price).toLocaleString()}</span>
                                    <span style={{ fontSize: '10px', color: 'rgba(232, 230, 227, 0.3)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>/ {plan.interval.toLowerCase()}</span>
                                </div>
                            </div>

                            <div style={{ flexGrow: 1, marginBottom: '50px', textAlign: 'left' }}>
                                <div style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '900', letterSpacing: '2px', marginBottom: '25px', textAlign: 'center', opacity: 0.5 }}>PRIVILEGE MATRIX</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                    {(plan.features || ['Standard benefits']).map((feature, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                                            <Check size={14} color="var(--gold)" style={{ marginTop: '2px', flexShrink: 0 }} />
                                            <span style={{ fontSize: '14px', color: 'rgba(232, 230, 227, 0.6)', lineHeight: '1.5', fontWeight: '300' }}>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <PortfolioButton
                                variant={isCurrent ? "secondary" : "gold"}
                                disabled={isCurrent || submitting}
                                onClick={() => handleSubscribe(plan.id)}
                                style={{ width: '100%', height: '60px', fontSize: '11px' }}
                            >
                                {submitting ? 'PROCESSING...' : isCurrent ? 'ESTABLISHED' : `ACTIVATE ${plan.name.toUpperCase()}`}
                            </PortfolioButton>
                        </PortfolioCard>
                    );
                })}
            </PortfolioGrid>
        </div>
    );
};

export default MembershipTab;
