import React, { useState, useEffect } from 'react';
import { 
  View, 
  Keyboard
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useDropdownAnimation } from '../hooks/useDropdownAnimation';
import { SearchResult, SearchBarProps } from '../utils/types';
import { SearchDropDown } from './search-bar/SearchDropDown';
import { SearchInput } from './search-bar/SearchInput';
import { useSearchLogic } from '../hooks/useSearchLogic';

export function SearchBar({ onSearchResults, onSelectResult, onSearch, onShowAll, onClearQuery, placeholder = "Search units, locations, or customers..." }: SearchBarProps) {
  const { isDark } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const { slideAnimation, showDropdown: animateShowDropdown, hideDropdown: animateHideDropdown } = useDropdownAnimation();
  
  const searchLogic = useSearchLogic({
    onSearch,
    onShowAll,
    onSearchResults,
    onClearQuery
  });

  // Animation coordination - responds to search results changes
  useEffect(() => {
    if (searchLogic.shouldShowDropdown && searchLogic.searchResults.length > 0) {
      setShowDropdown(true);
      animateShowDropdown(searchLogic.searchResults.length);
    } else {
      animateHideDropdown(250, () => {
        setShowDropdown(false);
      });
    }
  }, [searchLogic.searchResults, searchLogic.shouldShowDropdown, animateShowDropdown, animateHideDropdown]);

  const closeDropdown = () => {
    animateHideDropdown(250, () => {
      setShowDropdown(false);
    });
  };

  const handleSelectResult = (result: SearchResult) => {
    searchLogic.setSearchText(result.primary);
    searchLogic.setUserIsSearching(false); // User has selected, no longer actively searching
    closeDropdown();
    
    // Dismiss the keyboard when a result is selected
    Keyboard.dismiss();
    
    onSelectResult(result);
  };

  return (
    <View className="mb-4">
      {/* Search Input */}
      <SearchInput
        value={searchLogic.searchText}
        onChangeText={searchLogic.handleTextChange}
        onFocus={searchLogic.handleFocus}
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