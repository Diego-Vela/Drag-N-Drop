// Base Imports
import { useCallback } from 'react';

interface UseFilteringProps {
  pairs: any[];
  units: string[];
  assignmentMaps: { unitToAssignment: Map<string, any>, pairToUnits: Map<string, string[]> };
}

export function useFiltering({ pairs, units, assignmentMaps }: UseFilteringProps) {
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
      const assignedUnits = assignmentMaps.pairToUnits.get(id) || [];
      return customer.toLowerCase().includes(lowerQuery) || 
             location.toLowerCase().includes(lowerQuery) ||
             assignedUnits.some((unit: string) => unit.toLowerCase().includes(lowerQuery));
    });

    // Filter units based on search
    const filteredUnits = units.filter(unit => {
      const assignment = assignmentMaps.unitToAssignment.get(unit);
      return unit.toLowerCase().includes(lowerQuery) ||
             assignment?.customer.toLowerCase().includes(lowerQuery) ||
             assignment?.location.toLowerCase().includes(lowerQuery);
    });

    return {
      filteredPairs,
      filteredUnits
    };
  }, [pairs, units, assignmentMaps]);

  return {
    getFilteredAssignments
  };
}