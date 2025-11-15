// hooks/useSearchFilter.ts
import { useState, useEffect } from 'react';

interface UseSearchFilterOptions<T> {
  keys?: (keyof T)[];  
  delayMs?: number;    // debounce delay
}

export function useSearchFilter<T>(
  data: T[] = [],
  options: UseSearchFilterOptions<T> = {}
) {
  const { keys, delayMs = 0 } = options;

  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState<T[]>(data);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (!active) return;

      try {
        const trimmed = query.trim().toLowerCase();

        // Empty query will return all
        if (!trimmed) {
          setFiltered(data);
          return;
        }

        // Split query by '&' for OR search
        const terms = trimmed.split('&').map(t => t.trim()).filter(Boolean);

        // Helper to get searchable string for an item
        const getSearchString = (item: any) => {
          if (typeof item === 'string') {
            return item.toLowerCase();
          } else if (item && typeof item === 'object' && 'name' in item) {
            return String(item.name ?? '').toLowerCase();
          } else if (keys && keys.length > 0) {
            return keys.map(key => String(item[key] ?? '').toLowerCase()).join(' ');
          }
          return '';
        };

        const result = data.filter(item =>
          terms.some(term => getSearchString(item).includes(term))
        );
        setFiltered(result);
      } catch (err) {
        console.error('Search processing error:', err);
        setFiltered(data);
      }
    }, delayMs);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, data, keys, delayMs]);

  return { query, setQuery, filtered };
}
