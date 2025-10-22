// Base Imports
import { useMemo } from 'react';
import { SearchResult } from './types';

interface UseSearchableDataProps {
  pairs: any[];
  units: string[];
  assignmentMaps: { unitToAssignment: Map<string, any>, pairToUnits: Map<string, string[]> };
}

export function useSearchableData({ pairs, units, assignmentMaps }: UseSearchableDataProps) {
  // Create searchable data structure
  const searchableData = useMemo(() => {
    const results: SearchResult[] = [];

    // Add all units
    units.forEach(unit => {
      const assignment = assignmentMaps.unitToAssignment.get(unit);
      results.push({
        id: `unit-${unit}`,
        type: 'unit',
        primary: unit,
        secondary: assignment 
          ? `${assignment.customer} - ${assignment.location}` 
          : 'Unassigned'
      });
    });

    // Add all customer-location pairs
    pairs.forEach(([customer, location, id]) => {
      const assignedUnits = assignmentMaps.pairToUnits.get(id) || [];
      results.push({
        id: `location-${id}`,
        type: 'location',
        primary: location,
        secondary: customer,
        unit: assignedUnits.length > 0 ? assignedUnits.join(', ') : 'No units assigned'
      });

      // Add customer entries (grouped by customer name)
      results.push({
        id: `customer-${customer}-${id}`,
        type: 'customer',
        primary: customer,
        secondary: `${location} (${assignedUnits.length} units)`
      });
    });

    return results;
  }, [pairs, units, assignmentMaps]);

  return {
    searchableData
  };
}