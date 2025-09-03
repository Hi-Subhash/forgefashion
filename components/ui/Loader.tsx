
import React from 'react';

interface LoaderProps {
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = "Generating your design..." }) => {
  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white"></div>
      <p className="mt-4 text-white text-lg font-semibold">{text}</p>
    </div>
  );
};

export default Loader;
