
import React, { useState, useCallback } from 'react';
import Customizer from '../customizer/Customizer';
import ModelViewer from '../customizer/ModelViewer';
import { generateFashionImage, generateFashionDetails, generateInspirationPrompt } from '../../services/geminiService';
import { useHistoryState } from '../../hooks/useHistoryState';
import { Product } from '../../types';

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

const initialState: CustomizerState = {
  prompt: '',
  fabric: 'any',
  pattern: 'any',
  sleeveLength: 'any',
  neckline: 'any',
  color: null,
  category: 'tops',
  size: 'any',
  sheen: 'any',
  texture: 'any',
  weight: 'any',
};


const CustomizePage: React.FC = () => {
  const {
    state: customizerState,
    setState: setCustomizerState,
    undo,
    redo,
    canUndo,
    canRedo
  } = useHistoryState<CustomizerState>(initialState);

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedDetails, setGeneratedDetails] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingInspiration, setIsGeneratingInspiration] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [latestGeneratedDesign, setLatestGeneratedDesign] = useState<Product | null>(null);
  const [isCurrentDesignSaved, setIsCurrentDesignSaved] = useState<boolean>(false);


  const handleStateChange = <K extends keyof CustomizerState>(field: K, value: CustomizerState[K]) => {
    setCustomizerState(prevState => {
      const newState = {
        ...prevState,
        [field]: value,
      };
      if (field === 'category') {
        newState.size = 'any';
      }
      return newState;
    });
  };

  const handleGenerateInspiration = useCallback(async () => {
    setIsGeneratingInspiration(true);
    setError(null);
    try {
        const inspiration = await generateInspirationPrompt();
        setCustomizerState(prevState => ({
            ...prevState,
            prompt: inspiration.prompt,
            texture: inspiration.texture || 'any',
            sheen: inspiration.sheen || 'any',
            weight: inspiration.weight || 'any',
        }));
    } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while generating inspiration.');
    } finally {
        setIsGeneratingInspiration(false);
    }
  }, [setCustomizerState]);


  const handleGenerate = useCallback(async () => {
    if (!customizerState.prompt.trim()) {
      setError('Please enter a description for your design.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedDetails(null);
    setLatestGeneratedDesign(null);
    setIsCurrentDesignSaved(false);

    let finalPrompt = customizerState.prompt.trim();
    const additions: string[] = [];
    
    const { color, sleeveLength, neckline, fabric, pattern, category, size, sheen, texture, weight } = customizerState;
    
    if (size && size.toLowerCase() !== 'any') {
      additions.push(`size ${size.toUpperCase()}`);
    }
    if (category && category.toLowerCase() !== 'any') {
      additions.push(`as a clothing item in the '${category}' category`);
    }
    if (color) {
      additions.push(`with a primary color of ${color}`);
    }
    if (sleeveLength && sleeveLength.toLowerCase() !== 'any') {
      additions.push(`with ${sleeveLength.replace('-', ' ')}`);
    }
    if (neckline && neckline.toLowerCase() !== 'any') {
      additions.push(`and a ${neckline.replace('-', ' ')} neckline`);
    }
    
    // Combine material properties for a more natural prompt
    const materialParts = [];
    if (weight && weight.toLowerCase() !== 'any') materialParts.push(weight);
    if (texture && texture.toLowerCase() !== 'any') materialParts.push(texture);
    if (sheen && sheen.toLowerCase() !== 'any') materialParts.push(sheen);
    if (fabric && fabric.toLowerCase() !== 'any') materialParts.push(fabric);

    if (materialParts.length > 0) {
        additions.push(`made from a ${materialParts.join(' ')} material`);
    }

    if (pattern && pattern.toLowerCase() !== 'any') {
      additions.push(`with a ${pattern} pattern`);
    }


    if (additions.length > 0) {
      finalPrompt += `, ${additions.join(', ')}`;
    }


    try {
      const [imageBase64, detailsHtml] = await Promise.all([
        generateFashionImage(finalPrompt),
        generateFashionDetails(finalPrompt)
      ]);
      
      const imageUrl = `data:image/jpeg;base64,${imageBase64}`;
      const newDesign: Product = {
        id: `gen-${Date.now()}`,
        name: finalPrompt,
        imageUrl: imageUrl,
        category: customizerState.category,
      };

      setGeneratedImage(imageUrl);
      setGeneratedDetails(detailsHtml);
      setLatestGeneratedDesign(newDesign);

      try {
        const storedHistory = localStorage.getItem('designHistory');
        const history = storedHistory ? JSON.parse(storedHistory) : [];
        const newHistory = [newDesign, ...history].slice(0, 6); // Keep latest 6
        localStorage.setItem('designHistory', JSON.stringify(newHistory));
      } catch (e) {
        console.error("Failed to save design to history:", e);
      }

    } catch (err: any) {
      setError((err as Error).message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [customizerState]);

  const handleSaveDesign = useCallback(() => {
    if (!latestGeneratedDesign) return;

    try {
        const storedDesigns = localStorage.getItem('savedDesigns');
        const designs: Product[] = storedDesigns ? JSON.parse(storedDesigns) : [];
        
        if (!designs.some(d => d.id === latestGeneratedDesign.id)) {
            const newDesigns = [latestGeneratedDesign, ...designs];
            localStorage.setItem('savedDesigns', JSON.stringify(newDesigns));
            setIsCurrentDesignSaved(true);
        } else {
            setIsCurrentDesignSaved(true);
        }
    } catch (e) {
        console.error("Failed to save design:", e);
        setError("Could not save your design. Please try again.");
    }
  }, [latestGeneratedDesign]);


  const handlePlaceOrder = () => {
    if(generatedImage) {
        alert('Thank you for your order! Your unique design is now being processed.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[75vh]">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6 flex flex-col">
        <Customizer
          state={customizerState}
          onStateChange={handleStateChange}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          isGeneratingInspiration={isGeneratingInspiration}
          onGenerateInspiration={handleGenerateInspiration}
          generatedDetails={generatedDetails}
          onPlaceOrder={handlePlaceOrder}
          isOrderable={!!generatedImage}
          onSaveDesign={handleSaveDesign}
          isSaved={isCurrentDesignSaved}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      </div>
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl shadow-lg flex items-center justify-center p-4 relative min-h-[50vh] lg:min-h-0 border border-white/20">
        <ModelViewer imageUrl={generatedImage} isLoading={isLoading} />
        {error && (
            <div className="absolute inset-0 bg-red-500/20 backdrop-blur-sm flex items-center justify-center p-4 rounded-lg">
                <p className="text-red-100 text-center font-medium">{error}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default CustomizePage;