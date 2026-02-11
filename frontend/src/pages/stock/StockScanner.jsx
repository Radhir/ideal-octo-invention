import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/GlassCard';
import { Camera, RefreshCw, ArrowUp, ArrowDown, Package, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const StockScanner = () => {
    const [_scannedResult, setScannedResult] = useState(null);
    const [mode, setMode] = useState('EXIT'); // EXIT (Consumption) or ENTRY (Restock)
    const [isScanning, setIsScanning] = useState(false);
    const [lastLog, setLastLog] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let scanner = null;
        if (isScanning) {
            scanner = new Html5QrcodeScanner("reader", {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            }, false);

            scanner.render(onScanSuccess, onScanFailure);
        }

        return () => {
            if (scanner) {
                scanner.clear().catch(error => {
                    console.error("Failed to clear scanner", error);
                });
            }
        };
    }, [isScanning, mode]);

    async function onScanSuccess(decodedText) {
        // Expected format: SKU_123 or just SKU
        setScannedResult(decodedText);
        setIsScanning(false);
        await processStockMovement(decodedText);
    }

    function onScanFailure(error) {
        // Usually too noisy to log, but good for debugging
        // console.warn(`Code scan error = ${error}`);
    }

    const processStockMovement = async (sku) => {
        setLoading(true);
        try {
            // Find item by SKU
            const itemRes = await api.get(`/forms/stock/api/items/?sku=${sku}`);
            const item = itemRes.data.find(i => i.sku === sku);

            if (!item) {
                setLastLog({ status: 'ERROR', message: `SKU ${sku} not found in registry.` });
                setLoading(false);
                return;
            }

            // Record Movement
            const movementData = {
                item: item.id,
                type: mode === 'ENTRY' ? 'IN' : 'OUT',
                quantity: mode === 'ENTRY' ? 1 : 1, // Defaulting to 1 for quick scans
                reason: mode === 'ENTRY' ? 'QR Restock' : 'QR Consumption',
                recorded_by: 'Staff (QR)'
            };

            await api.post('/forms/stock/api/movements/', movementData);
            setLastLog({
                status: 'SUCCESS',
                message: `${mode === 'ENTRY' ? 'Received' : 'Distributed'} 1 unit of ${item.name}`,
                time: new Date().toLocaleTimeString()
            });
        } catch (err) {
            console.error("QR Sync Error", err);
            setLastLog({ status: 'ERROR', message: 'Failed to sync with backend.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.5s ease-out' }}>
            <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ fontSize: '10px', color: '#b08d57', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Precision Tracking</div>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>Smart Scanner</h1>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '5px' }}>Scan item QR for rapid entry or exit.</p>
            </header>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
                <button
                    onClick={() => { setMode('ENTRY'); setLastLog(null); }}
                    style={{ ...modeBtnStyle, background: mode === 'ENTRY' ? '#10b981' : 'rgba(255,255,255,0.05)', color: mode === 'ENTRY' ? '#000' : '#94a3b8' }}
                >
                    <ArrowUp size={18} /> STOCK ENTRY
                </button>
                <button
                    onClick={() => { setMode('EXIT'); setLastLog(null); }}
                    style={{ ...modeBtnStyle, background: mode === 'EXIT' ? '#f59e0b' : 'rgba(255,255,255,0.05)', color: mode === 'EXIT' ? '#000' : '#94a3b8' }}
                >
                    <ArrowDown size={18} /> STOCK EXIT
                </button>
            </div>

            <GlassCard style={{ padding: '40px', textAlign: 'center', border: mode === 'ENTRY' ? '2px solid rgba(16, 185, 129, 0.3)' : '2px solid rgba(245, 158, 11, 0.3)' }}>
                {!isScanning ? (
                    <div style={{ padding: '40px 0' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: mode === 'ENTRY' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: mode === 'ENTRY' ? '#10b981' : '#f59e0b' }}>
                            <Camera size={48} />
                        </div>
                        <h2 style={{ color: '#fff' }}>Ready to Scan</h2>
                        <button
                            onClick={() => setIsScanning(true)}
                            style={{ padding: '12px 30px', background: '#b08d57', color: '#000', border: 'none', borderRadius: '8px', fontWeight: '900', cursor: 'pointer', marginTop: '20px' }}
                        >
                            ACTIVATE CAMERA
                        </button>
                    </div>
                ) : (
                    <div id="reader" style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', background: '#000' }}></div>
                )}

                {loading && (
                    <div style={{ marginTop: '20px', color: '#b08d57', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <RefreshCw className="spin" size={16} /> Syncing Inventory...
                    </div>
                )}

                {lastLog && (
                    <div style={{
                        marginTop: '30px', padding: '20px', borderRadius: '12px',
                        background: lastLog.status === 'SUCCESS' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                        border: `1px solid ${lastLog.status === 'SUCCESS' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
                        display: 'flex', alignItems: 'center', gap: '15px', textAlign: 'left'
                    }}>
                        {lastLog.status === 'SUCCESS' ? <CheckCircle color="#10b981" /> : <AlertCircle color="#f43f5e" />}
                        <div>
                            <div style={{ color: '#fff', fontSize: '14px', fontWeight: '700' }}>{lastLog.message}</div>
                            {lastLog.time && <div style={{ color: '#94a3b8', fontSize: '11px' }}>Log synced at {lastLog.time}</div>}
                        </div>
                        {lastLog.status === 'SUCCESS' && (
                            <button
                                onClick={() => setIsScanning(true)}
                                style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '5px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                            >
                                SCAN NEXT
                            </button>
                        )}
                    </div>
                )}
            </GlassCard>

            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

const modeBtnStyle = {
    flex: 1,
    padding: '15px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '900',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all 0.3s ease'
};

export default StockScanner;
