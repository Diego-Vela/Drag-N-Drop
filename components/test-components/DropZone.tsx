import React, { ReactNode } from 'react';
import { View, LayoutChangeEvent, Text } from 'react-native';

interface DropZoneProps {
  id: string;
  onMeasure: (id: string, layout: { x: number; y: number; width: number; height: number }) => void;
  color?: string;
  label?: string;
  children?: ReactNode;
}

/**
 * DropZone component
 * ------------------
 * - Measures its layout (x, y, width, height)
 * - Reports position to parent via `onMeasure`
 * - Displays a visible zone for testing
 */
export function DropZone({
  id,
  onMeasure,
  color = '#e0e0e0',
  label = 'Drop Zone',
  children,
}: DropZoneProps) {
  // Report layout to parent
  const handleLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    onMeasure(id, { x, y, width, height });
  };

  return (
    <View
      className="w-[200px] h-[200px] rounded-2xl border-2 border-neutral-400 items-center justify-center m-3"
      style={{ backgroundColor: color }}
      onLayout={handleLayout}
    >
      <Text className="font-bold text-neutral-800 dark:text-neutral-100">{label}</Text>
      {children && (
        <View className="flex-row items-center justify-center mt-2 w-full">
          {children}
        </View>
      )}
    </View>
  );
}


