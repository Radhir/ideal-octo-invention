import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BackgroundCarousel = () => {
    const location = useLocation();
    const isAuthPage = ['/login', '/register', '/portal'].some(path => location.pathname.startsWith(path));

    const assets = [
        { type: 'video', src: '/bg_vid1.mp4' },
        { type: 'image', src: '/backgrounds/Porsche.jpg' },
        { type: 'video', src: '/bg_vid2.mp4' },
        { type: 'image', src: '/backgrounds/Dodge Challenger.jpg' },
        { type: 'video', src: '/bg_vid5.mp4' },
        { type: 'image', src: '/backgrounds/F1.jpg' }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % assets.length);
        }, 12000); // Slightly longer for videos
        return () => clearInterval(interval);
    }, [assets.length]);

    if (isAuthPage) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            overflow: 'hidden',
            background: '#000'
        }}>
            {assets.map((asset, idx) => (
                <div
                    key={idx}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        transition: 'opacity 3s ease-in-out',
                        opacity: idx === currentIndex ? 0.25 : 0,
                        visibility: idx === currentIndex ? 'visible' : 'hidden'
                    }}
                >
                    {asset.type === 'video' ? (
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        >
                            <source src={asset.src} type="video/mp4" />
                        </video>
                    ) : (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${asset.src})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }} />
                    )}
                </div>
            ))}
            {/* Professional Vingette & Mesh Gradient Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'var(--mesh-gradient)',
                opacity: 0.4,
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.6) 100%), linear-gradient(to bottom, transparent 0%, #0a0c10 100%)',
                pointerEvents: 'none'
            }} />
        </div>
    );
};

export default BackgroundCarousel;
