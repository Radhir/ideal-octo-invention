import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const BackgroundCarousel = () => {
    const { theme } = useTheme();
    const location = useLocation();
    const isAuthPage = ['/login', '/register', '/portal'].some(path => location.pathname.startsWith(path));

    // Fallback static assets
    const staticAssets = [
        '/backgrounds/Porsche.jpg',
        '/backgrounds/F1.jpg'
    ];

    const [assets, setAssets] = useState(staticAssets);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Fetch dynamic backgrounds from ERP
        const fetchBackgrounds = async () => {
            try {
                const response = await fetch('/forms/job-cards/api/photos/random_backgrounds/?limit=8');
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        const imageUrls = data
                            .filter(item => item.url)
                            .map(item => item.url);

                        if (imageUrls.length > 0) {
                            setAssets(imageUrls);
                        }
                    }
                }
            } catch (error) {
                console.log('Using static backgrounds:', error);
                // Keep staticAssets as fallback
            }
        };

        fetchBackgrounds();
    }, []);

    useEffect(() => {
        // Preload images to prevent flicker or loading issues
        const preloadImages = async () => {
            const promises = assets.map((src) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = resolve;
                    img.onerror = resolve; // Continue even if one fails
                });
            });
            await Promise.all(promises);
            setLoaded(true);
        };
        preloadImages();
    }, [assets]);

    useEffect(() => {
        if (!loaded) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % assets.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [loaded, assets.length]);

    // Hide on auth pages OR in light mode for a clean white background
    if (isAuthPage || theme === 'light') return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            overflow: 'hidden',
            background: 'var(--bg-primary)', // Use theme-aware background
        }}>
            {/* Show fallback gradient while loading */}
            {!loaded && (
                <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at center, #1a1c20 0%, #000 100%)',
                }} />
            )}

            {loaded && assets.map((src, idx) => (
                <div
                    key={idx}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${src})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'opacity 2s ease-in-out',
                        opacity: idx === currentIndex ? 0.35 : 0,
                        willChange: 'opacity'
                    }}
                />
            ))}

            {/* Professional Vingette & Mesh Gradient Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.5)', // darken overall
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at center, transparent 0%, #000 120%)',
                pointerEvents: 'none'
            }} />
        </div>
    );
};

export default BackgroundCarousel;
