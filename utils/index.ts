// Central exports for all utility functions

// Data utilities
export * from './dataUtils';

// Search utilities  
export * from './searchUtils';

// Animation utilities
export * from './animationUtils';

// UI utilities (search results, icons, colors)
export * from './searchResultUtils';

// Type definitions
export * from './types';

// Constants
export const APP_CONSTANTS = {
  SEARCH_MIN_CHARS: 2,
  SEARCH_DEBOUNCE_MS: 1000,
  MAX_SEARCH_RESULTS: 10,
  DROPDOWN_MAX_HEIGHT: 240,
  DROPDOWN_ITEM_HEIGHT: 60
} as const;