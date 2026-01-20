import React from 'react';

const Card = ({ children, className = '', hoverEffect = false, ...props }) => {
    const baseClasses = "glass-card rounded-xl p-6 border border-white/5";
    const hoverClasses = hoverEffect ? "hover:scale-[1.01]" : "";

    return (
        <div className={`${baseClasses} ${hoverClasses} ${className}`} {...props}>
            {children}
        </div>
    );
};

export default Card;
