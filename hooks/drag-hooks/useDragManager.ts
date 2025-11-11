import { useState, useRef, useCallback, useEffect } from 'react';
import { LayoutAnimation } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import type { DropZoneRef, DropZoneData } from '../../types';
import {
  findTargetZoneId,
  findFromZoneId,
  moveBetweenZones,
  moveToDeadZone,
  moveFromDeadZone
} from '../../utils';

export function useDropManager(initialZones: DropZoneData[], initialDeadZone: DropZoneData) {
  //#region Variables 
  // States
  const [zones, setZones] = useState(initialZones);
  const [zoneInfo, setZoneInfo] = useState<Record<string, any>>({});
  const [deadZone, setDeadZone] = useState(initialDeadZone);
  const [activeDrag, setActiveDrag] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [refreshing, setRefreshing] = useState(false); 
  const [_, forceUpdate] = useState(0);
  const [showDeadZone, setShowDeadZone] = useState(true);

  // Shared Values 
  const overlayX = useSharedValue(0);
  const overlayY = useSharedValue(0);

  // Zone Refs
  const zoneRefs = useRef<Record<string, DropZoneRef | null>>({});

  // Init Zones
  useEffect(() => {
    setZones(initialZones);
    setDeadZone(initialDeadZone);
  }, [initialZones, initialDeadZone]);


  //#region Functions
  // Collect measurements from zones
  const handleZoneMeasure = useCallback((id: string, layout: any) => {
    setZoneInfo((prev) => ({ [id]: layout, ...prev }));
  }, []);

  // Handles Drag Movements: Start, Move, End
  const handleDragStart = (label: string) => {
    setIsDragging(true);
    setActiveDrag(label);
    recalcZoneLayouts();
  };

  const handleDragMove = (_label: string, position: { x: number; y: number }) => {
    overlayX.value = position.x;
    overlayY.value = position.y;
  };

  const handleDragEnd = (label: string, position: { x: number; y: number }) => {
    handleUnitDrop(label, position);
    setIsDragging(false);
    setActiveDrag(null);
  };

  const onRefresh = () => {
    forceUpdate(n => n+1);
    //console.log('Placeholder Re-render: Does nothing');
  }

  const handleShowDeadZoneButton = () => {
    setShowDeadZone(!showDeadZone);
  }

  //#region Internal Logic
  // Internal logic for moving and detecting zones on DragEnd
  const handleUnitDrop = useCallback(
    (id: string, position: { x: number; y: number }) => {
      if (Object.keys(zoneInfo).length === 0) return;

      // console.log(`Position X: ${position.x}, Position Y: ${position.y}`);

      const targetZoneId = findTargetZoneId(position, zoneInfo);

      if (targetZoneId !== null) {
        /*console.log(
          `${targetZoneId} l[${zoneInfo[targetZoneId].left}], r[${zoneInfo[targetZoneId].right}], t[${zoneInfo[targetZoneId].top}], b[${zoneInfo[targetZoneId].bottom}]`
        );*/
      } else {
        //console.log(`No target zone found`);
        //console.log(`${id} not inside any zone\n`);
        return;
      }

      const fromZoneId = findFromZoneId(id, zones, deadZone);
      if (!fromZoneId || fromZoneId === targetZoneId) {recalcZoneLayouts(); return;}

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
        // console.log(`${id} moved from ${fromZoneId} → ${targetZoneId}\n`);
      }
      setZoneInfo({});
    },
    [zoneInfo, zones, deadZone]
  );

  // Recalculates Zone layouts after two frames of dropping to get updated sizes. 
  function recalcZoneLayouts() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setZoneInfo({});
        Object.values(zoneRefs.current).forEach((ref) => ref?.measureNow?.());
        //console.log('✅ zone layouts recalculated after two frames');
      });
    });
  };

  //#region Exports
  return {
    zones,
    deadZone,
    zoneRefs,

    activeDrag,
    isDragging,

    refreshing,
    showDeadZone,

    overlayX,
    overlayY,

    handleZoneMeasure,
    
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    
    setDeadZone,
    onRefresh,
    handleShowDeadZoneButton,
  };
}
