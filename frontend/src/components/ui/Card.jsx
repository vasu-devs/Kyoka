import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className, ...props }) => {
    return (
        <div
            className={twMerge(
                'plltr-card p-6 text-plltr-text',
                'tech-border-corner',
                className
            )}
            {...props}
        >
            {children}
            {/* Decorative corner accents */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-plltr-blue/50" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-plltr-blue/50" />
        </div>
    );
};
