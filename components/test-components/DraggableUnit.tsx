import React, { useImperativeHandle, useRef, forwardRef } from 'react';
import { LayoutChangeEvent, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  SharedValue,
  useDerivedValue
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface DraggableUnitProps {
  label?: string;
  onDragEnd?: (id: string, position: { x: number; y: number }) => void; // NEW
  isDark?: boolean;
  isInDropZone?: boolean;
  isInDropZoneShared?: SharedValue<boolean>;
}

export interface UnitRef {
  shouldReset: SharedValue<boolean>;
  resetPosition: () => void;
}

/**
 * A self-contained draggable box that remembers its last position.
 * - Uses Reanimated shared values for smooth, native movement.
 * - Stays where you drop it.
 */

export const DraggableUnit = forwardRef<UnitRef, DraggableUnitProps>(
  ({ label = 'Drag me', onDragEnd, isDark = false, isInDropZoneShared}: DraggableUnitProps, ref) => {
  // Persistent offset (where the unit should be at rest)
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  // Should reset
  const shouldReset = useSharedValue(false);

  const unitRef = useRef<Animated.View>(null);

  const isDragging = useSharedValue(false);

  const getMiddlePoint = () => {
    if (unitRef.current) {
      unitRef.current.measure(
        (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
          const middleX = pageX + width / 2;
          const middleY = pageY + height / 2;
          //console.log('Middle Point X:', middleX);
          //console.log('Middle Point Y:', middleY);

          // Send to DragManager
          if (onDragEnd) {
            onDragEnd(label, { x: middleX, y: middleY });
          }
        }
      );
    }
  };

  useDerivedValue(() => {
    if (shouldReset.value) {
      offsetX.value = withSpring(0);
      offsetY.value = withSpring(0);
      shouldReset.value = false;
    }
  });

  // Apply both offset + live translation
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value + translateX.value },
      { translateY: offsetY.value + translateY.value },
    ],
    zIndex: isDragging.value ? 10 : 1,
    elevation: isDragging.value ? 10 : 0, // Android needs this
  }));
  

  // Define gesture using new Gesture API
  const pan = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
    })
    .onFinalize(() => {
      isDragging.value = false;
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      offsetX.value += translateX.value;
      offsetY.value += translateY.value;
      //console.log(`Dropped at: ${offsetX.value}, ${offsetY.value}`);
      runOnJS(getMiddlePoint)();
      translateX.value = 0;
      translateY.value = 0;
    }
  );

  useImperativeHandle(ref, () => ({
    shouldReset,
    resetPosition: () => {
      shouldReset.value = true;
    },
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        ref={unitRef}
        className={`px-4 py-6 rounded-lg border-2 ${
                isDark 
                  ? 'bg-dark-warning/20 border-dark-highlight-accent' 
                  : 'bg-light-highlight border-light-highlight-accent'
              }`}
        style={[
          animatedStyle,
          {
            width: '100%'
          },
        ]}
      >
        <Text className={`font-semibold text-sm text-left ${ isDark ? 'text-dark-highlight-text' : 'text-light-highlight-text'}`}>
          {label}
        </Text>
        {/*<TouchableOpacity className='bg-white h-5 w-12 mt-4' onPress={getMiddlePoint}/>*/}
      </Animated.View>
    </GestureDetector>
  );
});


