
import React, { useState, useRef, useEffect } from 'react';
import { View } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from '../auth/LoginModal';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const NavLink: React.FC<{
  view: View;
  currentView: View;
  onNavigate: (view: View) => void;
  children: React.ReactNode;
  isMobile?: boolean;
}> = ({ view, currentView, onNavigate, children, isMobile = false }) => {
  const isActive = view === currentView;
  const baseClasses = "transition-colors duration-200 font-medium";
  const mobileClasses = `w-full text-center px-4 py-3 rounded-md text-lg ${isActive ? 'bg-white/20 text-white' : 'text-gray-200 hover:bg-white/10'}`;
  const desktopClasses = `px-4 py-2 rounded-md text-sm ${isActive ? 'bg-white/20 text-white' : 'text-gray-200 hover:bg-white/10'}`;

  return (
    <button
      onClick={() => onNavigate(view)}
      className={`${baseClasses} ${isMobile ? mobileClasses : desktopClasses}`}
    >
      {children}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { currentUser, logout } = useAuth();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Close mobile menu on view change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentView]);

  const handleNavLinkClick = (view: View) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white/10 backdrop-blur-lg sticky top-0 z-50 border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3h12v4H3zM3 10h9v4H3zM3 17h6v4H3z"/>
              </svg>
              <span className="text-xl font-bold text-white tracking-wider">Forge Fashion</span>
            </div>

            <nav className="hidden md:flex items-center space-x-2 bg-black/10 p-1 rounded-lg">
                <NavLink view="shop" currentView={currentView} onNavigate={onNavigate}>Shop</NavLink>
                <NavLink view="customize" currentView={currentView} onNavigate={onNavigate}>Customize</NavLink>
                <NavLink view="gallery" currentView={currentView} onNavigate={onNavigate}>My Designs</NavLink>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4">
               {currentUser ? (
                 <div className="relative" ref={profileMenuRef}>
                   <button 
                     onClick={() => setProfileMenuOpen(prev => !prev)}
                     className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg hover:bg-white/30 transition-colors"
                     aria-haspopup="true"
                     aria-expanded={isProfileMenuOpen}
                   >
                     {currentUser.username.charAt(0).toUpperCase()}
                   </button>
                   {isProfileMenuOpen && (
                     <div className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-lg border border-white/20 rounded-md shadow-lg py-1 z-50">
                       <div className="px-4 py-2 text-sm text-gray-200 border-b border-white/10">
                         Signed in as <br/>
                         <strong className="font-medium text-white">{currentUser.username}</strong>
                       </div>
                       <button
                         onClick={() => {
                           logout();
                           setProfileMenuOpen(false);
                         }}
                         className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10"
                       >
                         Log Out
                       </button>
                     </div>
                   )}
                 </div>
               ) : (
                 <button 
                    onClick={() => setLoginModalOpen(true)}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-white text-black hover:bg-gray-200 transition-colors"
                 >
                   Log In
                 </button>
               )}
               <div className="md:hidden">
                 <button 
                    onClick={() => setMobileMenuOpen(prev => !prev)}
                    className="p-2 rounded-md text-gray-200 hover:bg-white/10"
                    aria-label="Toggle menu"
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-menu"
                 >
                    {isMobileMenuOpen ? (
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                 </button>
               </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div 
            id="mobile-menu"
            className={`absolute top-16 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-lg md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
        >
            <nav className="flex flex-col items-center space-y-2 p-4">
                <NavLink view="shop" currentView={currentView} onNavigate={handleNavLinkClick} isMobile>Shop</NavLink>
                <NavLink view="customize" currentView={currentView} onNavigate={handleNavLinkClick} isMobile>Customize</NavLink>
                <NavLink view="gallery" currentView={currentView} onNavigate={handleNavLinkClick} isMobile>My Designs</NavLink>
            </nav>
        </div>
      </header>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
};

export default Header;
