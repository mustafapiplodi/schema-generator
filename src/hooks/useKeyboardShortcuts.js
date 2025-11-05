import { useEffect } from 'react';

/**
 * Custom hook for keyboard shortcuts
 * @param {Object} shortcuts - Map of key combinations to handlers
 * Example: { 'cmd+s': handleSave, 'cmd+k': handleCopy }
 */
export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Build the key combination string
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifierKey = isMac ? 'cmd' : 'ctrl';

      let combination = [];

      if (event.ctrlKey || event.metaKey) {
        combination.push(modifierKey);
      }
      if (event.shiftKey) {
        combination.push('shift');
      }
      if (event.altKey) {
        combination.push('alt');
      }

      // Add the key (lowercase)
      const key = event.key.toLowerCase();
      if (!['control', 'shift', 'alt', 'meta'].includes(key)) {
        combination.push(key);
      }

      const comboString = combination.join('+');

      // Check if this combination has a handler
      if (shortcuts[comboString]) {
        event.preventDefault();
        shortcuts[comboString](event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}
