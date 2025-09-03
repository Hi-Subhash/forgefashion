
import React from 'react';
import { View } from '../../types';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const NavLink: React.FC<{
  view: View;
  currentView: View;
  onNavigate: (view: View) => void;
  children: React.ReactNode;
}> = ({ view, currentView, onNavigate, children }) => {
  const isActive = view === currentView;
  return (
    <button
      onClick={() => onNavigate(view)}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-white/20 text-white'
          : 'text-gray-200 hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );
};


const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  return (
    <header className="bg-white/10 backdrop-blur-lg sticky top-0 z-50 border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3h12v4H3zM3 10h9v4H3zM3 17h6v4H3z"/>
            </svg>
            <span className="text-xl font-bold text-white tracking-wider">Forge Fashion</span>
          </div>
          <nav className="flex items-center space-x-2 bg-black/10 p-1 rounded-lg">
              <NavLink view="shop" currentView={currentView} onNavigate={onNavigate}>Shop</NavLink>
              <NavLink view="customize" currentView={currentView} onNavigate={onNavigate}>Customize</NavLink>
              <NavLink view="gallery" currentView={currentView} onNavigate={onNavigate}>My Designs</NavLink>
          </nav>
          <div className="flex items-center space-x-4">
             <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;