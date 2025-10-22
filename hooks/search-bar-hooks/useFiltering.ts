// Base Imports
import { useCallback } from 'react';
import { UseFilteringProps } from './types'

export function useFiltering({ pairs, units, getAssignedUnits, getUnitAssignment }: UseFilteringProps) {
  // Filter assignments based on search - memoized and optimized
  const getFilteredAssignments = useCallback((query: string) => {
    if (!query || query.length < 2) {
      return {
        filteredPairs: pairs,
        filteredUnits: units
      };
    }

    const lowerQuery = query.toLowerCase();

    // Filter pairs based on search results
    const filteredPairs = pairs.filter(([customer, location, id]) => {
      return customer.toLowerCase().includes(lowerQuery) || 
             location.toLowerCase().includes(lowerQuery) ||
             getAssignedUnits(id).some(unit => unit.toLowerCase().includes(lowerQuery));
    });

    // Filter units based on search
    const filteredUnits = units.filter(unit => 
      unit.toLowerCase().includes(lowerQuery) ||
      getUnitAssignment(unit)?.customer.toLowerCase().includes(lowerQuery) ||
      getUnitAssignment(unit)?.location.toLowerCase().includes(lowerQuery)
    );

    return {
      filteredPairs,
      filteredUnits
    };
  }, [pairs, units, getAssignedUnits, getUnitAssignment]);

  return {
    getFilteredAssignments
  };
}