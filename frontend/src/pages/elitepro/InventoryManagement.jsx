import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { Package, Plus, Search, AlertTriangle, TrendingUp, Edit2, Archive, X } from 'lucide-react';
import './InventoryManagement.css';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        category: 'OTHER',
        description: '',
        unit_of_measure: 'pcs',
        current_stock: 0,
        reorder_level: 0,
        cost_price: 0,
        selling_price: 0,
    });
    const [saving, setSaving] = useState(false);

    const fetchProducts = useCallback(async () => {
        try {
            const endpoint = filter === 'low-stock'
                ? `${API_BASE}/logistics/api/products/low-stock/`
                : `${API_BASE}/logistics/api/products/`;

            const response = await api.get(endpoint);
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const getStockStatus = (product) => {
        if (product.current_stock === 0) return { label: 'Out of Stock', color: '#ef4444' };
        if (product.needs_reorder) return { label: 'Low Stock', color: '#f59e0b' };
        return { label: 'In Stock', color: '#10b981' };
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalInventoryValue = products.reduce((sum, p) => sum + (p.current_stock * p.cost_price), 0);
    const lowStockCount = products.filter(p => p.needs_reorder).length;

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({
            sku: '',
            name: '',
            category: 'OTHER',
            description: '',
            unit_of_measure: 'pcs',
            current_stock: 0,
            reorder_level: 0,
            cost_price: 0,
            selling_price: 0,
        });
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            sku: product.sku,
            name: product.name,
            category: product.category,
            description: product.description || '',
            unit_of_measure: product.unit_of_measure,
            current_stock: product.current_stock,
            reorder_level: product.reorder_level,
            cost_price: product.cost_price,
            selling_price: product.selling_price,
        });
        setShowModal(true);
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
        setSaving(true);
        try {
            if (editingProduct) {
                await api.put(`${API_BASE}/logistics/api/products/${editingProduct.id}/`, formData);
            } else {
                await api.post(`${API_BASE}/logistics/api/products/`, formData);
            }
            setShowModal(false);
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product. Please check all fields.');
        } finally {
            setSaving(false);
        }
    };

    const handleArchive = async (product) => {
        if (!window.confirm(`Archive ${product.name}? This will mark it as inactive.`)) return;
        try {
            await api.patch(`${API_BASE}/logistics/api/products/${product.id}/`, { is_active: false });
            fetchProducts();
        } catch (error) {
            console.error('Error archiving product:', error);
        }
    };

    return (
        <div className="inventory-management">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Inventory Management</h1>
                    <p className="page-subtitle">Track stock levels and product inventory</p>
                </div>
                <button className="btn-primary" onClick={openAddModal}>
                    <Plus size={18} />
                    Add Product
                </button>
            </div>

            {/* Summary Cards */}
            <div className="inventory-summary">
                <div className="summary-card">
                    <Package size={24} color="#b08d57" />
                    <div>
                        <div className="summary-label">Total Products</div>
                        <div className="summary-value">{products.length}</div>
                    </div>
                </div>
                <div className="summary-card">
                    <TrendingUp size={24} color="#10b981" />
                    <div>
                        <div className="summary-label">Inventory Value</div>
                        <div className="summary-value">AED {totalInventoryValue.toLocaleString()}</div>
                    </div>
                </div>
                <div className="summary-card">
                    <AlertTriangle size={24} color="#f59e0b" />
                    <div>
                        <div className="summary-label">Low Stock Items</div>
                        <div className="summary-value">{lowStockCount}</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by SKU, name, or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Products
                    </button>
                    <button
                        className={`filter-btn ${filter === 'low-stock' ? 'active' : ''}`}
                        onClick={() => setFilter('low-stock')}
                    >
                        Low Stock
                    </button>
                </div>
            </div>

            {/* Products Table */}
            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading inventory...</p>
                </div>
            ) : (
                <div className="products-table">
                    <table>
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Current Stock</th>
                                <th>Reorder Level</th>
                                <th>Unit Price</th>
                                <th>Value</th>
                                <th>Margin</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => {
                                const status = getStockStatus(product);
                                const stockValue = product.current_stock * product.cost_price;

                                return (
                                    <tr key={product.id} className={product.needs_reorder ? 'low-stock-row' : ''}>
                                        <td className="sku-cell">{product.sku}</td>
                                        <td className="product-name">{product.name}</td>
                                        <td className="category-cell">{product.category}</td>
                                        <td className="stock-cell">
                                            {product.current_stock} {product.unit_of_measure}
                                        </td>
                                        <td className="reorder-cell">
                                            {product.reorder_level} {product.unit_of_measure}
                                        </td>
                                        <td className="price-cell">
                                            AED {product.cost_price.toLocaleString()}
                                        </td>
                                        <td className="value-cell">
                                            AED {stockValue.toLocaleString()}
                                        </td>
                                        <td className="margin-cell">
                                            <span className={product.margin_percentage > 20 ? 'good-margin' : 'low-margin'}>
                                                {product.margin_percentage}%
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className="stock-status"
                                                style={{
                                                    background: `${status.color}20`,
                                                    color: status.color,
                                                    border: `1px solid ${status.color}40`
                                                }}
                                            >
                                                {status.label}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="action-btn" title="Edit" onClick={() => openEditModal(product)}>
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="action-btn" title="Archive" onClick={() => handleArchive(product)}>
                                                    <Archive size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {filteredProducts.length === 0 && !loading && (
                <div className="empty-state">
                    <Package size={64} color="#64748b" />
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or add a new product</p>
                </div>
            )}

            {/* Add/Edit Product Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>SKU *</label>
                                    <input
                                        type="text"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleInputChange}
                                        required
                                        disabled={!!editingProduct}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Product Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange}>
                                        {CATEGORY_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Unit of Measure</label>
                                    <input
                                        type="text"
                                        name="unit_of_measure"
                                        value={formData.unit_of_measure}
                                        onChange={handleInputChange}
                                        placeholder="pcs, kg, liters..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Current Stock</label>
                                    <input
                                        type="number"
                                        name="current_stock"
                                        value={formData.current_stock}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Reorder Level</label>
                                    <input
                                        type="number"
                                        name="reorder_level"
                                        value={formData.reorder_level}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Cost Price (AED)</label>
                                    <input
                                        type="number"
                                        name="cost_price"
                                        value={formData.cost_price}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Selling Price (AED)</label>
                                    <input
                                        type="number"
                                        name="selling_price"
                                        value={formData.selling_price}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryManagement;
