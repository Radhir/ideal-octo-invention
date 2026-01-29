import React, { useState } from 'react';
import GlassCard from '../../components/GlassCard';
import {
    Image, Film, FileText, Search,
    Upload, Folder, Filter, Grid, List
} from 'lucide-react';

const MediaLibrary = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [activeTab, setActiveTab] = useState('all');

    const mediaItems = [
        { id: 1, name: "Inspection_Front_Bumper.jpg", type: "image", size: "2.4 MB", date: "2024-01-20", tag: "Inspection" },
        { id: 2, name: "Scratch_Detail_Macro.mp4", type: "video", size: "15 MB", date: "2024-01-20", tag: "Evidence" },
        { id: 3, name: "Warranty_Cert_Signed.pdf", type: "document", size: "1.1 MB", date: "2024-01-19", tag: "Warranty" },
        { id: 4, name: "After_Polishing_Hood.jpg", type: "image", size: "4.2 MB", date: "2024-01-18", tag: "QC" },
        { id: 5, name: "Invoice_INV-2024-001.pdf", type: "document", size: "0.5 MB", date: "2024-01-18", tag: "Finance" },
        { id: 6, name: "Interior_Leather_Before.jpg", type: "image", size: "3.1 MB", date: "2024-01-15", tag: "Inspection" },
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'image': return <Image size={24} color="#3b82f6" />;
            case 'video': return <Film size={24} color="#ef4444" />;
            case 'document': return <FileText size={24} color="#10b981" />;
            default: return <FileText size={24} />;
        }
    };

    return (
        <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#fff' }}>Media Hub</h1>
                    <p style={{ color: '#94a3b8', marginTop: '4px' }}>Digital asset management for vehicle inspections and reports.</p>
                </div>
                <button style={{
                    background: 'linear-gradient(135deg, #b08d57 0%, #8a6d43 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                }}>
                    <Upload size={18} /> Upload New
                </button>
            </div>

            <GlassCard style={{ marginBottom: '30px', padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {['all', 'images', 'videos', 'documents'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: activeTab === tab ? '2px solid #b08d57' : '2px solid transparent',
                                    paddingBottom: '4px',
                                    color: activeTab === tab ? '#fff' : '#94a3b8',
                                    textTransform: 'capitalize',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setViewMode('grid')} style={{ padding: '6px', borderRadius: '4px', background: viewMode === 'grid' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', cursor: 'pointer', color: '#fff' }}><Grid size={18} /></button>
                        <button onClick={() => setViewMode('list')} style={{ padding: '6px', borderRadius: '4px', background: viewMode === 'list' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', cursor: 'pointer', color: '#fff' }}><List size={18} /></button>
                    </div>
                </div>

                {viewMode === 'grid' ? (
                    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
                        {mediaItems.map(item => (
                            <div key={item.id} style={{
                                background: 'rgba(0,0,0,0.2)',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.05)',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ height: '140px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {getIcon(item.type)}
                                </div>
                                <div style={{ padding: '12px' }}>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>
                                        <span>{item.size}</span>
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '0' }}>
                        {/* List View Implementation would go here */}
                        <div style={{ padding: '24px', color: '#94a3b8' }}>List view...</div>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};

export default MediaLibrary;
