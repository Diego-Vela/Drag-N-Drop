// Base Imports
import React, { useState, useEffect, useCallback } from 'react';
import { View, Keyboard } from 'react-native';
// Component Imports
import { SearchDropDown, SearchInput } from './search-bar';
// Context Imports
import { useTheme } from '../contexts/ThemeContext';
// Hook Imports
import { useSearchLogicComposed, useDropdownAnimation, useSearch } from '../hooks/search-bar-hooks';
// Types
import { SearchResult } from '../hooks/search-bar-hooks';

interface SearchBarProps {
  pairs: any[];
  units: string[];
  assignments: any[];
  onFilteredDataChange: (data: { filteredPairs: any[]; filteredUnits: string[] }) => void;
  placeholder?: string;
}

export function SearchBar({ pairs, units, assignments, onFilteredDataChange, placeholder = "Search units, locations, or customers..." }: SearchBarProps) {
  const { isDark } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { slideAnimation, showDropdown: animateShowDropdown, hideDropdown: animateHideDropdown } = useDropdownAnimation();
  
  // Use search hook internally
  const {
    performSearch,
    getFilteredAssignments,
    getAllItems
  } = useSearch({ pairs, units, assignments });

  // Stable callback to handle filtered data changes
  const handleFilteredDataChange = useCallback((query: string) => {
    const { filteredPairs, filteredUnits } = getFilteredAssignments(query);
    onFilteredDataChange({ filteredPairs, filteredUnits });
  }, [getFilteredAssignments, onFilteredDataChange]);

  // Create search handler functions
  const onSearch = useCallback((query: string) => {
    handleFilteredDataChange(query);
    return performSearch(query);
  }, [performSearch, handleFilteredDataChange]);

  const onShowAll = useCallback(() => {
    return getAllItems();
  }, [getAllItems]);

  const onSearchResults = useCallback((results: SearchResult[]) => {
    // Handle search results for dropdown display
  }, []);

  const onClearQuery = useCallback(() => {
    handleFilteredDataChange('');
  }, [handleFilteredDataChange]);

  const searchLogic = useSearchLogicComposed({
    onSearch,
    onShowAll,
    onSearchResults,
    onClearQuery
  });

  // Initialize filtered data when component mounts or data changes
  useEffect(() => {
    if (pairs.length > 0 && units.length > 0) {
      handleFilteredDataChange('');
    }
  }, [pairs.length, units.length, assignments.length, handleFilteredDataChange]);


  // Animation coordination - responds to search results changes and SearchBar activity
  useEffect(() => {
    if (searchLogic.shouldShowDropdown && searchLogic.searchResults.length > 0) {
      setShowDropdown(true);
      setIsAnimating(false); // Reset animation state when showing
      animateShowDropdown(searchLogic.searchResults.length);
    } else if (showDropdown && !isAnimating) {
      // Only start hide animation if dropdown is visible and not already animating
      setIsAnimating(true);
      animateHideDropdown(250, () => {
        setShowDropdown(false);
        setIsAnimating(false);
      });
    }
  }, [searchLogic.searchResults, searchLogic.shouldShowDropdown, animateShowDropdown, animateHideDropdown, showDropdown, isAnimating]);

  const closeDropdown = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      animateHideDropdown(250, () => {
        setShowDropdown(false);
        setIsAnimating(false);
      });
    }
  };
  const handleSelectResult = (result: SearchResult) => {
    // Use the hook's handler for state management
    searchLogic.handleSelectResult(result, () => {});
    
    // Handle UI-specific actions (animation and keyboard)
    closeDropdown();
    Keyboard.dismiss();
  };

  return (
    <View className="mb-0 mt-2 mx-2">
      {/* Search Input */}
      <SearchInput
        value={searchLogic.searchText}
        onChangeText={searchLogic.handleTextChange}
        onFocus={searchLogic.handleFocus}
        onBlur={searchLogic.handleBlur}
        onClear={searchLogic.clearSearch}
        placeholder={placeholder}
        isDark={isDark}
      />

      {/* Animated Dropdown Results - only show when dropdown is active */}
      <SearchDropDown
        searchResults={searchLogic.searchResults}
        showDropdown={showDropdown}
        slideAnimation={slideAnimation}
        onSelectResult={handleSelectResult}
        isDark={isDark}
      />
    </View>
  );
}