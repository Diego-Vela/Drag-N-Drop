// Type definitions and interfaces used across utils

export interface SearchResult {
  id: string;
  type: 'unit' | 'location' | 'customer';
  primary: string;
  secondary?: string;
  unit?: string;
}

export interface AssignmentData {
  pairs: [string, string, string][];
  units: string[];
  assignments: [string, string][];
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  isLoading: boolean;
}

export interface DropdownState {
  isVisible: boolean;
  height: number;
  items: SearchResult[];
}

export type SearchResultType = 'unit' | 'location' | 'customer';

export interface ThemeColors {
  bg: string;
  text: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}