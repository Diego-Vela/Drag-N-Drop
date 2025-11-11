// hooks/useSearchFilter.ts
import { useState, useEffect } from 'react';

interface UseSearchFilterOptions<T> {
  keys?: (keyof T)[];  // keys to match (for objects)
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

        // Empty query → return all
        if (!trimmed) {
          setFiltered(data);
          return;
        }

        // Handle arrays of strings directly
        if (typeof data[0] === 'string') {
          const result = (data as unknown as string[]).filter((item) =>
            item.toLowerCase().includes(trimmed)
          );
          setFiltered(result as T[]);
          return;
        }

        // Handle arrays of objects (by keys)
        if (keys && keys.length > 0) {
          const result = data.filter((item) =>
            keys.some((key) => {
              const value = String((item as any)[key] ?? '').toLowerCase();
              return value.includes(trimmed);
            })
          );
          setFiltered(result);
          return;
        }

        // Fallback — if no match mode defined
        setFiltered(data);
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
