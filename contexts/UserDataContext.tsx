
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { Product } from '../types';

interface UserDataContextType {
  savedDesigns: Product[];
  recentCreations: Product[];
  addSavedDesign: (design: Product) => void;
  removeSavedDesign: (designId: string | number) => void;
  addRecentCreation: (design: Product) => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

// FIX: The useStorage hook has been refactored to be more robust.
// It now returns a stable `setState` function from `useState`, which supports functional updates.
// It also uses `useEffect` to automatically sync with localStorage when the key or value changes.
const useStorage = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key “${key}”:`, error);
      return defaultValue;
    }
  });

  // When key changes (e.g., user logs in/out), re-read from localStorage.
  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      setValue(item ? JSON.parse(item) : defaultValue);
    } catch (error) {
      console.error(`Error reading from localStorage key “${key}”:`, error);
      setValue(defaultValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Persist to localStorage when value changes.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, value]);

  return [value, setValue];
};

export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  
  const designsKey = currentUser ? `savedDesigns_${currentUser.username}` : 'savedDesigns_guest';
  const historyKey = currentUser ? `designHistory_${currentUser.username}` : 'designHistory_guest';

  const [savedDesigns, setSavedDesigns] = useStorage<Product[]>(designsKey, []);
  const [recentCreations, setRecentCreations] = useStorage<Product[]>(historyKey, []);

  // FIX: The following functions now work correctly because `useStorage` returns a state setter
  // that supports functional updates, resolving the original TypeScript errors.
  const addSavedDesign = useCallback((design: Product) => {
    setSavedDesigns(prevDesigns => {
      if (prevDesigns.some(d => d.id === design.id)) {
        return prevDesigns; 
      }
      return [design, ...prevDesigns];
    });
  }, [setSavedDesigns]);
  
  // FIX: This function now works correctly with the refactored `useStorage` hook.
  const removeSavedDesign = useCallback((designId: string | number) => {
    setSavedDesigns(prevDesigns => prevDesigns.filter(d => d.id !== designId));
  }, [setSavedDesigns]);

  // FIX: This function now works correctly with the refactored `useStorage` hook.
  const addRecentCreation = useCallback((design: Product) => {
    setRecentCreations(prevCreations => {
        const newHistory = [design, ...prevCreations];
        return newHistory.slice(0, 6); // Keep latest 6
    });
  }, [setRecentCreations]);

  const value = { savedDesigns, recentCreations, addSavedDesign, removeSavedDesign, addRecentCreation };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};

export const useUserData = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
