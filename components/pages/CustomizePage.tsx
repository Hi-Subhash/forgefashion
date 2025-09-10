
import React, { useState, useCallback, useEffect } from 'react';
import Customizer from '../customizer/Customizer';
import ModelViewer from '../customizer/ModelViewer';
import { generateFashionImage, generateFashionDetails, generateInspirationPrompt } from '../../services/geminiService';
import { useHistoryState } from '../../hooks/useHistoryState';
import { Product } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../contexts/UserDataContext';
import { useNotification } from '../../contexts/NotificationContext';
import OrderConfirmationModal from '../ui/OrderConfirmationModal';

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
  const { currentUser } = useAuth();
  const { addRecentCreation, addSavedDesign, savedDesigns } = useUserData();
  const { addNotification } = useNotification();
  
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
  const [latestGeneratedDesign, setLatestGeneratedDesign] = useState<Product | null>(null);
  const [isCurrentDesignSaved, setIsCurrentDesignSaved] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (latestGeneratedDesign) {
      const isSaved = savedDesigns.some(d => d.id === latestGeneratedDesign.id);
      setIsCurrentDesignSaved(isSaved);
    } else {
      setIsCurrentDesignSaved(false);
    }
  }, [latestGeneratedDesign, savedDesigns]);

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
        addNotification(err.message || 'An unexpected error occurred while generating inspiration.', 'error');
    } finally {
        setIsGeneratingInspiration(false);
    }
  }, [setCustomizerState, addNotification]);


  const handleGenerate = useCallback(async () => {
    if (!customizerState.prompt.trim()) {
      addNotification('Please enter a description for your design.', 'error');
      return;
    }
    setIsLoading(true);
    setGeneratedImage(null);
    setGeneratedDetails(null);
    setLatestGeneratedDesign(null);

    let finalPrompt = customizerState.prompt.trim();
    const additions: string[] = [];
    
    const { color, sleeveLength, neckline, fabric, pattern, category, size, sheen, texture, weight } = customizerState;
    
    if (size && size.toLowerCase() !== 'any') additions.push(`size ${size.toUpperCase()}`);
    if (category && category.toLowerCase() !== 'any') additions.push(`as a clothing item in the '${category}' category`);
    if (color) additions.push(`with a primary color of ${color}`);
    if (sleeveLength && sleeveLength.toLowerCase() !== 'any') additions.push(`with ${sleeveLength.replace('-', ' ')}`);
    if (neckline && neckline.toLowerCase() !== 'any') additions.push(`and a ${neckline.replace('-', ' ')} neckline`);
    
    const materialParts = [];
    if (weight && weight.toLowerCase() !== 'any') materialParts.push(weight);
    if (texture && texture.toLowerCase() !== 'any') materialParts.push(texture);
    if (sheen && sheen.toLowerCase() !== 'any') materialParts.push(sheen);
    if (fabric && fabric.toLowerCase() !== 'any') materialParts.push(fabric);

    if (materialParts.length > 0) additions.push(`made from a ${materialParts.join(' ')} material`);
    if (pattern && pattern.toLowerCase() !== 'any') additions.push(`with a ${pattern} pattern`);

    if (additions.length > 0) finalPrompt += `, ${additions.join(', ')}`;

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

      if (currentUser) {
        addRecentCreation(newDesign);
      }
      addNotification('Your design has been visualized!', 'success');
    } catch (err: any) {
      addNotification((err as Error).message || 'An unexpected error occurred.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [customizerState, currentUser, addRecentCreation, addNotification]);

  const handleSaveDesign = useCallback(() => {
    if (!latestGeneratedDesign || !currentUser) return;

    try {
        addSavedDesign(latestGeneratedDesign);
        addNotification('Design saved to your gallery!', 'success');
    } catch (e) {
        console.error("Failed to save design:", e);
        addNotification("Could not save your design. Please try again.", 'error');
    }
  }, [latestGeneratedDesign, currentUser, addSavedDesign, addNotification]);


  const handlePlaceOrder = () => {
    if(generatedImage) {
        setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmOrder = () => {
    setIsConfirmModalOpen(false);
    addNotification('Thank you for your order! Your unique design is now being processed.', 'success');
  };

  return (
    <>
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
            isLoggedIn={!!currentUser}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        </div>
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl shadow-lg flex items-center justify-center p-4 relative min-h-[50vh] lg:min-h-0 border border-white/20">
          <ModelViewer imageUrl={generatedImage} isLoading={isLoading} />
        </div>
      </div>
      <OrderConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmOrder}
        designDetails={{
          category: customizerState.category,
          prompt: latestGeneratedDesign?.name || customizerState.prompt
        }}
      />
    </>
  );
};

export default CustomizePage;
