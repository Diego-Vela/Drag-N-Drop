import { useRef, useEffect, useCallback } from 'react';
import { Keyboard } from 'react-native';
import { SearchResult } from '../../utils/types';

/**
 * Search actions and effects hook
 * Handles: search execution, debouncing, result selection, clearing
 */
export function useSearchActions({
  searchState,
  activityState,
  onSearch,
  onShowAll,
  onSearchResults,
  onClearQuery
}: {
  searchState: {
    searchText: string;
    searchResults: SearchResult[];
    userIsSearching: boolean;
    updateSearchResults: (results: SearchResult[]) => void;
    resetSearch: () => void;
    setUserSearching: (isSearching: boolean) => void;
    setSearchText: (text: string) => void;
  };
  activityState: {
    isSearchBarActive: boolean;
    setActive: (active: boolean) => void;
  };
  onSearch?: (query: string) => SearchResult[];
  onShowAll?: () => SearchResult[];
  onSearchResults: (results: SearchResult[]) => void;
  onClearQuery?: () => void;
}) {
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getAllItems = useCallback((): SearchResult[] => {
    return onShowAll ? onShowAll() : [];
  }, [onShowAll]);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const { searchText, userIsSearching } = searchState;
    const { isSearchBarActive } = activityState;

    if (userIsSearching && isSearchBarActive) {
      if (searchText.trim() && searchText.length >= 2) {
        // User is searching with valid query
        searchTimeoutRef.current = setTimeout(() => {
          const results = onSearch ? onSearch(searchText) : [];
          searchState.updateSearchResults(results);
          onSearchResults(results);
        }, 1000); // 1-second delay
      } else if (searchText.trim() === '') {
        // User cleared search
        searchState.updateSearchResults([]);
        onSearchResults([]);
      } else {
        // User is typing but hasn't reached 2 characters yet
        searchState.updateSearchResults([]);
        onSearchResults([]);
      }
    } else {
      // User is not actively searching - hide dropdown
      searchState.updateSearchResults([]);
      onSearchResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [
    searchState.searchText,
    searchState.userIsSearching,
    activityState.isSearchBarActive,
    onSearchResults,
    onSearch,
    searchState.updateSearchResults
  ]);

  const clearSearch = useCallback(() => {
    searchState.resetSearch();
    searchState.setUserSearching(true); // User is now actively searching (wants to see all)
    
    // Dismiss the keyboard when clearing search
    Keyboard.dismiss();
    
    // Reset the query state in parent component
    if (onClearQuery) {
      onClearQuery();
    }
    
    // Show all items instead of empty results
    const allResults = getAllItems();
    searchState.updateSearchResults(allResults);
    onSearchResults(allResults);
  }, [
    searchState.resetSearch,
    searchState.setUserSearching,
    searchState.updateSearchResults,
    onClearQuery,
    getAllItems,
    onSearchResults
  ]);

  const handleSelectResult = useCallback((
    result: SearchResult,
    onSelectCallback?: (result: SearchResult) => void
  ) => {
    searchState.setSearchText(result.primary);
    searchState.setUserSearching(false); // User has selected, no longer actively searching
    activityState.setActive(false); // Hide dropdown after selection
    
    // Call the parent's onSelect callback if provided
    if (onSelectCallback) {
      onSelectCallback(result);
    }
  }, [searchState.setSearchText, searchState.setUserSearching, activityState.setActive]);

  return {
    clearSearch,
    handleSelectResult,
    shouldShowDropdown: searchState.searchResults.length > 0 && activityState.isSearchBarActive
  };
}