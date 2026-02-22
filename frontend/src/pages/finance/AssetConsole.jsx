import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    Package, Plus, Trash2, Calendar, MapPin,
    TrendingDown, ShieldCheck, Info, Search
} from 'lucide-react';
import {
    PortfolioPage, PortfolioTitle, PortfolioStats,
    PortfolioButton, PortfolioCard, GlassCard
} from '../../components/PortfolioComponents';

const AssetConsole = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const res = await api.get('/finance/api/fixed-assets/');
            setAssets(res.data.results || res.data);
        } catch (err) {
            console.error('Error fetching assets', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredAssets = assets.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.asset_type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalValuation = assets.reduce((acc, curr) => acc + parseFloat(curr.current_book_value), 0);
    const monthlyDep = assets.reduce((acc, curr) => acc + parseFloat(curr.monthly_depreciation), 0);

    return (
        <PortfolioPage breadcrumb="FINANCE // ASSETS">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="Lifecycle management of company-owned equipment, vehicles, and long-term assets.">
                    ASSET REGISTRY
                </PortfolioTitle>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '15px', top: '12px', opacity: 0.4 }} size={16} />
                        <input
                            type="text"
                            placeholder="Search assets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '10px 15px 10px 45px', background: 'rgba(232, 230, 227, 0.05)',
                                border: '1px solid rgba(232, 230, 227, 0.1)', borderRadius: '12px',
                                color: 'var(--cream)', fontSize: '14px', width: '250px', outline: 'none'
                            }}
                        />
                    </div>
                    <PortfolioButton>
                        <Plus size={16} /> REGISTER ASSET
                    </PortfolioButton>
                </div>
            </div>

            <PortfolioStats stats={[
                { value: `AED ${totalValuation.toLocaleString()}`, label: 'CURRENT BOOK VALUE', color: 'var(--gold)' },
                { value: `AED ${monthlyDep.toLocaleString()}`, label: 'MONTHLY DEPRECIATION', color: '#ef4444' },
                { value: assets.length, label: 'TOTAL ASSETS TRACKED' }
            ]} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {filteredAssets.length === 0 ? (
                    <div style={{ gridColumn: 'span 2' }}>
                        <GlassCard style={{ textAlign: 'center', padding: '100px', opacity: 0.5 }}>
                            NO REGISTERED ASSETS FOUND
                        </GlassCard>
                    </div>
                ) : (
                    filteredAssets.map(asset => (
                        <PortfolioCard key={asset.id} style={{ padding: '35px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                                <div>
                                    <div style={{ color: 'var(--gold)', fontSize: '10px', letterSpacing: '2px', fontWeight: '800', marginBottom: '5px' }}>
                                        {asset.asset_type}
                                    </div>
                                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--cream)', margin: 0 }}>
                                        {asset.name}
                                    </h3>
                                </div>
                                <div style={{
                                    padding: '8px 15px', background: 'rgba(176,141,87,0.1)',
                                    borderRadius: '50px', color: 'var(--gold)', fontSize: '11px', fontWeight: '800'
                                }}>
                                    {asset.branch_name || 'Global'}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                                <div style={{ borderLeft: '2px solid rgba(232,230,227,0.1)', paddingLeft: '15px' }}>
                                    <div style={{ fontSize: '11px', opacity: 0.5, marginBottom: '5px' }}>PURCHASE COST</div>
                                    <div style={{ fontSize: '16px', color: 'var(--cream)' }}>AED {parseFloat(asset.purchase_cost).toLocaleString()}</div>
                                </div>
                                <div style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '15px' }}>
                                    <div style={{ fontSize: '11px', opacity: 0.5, marginBottom: '5px' }}>BOOK VALUE</div>
                                    <div style={{ fontSize: '16px', color: 'var(--gold)', fontWeight: '800' }}>AED {parseFloat(asset.current_book_value).toLocaleString()}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '20px', fontSize: '12px', opacity: 0.6 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar size={14} /> {new Date(asset.purchase_date).toLocaleDateString()}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <TrendingDown size={14} /> AED {parseFloat(asset.monthly_depreciation).toLocaleString()}/mo
                                </div>
                            </div>

                            <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                                <PortfolioButton variant="secondary" style={{ flex: 1, padding: '10px' }}>
                                    <Info size={16} /> DETAILS
                                </PortfolioButton>
                                <PortfolioButton variant="secondary" style={{ padding: '10px' }}>
                                    <Trash2 size={16} color="#ef4444" />
                                </PortfolioButton>
                            </div>
                        </PortfolioCard>
                    ))
                )}
            </div>
        </PortfolioPage>
    );
};

export default AssetConsole;
