
import React, { useState, useCallback } from 'react';
import { View } from './types';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import HomePage from './components/pages/HomePage';
import CustomizePage from './components/pages/CustomizePage';
import GalleryPage from './components/pages/GalleryPage';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  const [view, setView] = useState<View>('shop');

  const handleNavigate = useCallback((newView: View) => {
    setView(newView);
  }, []);

  return (
    <AuthProvider>
      <div className="text-white min-h-screen flex flex-col font-sans">
        <Header currentView={view} onNavigate={handleNavigate} />
        <main className="flex-grow container mx-auto px-4 py-8">
          {view === 'shop' && <HomePage onCustomizeClick={() => handleNavigate('customize')} />}
          {view === 'customize' && <CustomizePage />}
          {view === 'gallery' && <GalleryPage />}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;
