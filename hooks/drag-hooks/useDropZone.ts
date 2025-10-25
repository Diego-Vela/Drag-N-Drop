import { useRef, useImperativeHandle } from 'react';
import { View } from 'react-native';
import type { DropZoneRef } from '../../types';

/**
 * Handles measurement logic for a droppable zone.
 * Returns the zoneRef and sets up `measureNow` to report layout bounds to the parent.
 */
export function useDropZone(
  id: string,
  onMeasure: (id: string, layout: { left: number; right: number; top: number; bottom: number }) => void,
  ref: React.Ref<DropZoneRef>
) {
  const zoneRef = useRef<View>(null);

  // Measure zone position and report via callback
  const measureNow = () => {
    if (!zoneRef.current) return;
    zoneRef.current.measureInWindow((x, y, width, height) => {
      const left = x;
      const right = x + width;
      const top = y;
      const bottom = y + height;
      onMeasure(id, { left, right, top, bottom });
    });
  };

  // Expose measureNow to parent via ref
  useImperativeHandle(ref, () => ({ measureNow }));

  return { zoneRef, measureNow };
}
