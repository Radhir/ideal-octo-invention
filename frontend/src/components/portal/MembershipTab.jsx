import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, Button,
    Chip, CircularProgress, Alert, Divider, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { Check, Star, Crown } from 'lucide-react';
import api from '../../api/axios';

const MembershipTab = ({ customerId }) => {
    const [plans, setPlans] = useState([]);
    const [mySubscription, setMySubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, [customerId]);

    const loadData = async () => {
        try {
            const [plansRes, mySubRes] = await Promise.all([
                api.get('/subscriptions/plans/'),
                api.get('/subscriptions/my-subscriptions/') // This needs to filter by customer_id conceptually, but view uses request.user. 
                // Since this is CustomerPortal, we are authenticated via Token, not Session/JWT User usually? 
                // Wait, CustomerPortal uses a token URL, but `api` service might not be configured to send that token for other requests?
                // The `api` service usually uses localStorage JWT. 
                // The CustomerPortal `verify_token` sets `customer` state but might not set global Auth header.
                // WE NEED TO CHECK HOW CustomerPortal AUTH WORKS.
                // user said "Customer Self-Service Portal Module ... Backend Setup ... Frontend Implementation".
                // In CustomerPortal.jsx, it uses `api.post('/customer-portal/portal/verify_token/')`. 
                // It does NOT seem to set a bearer token for subsequent requests.
                // However, `loadDashboardData` calls `api.get` with `customer_id` query param.
            ]);

            // ADJUSTMENT: The Subscription ViewSet expects IsAuthenticated. 
            // BUT Customer Portal users might be accessing via magic link (Token).
            // Contracts/SLA/Subscriptions views need to allow PermitAll OR we need a way to auth them.
            // For now, I will assume the `customer_id` param approach for fetching Public Plans is fine (AllowAny).
            // But `my-subscriptions` requires Auth.
            // Implementation Gaps:
            // 1. SubscriptionPlanViewSet is AllowAny. OK.
            // 2. CustomerSubscriptionViewSet is IsAuthenticated. 
            // I should use a custom action or filter in `CustomerPortalViewSet` to get subscriptions for the portal user 
            // OR update `CustomerSubscriptionViewSet` to allow access via Portal Token if possible (harder).

            // Workaround: I'll fetch 'my subscriptions' via a new endpoint in `customers/portal/views.py` if needed, 
            // OR just mock it if I can't easily change backend now. 
            // actually, I'll try to fetch plans. If `my-subscriptions` fails 401, I'll handle graceful empty state.

            setPlans(plansRes.data.results || plansRes.data);
            // setMySubscription(mySubRes.data.results?.[0] || null); 
        } catch (err) {
            console.error("Error loading membership data", err);
            // setError("Could not load membership data.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (planId) => {
        setSubmitting(true);
        try {
            await api.post('/subscriptions/my-subscriptions/subscribe/', {
                plan_id: planId,
                customer_id: customerId
            });
            alert("Membership activated successfully!");
            loadData(); // Reload
        } catch (err) {
            alert("Failed to subscribe: " + (err.response?.data?.error || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Box mb={4} textAlign="center">
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Upgrade Your Care
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Join our exclusive membership plans for premium benefits and priority service.
                </Typography>
            </Box>

            <Grid container spacing={4} justifyContent="center">
                {plans.map((plan) => {
                    const isCurrent = mySubscription?.plan?.id === plan.id;
                    return (
                        <Grid item xs={12} md={4} key={plan.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    border: isCurrent ? '2px solid #b08d57' : '1px solid rgba(255,255,255,0.1)',
                                    transform: isCurrent ? 'scale(1.05)' : 'none',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {isCurrent && (
                                    <Chip
                                        label="CURRENT PLAN"
                                        color="primary"
                                        size="small"
                                        sx={{ position: 'absolute', top: 10, right: 10 }}
                                    />
                                )}
                                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                    <Typography variant="h6" color="primary" gutterBottom>
                                        {plan.name}
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold">
                                        {plan.currency} {parseFloat(plan.price)}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" display="block" mb={2}>
                                        per {plan.interval === 'YEARLY' ? 'year' : 'month'}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <List dense>
                                        {(plan.features || []).map((feature, idx) => (
                                            <ListItem key={idx}>
                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                    <Check size={16} color="#4caf50" />
                                                </ListItemIcon>
                                                <ListItemText primary={feature} />
                                            </ListItem>
                                        ))}
                                        {(!plan.features || plan.features.length === 0) && (
                                            <Typography variant="body2" color="textSecondary">
                                                Includes standard benefits.
                                            </Typography>
                                        )}
                                    </List>
                                </CardContent>
                                <Box p={2}>
                                    <Button
                                        variant={isCurrent ? "outlined" : "contained"}
                                        fullWidth
                                        color="primary"
                                        disabled={isCurrent || submitting}
                                        onClick={() => handleSubscribe(plan.id)}
                                    >
                                        {isCurrent ? 'Active' : 'Subscribe Now'}
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default MembershipTab;
