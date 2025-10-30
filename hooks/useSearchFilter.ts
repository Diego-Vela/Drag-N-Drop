// hooks/useSearchFilter.ts
import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';

interface UseSearchFilterOptions<T> {
  keys?: (keyof T)[];       // keys to match (for objects)
  fuzzy?: boolean;           // use Fuse.js fuzzy search
  threshold?: number;        // Fuse threshold (0 exact → 1 loose)
  delayMs?: number;          // debounce delay
}

export function useSearchFilter<T>(
  data: T[] = [],
  options: UseSearchFilterOptions<T> = {}
) {
  const {
    keys,
    fuzzy = !!keys,
    threshold = 0.3,
    delayMs = 0, // default 1 second delay
  } = options;

  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState<T[]>(data);

  // --- Memoize Fuse instance to avoid re-creating ---
  const fuse = useMemo(() => {
    if (fuzzy && keys && keys.length > 0) {
      try {
        return new Fuse(data, { keys: keys as string[], threshold });
      } catch (err) {
        console.error('Fuse initialization failed:', err);
        return null;
      }
    }
    return null;
  }, [data, keys, fuzzy, threshold]);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (!active) return;

      try {
        // If query is empty → return all
        if (!query || query.trim().length === 0) {
          setFiltered(data);
          return;
        }

        // Require at least 1 character to trigger
        if (query.trim().length < 1) {
          setFiltered(data);
          return;
        }

        // If we have a Fuse instance → fuzzy search
        if (fuse) {
          const results = fuse.search(query);
          setFiltered(results.map((r) => r.item));
          return;
        }

        // Otherwise, do simple substring matching
        if (typeof data[0] === 'string') {
          const q = query.toLowerCase();
          const result = (data as unknown as string[]).filter((item) =>
            item.toLowerCase().includes(q)
          );
          setFiltered(result as T[]);
          return;
        }

        // Fallback: no valid mode
        setFiltered(data);
      } catch (err) {
        console.error('Search processing error:', err);
        setFiltered(data);
      }
    }, delayMs);

    // Cleanup / cancel debounce
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, data, fuse, delayMs]);

  return { 
    query, 
    setQuery, 
    filtered };
}
