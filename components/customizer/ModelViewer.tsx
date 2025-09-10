
import React, { useState } from 'react';
import Loader from '../ui/Loader';

interface ModelViewerProps {
  imageUrl: string | null;
  isLoading: boolean;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ imageUrl, isLoading }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPoint, setStartPanPoint] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 45) % 360);
  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPanOffset({ x: 0, y: 0 });
  };

  const handlePanStart = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageUrl) return;
    e.preventDefault();
    setIsPanning(true);
    setStartPanPoint({
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y,
    });
  };

  const handlePanMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isPanning || !imageUrl) return;
    e.preventDefault();
    setPanOffset({
      x: e.clientX - startPanPoint.x,
      y: e.clientY - startPanPoint.y,
    });
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  const handlePanStartTouch = (e: React.TouchEvent<HTMLImageElement>) => {
    if (!imageUrl || e.touches.length !== 1) return;
    setIsPanning(true);
    setStartPanPoint({
      x: e.touches[0].clientX - panOffset.x,
      y: e.touches[0].clientY - panOffset.y,
    });
  };

  const handlePanMoveTouch = (e: React.TouchEvent<HTMLImageElement>) => {
    if (!isPanning || !imageUrl || e.touches.length !== 1) return;
    setPanOffset({
      x: e.touches[0].clientX - startPanPoint.x,
      y: e.touches[0].clientY - startPanPoint.y,
    });
  };

  const handlePanEndTouch = () => {
    setIsPanning(false);
  };


  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden rounded-lg">
       {isLoading && <Loader text="AI is rendering your design..."/>}
       <div className="relative w-[281px] h-[500px] md:w-[337px] md:h-[600px] flex items-center justify-center">
        {!imageUrl && !isLoading && (
            <div className="w-full h-full border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-4 text-md font-semibold text-gray-200">Your Creation Awaits</h3>
                <p className="mt-1 text-sm text-gray-400">Fill out the details and click 'Visualize' to see your design.</p>
            </div>
        )}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Generated Fashion"
            className="object-contain w-full h-full rounded-lg shadow-2xl transition-opacity duration-500 animate-fade-in"
            onMouseDown={handlePanStart}
            onMouseMove={handlePanMove}
            onMouseUp={handlePanEnd}
            onMouseLeave={handlePanEnd}
            onTouchStart={handlePanStartTouch}
            onTouchMove={handlePanMoveTouch}
            onTouchEnd={handlePanEndTouch}
            onTouchCancel={handlePanEndTouch}
            style={{
              transform: `translateX(${panOffset.x}px) translateY(${panOffset.y}px) rotate(${rotation}deg) scale(${scale})`,
              transition: isPanning ? 'none' : 'transform 0.3s ease-in-out',
              cursor: isPanning ? 'grabbing' : 'grab',
              animation: 'fadeIn 0.5s ease-in-out',
              touchAction: 'none'
            }}
          />
        )}
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-black/30 backdrop-blur-sm p-2 rounded-full text-white">
        <button title="Rotate" onClick={handleRotate} className="p-2 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!imageUrl}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m-5 2h12M20 20v-5h-5m5 2H8" /></svg>
        </button>
         <button title="Zoom In" onClick={handleZoomIn} className="p-2 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!imageUrl}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3h-6" /></svg>
        </button>
         <button title="Zoom Out" onClick={handleZoomOut} className="p-2 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!imageUrl}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
        </button>
         <button title="Reset View" onClick={handleReset} className="p-2 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!imageUrl}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
        </button>
      </div>
       <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
          }
        `}</style>
    </div>
  );
};

export default ModelViewer;
