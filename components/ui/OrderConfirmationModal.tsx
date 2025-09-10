import React from 'react';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  designDetails: {
    category: string;
    prompt: string;
  };
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ isOpen, onClose, onConfirm, designDetails }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-confirm-title"
    >
      <div 
        className="bg-gray-800/80 border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label="Close confirmation modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 id="order-confirm-title" className="text-2xl font-bold text-white mt-4">Confirm Your Order</h2>
        </div>
        <div className="mt-6 text-gray-200 bg-white/5 p-4 rounded-lg border border-white/10">
            <p className="text-sm">You are about to place an order for a unique, AI-generated <strong className="font-bold text-white capitalize">{designDetails.category}</strong>.</p>
            <p className="text-sm mt-3">Your design is based on the following description:</p>
            <blockquote className="mt-2 text-sm italic text-gray-300 border-l-2 border-white/20 pl-3">
                "{designDetails.prompt}"
            </blockquote>
        </div>
        <p className="text-xs text-gray-400 mt-4 text-center">Once confirmed, this design will be sent for production. This action cannot be undone.</p>
        
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-md text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-md text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;
