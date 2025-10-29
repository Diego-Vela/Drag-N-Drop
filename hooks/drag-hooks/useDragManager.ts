//#region Imports
import { useState, useRef, useEffect, useCallback } from 'react';
import { LayoutAnimation } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import type { DropZoneData } from '../../components';
import type { DropZoneRef } from '../../types';
import {
  findTargetZoneId,
  findFromZoneId,
  moveBetweenZones,
  moveToDeadZone,
  moveFromDeadZone,
} from '../../utils/drag-manager-utils';

export function useDropManager(initialZones: DropZoneData[], initialDeadZone: DropZoneData) {
  //#region Variables 
  // States
  const [zones, setZones] = useState(initialZones);
  const [zoneInfo, setZoneInfo] = useState<Record<string, any>>({});
  const [deadZone, setDeadZone] = useState(initialDeadZone);
  const [activeDrag, setActiveDrag] = useState<string | null>(null);

  // Overlay Values 
  const overlayX = useSharedValue(0);
  const overlayY = useSharedValue(0);

  // Zone Refs
  const zoneRefs = useRef<Record<string, DropZoneRef | null>>({});

  //#region Exported Functions
  // Collect measurements from zones
  const handleZoneMeasure = useCallback((id: string, layout: any) => {
    setZoneInfo((prev) => ({ [id]: layout, ...prev }));
  }, []);

  // Waits two frames before zone measurements
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

  // Handles Drag Movements: Start, Move, End
  const handleDragStart = (label: string) => {
    setActiveDrag(label);
  };

  const handleDragMove = (_label: string, position: { x: number; y: number }) => {
    overlayX.value = position.x;
    overlayY.value = position.y;
  };

  const handleDragEnd = (label: string, position: { x: number; y: number }) => {
    handleUnitDrop(label, position); // delegate to your hook logic
    setActiveDrag(null);
  };

  //#region Internal Logic
  // Internal logic for moving and detecting zones on DragEnd
  const handleUnitDrop = useCallback(
    (id: string, position: { x: number; y: number }) => {
      Object.values(zoneRefs.current).forEach((ref) => ref?.measureNow?.());
      if (Object.keys(zoneInfo).length === 0) return;

      console.log(`Position X: ${position.x}, Position Y: ${position.y}`);

      const targetZoneId = findTargetZoneId(position, zoneInfo);

      if (targetZoneId !== null) {
        console.log(
          `${targetZoneId} l[${zoneInfo[targetZoneId].left}], r[${zoneInfo[targetZoneId].right}], t[${zoneInfo[targetZoneId].top}], b[${zoneInfo[targetZoneId].bottom}]`
        );
      } else {
        console.log(`No target zone found`);
        console.log(`${id} not inside any zone\n`);
        return;
      }

      const fromZoneId = findFromZoneId(id, zones, deadZone);
      if (!fromZoneId || fromZoneId === targetZoneId) return;

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      // --- DEADZONE PRIORITY ---
      if (targetZoneId === deadZone?.id) {
        moveToDeadZone(id, fromZoneId, setZones, setDeadZone, deadZone);
      }

      // --- FROM DEADZONE → Zone ---
      else if (fromZoneId === deadZone?.id) {
        moveFromDeadZone(id, targetZoneId, setZones, setDeadZone);
      } else {

        // --- Zone → Zone ---`
        moveBetweenZones(id, fromZoneId, targetZoneId, setZones);
        console.log(`${id} moved from ${fromZoneId} → ${targetZoneId}\n`);
      }
      recalcZoneLayouts();
    },
    [zoneInfo, zones, deadZone]
  );

  // Recalculates Zone layouts after two frames of dropping to get updated sizes. 
  function recalcZoneLayouts() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        Object.values(zoneRefs.current).forEach((ref) => ref?.measureNow?.());
        console.log('✅ zone layouts recalculated after two frames');
      });
    });
  }

  //#region Exports
  return {
    zones,
    deadZone,
    zoneRefs,
    activeDrag,
    overlayX,
    overlayY,
    handleZoneMeasure,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    setDeadZone
  };
}
