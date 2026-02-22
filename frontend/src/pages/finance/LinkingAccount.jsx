import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { GlassCard } from '../../components/PortfolioComponents';
import { Plus, Save, Trash2, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import './Accounts.css';

const LinkingAccount = () => {
    const [links, setLinks] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const moduleOptions = [
        { value: 'PAYROLL', label: 'Payroll Expansion' },
        { value: 'INVENTORY', label: 'Inventory / Warehouse' },
        { value: 'SALES', label: 'Point of Sales (POS)' },
        { value: 'PURCHASE', label: 'Procurement / Purchases' },
        { value: 'CASH_IN_HAND', label: 'Cash in Hand (Petty)' },
        { value: 'BANK', label: 'Main Bank Account' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [linksRes, accountsRes] = await Promise.all([
                    api.get('/api/finance/linking-accounts/'),
                    api.get('/api/finance/accounts/')
                ]);
                setLinks(linksRes.data.results || linksRes.data);
                setAccounts(accountsRes.data.results || accountsRes.data);
            } catch (err) {
                console.error("Failed to load linking data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleUpdate = async (moduleId, accountId) => {
        setSaving(true);
        try {
            await api.post('/api/finance/linking-accounts/bulk-update/', {
                module: moduleId,
                account: accountId
            });
            // Refresh local state or show success
        } catch (err) {
            alert("Failed to update link");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-gold">Synchronizing Ledger Encoders...</div>;

    return (
        <div className="accounts-container">
            <header className="accounts-header">
                <div>
                    <h1 className="accounts-title">OPERATIONAL LINKING</h1>
                    <p className="accounts-subtitle">Map automated module triggers to specific General Ledger codes.</p>
                </div>
                <div className="status-badge">
                    <ShieldCheck size={14} />
                    <span>LEDGER SYNC ACTIVE</span>
                </div>
            </header>

            <div className="links-grid">
                {moduleOptions.map((mod) => {
                    const activeLink = links.find(l => l.module === mod.value);
                    return (
                        <GlassCard key={mod.value} className="link-card">
                            <div className="link-info">
                                <ArrowRightLeft size={20} className="link-icon" />
                                <div>
                                    <h3 className="mod-name">{mod.label}</h3>
                                    <span className="mod-id">{mod.value}</span>
                                </div>
                            </div>

                            <div className="link-selection">
                                <label>Target Ledger Account</label>
                                <select
                                    className="premium-select"
                                    value={activeLink?.account || ''}
                                    onChange={(e) => handleUpdate(mod.value, e.target.value)}
                                >
                                    <option value="">-- UNLINKED --</option>
                                    {accounts.map(acc => (
                                        <option key={acc.id} value={acc.id}>
                                            {acc.code} - {acc.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </GlassCard>
                    );
                })}
            </div>

            {saving && <div className="saving-overlay">Updating Registry...</div>}
        </div>
    );
};

export default LinkingAccount;
