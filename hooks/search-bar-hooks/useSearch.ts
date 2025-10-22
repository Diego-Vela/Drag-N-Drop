// Base Imports
import { useState } from 'react';
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
}

export function useSearch({ pairs, units, assignments }: UseSearchProps) {
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
    getAssignedUnits, 
    getUnitAssignment 
  });

  // Get search functionality
  const { performSearch, getAllItems, calculateMatchScore } = useSearchFunctionality({ 
    searchableData 
  });

  // Get filtering functionality
  const { getFilteredAssignments } = useFiltering({ 
    pairs, 
    units, 
    getAssignedUnits, 
    getUnitAssignment 
  });

  return {
    // State
    searchQuery,
    setSearchQuery,
    filteredResults,
    setFilteredResults,
    
    // Assignment helpers
    getAssignedUnits,
    getUnitAssignment,
    
    // Search functionality
    performSearch,
    getAllItems,
    getFilteredAssignments,
    
    // Internal data
    searchableData,
    assignmentMaps,
    calculateMatchScore
  };
}

// Export the SearchResult type for convenience
export type { SearchResult };