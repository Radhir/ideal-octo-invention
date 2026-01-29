import React from 'react';
import { Camera, Scan } from 'lucide-react';

const OCRScanner = ({ onScan }) => {
    const handleScan = () => {
        // Mock OCR Data for simulation
        const mockData = {
            plate: "DXB 80872",
            model: "TIGUAN",
            vin: "WVWZZZ5N1...X"
        };

        // In a real implementation, this would trigger a camera modal or file upload
        if (onScan) {
            onScan(mockData);
        }
        alert("OCR Scan Simulated: Captured Plate DXB 80872");
    };

    return (
        <button
            onClick={handleScan}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <Scan size={16} />
            <span>Scan License Plate / VIN (OCR)</span>
        </button>
    );
};

export default OCRScanner;
