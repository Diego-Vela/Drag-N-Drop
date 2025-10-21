// Base Imports
import { useState, useRef, useEffect, useCallback } from 'react';
import { Keyboard } from 'react-native';
// Utility Imports
import { SearchResult, UseSearchLogicProps } from '../utils/types';

export function useSearchLogic({onSearch, onShowAll, onSearchResults, onClearQuery}: UseSearchLogicProps ) 
{
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [userIsSearching, setUserIsSearching] = useState(false); // Track user intent
  const [isSearchBarActive, setIsSearchBarActive] = useState(false); // Track if search bar is active
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const performSearch = (query: string): SearchResult[] => {
    return onSearch? onSearch(query): [];
  }
  
  const getAllItems = useCallback((): SearchResult[] => {
    if(onShowAll) {
      return onShowAll();
    } else 
      return []; 
  }, [onShowAll]);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (userIsSearching && isSearchBarActive) {
      if (searchText.trim() && searchText.length >= 2) {
        // User is searching with valid query
        searchTimeoutRef.current = setTimeout(() => {
          const results = onSearch ? onSearch(searchText) : performSearch(searchText);
          setSearchResults(results);
          onSearchResults(results);
        }, 1000); // 1-second delay
      } else if (searchText.trim() === '') {
        // User cleared search
        setSearchResults([]);
        onSearchResults([]);
      } else {
        // User is typing but hasn't reached 2 characters yet
        setSearchResults([]);
        onSearchResults([]);
      }
    } else {
      // User is not actively searching - hide dropdown
      setSearchResults([]);
      onSearchResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchText, userIsSearching, isSearchBarActive, onSearchResults, onSearch, onShowAll]);

  const clearSearch = useCallback(() => {
    setSearchText('');
    setUserIsSearching(true); // User is now actively searching (wants to see all)
    // closeDropdown(); <- This stays in SearchBar (animation)
    
    // Dismiss the keyboard when clearing search
    Keyboard.dismiss();
    
    // Reset the query state in parent component
    if (onClearQuery) {
      onClearQuery();
    }
    
    // Option 1: Enhanced clear button - show all items instead of empty results
    const allResults = getAllItems();
    setSearchResults(allResults);
    onSearchResults(allResults);
    
    // Show dropdown with all results <- Animation calls stay in SearchBar
  }, [onClearQuery, getAllItems, onSearchResults]);

  const handleTextChange = useCallback((text: string) => {
    setSearchText(text);
    setUserIsSearching(true);
  }, []);

  const handleFocus = useCallback(() => {
    setUserIsSearching(true);
    setIsSearchBarActive(true);
  }, []);

  const handleBlur = useCallback(() => {
    // Small delay before deactivating to allow for dropdown interactions
    setTimeout(() => setIsSearchBarActive(false), 5);
  }, []);

  const handleSelectResult = useCallback((result: SearchResult, onSelectCallback?: (result: SearchResult) => void) => {
    setSearchText(result.primary);
    setUserIsSearching(false); // User has selected, no longer actively searching
    setIsSearchBarActive(false); // Hide dropdown after selection
    
    // Call the parent's onSelect callback if provided
    if (onSelectCallback) {
      onSelectCallback(result);
    }
  }, []);

  return {
    searchText,
    setSearchText,
    searchResults,
    setSearchResults,
    userIsSearching,
    setUserIsSearching,
    isSearchBarActive,
    setIsSearchBarActive,
    clearSearch,
    shouldShowDropdown: searchResults.length > 0 && isSearchBarActive,
    handleTextChange,
    handleFocus,
    handleBlur,
    handleSelectResult
  };
}