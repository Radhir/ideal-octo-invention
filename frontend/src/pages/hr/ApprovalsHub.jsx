import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle2, XCircle, Clock, Package,
    CreditCard, Users, ChevronRight, AlertCircle,
    ClipboardCheck, Activity
} from 'lucide-react';
import api from '../../api/axios';
import {
    PortfolioPage, PortfolioTitle, PortfolioCard,
    PortfolioGrid, PortfolioButton, PortfolioStats
} from '../../components/PortfolioComponents';
import { motion, AnimatePresence } from 'framer-motion';

const ApprovalsHub = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([
        { label: 'PENDING LEAVES', value: 0, icon: Users, color: '#f59e0b' },
        { label: 'STOCK MOVEMENTS', value: 0, icon: Package, color: '#00D1FF' },
        { label: 'PETTY CASH', value: 0, icon: CreditCard, color: '#10b981' }
    ]);

    const [approvalGroups, setApprovalGroups] = useState({
        leaves: [],
        stock: [],
        finance: []
    });

    useEffect(() => {
        fetchApprovals();
    }, []);

    const fetchApprovals = async () => {
        setLoading(true);
        try {
            const [leavesRes, stockRes, cashRes] = await Promise.all([
                api.get('/forms/leaves/api/applications/').catch(() => ({ data: [] })),
                api.get('/forms/stock/api/movements/?status=PENDING').catch(() => ({ data: [] })),
                api.get('/api/finance/petty-cash/').catch(() => ({ data: [] }))
            ]);

            const pendingLeaves = (leavesRes.data.results || leavesRes.data || []).filter(l => !l.manager_approval || !l.hr_approval);
            const pendingStock = stockRes.data.results || stockRes.data || [];
            const pendingCash = (cashRes.data.results || cashRes.data || []).filter(c => c.status === 'PENDING');

            setApprovalGroups({
                leaves: pendingLeaves,
                stock: pendingStock,
                finance: pendingCash
            });

            setStats([
                { label: 'PENDING LEAVES', value: pendingLeaves.length, icon: Users, color: '#f59e0b' },
                { label: 'STOCK MOVEMENTS', value: pendingStock.length, icon: Package, color: '#00D1FF' },
                { label: 'PETTY CASH', value: pendingCash.length, icon: CreditCard, color: '#10b981' }
            ]);

        } catch (err) {
            console.error('Error fetching approvals hub data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (type, id, action) => {
        try {
            if (type === 'stock') {
                await api.post(`/forms/stock/api/movements/${id}/approve/`);
            } else if (type === 'leave') {
                // Assuming separate endpoints or params for mgr/hr approval
                await api.patch(`/forms/leaves/api/applications/${id}/`, { manager_approval: action === 'approve' });
            }
            alert(`${type.toUpperCase()} ${action === 'approve' ? 'ACCEPTED' : 'REJECTED'}`);
            fetchApprovals();
        } catch (err) {
            alert('Action failed. Check permissions.');
        }
    };

    const sectionHeaderStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        fontSize: '11px',
        fontWeight: '900',
        color: 'var(--gold)',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        marginBottom: '30px',
        marginTop: '60px'
    };

    return (
        <PortfolioPage breadcrumb="Governance / Approvals Hub">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Centralized command for organizational authorization workflows.">
                    APPROVALS<br />MANAGEMENT
                </PortfolioTitle>
                <PortfolioButton onClick={fetchApprovals} variant="secondary">
                    <Activity size={18} style={{ marginRight: '10px' }} /> REFRESH SYNC
                </PortfolioButton>
            </div>

            <PortfolioStats stats={stats} />

            {loading ? (
                <div style={{ padding: '100px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.3)', letterSpacing: '2px' }}>
                    AUDITING PENDING AUTHORIZATIONS...
                </div>
            ) : (
                <div style={{ maxWidth: '1200px' }}>
                    {/* 1. Leave Applications */}
                    <div style={sectionHeaderStyle}><Users size={16} /> <span>Staff Leave Registry</span></div>
                    <PortfolioGrid columns="1fr">
                        {approvalGroups.leaves.length === 0 ? (
                            <EmptyState label="No pending leave requests" />
                        ) : approvalGroups.leaves.map(leave => (
                            <ApprovalCard
                                key={leave.id}
                                title={leave.employee_name}
                                subtitle={`${leave.leave_type} • ${leave.total_days} Days`}
                                meta={`From: ${leave.leave_period_from} To: ${leave.leave_period_to}`}
                                onApprove={() => handleAction('leave', leave.id, 'approve')}
                                onReject={() => handleAction('leave', leave.id, 'reject')}
                                onClick={() => navigate(`/leaves`)}
                            />
                        ))}
                    </PortfolioGrid>

                    {/* 2. Stock Movements */}
                    <div style={sectionHeaderStyle}><Package size={16} /> <span>Inventory Adjustments</span></div>
                    <PortfolioGrid columns="1fr">
                        {approvalGroups.stock.length === 0 ? (
                            <EmptyState label="Stock movement ledger is clear" />
                        ) : approvalGroups.stock.map(stock => (
                            <ApprovalCard
                                key={stock.id}
                                title={stock.item_name}
                                subtitle={`${stock.type === 'IN' ? 'Entry' : 'Exit'} • ${stock.quantity} Units`}
                                meta={`Recorded by: ${stock.recorded_by || 'System Scanner'}`}
                                onApprove={() => handleAction('stock', stock.id, 'approve')}
                                onClick={() => navigate(`/stock`)}
                            />
                        ))}
                    </PortfolioGrid>

                    {/* 3. Finance / Petty Cash */}
                    <div style={sectionHeaderStyle}><CreditCard size={16} /> <span>Financial Disbursements</span></div>
                    <PortfolioGrid columns="1fr">
                        {approvalGroups.finance.length === 0 ? (
                            <EmptyState label="No petty cash vouchers pending" />
                        ) : approvalGroups.finance.map(cash => (
                            <ApprovalCard
                                key={cash.id}
                                title={cash.reason || 'Petty Cash Request'}
                                subtitle={`AED ${cash.amount}`}
                                meta={`Requested by: ${cash.employee_name} • ${new Date(cash.date).toLocaleDateString()}`}
                                onApprove={() => handleAction('finance', cash.id, 'approve')}
                                onClick={() => navigate(`/finance/petty-cash`)}
                            />
                        ))}
                    </PortfolioGrid>
                </div>
            )}
        </PortfolioPage>
    );
};

const ApprovalCard = ({ title, subtitle, meta, onApprove, onReject, onClick }) => (
    <PortfolioCard style={{ padding: '25px', marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div onClick={onClick} style={{ flex: 1, cursor: 'pointer' }}>
                <div style={{ fontSize: '18px', fontWeight: '400', color: 'var(--cream)', fontFamily: 'var(--font-serif)', marginBottom: '5px' }}>{title}</div>
                <div style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: '700', letterSpacing: '1px', marginBottom: '8px' }}>{subtitle.toUpperCase()}</div>
                <div style={{ fontSize: '11px', color: 'rgba(232, 230, 227, 0.4)', letterSpacing: '0.5px' }}>{meta}</div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                {onReject && (
                    <button
                        onClick={onReject}
                        style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            padding: '10px 20px',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: '900',
                            cursor: 'pointer'
                        }}>REJECT</button>
                )}
                <button
                    onClick={onApprove}
                    style={{
                        background: 'var(--gold)',
                        border: 'none',
                        color: '#000',
                        padding: '10px 25px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '900',
                        cursor: 'pointer',
                        boxShadow: '0 10px 20px rgba(176,141,87,0.2)'
                    }}>APPROVE</button>
            </div>
        </div>
    </PortfolioCard>
);

const EmptyState = ({ label }) => (
    <div style={{ padding: '40px', border: '1px dashed rgba(232, 230, 227, 0.1)', borderRadius: '24px', textAlign: 'center', color: 'rgba(232, 230, 227, 0.2)', fontSize: '12px', letterSpacing: '1px', fontWeight: '700' }}>
        {label.toUpperCase()}
    </div>
);

export default ApprovalsHub;
