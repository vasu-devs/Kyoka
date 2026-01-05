import React from 'react';
import { twMerge } from 'tailwind-merge';

const Button = ({ children, variant = 'primary', className, ...props }) => {
    return (
        <button
            className={twMerge(
                'btn-luxury',
                className
            )}
            {...props}
        >
            <span className="relative z-10">{children}</span>
        </button>
    );
};

export default Button;
