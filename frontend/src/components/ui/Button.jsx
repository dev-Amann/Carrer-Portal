import React from 'react';

const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 border-transparent",
    secondary: "bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:text-white",
    outline: "bg-transparent border-gray-600 text-gray-300 hover:border-indigo-400 hover:text-indigo-400",
    ghost: "bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5",
    danger: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40"
};

const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
};

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    loading = false,
    disabled = false,
    type = 'button',
    onClick,
    ...props
}) => {
    const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = variants[variant] || variants.primary;
    const sizeClasses = sizes[size] || sizes.md;

    return (
        <button
            type={type}
            className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
};

export default Button;
