import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md', // sm, md, lg, xl
  footer
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto overflow-x-hidden backdrop-blur-sm bg-black/60 animate-fade-in">
      {/* Backdrop overlay for closing */}
      <div className="fixed inset-0 transition-opacity" onClick={onClose} aria-hidden="true" />

      <div className={`relative w-full ${maxWidthClasses[size]} transform rounded-2xl bg-[#13131f] border border-white/10 shadow-2xl transition-all flex flex-col max-h-[90vh]`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 sticky top-0 bg-[#13131f] z-10 rounded-t-2xl">
          <h3 className="text-xl font-semibold text-white tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5 focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-white/5 bg-[#0a0a0f]/50 rounded-b-2xl sticky bottom-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
