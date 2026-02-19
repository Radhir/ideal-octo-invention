import React, { createContext, useContext, useState, useEffect } from 'react';

const BrandContext = createContext();

export const BRAND_TYPES = {
    ELITE_SHINE: {
        id: 'ELITE_SHINE',
        label: 'Elite Shine',
        color: '#b08d57', // Gold
        type: 'SERVICE'
    },
    ELITE_PRO: {
        id: 'ELITE_PRO',
        label: 'Elite Pro',
        color: '#8b5cf6', // Violet
        type: 'SALES'
    },
    TRADING: {
        id: 'TRADING',
        label: 'Trading Co.',
        color: '#10b981', // Emerald
        type: 'COMMERCE'
    }
};

export const BrandProvider = ({ children }) => {
    const [currentBrand, setCurrentBrand] = useState(BRAND_TYPES.ELITE_SHINE);

    const switchBrand = (brandId) => {
        if (BRAND_TYPES[brandId]) {
            setCurrentBrand(BRAND_TYPES[brandId]);
            // Persist to local storage if needed
            localStorage.setItem('active_brand', brandId);
        }
    };

    useEffect(() => {
        const savedBrand = localStorage.getItem('active_brand');
        if (savedBrand && BRAND_TYPES[savedBrand]) {
            setCurrentBrand(BRAND_TYPES[savedBrand]);
        }
    }, []);

    return (
        <BrandContext.Provider value={{ currentBrand, switchBrand, brands: BRAND_TYPES }}>
            {children}
        </BrandContext.Provider>
    );
};

export const useBrand = () => {
    const context = useContext(BrandContext);
    if (!context) {
        throw new Error('useBrand must be used within a BrandProvider');
    }
    return context;
};

export default BrandContext;
