
import React, { useState } from 'react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onDelete?: () => void;
  isDeletable?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onDelete, isDeletable = false }) => {
  const [shareFeedback, setShareFeedback] = useState('Share');

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const isGenerated = typeof product.id === 'string' && product.id.startsWith('gen-');
    let url;
    if (isGenerated) {
      url = `${window.location.origin}/?shared_prompt=${encodeURIComponent(product.name)}`;
    } else {
      url = `${window.location.origin}/?product_id=${product.id}`;
    }

    const shareData = {
      title: `Forge Fashion: ${product.name}`,
      text: `Check out this design I found on Forge Fashion!`,
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Share failed:", err);
        await navigator.clipboard.writeText(url);
        setShareFeedback('Copied!');
        setTimeout(() => setShareFeedback('Share'), 2000);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShareFeedback('Copied!');
        setTimeout(() => setShareFeedback('Share'), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
        setShareFeedback('Error');
        setTimeout(() => setShareFeedback('Share'), 2000);
      }
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onDelete?.();
  }


  return (
    <div 
      className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl aspect-[3/4] cursor-pointer"
      onClick={onClick}
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
       <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
        <button 
          onClick={handleShare}
          className="p-2 rounded-full bg-black/40 text-white hover:bg-white/20"
          aria-label="Share this design"
          title={shareFeedback}
        >
          {shareFeedback === 'Copied!' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
          ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
          )}
        </button>
        {isDeletable && onDelete && (
            <button 
                onClick={handleDelete}
                className="p-2 rounded-full bg-black/40 text-white hover:bg-red-500/80"
                aria-label="Delete this design"
                title="Delete"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            </button>
        )}
       </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <h3 className="text-xl font-semibold truncate" title={product.name}>{product.name}</h3>
        <p className="mt-1 text-sm text-gray-200">{product.category}</p>
        {product.price && <p className="mt-2 text-lg font-bold">{product.price}</p>}
      </div>
    </div>
  );
};

export default ProductCard;
