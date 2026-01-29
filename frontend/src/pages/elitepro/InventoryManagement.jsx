import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Plus, Search, AlertTriangle, TrendingDown, TrendingUp, Edit2, Archive } from 'lucide-react';
import './InventoryManagement.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const InventoryManagement = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, [filter]);

    const fetchProducts = async () => {
        try {
            const endpoint = filter === 'low-stock'
                ? `${API_BASE}/logistics/api/products/low-stock/`
                : `${API_BASE}/logistics/api/products/`;

            const response = await axios.get(endpoint);
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

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

    return (
        <div className="inventory-management">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Inventory Management</h1>
                    <p className="page-subtitle">Track stock levels and product inventory</p>
                </div>
                <button className="btn-primary">
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
                                                <button className="action-btn" title="Edit">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="action-btn" title="Archive">
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
        </div>
    );
};

export default InventoryManagement;
