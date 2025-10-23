import React, { ReactNode, useRef } from 'react';
import { View, LayoutChangeEvent, Text, TouchableOpacity } from 'react-native';

interface DropZoneProps {
  id: string;
  onMeasure: (id: string, layout: { left: number; right: number; top: number; bottom: number }) => void;
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

  const zoneRef = useRef<View>(null);

  const getBounds = () => {
    if (zoneRef.current) {
      zoneRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {

        console.log(`left: ${pageX}, right: ${pageX+width}, top: ${pageY}, bottom: ${pageY+height}`);
      })
    }
  }

  // Report layout to parent with left, right, top, bottom
  const handleLayout = () => {
    if (zoneRef.current) {
      zoneRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        const left = pageX;
        const right = pageX + width;
        const top = pageY;
        const bottom = pageY + height;
        onMeasure(id, { left, right, top, bottom });
      });
    }
  };

  return (
    <View
      className="w-[200px] h-[200px] rounded-2xl border-2 border-neutral-400 items-center justify-center m-3"
      ref={zoneRef}
      style={{ backgroundColor: color }}
      onLayout={handleLayout}
    >
      <Text className="font-bold text-neutral-800 dark:text-neutral-100">{label}</Text>
      {children && (
        <View className="flex-row items-center justify-center mt-2 w-full">
          {children}
        </View>
      )}
      <TouchableOpacity className='bg-white h-5 w-12 mt-4' onPress={getBounds}/>
    </View>
  );
}


