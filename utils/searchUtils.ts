// Search and filtering utilities
import type { SearchResult } from './types';

/**
 * Calculate match score for search result ranking
 */
export function calculateMatchScore(item: SearchResult, query: string): number {
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
}

/**
 * Sort search results by relevance and type priority
 */
export function sortSearchResults(results: SearchResult[], query: string): SearchResult[] {
  const lowerQuery = query.toLowerCase();
  
  return results.sort((a, b) => {
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
}

/**
 * Filter items based on search query
 */
export function filterSearchItems(items: SearchResult[], query: string): SearchResult[] {
  if (query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return items.filter(item => {
    // Search in primary field (unit name, location, customer)
    if (item.primary.toLowerCase().includes(lowerQuery)) return true;
    
    // Search in secondary field
    if (item.secondary && item.secondary.toLowerCase().includes(lowerQuery)) return true;
    
    // Search in unit field for location results
    if (item.unit && item.unit.toLowerCase().includes(lowerQuery)) return true;
    
    return false;
  });
}

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}