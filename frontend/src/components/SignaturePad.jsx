import React, { useRef, useState } from 'react';
import { PenTool, Eraser, Check } from 'lucide-react';

const SignaturePad = ({ label, onSave: _onSave }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    // Context for drawing
    const getContext = () => canvasRef.current.getContext('2d');

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        const ctx = getContext();
        ctx.strokeStyle = '#b08d57'; // Gold color signature
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        const ctx = getContext();
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        setHasSignature(true);
    };

    const stopDrawing = () => {
        const ctx = getContext();
        ctx.closePath();
        setIsDrawing(false);
    };

    const clearSignature = () => {
        const ctx = getContext();
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setHasSignature(false);
    };

    return (
        <div style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '16px',
            marginTop: '16px',
            transition: 'all 0.3s ease'
        }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '10px' }}>
                {label}
            </label>

            <div style={{
                position: 'relative',
                border: '2px dashed var(--border-color)',
                borderRadius: '8px',
                background: 'var(--input-bg)',
                height: '150px',
                overflow: 'hidden',
                cursor: 'crosshair',
                transition: 'all 0.3s ease'
            }}>
                {!hasSignature && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        pointerEvents: 'none',
                        opacity: 0.5
                    }}>
                        <PenTool size={16} />
                        <span style={{ fontSize: '12px' }}>Sign Here</span>
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    width={400}
                    height={150}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    style={{ width: '100%', height: '100%', display: 'block' }}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                    onClick={clearSignature}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <Eraser size={12} /> Clear
                </button>
            </div>
        </div>
    );
};

export default SignaturePad;
