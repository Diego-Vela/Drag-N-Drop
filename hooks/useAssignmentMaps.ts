// Base Imports
import { useMemo, useCallback } from 'react';

export interface UseAssignmentMapsProps {
  pairs: any[];
  assignments: any[];
}

export function useAssignmentMaps({ pairs, assignments }: UseAssignmentMapsProps) {
  // Create lookup maps for O(1) access - memoized for performance
  const assignmentMaps = useMemo(() => {
    const unitToAssignment = new Map<string, { customer: string; location: string; pairId: string }>();
    const pairToUnits = new Map<string, string[]>();

    assignments.forEach(([unit, pairId]) => {
      const pair = pairs.find(([, , id]) => id === pairId);
      if (pair) {
        unitToAssignment.set(unit, {
          customer: pair[0],
          location: pair[1],
          pairId
        });
      }

      if (!pairToUnits.has(pairId)) {
        pairToUnits.set(pairId, []);
      }
      pairToUnits.get(pairId)!.push(unit);
    });

    return { unitToAssignment, pairToUnits };
  }, [pairs, assignments]);

  // Helper to find assigned units for a pair ID - now O(1) - memoized
  const getAssignedUnits = useCallback((pairId: string) => {
    return assignmentMaps.pairToUnits.get(pairId) || [];
  }, [assignmentMaps]);

  // Helper to find which customer/location a unit is assigned to - now O(1) - memoized
  const getUnitAssignment = useCallback((unitName: string) => {
    return assignmentMaps.unitToAssignment.get(unitName) || null;
  }, [assignmentMaps]);

  return {
    assignmentMaps,
    getAssignedUnits,
    getUnitAssignment
  };
}