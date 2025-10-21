import { useState, useEffect, useMemo } from 'react';

interface SearchResult {
  id: string;
  type: 'unit' | 'location' | 'customer';
  primary: string;
  secondary?: string;
  unit?: string;
}

interface UseSearchProps {
  pairs: any[];
  units: string[];
  assignments: any[];
}

export function useSearch({ pairs, units, assignments }: UseSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);

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

  // Helper to find assigned units for a pair ID - now O(1)
  const getAssignedUnits = (pairId: string) => {
    return assignmentMaps.pairToUnits.get(pairId) || [];
  };

  // Helper to find which customer/location a unit is assigned to - now O(1)
  const getUnitAssignment = (unitName: string) => {
    return assignmentMaps.unitToAssignment.get(unitName) || null;
  };

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
  }, [pairs, units, assignments]);

  // Search function with intelligent ranking
  const performSearch = (query: string): SearchResult[] => {
    if (query.length < 2) return [];

    const lowerQuery = query.toLowerCase();
    
    const matchedResults = searchableData.filter(item => {
      // Search in primary field (unit name, location, customer)
      if (item.primary.toLowerCase().includes(lowerQuery)) return true;
      
      // Search in secondary field
      if (item.secondary && item.secondary.toLowerCase().includes(lowerQuery)) return true;
      
      // Search in unit field for location results
      if (item.unit && item.unit.toLowerCase().includes(lowerQuery)) return true;
      
      return false;
    });

    // Sort results by relevance and type priority
    const sortedResults = matchedResults.sort((a, b) => {
      // Calculate match scores
      const scoreA = calculateMatchScore(a, lowerQuery);
      const scoreB = calculateMatchScore(b, lowerQuery);
      
      // If scores are different, sort by score (higher is better)
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      
      // If scores are equal, sort by type priority: unit -> location -> customer
      const typePriority = { unit: 3, location: 2, customer: 1 };
      const priorityA = typePriority[a.type];
      const priorityB = typePriority[b.type];
      
      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }
      
      // If both score and type are equal, sort alphabetically by primary field
      return a.primary.localeCompare(b.primary);
    });

    return sortedResults.slice(0, 10); // Limit to 10 results for performance
  };

  // Calculate match score for ranking results
  const calculateMatchScore = (item: SearchResult, query: string): number => {
    let score = 0;
    const queryLower = query.toLowerCase();
    
    // Exact match in primary field gets highest score
    if (item.primary.toLowerCase() === queryLower) {
      score += 100;
    }
    // Primary field starts with query gets high score
    else if (item.primary.toLowerCase().startsWith(queryLower)) {
      score += 80;
    }
    // Primary field contains query gets medium score
    else if (item.primary.toLowerCase().includes(queryLower)) {
      score += 60;
    }
    
    // Secondary field matches get lower scores
    if (item.secondary) {
      if (item.secondary.toLowerCase() === queryLower) {
        score += 40;
      } else if (item.secondary.toLowerCase().startsWith(queryLower)) {
        score += 30;
      } else if (item.secondary.toLowerCase().includes(queryLower)) {
        score += 20;
      }
    }
    
    // Unit field matches get lowest scores (for location results)
    if (item.unit) {
      if (item.unit.toLowerCase().includes(queryLower)) {
        score += 10;
      }
    }
    
    // Bonus points for shorter matches (more precise)
    const primaryLength = item.primary.length;
    if (primaryLength <= 10) score += 5;
    
    return score;
  };

  // Filter assignments based on search
  const getFilteredAssignments = (query: string) => {
    if (!query || query.length < 2) {
      return {
        filteredPairs: pairs,
        filteredUnits: units
      };
    }

    const searchResults = performSearch(query);
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
  };

  // Get all items in proper order (unit -> location -> customer)
  const getAllItems = (): SearchResult[] => {
    const sortedData = [...searchableData].sort((a, b) => {
      // Sort by type priority: unit -> location -> customer
      const typePriority = { unit: 3, location: 2, customer: 1 };
      const priorityA = typePriority[a.type];
      const priorityB = typePriority[b.type];
      
      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }
      
      // Within same type, sort alphabetically
      return a.primary.localeCompare(b.primary);
    });
    
    return sortedData;
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredResults,
    setFilteredResults,
    performSearch,
    getAllItems,
    getFilteredAssignments,
    getAssignedUnits
  };
}