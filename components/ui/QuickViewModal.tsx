
import React from 'react';
import { Product } from '../../types';

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  // FIX: Made onCustomizeClick optional to allow the modal to be used on pages without a navigation function.
  onCustomizeClick?: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ isOpen, onClose, product, onCustomizeClick }) => {
  if (!isOpen || !product) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      <div 
        className="bg-gray-800/80 border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl relative flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'zoomIn 0.3s ease-out' }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 p-1 bg-black/20 rounded-full"
          aria-label="Close quick view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-full md:w-1/2 h-80 md:h-auto bg-black/20">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 id="quick-view-title" className="text-3xl font-bold text-white">{product.name}</h2>
          <p className="text-gray-300 mt-2">{product.category}</p>
          
          {product.price && (
            <p className="text-2xl font-semibold text-white mt-4">{product.price}</p>
          )}

          {/* FIX: Conditionally render the "Inspired?" section only if onCustomizeClick is provided. */}
          {onCustomizeClick && (
            <div className="mt-6 border-t border-white/20 pt-6">
              <h3 className="text-lg font-semibold text-white">Inspired?</h3>
              <p className="text-gray-300 mt-2">Use this design as a starting point for your own creation.</p>
              <button
                onClick={onCustomizeClick}
                className="mt-4 w-full bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                </svg>
                Customize Your Own
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default QuickViewModal;
