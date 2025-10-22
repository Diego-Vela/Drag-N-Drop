// Base Imports
import { useState, useCallback } from 'react';
// Utility Imports
import { SearchResult } from './types';

/**
 * Pure search state management hook
 * Handles: search text, results, user intent
 */
export function useSearchState() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [userIsSearching, setUserIsSearching] = useState(false);

  const updateSearchText = useCallback((text: string) => {
    setSearchText(text);
    setUserIsSearching(true);
  }, []);

  const updateSearchResults = useCallback((results: SearchResult[]) => {
    setSearchResults(results);
  }, []);

  const resetSearch = useCallback(() => {
    setSearchText('');
    setSearchResults([]);
    setUserIsSearching(false);
  }, []);

  const setUserSearching = useCallback((isSearching: boolean) => {
    setUserIsSearching(isSearching);
  }, []);

  return {
    // State
    searchText,
    searchResults,
    userIsSearching,
    
    // Actions
    updateSearchText,
    updateSearchResults,
    resetSearch,
    setUserSearching,
    
    // Direct setters (for advanced use)
    setSearchText,
    setSearchResults
  };
}