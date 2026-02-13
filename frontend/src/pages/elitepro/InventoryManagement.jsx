import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { ArrowRight, Plus, Package, AlertTriangle, X, Check } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const CATEGORY_OPTIONS = [
    { value: 'ELECTRONICS', label: 'Electronics' },
    { value: 'TEXTILES', label: 'Textiles' },
    { value: 'FOOD', label: 'Food & Beverages' },
    { value: 'AUTOMOTIVE', label: 'Automotive Parts' },
    { value: 'MACHINERY', label: 'Machinery' },
    { value: 'CHEMICALS', label: 'Chemicals' },
    { value: 'OTHER', label: 'Other' },
];

const InventoryManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        sku: '', name: '', category: 'OTHER', description: '', unit_of_measure: 'pcs',
        current_stock: 0, reorder_level: 0, cost_price: 0, selling_price: 0,
    });

    const fetchProducts = useCallback(async () => {
        try {
            const response = await api.get('/logistics/api/products/');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({
            sku: '', name: '', category: 'OTHER', description: '', unit_of_measure: 'pcs',
            current_stock: 0, reorder_level: 0, cost_price: 0, selling_price: 0,
        });
        setShowForm(true);
        setSelectedProduct(null);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            sku: product.sku, name: product.name, category: product.category,
            description: product.description || '', unit_of_measure: product.unit_of_measure,
            current_stock: product.current_stock, reorder_level: product.reorder_level,
            cost_price: product.cost_price, selling_price: product.selling_price,
        });
        setShowForm(true);
        setSelectedProduct(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['current_stock', 'reorder_level', 'cost_price', 'selling_price'].includes(name)
                ? parseFloat(value) || 0
                : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/logistics/api/products/${editingProduct.id}/`, formData);
            } else {
                await api.post('/logistics/api/products/', formData);
            }
            setShowForm(false);
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product. Please check all fields.');
        }
    };

    const lowStockCount = products.filter(p => p.needs_reorder).length;
    const totalValue = products.reduce((sum, p) => sum + (p.current_stock * p.cost_price), 0);

    if (loading) return <div style={{ padding: '60px', color: 'var(--cream)' }}>Loading...</div>;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            padding: '60px 80px',
            position: 'relative'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '40px'
            }}>
                <div style={{ fontSize: '13px', color: 'var(--cream)', fontWeight: '300', letterSpacing: '1px' }}>
                    Logistics
                </div>
                <ArrowRight size={32} color="var(--cream)" strokeWidth={1} />
            </div>

            {!showForm && !selectedProduct ? (
                <>
                    <h1 style={{
                        fontSize: 'clamp(4rem, 12vw, 10rem)',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: '600',
                        color: 'var(--cream)',
                        lineHeight: '0.9',
                        marginBottom: '60px',
                        letterSpacing: '-0.02em'
                    }}>
                        INVENTORY
                    </h1>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '40px', marginBottom: '80px' }}>
                        <div>
                            <div style={{ fontSize: '48px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', fontWeight: '300' }}>
                                {products.length}
                            </div>
                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', letterSpacing: '1px', marginTop: '5px' }}>
                                PRODUCTS
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '48px', fontFamily: 'var(--font-serif)', color: lowStockCount > 0 ? '#f59e0b' : 'var(--cream)', fontWeight: '300' }}>
                                {lowStockCount}
                            </div>
                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', letterSpacing: '1px', marginTop: '5px' }}>
                                LOW STOCK
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '48px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', fontWeight: '300' }}>
                                {(totalValue / 1000).toFixed(0)}K
                            </div>
                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', letterSpacing: '1px', marginTop: '5px' }}>
                                AED VALUE
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={openAddModal}
                        style={{
                            padding: '18px 40px',
                            background: 'var(--cream)',
                            border: 'none',
                            borderRadius: '50px',
                            color: '#0a0a0a',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            marginBottom: '60px',
                            letterSpacing: '0.5px'
                        }}
                    >
                        Add Product
                    </button>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '20px',
                        maxWidth: '1400px'
                    }}>
                        {products.map(product => (
                            <button
                                key={product.id}
                                onClick={() => setSelectedProduct(product)}
                                style={{
                                    padding: '30px',
                                    background: 'transparent',
                                    border: product.needs_reorder
                                        ? '1.5px solid #f59e0b'
                                        : '1.5px solid rgba(232, 230, 227, 0.2)',
                                    borderRadius: '20px',
                                    color: 'var(--cream)',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    textAlign: 'left',
                                    fontFamily: 'var(--font-serif)'
                                }}
                                onMouseEnter={(e) => e.target.style.background = 'rgba(232, 230, 227, 0.03)'}
                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                            >
                                <div style={{ fontSize: '18px', marginBottom: '8px' }}>{product.name}</div>
                                <div style={{ fontSize: '12px', opacity: 0.5, marginBottom: '15px', fontFamily: 'monospace' }}>
                                    {product.sku}
                                </div>
                                <div style={{ fontSize: '13px', opacity: 0.7 }}>
                                    {product.current_stock} {product.unit_of_measure}
                                    {product.needs_reorder && (
                                        <span style={{ marginLeft: '10px', color: '#f59e0b' }}>
                                            <AlertTriangle size={14} style={{ display: 'inline', marginBottom: '-2px' }} /> Low
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </>
            ) : showForm ? (
                <>
                    <button
                        onClick={() => setShowForm(false)}
                        style={{
                            padding: '15px 40px',
                            background: 'transparent',
                            border: '1.5px solid var(--cream)',
                            borderRadius: '50px',
                            color: 'var(--cream)',
                            fontSize: '14px',
                            cursor: 'pointer',
                            marginBottom: '60px'
                        }}
                    >
                        ← Back
                    </button>

                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: '500',
                        color: 'var(--cream)',
                        marginBottom: '60px',
                        letterSpacing: '-0.01em'
                    }}>
                        {editingProduct ? 'Edit Product' : 'New Product'}
                    </h2>

                    <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                            <div>
                                <label style={labelStyle}>SKU</label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!!editingProduct}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>PRODUCT NAME</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                            <div>
                                <label style={labelStyle}>CATEGORY</label>
                                <select name="category" value={formData.category} onChange={handleInputChange} style={{ ...inputStyle, background: '#0a0a0a' }}>
                                    {CATEGORY_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>UNIT OF MEASURE</label>
                                <input
                                    type="text"
                                    name="unit_of_measure"
                                    value={formData.unit_of_measure}
                                    onChange={handleInputChange}
                                    style={inputStyle}
                                    placeholder="pcs, kg, liters..."
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                            <div>
                                <label style={labelStyle}>STOCK</label>
                                <input
                                    type="number"
                                    name="current_stock"
                                    value={formData.current_stock}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>REORDER AT</label>
                                <input
                                    type="number"
                                    name="reorder_level"
                                    value={formData.reorder_level}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>COST (AED)</label>
                                <input
                                    type="number"
                                    name="cost_price"
                                    value={formData.cost_price}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>PRICE (AED)</label>
                                <input
                                    type="number"
                                    name="selling_price"
                                    value={formData.selling_price}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '40px' }}>
                            <label style={labelStyle}>DESCRIPTION</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                padding: '18px 60px',
                                background: 'var(--cream)',
                                border: 'none',
                                borderRadius: '50px',
                                color: '#0a0a0a',
                                fontSize: '15px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                letterSpacing: '0.5px'
                            }}
                        >
                            {editingProduct ? 'Save Changes' : 'Create Product'}
                        </button>
                    </form>
                </>
            ) : selectedProduct && (
                <>
                    <button
                        onClick={() => setSelectedProduct(null)}
                        style={{
                            padding: '15px 40px',
                            background: 'transparent',
                            border: '1.5px solid var(--cream)',
                            borderRadius: '50px',
                            color: 'var(--cream)',
                            fontSize: '14px',
                            cursor: 'pointer',
                            marginBottom: '60px'
                        }}
                    >
                        ← Back to inventory
                    </button>

                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: '500',
                        color: 'var(--cream)',
                        marginBottom: '20px',
                        letterSpacing: '-0.01em'
                    }}>
                        {selectedProduct.name}
                    </h2>

                    <div style={{
                        color: 'rgba(232, 230, 227, 0.6)',
                        fontSize: '16px',
                        marginBottom: '60px',
                        fontFamily: 'monospace',
                        letterSpacing: '2px'
                    }}>
                        {selectedProduct.sku} • {selectedProduct.category}
                    </div>

                    {selectedProduct.description && (
                        <p style={{
                            color: 'rgba(232, 230, 227, 0.8)',
                            fontSize: '16px',
                            marginBottom: '60px',
                            maxWidth: '600px',
                            lineHeight: '1.6'
                        }}>
                            {selectedProduct.description}
                        </p>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px', marginBottom: '60px', maxWidth: '1000px' }}>
                        <div style={{ padding: '25px', background: 'rgba(232, 230, 227, 0.03)', border: '1px solid rgba(232, 230, 227, 0.1)', borderRadius: '15px' }}>
                            <div style={{ fontSize: '36px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', fontWeight: '300' }}>
                                {selectedProduct.current_stock}
                            </div>
                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginTop: '8px', letterSpacing: '1px' }}>
                                CURRENT STOCK
                            </div>
                            <div style={{ fontSize: '12px', color: 'rgba(232, 230, 227, 0.5)', marginTop: '5px' }}>
                                {selectedProduct.unit_of_measure}
                            </div>
                        </div>

                        <div style={{ padding: '25px', background: 'rgba(232, 230, 227, 0.03)', border: '1px solid rgba(232, 230, 227, 0.1)', borderRadius: '15px' }}>
                            <div style={{ fontSize: '36px', fontFamily: 'var(--font-serif)', color: selectedProduct.needs_reorder ? '#f59e0b' : 'var(--cream)', fontWeight: '300' }}>
                                {selectedProduct.reorder_level}
                            </div>
                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginTop: '8px', letterSpacing: '1px' }}>
                                REORDER LEVEL
                            </div>
                            {selectedProduct.needs_reorder && (
                                <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '5px' }}>
                                    ⚠ Low Stock
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '25px', background: 'rgba(232, 230, 227, 0.03)', border: '1px solid rgba(232, 230, 227, 0.1)', borderRadius: '15px' }}>
                            <div style={{ fontSize: '36px', fontFamily: 'var(--font-serif)', color: 'var(--cream)', fontWeight: '300' }}>
                                {selectedProduct.cost_price}
                            </div>
                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginTop: '8px', letterSpacing: '1px' }}>
                                COST PRICE
                            </div>
                            <div style={{ fontSize: '12px', color: 'rgba(232, 230, 227, 0.5)', marginTop: '5px' }}>
                                AED
                            </div>
                        </div>

                        <div style={{ padding: '25px', background: 'rgba(232, 230, 227, 0.03)', border: '1px solid rgba(232, 230, 227, 0.1)', borderRadius: '15px' }}>
                            <div style={{ fontSize: '36px', fontFamily: 'var(--font-serif)', color: '#10b981', fontWeight: '300' }}>
                                {selectedProduct.selling_price}
                            </div>
                            <div style={{ fontSize: '13px', color: 'rgba(232, 230, 227, 0.6)', marginTop: '8px', letterSpacing: '1px' }}>
                                SELL PRICE
                            </div>
                            <div style={{ fontSize: '12px', color: 'rgba(232, 230, 227, 0.5)', marginTop: '5px' }}>
                                AED • {selectedProduct.margin_percentage}% margin
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => openEditModal(selectedProduct)}
                        style={{
                            padding: '15px 40px',
                            background: 'transparent',
                            border: '1.5px solid var(--cream)',
                            borderRadius: '50px',
                            color: 'var(--cream)',
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}
                    >
                        Edit Product
                    </button>
                </>
            )}
        </div>
    );
};

const labelStyle = {
    display: 'block',
    color: 'rgba(232, 230, 227, 0.6)',
    fontSize: '13px',
    marginBottom: '10px',
    letterSpacing: '1px'
};

const inputStyle = {
    width: '100%',
    padding: '15px 20px',
    background: 'transparent',
    border: '1px solid rgba(232, 230, 227, 0.3)',
    borderRadius: '10px',
    color: 'var(--cream)',
    fontSize: '15px',
    fontFamily: 'inherit'
};

export default InventoryManagement;
