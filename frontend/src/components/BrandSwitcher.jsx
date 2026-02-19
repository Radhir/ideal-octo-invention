import React from 'react';
import { useBrand, BRAND_TYPES } from '../context/BrandContext';
import { Layers, ShieldCheck, ShoppingCart } from 'lucide-react';

const BrandSwitcher = () => {
    const { currentBrand, switchBrand } = useBrand();

    const getIcon = (id) => {
        switch (id) {
            case 'ELITE_SHINE': return <Layers size={16} />;
            case 'ELITE_PRO': return <ShieldCheck size={16} />;
            case 'TRADING': return <ShoppingCart size={16} />;
            default: return <Layers size={16} />;
        }
    };

    return (
        <div style={{ display: 'flex', gap: '5px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px' }}>
            {Object.values(BRAND_TYPES).map((brand) => (
                <button
                    key={brand.id}
                    onClick={() => switchBrand(brand.id)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: currentBrand.id === brand.id ? brand.color : 'transparent',
                        color: currentBrand.id === brand.id ? '#fff' : 'rgba(255,255,255,0.4)',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {getIcon(brand.id)}
                    {brand.label}
                </button>
            ))}
        </div>
    );
};

export default BrandSwitcher;
