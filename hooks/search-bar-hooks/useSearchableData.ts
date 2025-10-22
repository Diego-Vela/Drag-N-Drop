// Base Imports
import { useMemo } from 'react';
import { SearchResult, UseSearchableDataProps } from './types';

export function useSearchableData({ pairs, units, getAssignedUnits, getUnitAssignment }: UseSearchableDataProps) {
  // Create searchable data structure
  const searchableData = useMemo(() => {
    const results: SearchResult[] = [];

    // Add all units
    units.forEach(unit => {
      const assignment = getUnitAssignment(unit);
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
      const assignedUnits = getAssignedUnits(id);
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
  }, [pairs, units, getAssignedUnits, getUnitAssignment]);

  return {
    searchableData
  };
}