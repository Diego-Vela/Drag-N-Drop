import { useState, useCallback } from 'react';

/**
 * Search bar activity tracking hook
 * Handles: focus/blur state, activation timing
 */
export function useSearchBarActivity() {
  const [isSearchBarActive, setIsSearchBarActive] = useState(false);

  const handleFocus = useCallback(() => {
    setIsSearchBarActive(true);
  }, []);

  const handleBlur = useCallback(() => {
    // Small delay before deactivating to allow for dropdown interactions
    setTimeout(() => setIsSearchBarActive(false), 2000);
  }, []);

  const setActive = useCallback((active: boolean) => {
    setIsSearchBarActive(active);
  }, []);

  return {
    isSearchBarActive,
    handleFocus,
    handleBlur,
    setActive
  };
}