import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/10 backdrop-blur-lg border-t border-white/20">
      <div className="container mx-auto px-4 py-6 text-center text-gray-300">
        <p>&copy; {new Date().getFullYear()} Forge Fashion. All rights reserved.</p>
        <p className="text-sm mt-1">Crafted by AI. Designed by You.</p>
      </div>
    </footer>
  );
};

export default Footer;