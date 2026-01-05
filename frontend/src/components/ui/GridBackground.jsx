import React from 'react';

export const GridBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
            <div className="absolute inset-0 technical-grid opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-plltr-bg via-transparent to-transparent" />
            {/* Dynamic light effects */}
            <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-plltr-blue/5 blur-[100px] rounded-full animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-plltr-accent/5 blur-[80px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>
    );
};
