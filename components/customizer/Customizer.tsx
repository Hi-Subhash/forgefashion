
import React from 'react';

interface CustomizerState {
    prompt: string;
    fabric: string;
    pattern: string;
    sleeveLength: string;
    neckline: string;
    color: string | null;
    category: string;
    size: string;
    sheen: string;
    texture: string;
    weight: string;
}

interface CustomizerProps {
  state: CustomizerState;
  onStateChange: <K extends keyof CustomizerState>(field: K, value: CustomizerState[K]) => void;
  onGenerate: () => void;
  isLoading: boolean;
  generatedDetails: string | null;
  onPlaceOrder: () => void;
  isOrderable: boolean;
  onSaveDesign: () => void;
  isSaved: boolean;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onGenerateInspiration: () => void;
  isGeneratingInspiration: boolean;
}

const FABRICS = ['Any', 'Cotton', 'Silk', 'Leather', 'Denim', 'Wool', 'Linen', 'Velvet'];
const PATTERNS = ['Any', 'Plain', 'Striped', 'Floral', 'Polka Dot', 'Plaid', 'Geometric', 'Camouflage'];
const SLEEVE_LENGTHS = ['Any', 'Short Sleeve', 'Long Sleeve', 'Sleeveless', 'Three-Quarter Sleeve'];
const NECKLINES = ['Any', 'Crew Neck', 'V-Neck', 'Scoop Neck', 'Turtleneck', 'Boat Neck'];
const CATEGORIES = ['Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Accessories'];
const TEXTURES = ['Any', 'Smooth', 'Rough', 'Woven', 'Knit', 'Fur', 'Quilted', 'Ribbed'];
const SHEEN = ['Any', 'Matte', 'Satin', 'Glossy', 'Metallic', 'Iridescent'];
const WEIGHTS = ['Any', 'Lightweight', 'Medium-weight', 'Heavyweight', 'Sheer'];

const SIZES: { [key: string]: string[] } = {
  tops: ['Any', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
  bottoms: ['Any', '28', '30', '32', '34', '36', '38'],
  outerwear: ['Any', 'S', 'M', 'L', 'XL', 'XXL'],
  footwear: ['Any', '7', '8', '9', '10', '11', '12'],
  accessories: ['Any', 'One Size'],
};


const Customizer: React.FC<CustomizerProps> = ({
  state,
  onStateChange,
  onGenerate,
  isLoading,
  generatedDetails,
  onPlaceOrder,
  isOrderable,
  onSaveDesign,
  isSaved,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onGenerateInspiration,
  isGeneratingInspiration
}) => {
  const availableSizes = SIZES[state.category.toLowerCase()] || ['Any'];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">Describe Your Vision</h2>
              <button
                onClick={onGenerateInspiration}
                disabled={isLoading || isGeneratingInspiration}
                className="p-1.5 rounded-full text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Generate inspiration"
                title="Surprise Me!"
              >
                {isGeneratingInspiration ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h.5a1.5 1.5 0 010 3h-.5a1 1 0 00-1 1v.5a1.5 1.5 0 01-3 0V8a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3h.5a1 1 0 001-1v-.5zM7.5 10a1.5 1.5 0 000 3h.5a1 1 0 011 1v.5a1.5 1.5 0 003 0V14a1 1 0 011-1h.5a1.5 1.5 0 000-3h-.5a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1h-.5z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex items-center space-x-2">
                <button 
                    onClick={onUndo} 
                    disabled={!canUndo || isLoading}
                    className="p-2 rounded-full hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Undo change"
                    title="Undo"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 00-1.132-1.132l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.132-1.132L10.5 13H16a1 1 0 100-2h-5.5l1.566-1.8z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                    </svg>
                </button>
                 <button 
                    onClick={onRedo} 
                    disabled={!canRedo || isLoading}
                    className="p-2 rounded-full hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Redo change"
                    title="Redo"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.934 11.2a1 1 0 011.132-1.132l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.132-1.132L13.5 13H8a1 1 0 110-2h5.5l-1.566-1.8z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                    </svg>
                </button>
            </div>
        </div>

        <p className="text-gray-200 mb-4">Be as detailed as you like. Mention style, color, material, and any unique features.</p>
        <textarea
          value={state.prompt}
          onChange={(e) => onStateChange('prompt', e.target.value)}
          placeholder="e.g., a futuristic bomber jacket, iridescent silver fabric, with neon blue glowing seams..."
          className="w-full h-40 p-3 bg-white/5 text-white placeholder-gray-400 border border-white/20 rounded-md focus:ring-2 focus:ring-white/50 focus:border-white/50 transition duration-200 resize-none"
          disabled={isLoading}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Primary Color
            </label>
            <div className="flex items-center gap-3 mt-2">
              <input
                id="color-toggle"
                type="checkbox"
                checked={state.color !== null}
                onChange={(e) => {
                  if (e.target.checked) {
                    onStateChange('color', '#FFFFFF'); // Default to white when enabled
                  } else {
                    onStateChange('color', null);
                  }
                }}
                disabled={isLoading}
                className="h-4 w-4 rounded border-gray-300 text-white focus:ring-white/50 bg-transparent cursor-pointer"
              />
              <label htmlFor="color-toggle" className="text-sm text-gray-300 flex-grow cursor-pointer">
                {state.color !== null ? 'Customize color' : 'Let AI choose'}
              </label>
              <input
                id="color-picker"
                type="color"
                value={state.color || '#ffffff'}
                onChange={(e) => onStateChange('color', e.target.value)}
                disabled={isLoading || state.color === null}
                className={`w-10 h-10 p-1 bg-transparent border rounded-md cursor-pointer disabled:cursor-not-allowed transition-opacity duration-300 ${
                  state.color === null ? 'opacity-20' : 'opacity-100 border-white/30'
                }`}
              />
            </div>
          </div>
          <div>
            <label htmlFor="category-select" className="block text-sm font-medium text-gray-200 mb-1">
              Category
            </label>
            <select
              id="category-select"
              value={state.category}
              onChange={(e) => onStateChange('category', e.target.value)}
              disabled={isLoading}
              className="w-full p-2 border border-white/20 rounded-md focus:ring-2 focus:ring-white/50 focus:border-white/50 transition duration-200 bg-white/5 text-white"
            >
              {CATEGORIES.map((c) => (
                <option className="bg-gray-800" key={c} value={c.toLowerCase()}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="size-select" className="block text-sm font-medium text-gray-200 mb-1">
              Size
            </label>
            <select
              id="size-select"
              value={state.size}
              onChange={(e) => onStateChange('size', e.target.value)}
              disabled={isLoading}
              className="w-full p-2 border border-white/20 rounded-md focus:ring-2 focus:ring-white/50 focus:border-white/50 transition duration-200 bg-white/5 text-white"
            >
              {availableSizes.map((s) => (
                <option className="bg-gray-800" key={s} value={s.toLowerCase()}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sleeve-select" className="block text-sm font-medium text-gray-200 mb-1">
              Sleeve Length
            </label>
            <select
              id="sleeve-select"
              value={state.sleeveLength}
              onChange={(e) => onStateChange('sleeveLength', e.target.value)}
              disabled={isLoading}
              className="w-full p-2 border border-white/20 rounded-md focus:ring-2 focus:ring-white/50 focus:border-white/50 transition duration-200 bg-white/5 text-white"
            >
              {SLEEVE_LENGTHS.map((s) => (
                <option className="bg-gray-800" key={s} value={s.toLowerCase()}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="neckline-select" className="block text-sm font-medium text-gray-200 mb-1">
              Neckline Type
            </label>
            <select
              id="neckline-select"
              value={state.neckline}
              onChange={(e) => onStateChange('neckline', e.target.value)}
              disabled={isLoading}
              className="w-full p-2 border border-white/20 rounded-md focus:ring-2 focus:ring-white/50 focus:border-white/50 transition duration-200 bg-white/5 text-white"
            >
              {NECKLINES.map((n) => (
                <option className="bg-gray-800" key={n} value={n.toLowerCase()}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="fabric-select" className="block text-sm font-medium text-gray-200 mb-1">
              Base Fabric
            </label>
            <select
              id="fabric-select"
              value={state.fabric}
              onChange={(e) => onStateChange('fabric', e.target.value)}
              disabled={isLoading}
              className="w-full p-2 border border-white/20 rounded-md focus:ring-2 focus:ring-white/50 focus:border-white/50 transition duration-200 bg-white/5 text-white"
            >
              {FABRICS.map((f) => (
                <option className="bg-gray-800" key={f} value={f.toLowerCase()}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="texture-select" className="block text-sm font-medium text-gray-200 mb-1">
              Material Texture
            </label>
            <select
              id="texture-select"
              value={state.texture}
              onChange={(e) => onStateChange('texture', e.target.value)}
              disabled={isLoading}
              className="w-full p-2 border border-white/20 rounded-md focus:ring-2 focus:ring-white/50 focus:border-white/50 transition duration-200 bg-white/5 text-white"
            >
              {TEXTURES.map((t) => (
                <option className="bg-gray-800" key={t} value={t.toLowerCase()}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sheen-select" className="block text-sm font-medium text-gray-200 mb-1">
              Material Sheen
            </label>
            <select
              id="sheen-select"
              value={state.sheen}
              onChange={(e) => onStateChange('sheen', e.target.value)}
              disabled={isLoading}
              className="w-full p-2 border border-white/20 rounded-md focus:ring-2 focus:ring-white/50 focus:border-white/50 transition duration-200 bg-white/5 text-white"
            >
              {SHEEN.map((s) => (
                <option className="bg-gray-800" key={s} value={s.toLowerCase()}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="weight-select" className="block text-sm font-medium text-gray-200 mb-1">
              Material Weight
            </label>
            <select
              id="weight-select"
              value={state.weight}
              onChange={(e) => onStateChange('weight', e.target.value)}
              disabled={isLoading}
              className="w-full p-2 border border-white/20 rounded-md focus:ring-2 focus:ring-white/50 focus:border-white/50 transition duration-200 bg-white/5 text-white"
            >
              {WEIGHTS.map((w) => (
                <option className="bg-gray-800" key={w} value={w.toLowerCase()}>{w}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pattern-select" className="block text-sm font-medium text-gray-200 mb-1">
              Pattern
            </label>
            <select
              id="pattern-select"
              value={state.pattern}
              onChange={(e) => onStateChange('pattern', e.target.value)}
              disabled={isLoading}
              className="w-full p-2 border border-white/20 rounded-md focus:ring-2 focus:ring-white/50 focus:border-white/50 transition duration-200 bg-white/5 text-white"
            >
              {PATTERNS.map((p) => (
                <option className="bg-gray-800" key={p} value={p.toLowerCase()}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {generatedDetails && !isLoading && (
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/20">
             <h3 className="text-xl font-bold text-white mb-3">AI-Generated Details</h3>
             <div className="prose prose-invert prose-sm" dangerouslySetInnerHTML={{ __html: generatedDetails }} />
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full sm:w-auto flex-grow bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Visualize'
          )}
        </button>
        {isOrderable && (
            <>
                <button
                    onClick={onSaveDesign}
                    disabled={isSaved || isLoading}
                    className="w-full sm:w-auto bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 disabled:bg-blue-400/50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                    {isSaved ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Saved
                        </>
                    ) : (
                        'Save Design'
                    )}
                </button>
                <button
                    onClick={onPlaceOrder}
                    className="w-full sm:w-auto bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
                >
                    Place Order
                </button>
            </>
        )}
      </div>
    </div>
  );
};

export default Customizer;