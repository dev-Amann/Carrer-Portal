import React from 'react';

const Input = ({ label, id, error, as = 'input', className = '', icon, ...props }) => {
    const Component = as === 'textarea' ? 'textarea' : 'input';

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        {icon}
                    </div>
                )}
                <Component
                    id={id}
                    className={`
            w-full ${icon ? 'pl-10' : 'px-4'} py-2.5 bg-[#13131f] border border-gray-700/50 rounded-lg 
            text-gray-100 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
            transition-all duration-200
            disabled:opacity-50 disabled:bg-gray-800
            ${error ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-400 ml-1">{error}</p>
            )}
        </div>
    );
};

export default Input;
