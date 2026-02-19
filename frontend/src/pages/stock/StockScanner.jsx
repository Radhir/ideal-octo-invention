import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Camera, RefreshCw, ArrowUpCircle, ArrowDownCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
    PortfolioPage,
    PortfolioTitle,
    PortfolioButton,
    PortfolioCard,
} from '../../components/PortfolioComponents';

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
        setScannedResult(decodedText);
        setIsScanning(false);
        await processStockMovement(decodedText);
    }

    function onScanFailure(error) {
        // Silent failure for continuous scanning
    }

    const processStockMovement = async (sku) => {
        setLoading(true);
        try {
            const itemRes = await api.get(`/forms/stock/api/items/?sku=${sku}`);
            const item = itemRes.data.find(i => i.sku === sku);

            if (!item) {
                setLastLog({ status: 'ERROR', message: `SKU ${sku} NOT RECOGNIZED IN ARCHIVE.` });
                setLoading(false);
                return;
            }

            const movementData = {
                item: item.id,
                type: mode === 'ENTRY' ? 'IN' : 'OUT',
                quantity: 1,
                reason: mode === 'ENTRY' ? 'Optical Restock' : 'Optical Consumption',
                recorded_by: 'Authorized Scanner'
            };

            const res = await api.post('/forms/stock/api/movements/', movementData);
            const status = res.data.status;

            let message = '';
            if (status === 'APPROVED') {
                message = `${mode === 'ENTRY' ? 'ACQUIRED' : 'DISPATCHED'} 1 UNIT: ${item.name.toUpperCase()}`;
            } else {
                message = `SCAN RECORDED - PENDING APPROVAL: ${item.name.toUpperCase()}`;
            }

            setLastLog({
                status: 'SUCCESS',
                message: message,
                time: new Date().toLocaleTimeString(),
                isPending: status === 'PENDING'
            });
        } catch (err) {
            console.error("QR Sync Error", err);
            setLastLog({ status: 'ERROR', message: 'CONNECTION INTERRUPTED.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <PortfolioPage breadcrumb="Operations / Logistics / Intelligence">
            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                <PortfolioTitle subtitle="High-precision optical recognition for rapid inventory synchronization.">
                    Scanner Portal
                </PortfolioTitle>
            </header>

            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                    <PortfolioButton
                        onClick={() => { setMode('ENTRY'); setLastLog(null); }}
                        variant={mode === 'ENTRY' ? 'primary' : 'secondary'}
                        style={{
                            flex: 1,
                            height: '60px',
                            border: mode === 'ENTRY' ? '1px solid #10b981' : '1px solid rgba(232, 230, 227, 0.1)',
                            background: mode === 'ENTRY' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                            color: mode === 'ENTRY' ? '#10b981' : 'rgba(232, 230, 227, 0.4)'
                        }}
                    >
                        <ArrowUpCircle size={18} /> INBOUND ACQUISITION
                    </PortfolioButton>
                    <PortfolioButton
                        onClick={() => { setMode('EXIT'); setLastLog(null); }}
                        variant={mode === 'EXIT' ? 'primary' : 'secondary'}
                        style={{
                            flex: 1,
                            height: '60px',
                            border: mode === 'EXIT' ? '1px solid var(--gold)' : '1px solid rgba(232, 230, 227, 0.1)',
                            background: mode === 'EXIT' ? 'rgba(176, 141, 87, 0.1)' : 'transparent',
                            color: mode === 'EXIT' ? 'var(--gold)' : 'rgba(232, 230, 227, 0.4)'
                        }}
                    >
                        <ArrowDownCircle size={18} /> OUTBOUND DISPATCH
                    </PortfolioButton>
                </div>

                <PortfolioCard style={{
                    padding: '60px',
                    textAlign: 'center',
                    border: mode === 'ENTRY' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(176, 141, 87, 0.3)'
                }}>
                    {!isScanning ? (
                        <div style={{ padding: '20px 0' }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                border: '1px solid rgba(232, 230, 227, 0.1)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '30px',
                                color: mode === 'ENTRY' ? '#10b981' : 'var(--gold)',
                                background: 'rgba(232, 230, 227, 0.02)'
                            }}>
                                <Camera size={50} strokeWidth={1} />
                            </div>
                            <h2 style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                color: 'var(--cream)',
                                fontSize: '28px',
                                marginBottom: '10px'
                            }}>
                                Optical Lens Ready
                            </h2>
                            <p style={{ color: 'rgba(232, 230, 227, 0.4)', fontSize: '12px', letterSpacing: '1px', marginBottom: '40px' }}>
                                POSITION QR CODE WITHIN THE SENSORY RANGE
                            </p>
                            <PortfolioButton
                                onClick={() => setIsScanning(true)}
                                variant="primary"
                                style={{ width: '240px', height: '60px' }}
                            >
                                ACTIVATE SENSORS
                            </PortfolioButton>
                        </div>
                    ) : (
                        <div id="reader" style={{ width: '100%', borderRadius: '20px', overflow: 'hidden', background: '#000', border: '1px solid rgba(232,230,227,0.2)' }}></div>
                    )}

                    {loading && (
                        <div style={{ marginTop: '30px', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', fontSize: '13px', letterSpacing: '2px' }}>
                            <RefreshCw className="spin" size={16} /> SYNCHRONIZING WITH ARCHIVE...
                        </div>
                    )}

                    {lastLog && (
                        <div style={{
                            marginTop: '40px',
                            padding: '30px',
                            borderRadius: '15px',
                            background: lastLog.status === 'SUCCESS' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)',
                            border: `1px solid ${lastLog.status === 'SUCCESS' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            textAlign: 'left'
                        }}>
                            {lastLog.status === 'SUCCESS' ? <CheckCircle color="#10b981" size={24} /> : <AlertCircle color="#f43f5e" size={24} />}
                            <div style={{ flex: 1 }}>
                                <div style={{ color: 'var(--cream)', fontSize: '15px', fontWeight: '700', letterSpacing: '0.5px' }}>{lastLog.message}</div>
                                {lastLog.time && <div style={{ color: 'rgba(232, 230, 227, 0.4)', fontSize: '11px', marginTop: '5px' }}>LOGGED AT {lastLog.time}</div>}
                            </div>
                            {lastLog.status === 'SUCCESS' && (
                                <PortfolioButton
                                    onClick={() => setIsScanning(true)}
                                    variant="secondary"
                                    style={{ height: '40px', padding: '0 15px', fontSize: '10px' }}
                                >
                                    CONTINUE
                                </PortfolioButton>
                            )}
                        </div>
                    )}
                </PortfolioCard>
            </div>


        </PortfolioPage>
    );
};

export default StockScanner;
