import { Animated } from 'react-native';

export interface SearchResult {
  id: string;
  type: 'unit' | 'location' | 'customer';
  primary: string;
  secondary?: string;
  unit?: string;
}

export interface SearchBarProps {
  onSearchResults: (results: SearchResult[]) => void;
  onSelectResult: (result: SearchResult) => void;
  onSearch?: (query: string) => SearchResult[];
  onShowAll?: () => SearchResult[]; // New prop to get all items
  onClearQuery?: () => void; // New prop to reset query state
  placeholder?: string;
}

export interface SearchDropDownProps {
  searchResults: SearchResult[];
  showDropdown: boolean;
  slideAnimation: Animated.Value;
  onSelectResult: (result: SearchResult) => void;
  isDark: boolean;
}

export interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  onBlur?: () => void;
  onClear: () => void;
  placeholder: string;
  isDark: boolean;
}

export interface UseSearchLogicProps {
  onSearch?: (query: string) => SearchResult[];
  onShowAll?: () => SearchResult[];
  onSearchResults: (results: SearchResult[]) => void;
  onClearQuery?: () => void;
}