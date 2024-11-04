import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn p-4">
      <div 
        className="bg-white rounded-lg border border-gray-200 shadow-[0_0_15px_rgba(0,0,0,0.1)] max-w-md w-full animate-slideUp"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;