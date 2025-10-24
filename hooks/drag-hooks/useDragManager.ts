import { useState, useRef, useEffect, useCallback } from 'react';
import { LayoutAnimation } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import type { DropZoneData } from '../../components';
import type { UnitRef, DropZoneRef } from '../../types';

export function useDropManager(initialZones: DropZoneData[]) {
  // --- State model ---
  const [zones, setZones] = useState(initialZones);
  const [zoneInfo, setZoneInfo] = useState<Record<string, any>>({});

  // --- Refs ---
  const zoneRefs = useRef<Record<string, DropZoneRef | null>>({});
  const unitRefs = useRef<Record<string, UnitRef | null>>({});
  const unitInDropZoneShared = useSharedValue(false);

  // --- Collect measurements from DropZones ---
  const handleZoneMeasure = useCallback((id: string, layout: any) => {
    setZoneInfo((prev) => ({ ...prev, [id]: layout }));
  }, []);

  // --- Ensure zones are measured after layout settles ---
  useEffect(() => {
    let f1: number, f2: number;
    f1 = requestAnimationFrame(() => {
      f2 = requestAnimationFrame(() => {
        Object.values(zoneRefs.current).forEach((ref) => ref?.measureNow?.());
      });
    });
    return () => {
      cancelAnimationFrame(f1);
      cancelAnimationFrame(f2);
    };
  }, [zones]);

  // --- Handle drag drop across zones ---
  const handleUnitDrop = useCallback(
    (id: string, position: { x: number; y: number }) => {
      // Always refresh zone bounds
      Object.values(zoneRefs.current).forEach((ref) => ref?.measureNow?.());

      if (Object.keys(zoneInfo).length === 0) {
        unitRefs.current[id]?.resetPosition?.();
        return;
      }

      // Detect target zone
      let targetZoneId: string | null = null;
      for (const [zoneId, { left, right, top, bottom }] of Object.entries(zoneInfo)) {
        const inside =
          position.x >= left &&
          position.x <= right &&
          position.y >= top &&
          position.y <= bottom;

        if (inside) {
          targetZoneId = zoneId;
          break;
        }
      }

      if (targetZoneId) {
        const fromZoneId = zones.find((z) => z.units.includes(id))?.id;
        if (!fromZoneId || fromZoneId === targetZoneId) {
          unitRefs.current[id]?.resetPosition?.();
          unitInDropZoneShared.value = true;
          return;
        }

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        // Update zones
        setZones((prevZones) =>
          prevZones.map((z) => {
            if (z.id === fromZoneId) {
              return { ...z, units: z.units.filter((u) => u !== id) };
            } else if (z.id === targetZoneId) {
              return { ...z, units: [...z.units, id] };
            } else {
              return z;
            }
          })
        );

        unitInDropZoneShared.value = true;
      } else {
        unitInDropZoneShared.value = false;
        unitRefs.current[id]?.resetPosition?.();
      }
    },
    [zoneInfo, zones]
  );

  return {
    zones,
    zoneRefs,
    unitRefs,
    unitInDropZoneShared,
    handleZoneMeasure,
    handleUnitDrop,
    setZones,
  };
}
