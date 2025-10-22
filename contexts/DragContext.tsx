//REUSABLE CODE DONT FORGET
// contexts/DragContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

/** Represents a draggable unit */
export interface Unit {
  id: string;
  [key: string]: any;
}

/** Represents a drop zone's position and dimensions */
export interface DropZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Global drag context shape */
interface DragContextType {
  draggedUnit: Unit | null;
  setDraggedUnit: Dispatch<SetStateAction<Unit | null>>;

  position: { x: number; y: number };
  setPosition: Dispatch<SetStateAction<{ x: number; y: number }>>;

  dropZones: DropZone[];
  setDropZones: Dispatch<SetStateAction<DropZone[]>>;

  activeZone: string | null;
  setActiveZone: Dispatch<SetStateAction<string | null>>;
}

// Create context with explicit undefined default (enforced check in hook)
const DragContext = createContext<DragContextType | undefined>(undefined);

/** Provider component to wrap editable screens */
export function DragProvider({ children }: { children: ReactNode }) {
  const [draggedUnit, setDraggedUnit] = useState<Unit | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dropZones, setDropZones] = useState<DropZone[]>([]);
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const value: DragContextType = {
    draggedUnit,
    setDraggedUnit,
    position,
    setPosition,
    dropZones,
    setDropZones,
    activeZone,
    setActiveZone,
  };

  return <DragContext.Provider value={value}>{children}</DragContext.Provider>;
}

/** Custom hook for accessing drag context safely */
export function useDrag(): DragContextType {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error('useDrag must be used within a DragProvider');
  }
  return context;
}
