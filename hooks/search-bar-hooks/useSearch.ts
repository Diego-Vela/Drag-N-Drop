// Base Imports
import { useState, useCallback, useEffect } from 'react';
// Hook Imports
import { useAssignmentMaps } from '../useAssignmentMaps';
import { useSearchableData } from './useSearchableData';
import { useSearchFunctionality } from './useSearchFunctionality';
import { useFiltering } from './useFiltering';
// Types
import type { SearchResult } from './types';

interface UseSearchProps {
  pairs: any[];
  units: string[];
  assignments: any[];
  onFilteredDataChange?: (data: { filteredPairs: any[]; filteredUnits: string[] }) => void;
}

export function useSearch({ pairs, units, assignments, onFilteredDataChange }: UseSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);

  // Get assignment mapping functionality
  const { assignmentMaps, getAssignedUnits, getUnitAssignment } = useAssignmentMaps({ 
    pairs, 
    assignments 
  });

  // Get searchable data structure
  const { searchableData } = useSearchableData({ 
    pairs, 
    units, 
    assignmentMaps
  });

  // Get search functionality
  const { performSearch, getAllItems, calculateMatchScore } = useSearchFunctionality({ 
    searchableData 
  });

  // Get filtering functionality
  const { getFilteredAssignments } = useFiltering({ 
    pairs, 
    units, 
    assignmentMaps
  });

  // Handle filtered data changes internally
  const handleFilteredDataChange = useCallback((query: string) => {
    const { filteredPairs, filteredUnits } = getFilteredAssignments(query);
    if (onFilteredDataChange) {
      onFilteredDataChange({ filteredPairs, filteredUnits });
    }
  }, [getFilteredAssignments, onFilteredDataChange]);

  // Enhanced search function that also updates filtered data
  const performSearchWithFilter = useCallback((query: string) => {
    handleFilteredDataChange(query);
    return performSearch(query);
  }, [performSearch, handleFilteredDataChange]);

  // Clear function that resets filtered data
  const clearSearch = useCallback(() => {
    handleFilteredDataChange('');
  }, [handleFilteredDataChange]);

  // Initialize filtered data when component mounts or data changes
  useEffect(() => {
    if (pairs.length > 0 && units.length > 0 && onFilteredDataChange) {
      handleFilteredDataChange('');
    }
  }, [pairs.length, units.length, assignments.length, handleFilteredDataChange]);

  return {
    // State
    searchQuery,
    setSearchQuery,
    filteredResults,
    setFilteredResults,
    
    // Assignment helpers
    getAssignedUnits,
    getUnitAssignment,
    
    // Search functionality (simplified for SearchBar)
    performSearch: performSearchWithFilter,  // This includes filtered data updates
    getAllItems,
    clearSearch,
    
    // Internal data
    searchableData,
    assignmentMaps,
    calculateMatchScore
  };
}

// Export the SearchResult type for convenience
export type { SearchResult };