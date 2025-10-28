import Animated, { SharedValue } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';

// Static Unit Props
export interface StaticUnitProps {
  label: string;
  isDark?: boolean;
  onDragStart: (id: string) => void;
  onDragMove: (id: string, position: DragPosition) => void;
  onDragEnd: (id: string, position: DragPosition) => void;
}
// DropZone Props
export interface DropZoneProps {
  id: string;
  onMeasure: (id: string, layout: { left: number; right: number; top: number; bottom: number }) => void;
  label?: string;
  sublabel?: string;
  isDark?: boolean;
  isDeadZone?: boolean;
  children?: React.ReactNode;
}
// useDraggableUnit Props
export interface UseDraggableUnitReturn {
  unitRef: React.RefObject<Animated.View | null>;
  animatedStyle: any;
  pan: ReturnType<typeof Gesture.Pan>;
  shouldReset: SharedValue<boolean>;
  resetPosition: () => void;
}

// UnitRef: DraggableUnit.tsx, useDragManager.ts
export interface UnitRef {
  shouldReset: SharedValue<boolean>;
  resetPosition: () => void;
}

// DropZoneRef: DropZone.tsx, useDragManager.ts
export interface DropZoneRef {
  measureNow: () => void;
}

// Drag Position Helper Type
export interface DragPosition {
  x: number;
  y: number;
}