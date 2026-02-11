import React from 'react';

const LoadingSkeleton = ({ type = 'card' }) => {
    if (type === 'card') {
        return (
            <div className="glass-card p-4 animate-pulse w-100 h-100 opacity-50">
                <div className="h-6 bg-slate-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-5/6"></div>
            </div>
        );
    }

    if (type === 'table') {
        return (
            <div className="animate-pulse w-full">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex space-x-4 mb-4">
                        <div className="h-6 bg-slate-700 rounded flex-1"></div>
                        <div className="h-6 bg-slate-700 rounded flex-1"></div>
                        <div className="h-6 bg-slate-700 rounded flex-1"></div>
                    </div>
                ))}
            </div>
        );
    }

    return <div className="animate-pulse h-4 bg-slate-700 rounded w-full"></div>;
};

export default LoadingSkeleton;
