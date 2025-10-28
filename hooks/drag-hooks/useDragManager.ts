import { useState, useRef, useEffect, useCallback } from 'react';
import { LayoutAnimation } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import type { DropZoneData } from '../../components';
import type { DropZoneRef } from '../../types';

export function useDropManager(initialZones: DropZoneData[], initialDeadZone: DropZoneData) {
  // --- State model ---
  const [zones, setZones] = useState(initialZones);
  const [zoneInfo, setZoneInfo] = useState<Record<string, any>>({});
  const [deadZone, setDeadZone] = useState(initialDeadZone);

  // --- Refs ---
  const zoneRefs = useRef<Record<string, DropZoneRef | null>>({});

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
  }, [zones, deadZone]);

  // --- Handle drag drop across zones ---
  const handleUnitDrop = useCallback(
    (id: string, position: { x: number; y: number }) => {
      // Refresh zone bounds to adjust for scrolling
      Object.values(zoneRefs.current).forEach((ref) => ref?.measureNow?.());

      if (Object.keys(zoneInfo).length === 0) {
        return;
      }

      console.log(`Position X: ${position.x}, Position Y: ${position.y}`)

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

      if (targetZoneId !== null) {
        console.log(
          `${targetZoneId} l[${zoneInfo[targetZoneId].left}], r[${zoneInfo[targetZoneId].right}], t[${zoneInfo[targetZoneId].top}], b[${zoneInfo[targetZoneId].bottom}]`
        );
      } else {
        console.log(`No target zone found`);
      }

      if (targetZoneId) {
        const fromZoneId =
          zones.find((zone) => zone.units.includes(id))?.id ||
          (deadZone?.units.includes(id) ? deadZone.id : undefined);

        if (!fromZoneId || fromZoneId === targetZoneId) { return; }

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        // --- Move TO DeadZone ---
        if (targetZoneId === deadZone?.id) {
          console.log(`📦 moving ${id} → DeadZone`);
          setZones((prev) =>
            prev.map((zone) =>
              zone.id === fromZoneId
                ? { ...zone, units: zone.units.filter((unit) => unit !== id) }
                : zone
            )
          );
          setDeadZone((prev) =>
            prev
              ? { ...prev, units: [...prev.units, id] }
              : { id: 'DeadZone', label: 'Unassigned', sublabel: '', units: [id] }
          );
          return;
        }

        // --- Move FROM DeadZone ---
        if (fromZoneId === deadZone?.id) {
          console.log(`♻️ moving ${id} from DeadZone → ${targetZoneId}`);
          setDeadZone((prev) =>
            prev
              ? { ...prev, units: prev.units.filter((u) => u !== id) }
              : prev
          );
          setZones((prev) =>
            prev.map((zone) =>
              zone.id === targetZoneId
                ? { ...zone, units: [...zone.units, id] }
                : zone
            )
          );
          return;
        }

        // --- Zone → Zone (default behavior) ---
        setZones((prevZones) =>
          prevZones.map((zone) => {
            if (zone.id === fromZoneId) {
              return { ...zone, units: zone.units.filter((u) => u !== id) };
            } else if (zone.id === targetZoneId) {
              return { ...zone, units: [...zone.units, id] };
            } else {
              return zone;
            }
          })
        );

        console.log(`✅ ${id} moved from ${fromZoneId} → ${targetZoneId}\n`);
      } else { 
        console.log(`❌ ${id} not inside any zone\n`); 
      }
    },
    [zoneInfo, zones, deadZone]
  );

  return {
    zones,
    deadZone,
    zoneRefs,
    handleZoneMeasure,
    handleUnitDrop,
    setZones,
    setDeadZone,
  };
}
