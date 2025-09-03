import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../../types';
import ProductCard from '../ui/ProductCard';

const mockProducts: Product[] = [
    { id: 1, name: 'The Artisan Trench', price: '$449.00', category: 'Outerwear', imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop' },
    { id: 2, name: 'Flowing Linen Dress', price: '$229.00', category: 'Dresses', imageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa6cecc870?q=80&w=800&auto=format&fit=crop' },
    { id: 3, name: 'Midnight Rider Jacket', price: '$399.00', category: 'Outerwear', imageUrl: 'https://images.unsplash.com/photo-1542289948-8b4353488275?q=80&w=800&auto=format&fit=crop' },
    { id: 4, name: 'Urban Straight-Fit Denim', price: '$129.00', category: 'Bottoms', imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop' },
    { id: 5, name: 'Ascent Runner Sneakers', price: '$199.00', category: 'Footwear', imageUrl: 'https://images.unsplash.com/photo-1550928434-4a0b2b8006e2?q=80&w=800&auto=format&fit=crop' },
    { id: 6, name: 'The Minimalist Crossbody', price: '$179.00', category: 'Accessories', imageUrl: 'https://images.unsplash.com/photo-1598532163257-ae24b22c7594?q=80&w=800&auto=format&fit=crop' },
    { id: 7, name: 'Classic Oxford Shirt', price: '$99.00', category: 'Tops', imageUrl: 'https://images.unsplash.com/photo-1603252109360-704952e1aedd?q=80&w=800&auto=format&fit=crop' },
    { id: 8, name: 'Summer Sundress', price: '$159.00', category: 'Dresses', imageUrl: 'https://images.unsplash.com/photo-1594744806549-82d3f6834180?q=80&w=800&auto=format&fit=crop' },
    { id: 9, name: 'Tailored Chino Trousers', price: '$149.00', category: 'Bottoms', imageUrl: 'https://images.unsplash.com/photo-1605518216938-6c84b68910c1?q=80&w=800&auto=format&fit=crop' },
    { id: 10, name: 'Aviator Sunglasses', price: '$129.00', category: 'Accessories', imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop' },
];

const CATEGORIES = ['All', 'Outerwear', 'Dresses', 'Tops', 'Bottoms', 'Footwear', 'Accessories'];


interface HomePageProps {
    onCustomizeClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onCustomizeClick }) => {
  const [recentCreations, setRecentCreations] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('designHistory');
      if (storedHistory) {
        setRecentCreations(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse design history from localStorage:", error);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') {
      return mockProducts;
    }
    return mockProducts.filter(product => product.category === activeCategory);
  }, [activeCategory]);


  return (
    <div className="space-y-16">
      <div className="relative h-[60vh] -mx-4 -mt-8 flex items-center justify-center text-center text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Forge Your Style.</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200">
            Bring your unique vision to life. Our AI-powered platform turns your ideas into one-of-a-kind apparel.
          </p>
          <button 
              onClick={onCustomizeClick}
              className="mt-8 inline-block bg-white text-black font-bold py-3 px-10 rounded-lg text-lg hover:bg-gray-200 transition-transform transform hover:scale-105 shadow-2xl"
          >
            Start Designing Now
          </button>
        </div>
      </div>

      {recentCreations.length > 0 && (
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Your Recent Creations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentCreations.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Explore The Collection</h2>
        
        <div className="flex justify-center flex-wrap gap-3 mb-10">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;