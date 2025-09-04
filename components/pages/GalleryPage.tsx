
import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import ProductCard from '../ui/ProductCard';
import { useAuth } from '../../contexts/AuthContext';

const GalleryPage: React.FC = () => {
  const [savedDesigns, setSavedDesigns] = useState<Product[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      try {
        const storedDesigns = localStorage.getItem(`savedDesigns_${currentUser.username}`);
        if (storedDesigns) {
          setSavedDesigns(JSON.parse(storedDesigns));
        } else {
          setSavedDesigns([]);
        }
      } catch (error) {
        console.error("Failed to parse saved designs from localStorage:", error);
        setSavedDesigns([]);
      }
    } else {
      setSavedDesigns([]);
    }
  }, [currentUser]);

  const renderContent = () => {
    if (!currentUser) {
        return (
             <div className="text-center bg-white/5 border border-white/20 rounded-lg p-12 mt-16">
                 <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h2 className="mt-6 text-2xl font-bold text-white">Log in to see your designs</h2>
                <p className="mt-2 text-gray-300">
                    Your personal gallery is waiting for you. Log in to view or save new creations.
                </p>
             </div>
        );
    }
    if (savedDesigns.length > 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedDesigns.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        );
    }
    return (
        <div className="text-center bg-white/5 border border-white/20 rounded-lg p-12 mt-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 className="mt-6 text-2xl font-bold text-white">Your gallery is empty</h2>
          <p className="mt-2 text-gray-300">
            Head over to the 'Customize' tab to create and save your first design.
          </p>
        </div>
    );
  };

  return (
    <div className="container mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">My Designs</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
          Your personal gallery of AI-generated creations. Share your unique style with the world.
        </p>
      </div>
      {renderContent()}
    </div>
  );
};

export default GalleryPage;
