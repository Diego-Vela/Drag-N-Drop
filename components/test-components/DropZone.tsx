import React, { ReactNode, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface DropZoneProps {
  id: string;
  onMeasure: (id: string, layout: { left: number; right: number; top: number; bottom: number }) => void;
  label?: string;
  isDark?: boolean;
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
  label = 'Drop Zone',
  isDark = false,
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
      className={`flex-row mb-4 p-3 rounded-lg ${isDark ? 'bg-dark-surface/40' : 'bg-neutral-100/60'}`}
      ref={zoneRef}
      onLayout={handleLayout}
    >
        {/* Left Column: Title/Subtitle Pair */}
        <View className="items-center">
          <View className={`p-4 rounded-lg shadow-sm border w-40 ${
            isDark 
              ? 'bg-dark-surface border-dark-border' 
              : 'bg-white border-light-border/20'
          }`}>
            <Text className={`font-bold text-sm ${
              isDark ? 'text-dark-primary' : 'text-light-primary'
            }`}>
              {'Customer'}
            </Text>
            <Text className={`text-xs mt-1 ${
              isDark ? 'text-dark-secondary' : 'text-light-secondary'
            }`}>
              {'Location'}
            </Text>

          </View>
        </View>
        
        {/* Right Column: Units */}
        <View className="ml-4 flex-1 items-center justify-center">
          {children && (
            <View className="flex-row items-center justify-center mt-2 w-full">
              {children}
            </View>
          )}
          <TouchableOpacity className='bg-white h-5 w-12 mt-4' onPress={getBounds}/>
        </View>
      
    </View>
  );
}


