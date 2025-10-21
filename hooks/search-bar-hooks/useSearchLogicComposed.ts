import { useSearchState } from './useSearchState';
import { useSearchBarActivity } from './useSearchBarActivity';
import { useSearchActions } from './useSearchActions';
import { UseSearchLogicProps } from '../../utils/types';

/**
 * Composed search logic hook
 * Combines: state management, activity tracking, and actions
 * This is the main hook that components should use
 */
export function useSearchLogicComposed(props: UseSearchLogicProps) {
  // Separate concerns into focused hooks
  const searchState = useSearchState();
  const activityState = useSearchBarActivity();
  const searchActions = useSearchActions({
    searchState,
    activityState,
    ...props
  });

  // Combined event handlers for convenience
  const handleTextChange = (text: string) => {
    searchState.updateSearchText(text);
  };

  const handleFocus = () => {
    searchState.setUserSearching(true);
    activityState.handleFocus();
  };

  return {
    // State (read-only for components)
    searchText: searchState.searchText,
    searchResults: searchState.searchResults,
    userIsSearching: searchState.userIsSearching,
    isSearchBarActive: activityState.isSearchBarActive,
    
    // Actions
    clearSearch: searchActions.clearSearch,
    handleSelectResult: searchActions.handleSelectResult,
    shouldShowDropdown: searchActions.shouldShowDropdown,
    
    // Event handlers
    handleTextChange,
    handleFocus,
    handleBlur: activityState.handleBlur,
    
    // Advanced access (if needed)
    searchState,
    activityState,
    searchActions
  };
}