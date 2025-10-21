// Data transformation and processing utilities
import type { SearchResult } from './types';

export interface AssignmentMaps {
  unitToAssignment: Map<string, { customer: string; location: string; pairId: string }>;
  pairToUnits: Map<string, string[]>;
}

/**
 * Creates optimized lookup maps from assignments data for O(1) access
 */
export function createAssignmentMaps(
  assignments: [string, string][], 
  pairs: [string, string, string][]
): AssignmentMaps {
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
}

/**
 * Gets assigned units for a pair ID using lookup map
 */
export function getAssignedUnitsFromMap(
  pairId: string, 
  pairToUnits: Map<string, string[]>
): string[] {
  return pairToUnits.get(pairId) || [];
}

/**
 * Gets unit assignment using lookup map
 */
export function getUnitAssignmentFromMap(
  unitName: string, 
  unitToAssignment: Map<string, { customer: string; location: string; pairId: string }>
): { customer: string; location: string; pairId: string } | null {
  return unitToAssignment.get(unitName) || null;
}

/**
 * Validates data structure integrity
 */
export function validateDataStructure(
  pairs: any[], 
  units: string[], 
  assignments: any[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for duplicate units
  const unitSet = new Set(units);
  if (unitSet.size !== units.length) {
    errors.push('Duplicate units found');
  }

  // Check for invalid assignments
  assignments.forEach(([unit, pairId]) => {
    if (!units.includes(unit)) {
      errors.push(`Assignment references non-existent unit: ${unit}`);
    }
    if (!pairs.find(([, , id]) => id === pairId)) {
      errors.push(`Assignment references non-existent pair: ${pairId}`);
    }
  });

  return { isValid: errors.length === 0, errors };
}