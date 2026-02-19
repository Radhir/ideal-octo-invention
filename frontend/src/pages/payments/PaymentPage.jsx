import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import api from '../../api/axios';
import CheckoutForm from '../../components/payments/CheckoutForm';
import {
    PortfolioPage,
    PortfolioCard,
    PortfolioTitle,
    PortfolioBackButton
} from '../../components/PortfolioComponents';
import { ShieldCheck, CreditCard, Lock } from 'lucide-react';

// Replace with your actual publishable key or env var
const stripePromise = loadStripe('pk_test_placeholder');

const PaymentPage = () => {
    const { invoiceId } = useParams();
    const [clientSecret, setClientSecret] = useState('');
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (invoiceId) {
            fetchInvoiceAndIntent();
        }
    }, [invoiceId]);

    const fetchInvoiceAndIntent = async () => {
        try {
            // Fetch Invoice Details first
            const invoiceRes = await api.get(`/invoices/${invoiceId}/`);
            setInvoice(invoiceRes.data);

            // Create Payment Intent
            const intentRes = await api.post('/payments/create-payment-intent/', {
                invoice_id: invoiceId
            });
            setClientSecret(intentRes.data.clientSecret);
        } catch (error) {
            console.error("Error initializing payment:", error);
            alert("Failed to initialize payment.");
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = () => {
        alert("Payment Successful! Thank you.");
        navigate('/customer-portal'); // Redirect back to portal
    };

    if (loading) {
        return (
            <PortfolioPage>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '20px' }}>
                    <div className="spinner"></div>
                    <p style={{ color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>Securely loading payment gateway...</p>
                </div>
            </PortfolioPage>
        );
    }

    if (!invoice || !clientSecret) {
        return (
            <PortfolioPage>
                <div style={{ textAlign: 'center', padding: '50px', color: '#f43f5e' }}>
                    <ShieldCheck size={48} style={{ marginBottom: '20px' }} />
                    <h2>Invalid Invoice or Payment Context</h2>
                    <p>Please return to the invoice and try again.</p>
                </div>
            </PortfolioPage>
        );
    }

    const options = {
        clientSecret,
        appearance: {
            theme: 'night',
            variables: {
                colorPrimary: '#b08d57',
                colorBackground: '#1e293b',
                colorText: '#ffffff',
                colorDanger: '#f43f5e',
                fontFamily: 'Outfit, sans-serif',
                spacingUnit: '4px',
                borderRadius: '8px',
            },
        },
    };

    return (
        <PortfolioPage breadcrumb="Financial Gateway / Secure Checkout">
            {/* Centered Container */}
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <PortfolioBackButton onClick={() => navigate(-1)} />

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(176,141,87,0.1)', padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(176,141,87,0.2)', marginBottom: '20px' }}>
                        <Lock size={14} color="var(--gold)" />
                        <span style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>256-Bit SSL Encrypted</span>
                    </div>
                    <PortfolioTitle subtitle={`Invoice #${invoice.invoice_number}`}>
                        Secure Payment
                    </PortfolioTitle>
                </div>

                <PortfolioCard style={{ padding: '40px', border: '1px solid var(--gold)', boxShadow: '0 0 50px rgba(176,141,87,0.1)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid rgba(232, 230, 227, 0.1)' }}>
                        <div style={{ fontSize: '14px', color: 'rgba(232, 230, 227, 0.6)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>Total Amount Due</div>
                        <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>
                            <span style={{ fontSize: '1.5rem', verticalAlign: 'top', marginRight: '5px', color: 'var(--gold)' }}>AED</span>
                            {invoice.balance_due}
                        </div>
                    </div>

                    <Elements stripe={stripePromise} options={options}>
                        <CheckoutForm amount={invoice.balance_due} onSuccess={handlePaymentSuccess} />
                    </Elements>

                    <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '15px', opacity: 0.5 }}>
                        <CreditCard size={20} color="#fff" />
                        {/* Add more card icons if needed */}
                    </div>
                </PortfolioCard>
            </div>


        </PortfolioPage>
    );
};

export default PaymentPage;
