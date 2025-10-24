import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, LayoutAnimation } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useTheme } from '../../contexts';
import { DraggableUnit, UnitRef } from './DraggableUnit';
import { DropZone, DropZoneRef } from './DropZone';

export function DragManager() {
  const { isDark } = useTheme();

  // --- State model: zones each own an array of unit IDs ---
  const [zones, setZones] = useState([
    { id: 'zone1', units: ['A', 'B', 'C', 'D', 'E'] },
    { id: 'zone2', units: ['F'] },
    { id: 'zone3', units: [] },
  ]);

  // --- Refs for measuring and controlling units/zones ---
  const zoneRefs = useRef<Record<string, DropZoneRef | null>>({});
  const unitRefs = useRef<Record<string, UnitRef | null>>({});
  const [zoneInfo, setZoneInfo] = useState<Record<string, any>>({});
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
        console.warn('⏳ Zones not ready yet, springing back.');
        unitRefs.current[id]?.resetPosition?.();
        return;
      }

      // Detect which zone (if any) we dropped into
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
        // Find the current zone the unit belongs to
        const fromZoneId = zones.find((z) => z.units.includes(id))?.id;
        if (!fromZoneId || fromZoneId === targetZoneId) {
          unitRefs.current[id]?.resetPosition?.();
          unitInDropZoneShared.value = true;
          return;
        }

        // Smooth visual transition
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        // Update state: remove from old zone, add to new one
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

        console.log(`✅ ${id} moved from ${fromZoneId} → ${targetZoneId}`);
        unitInDropZoneShared.value = true;
      } else {
        console.log(`❌ ${id} not inside any zone`);
        unitInDropZoneShared.value = false;
        unitRefs.current[id]?.resetPosition?.();
      }
    },
    [zoneInfo, zones]
  );

  // --- Render zones with their current units ---
  return (
    <View className="py-[16] px-[16]">
      {zones.map((zone) => (
        <DropZone
          key={zone.id}
          ref={(el) => {
            zoneRefs.current[zone.id] = el;
          }}
          id={zone.id}
          onMeasure={handleZoneMeasure}
          isDark={isDark}
        >
          {zone.units.map((letter) => (
            <DraggableUnit
              key={letter}
              ref={(el) => {
                unitRefs.current[`${letter}`] = el;
              }}
              label={`${letter}`}
              onDragEnd={handleUnitDrop}
              isDark={isDark}
              isInDropZoneShared={unitInDropZoneShared}
            />
          ))}
        </DropZone>
      ))}
    </View>
  );
}