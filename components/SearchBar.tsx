import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  Animated,
  Keyboard
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useDropdownAnimation } from '../hooks/useDropdownAnimation';
import { getSearchResultIcon, getSearchResultTypeColor } from '../utils/searchResultUtils';

interface SearchResult {
  id: string;
  type: 'unit' | 'location' | 'customer';
  primary: string;
  secondary?: string;
  unit?: string;
}

interface SearchBarProps {
  onSearchResults: (results: SearchResult[]) => void;
  onSelectResult: (result: SearchResult) => void;
  onSearch?: (query: string) => SearchResult[];
  onShowAll?: () => SearchResult[]; // New prop to get all items
  onClearQuery?: () => void; // New prop to reset query state
  placeholder?: string;
}

export function SearchBar({ onSearchResults, onSelectResult, onSearch, onShowAll, onClearQuery, placeholder = "Search units, locations, or customers..." }: SearchBarProps) {
  const { isDark } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [userIsSearching, setUserIsSearching] = useState(false); // Track user intent
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { slideAnimation, showDropdown: animateShowDropdown, hideDropdown: animateHideDropdown } = useDropdownAnimation();

  // Mock search function - will be replaced with actual search logic
  const performSearch = (query: string): SearchResult[] => {
    // Fallback for when no onSearch prop is provided
    return onSearch ? onSearch(query) : [];
  };

  // Get all items function - for showing everything when search is empty
  const getAllItems = (): SearchResult[] => {
    if (onShowAll) {
      return onShowAll();
    }
    
    // Fallback mock data when no onShowAll prop is provided
    return [
      {
        id: '1',
        type: 'unit',
        primary: 'Unit A',
        secondary: 'Customer 1 - Location 1'
      },
      {
        id: '2',
        type: 'unit',
        primary: 'Unit B', 
        secondary: 'Customer 1 - Location 1'
      },
      {
        id: '3',
        type: 'unit',
        primary: 'Unit C',
        secondary: 'Customer 2 - Location 2'
      },
      {
        id: '4',
        type: 'location',
        primary: 'Location 1',
        secondary: 'Customer 1',
        unit: 'Unit A, Unit B'
      },
      {
        id: '5',
        type: 'location',
        primary: 'Location 2', 
        secondary: 'Customer 2',
        unit: 'Unit C'
      },
      {
        id: '6',
        type: 'customer',
        primary: 'Customer 1',
        secondary: '1 location, 2 units'
      },
      {
        id: '7',
        type: 'customer',
        primary: 'Customer 2',
        secondary: '1 location, 1 unit'
      }
    ];
  };

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (userIsSearching) {
      if (searchText.trim() && searchText.length >= 2) {
        // User is searching with valid query
        searchTimeoutRef.current = setTimeout(() => {
          const results = onSearch ? onSearch(searchText) : performSearch(searchText);
          setSearchResults(results);
          
          if (results.length > 0) {
            setShowDropdown(true);
            animateShowDropdown(results.length);
          } else {
            closeDropdown();
          }
          
          onSearchResults(results);
        }, 1000); // 1-second delay
      } else if (searchText.trim() === '') {
        // User cleared search - only show dropdown for clear button action
        closeDropdown();
        onSearchResults([]);
      } else {
        // User is typing but hasn't reached 2 characters yet
        closeDropdown();
        onSearchResults([]);
      }
    } else {
      // User is not actively searching - hide dropdown
      closeDropdown();
      onSearchResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchText, userIsSearching, onSearchResults, onSearch, onShowAll]);

  const closeDropdown = () => {
    animateHideDropdown(250, () => {
      setShowDropdown(false);
      setSearchResults([]);
    });
  };

  const handleSelectResult = (result: SearchResult) => {
    setSearchText(result.primary);
    setUserIsSearching(false); // User has selected, no longer actively searching
    closeDropdown();
    
    // Dismiss the keyboard when a result is selected
    Keyboard.dismiss();
    
    onSelectResult(result);
  };

  const getResultIcon = (type: string) => {
    return getSearchResultIcon(type);
  };

  const clearSearch = () => {
    setSearchText('');
    setUserIsSearching(true); // User is now actively searching (wants to see all)
    closeDropdown();
    
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
    
    // Show dropdown with all results
    if (allResults.length > 0) {
      setShowDropdown(true);
      animateShowDropdown(allResults.length);
    }
  };

  return (
    <View className="mb-4">
      {/* Search Input */}
      <View className={`flex-row items-center px-4 py-3 rounded-lg border ${
        isDark 
          ? 'bg-dark-surface border-dark-border' 
          : 'bg-white border-light-border/30'
      }`}>
        <Text className="mr-3 text-lg">🔍</Text>
        <TextInput
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            setUserIsSearching(true); // User is actively typing
          }}
          onFocus={() => {
            setUserIsSearching(true); // User focused on input, ready to search
          }}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          className={`flex-1 text-base ${
            isDark ? 'text-dark-primary' : 'text-light-primary'
          }`}
          style={{ outlineStyle: 'none' } as any}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={clearSearch} className="ml-2 p-1">
            <Text className={`text-lg ${
              isDark ? 'text-dark-secondary' : 'text-light-secondary'
            }`}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Animated Dropdown Results - only show when dropdown is active */}
      {showDropdown && (
        <Animated.View 
          style={{ 
            height: slideAnimation,
            // Visible when there are results to show, hidden during transitions
            overflow: searchResults.length > 0 ? 'visible' : 'hidden',
            marginBottom: 0,
          }}
        >
        <View 
          className={`mt-1 rounded-lg border ${
            isDark 
              ? 'bg-dark-surface border-dark-border' 
              : 'bg-white border-light-border/30'
          }`}
          style={{ 
            height: '100%', // Ensure the container takes full animated height
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 5,
            paddingTop: 0,
            paddingBottom: 4, // Extra bottom padding for rounded corners
            overflow: 'hidden', // Ensure content respects rounded corners
          }}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {searchResults.map((result, index) => {
              const isLastItem = index === searchResults.length - 1;
              return (
                <TouchableOpacity
                  key={result.id}
                  onPress={() => handleSelectResult(result)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    paddingBottom: 8,
                    borderBottomWidth: isLastItem ? 0 : 1, // No border on last item
                    borderBottomColor: isDark ? '#374151' : '#E5E7EB',
                    minHeight: 60, // Ensure consistent height per item
                  }}
                >
                  <Text style={{ marginRight: 12, fontSize: 18 }}>{getResultIcon(result.type)}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      fontWeight: '600', 
                      fontSize: 14,
                      color: isDark ? '#F9FAFB' : '#111827'
                    }}>
                      {result.primary}
                    </Text>
                    {result.secondary && (
                      <Text style={{ 
                        fontSize: 12, 
                        marginTop: 4,
                        color: isDark ? '#9CA3AF' : '#6B7280'
                      }}>
                        {result.secondary}
                      </Text>
                    )}
                    {result.unit && (
                      <Text style={{ 
                        fontSize: 12, 
                        marginTop: 4,
                        color: isDark ? '#FCD34D' : '#D97706'
                      }}>
                        Units: {result.unit}
                      </Text>
                    )}
                  </View>
                  <View style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4,
                    backgroundColor: getSearchResultTypeColor(result.type, isDark).bg
                  }}>
                    <Text style={{
                      fontSize: 10,
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      color: getSearchResultTypeColor(result.type, isDark).text
                    }}>
                      {result.type}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            </ScrollView>
          </View>
        </Animated.View>
      )}
    </View>
  );
}