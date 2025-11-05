import { useEffect, useRef, useState } from 'react';
import { useDebounce } from './useDebounce';

/**
 * Custom hook for auto-saving data to localStorage
 * @param {string} key - localStorage key
 * @param {any} data - Data to save
 * @param {number} delay - Debounce delay in milliseconds (default: 2000)
 */
export function useAutoSave(key, data, delay = 2000) {
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const debouncedData = useDebounce(data, delay);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip auto-save on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Skip if no data
    if (!debouncedData || Object.keys(debouncedData).length === 0) {
      return;
    }

    setIsSaving(true);

    try {
      const autoSaveData = {
        timestamp: new Date().toISOString(),
        data: debouncedData,
      };

      localStorage.setItem(key, JSON.stringify(autoSaveData));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setTimeout(() => setIsSaving(false), 500); // Show saving indicator for at least 500ms
    }
  }, [debouncedData, key]);

  const loadAutoSaved = () => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.data;
      }
    } catch (error) {
      console.error('Failed to load auto-saved data:', error);
    }
    return null;
  };

  const clearAutoSave = () => {
    try {
      localStorage.removeItem(key);
      setLastSaved(null);
    } catch (error) {
      console.error('Failed to clear auto-save:', error);
    }
  };

  return {
    lastSaved,
    isSaving,
    loadAutoSaved,
    clearAutoSave,
  };
}
